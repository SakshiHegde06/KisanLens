import io

from PIL import Image
from torchvision import transforms

from app.config import IMAGE_SIZE

# CRITICAL: these exact values (resize size, ImageNet mean/std) must match
# the transforms used in training/train_soil_model.py and
# training/train_disease_model.py. A mismatch here is the classic
# "silent numerical bug" flagged in the original architecture discussion -
# the model won't error, it'll just quietly predict badly.
_PREPROCESS = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # ImageNet mean - required since both
        std=[0.229, 0.224, 0.225],   # models fine-tune an ImageNet-pretrained backbone
    ),
])


def bytes_to_tensor(image_bytes: bytes):
    """Converts raw uploaded image bytes into a single-image batch tensor
    of shape (1, 3, IMAGE_SIZE, IMAGE_SIZE), ready to feed to either model."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = _PREPROCESS(image)
    return tensor.unsqueeze(0)  # add batch dimension
