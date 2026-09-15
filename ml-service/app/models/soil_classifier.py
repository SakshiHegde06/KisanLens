import os

import torch
from torch import nn
from torchvision.models import mobilenet_v2

from app.config import SOIL_MODEL_PATH
from app.preprocessing.image_utils import bytes_to_tensor


class SoilClassifier:
    """
    Lazy-loaded wrapper around a fine-tuned MobileNetV2.

    Lazy-loading (rather than loading at module import time) means the
    FastAPI app can still start up and serve /health even before you've
    trained a model and dropped soil_cnn.pt into app/weights/ - you get a
    clear error on the /predict/soil call itself instead of the whole
    service refusing to boot.
    """

    def __init__(self):
        self._model = None
        self._class_names = None

    def _ensure_loaded(self):
        if self._model is not None:
            return

        if not os.path.exists(SOIL_MODEL_PATH):
            raise FileNotFoundError(
                f"No trained soil model found at {SOIL_MODEL_PATH}. "
                "Run training/train_soil_model.py first and copy the "
                "resulting soil_cnn.pt into app/weights/."
            )

        checkpoint = torch.load(SOIL_MODEL_PATH, map_location="cpu")
        class_names = checkpoint["class_names"]

        model = mobilenet_v2(weights=None)
        model.classifier[1] = nn.Linear(model.last_channel, len(class_names))
        model.load_state_dict(checkpoint["state_dict"])
        model.eval()

        self._model = model
        self._class_names = class_names

    def predict(self, image_bytes: bytes) -> tuple[str, float]:
        self._ensure_loaded()

        input_tensor = bytes_to_tensor(image_bytes)

        with torch.no_grad():
            logits = self._model(input_tensor)
            probabilities = torch.softmax(logits, dim=1)[0]
            confidence, predicted_index = torch.max(probabilities, dim=0)

        soil_type = self._class_names[predicted_index.item()]
        return soil_type, confidence.item()


# Module-level singleton - one model instance shared across requests,
# loaded once and reused (loading a CNN checkpoint per-request would be slow).
soil_classifier = SoilClassifier()
