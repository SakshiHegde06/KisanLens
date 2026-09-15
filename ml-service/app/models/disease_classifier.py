import os

import torch
from torch import nn
from torchvision.models import mobilenet_v2

from app.config import DISEASE_MODEL_PATH, infer_severity
from app.preprocessing.image_utils import bytes_to_tensor


class DiseaseClassifier:
    """Same lazy-loading pattern as SoilClassifier - see that file's
    docstring for why loading is deferred to first use."""

    def __init__(self):
        self._model = None
        self._class_names = None

    def _ensure_loaded(self):
        if self._model is not None:
            return

        if not os.path.exists(DISEASE_MODEL_PATH):
            raise FileNotFoundError(
                f"No trained disease model found at {DISEASE_MODEL_PATH}. "
                "Run training/train_disease_model.py first and copy the "
                "resulting disease_cnn.pt into app/weights/."
            )

        checkpoint = torch.load(DISEASE_MODEL_PATH, map_location="cpu")
        class_names = checkpoint["class_names"]

        model = mobilenet_v2(weights=None)
        model.classifier[1] = nn.Linear(model.last_channel, len(class_names))
        model.load_state_dict(checkpoint["state_dict"])
        model.eval()

        self._model = model
        self._class_names = class_names

    def predict(self, image_bytes: bytes) -> tuple[str, float, str]:
        self._ensure_loaded()

        input_tensor = bytes_to_tensor(image_bytes)

        with torch.no_grad():
            logits = self._model(input_tensor)
            probabilities = torch.softmax(logits, dim=1)[0]
            confidence, predicted_index = torch.max(probabilities, dim=0)

        disease_name = self._class_names[predicted_index.item()]
        severity = infer_severity(disease_name)
        return disease_name, confidence.item(), severity


disease_classifier = DiseaseClassifier()
