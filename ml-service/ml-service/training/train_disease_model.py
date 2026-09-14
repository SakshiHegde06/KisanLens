"""
Trains the disease classifier via transfer learning on a fine-tuned MobileNetV2,
using the PlantVillage dataset.

HOW TO USE IN GOOGLE COLAB:
1. Open colab.research.google.com -> New notebook
2. Runtime -> Change runtime type -> select "T4 GPU" -> Save
3. Download the PlantVillage dataset from Kaggle:
       https://www.kaggle.com/datasets/emmarex/plantdisease
   (mirror: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
   It's already organized as one folder per disease class (e.g.
   "Tomato___Late_blight", "Potato___healthy") - exactly the ImageFolder
   format torchvision expects, no reorganizing needed.
4. Zip the dataset folder, upload it to your Google Drive
5. Paste this whole script into a Colab cell and run it
6. Download disease_cnn.pt from Drive and place it in ml-service/app/weights/

IMPORTANT: app/config.py's SEVERITY_OVERRIDES / keyword lists assume you're
using PlantVillage's standard class naming (e.g. "___Late_blight",
"___healthy"). If you use a different or smaller subset of classes, check
that config.py's severity rules still make sense for your class names -
run print(class_names) after training (this script does it for you below)
and compare against app/config.py.
"""

import os
import zipfile

import torch
from torch import nn, optim
from torch.utils.data import DataLoader, random_split
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torchvision.models import MobileNet_V2_Weights, mobilenet_v2

# ---- Config - adjust paths to match where you put things in Drive ----
DRIVE_ZIP_PATH = "/content/drive/MyDrive/kisanlens/plantvillage.zip"
EXTRACT_DIR = "/content/plantvillage_data"
OUTPUT_PATH = "/content/drive/MyDrive/kisanlens/disease_cnn.pt"

IMAGE_SIZE = 224  # MUST match app/config.py's IMAGE_SIZE
BATCH_SIZE = 32
EPOCHS = 8  # PlantVillage is large - 8 epochs is usually enough with transfer learning
LEARNING_RATE = 0.0003
VALIDATION_SPLIT = 0.2

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

from google.colab import drive  # noqa: E402
drive.mount("/content/drive")

if not os.path.exists(EXTRACT_DIR):
    with zipfile.ZipFile(DRIVE_ZIP_PATH, "r") as zip_ref:
        zip_ref.extractall(EXTRACT_DIR)

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

full_dataset = ImageFolder(root=EXTRACT_DIR, transform=transform)
class_names = full_dataset.classes
print(f"Found {len(class_names)} classes: {class_names}")

val_size = int(len(full_dataset) * VALIDATION_SPLIT)
train_size = len(full_dataset) - val_size
train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)

model = mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
model.classifier[1] = nn.Linear(model.last_channel, len(class_names))
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

best_val_accuracy = 0.0

for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)

    train_loss = running_loss / train_size

    model.eval()
    correct = 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            correct += (predicted == labels).sum().item()

    val_accuracy = correct / val_size if val_size > 0 else 0.0
    print(f"Epoch {epoch + 1}/{EPOCHS} - train_loss: {train_loss:.4f} - val_accuracy: {val_accuracy:.4f}")

    if val_accuracy >= best_val_accuracy:
        best_val_accuracy = val_accuracy
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        torch.save({
            "state_dict": model.state_dict(),
            "class_names": class_names,
        }, OUTPUT_PATH)
        print(f"  -> saved new best model (val_accuracy={val_accuracy:.4f})")

print(f"Training complete. Best val_accuracy: {best_val_accuracy:.4f}")
print(f"Model saved to {OUTPUT_PATH}")
print(f"Class names (check these against app/config.py's severity rules): {class_names}")
