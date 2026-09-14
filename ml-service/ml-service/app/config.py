"""
Central config for the ml-service.

Class names for both models are NOT hardcoded here - they're saved
inside the .pt checkpoint file itself during training (see
training/train_soil_model.py and training/train_disease_model.py),
so the serving code always uses the exact label order the model was
trained with. This avoids a classic bug: someone updates the dataset,
retrains, and forgets to update a separate hardcoded label list.
"""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEIGHTS_DIR = os.path.join(BASE_DIR, "app", "weights")

SOIL_MODEL_PATH = os.path.join(WEIGHTS_DIR, "soil_cnn.pt")
DISEASE_MODEL_PATH = os.path.join(WEIGHTS_DIR, "disease_cnn.pt")

# Image size expected by both models - MUST match IMAGE_SIZE used in
# training/train_soil_model.py and training/train_disease_model.py.
IMAGE_SIZE = 224

# Below this, the backend still shows the result but flags it as
# low-confidence (see ConfidenceBadge.jsx on the frontend). Kept here too
# in case ml-service ever needs to act on it directly (e.g. logging).
LOW_CONFIDENCE_THRESHOLD = 0.6

# Fixed severity per disease class, per the capstone's chosen approach
# (see design discussion) rather than a learned severity score.
# Keys MUST exactly match the folder/class names your disease dataset
# uses (PlantVillage-style, e.g. "Tomato___Late_blight"). This default
# map assumes the standard 38-class PlantVillage dataset - update it to
# match whatever dataset you actually train on.
SEVERITY_OVERRIDES = {
    # class name substring (case-insensitive) -> severity
    "healthy": "none",
}

HIGH_SEVERITY_KEYWORDS = ["blight", "rot", "greening", "mosaic", "yellow_leaf_curl"]
MODERATE_SEVERITY_KEYWORDS = ["spot", "rust", "mildew", "scab", "mite", "scorch", "mold"]


def infer_severity(disease_class_name: str) -> str:
    """
    Rule-based severity lookup. Checked in order: exact override,
    then high-severity keywords, then moderate-severity keywords,
    then a default of "moderate" (never silently "none" for an
    unrecognized disease - see TreatmentService's fallback plan on
    the backend for the same "don't fabricate safety" principle).
    """
    name_lower = disease_class_name.lower()

    for keyword, severity in SEVERITY_OVERRIDES.items():
        if keyword in name_lower:
            return severity

    if any(keyword in name_lower for keyword in HIGH_SEVERITY_KEYWORDS):
        return "high"

    if any(keyword in name_lower for keyword in MODERATE_SEVERITY_KEYWORDS):
        return "moderate"

    return "moderate"
