import os

import joblib
import numpy as np
import pandas as pd

from app.config import CROP_MODEL_PATH

TOP_K = 3


class CropRecommender:
    """
    Lazy-loaded wrapper around the bundled crop-recommendation model
    (RandomForestClassifier + StandardScaler + LabelEncoder, saved
    together as one joblib artifact by training/train_crop_model.py).

    Same lazy-loading rationale as SoilClassifier/DiseaseClassifier:
    the service can start and serve /health before this model exists,
    and callers get a clear 503 on the /predict/crop call itself
    instead of the whole service refusing to boot.
    """

    def __init__(self):
        self._model = None
        self._scaler = None
        self._label_encoder = None
        self._feature_columns = None

    def _ensure_loaded(self):
        if self._model is not None:
            return

        if not os.path.exists(CROP_MODEL_PATH):
            raise FileNotFoundError(
                f"No trained crop-recommendation model found at {CROP_MODEL_PATH}. "
                "Run training/train_crop_model.py first (needs "
                "training/datasets/Crop_recommendation.csv)."
            )

        bundle = joblib.load(CROP_MODEL_PATH)
        self._model = bundle["model"]
        self._scaler = bundle["scaler"]
        self._label_encoder = bundle["label_encoder"]
        self._feature_columns = bundle["feature_columns"]

    def predict(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float,
    ) -> tuple[str, float, list[tuple[str, float]]]:
        self._ensure_loaded()

        # Built as a one-row DataFrame (not a bare array) so column names
        # match what the scaler/model were fit on - avoids sklearn's
        # "X does not have valid feature names" warning and keeps column
        # order tied to feature_columns rather than argument order here.
        features = pd.DataFrame(
            [[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]],
            columns=self._feature_columns,
        )
        features_scaled = self._scaler.transform(features)

        probabilities = self._model.predict_proba(features_scaled)[0]
        ranked_indices = np.argsort(probabilities)[::-1]

        top_index = ranked_indices[0]
        crop = self._label_encoder.inverse_transform([top_index])[0]
        confidence = float(probabilities[top_index])

        alternatives = [
            (self._label_encoder.inverse_transform([i])[0], float(probabilities[i]))
            for i in ranked_indices[1:TOP_K]
        ]

        return crop, confidence, alternatives


# Module-level singleton - one model instance shared across requests.
crop_recommender = CropRecommender()
