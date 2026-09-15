"""
Trains the crop recommendation model: given soil nutrients (N, P, K),
local weather (temperature, humidity, rainfall) and soil pH, predicts
which of 22 crops is the best fit.

This is a *separate* model from the soil-image and disease-image CNNs -
it takes 7 numeric features, not an image, and answers a different
question ("what should I plant here?") rather than "what type of soil /
what disease is this?". It's meant to sit next to (or eventually replace
part of) the rule-based CropRecommendationEngine in the Spring Boot
backend with a data-driven model.

HOW TO USE:
1. Get the dataset - the standard public "Crop_recommendation.csv"
   (2200 rows, 22 balanced crop classes, 7 numeric features + label).
   Same one referenced in the original notebook this was adapted from.
   Kaggle: search "Crop Recommendation Dataset" (Atharva Ingle).
2. Place it at training/datasets/Crop_recommendation.csv
3. Run: python training/train_crop_model.py
4. This writes app/weights/crop_recommender.joblib - pick it up
   automatically the next time ml-service starts (lazy-loaded, same
   pattern as the soil/disease CNNs).

Why scikit-learn instead of the notebook's Keras ANN:
- The task is small (2200 rows, 7 features) - a tree ensemble fits this
  kind of tabular data at least as well as a hand-tuned neural net, with
  no epoch/learning-rate tuning and no risk of the categorical_crossentropy
  label-encoding bugs that were in the original notebook.
- One joblib artifact (scaler + encoder + model bundled together) avoids
  the training/serving skew you get from re-implementing preprocessing
  by hand in the FastAPI service.
- Keeps ml-service's dependency footprint aligned with what's already
  there (adds scikit-learn + joblib + pandas; no second deep-learning
  framework next to PyTorch).
"""

import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "training", "datasets", "Crop_recommendation.csv")
WEIGHTS_DIR = os.path.join(BASE_DIR, "app", "weights")
MODEL_PATH = os.path.join(WEIGHTS_DIR, "crop_recommender.joblib")

FEATURE_COLUMNS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
RANDOM_STATE = 42


def main():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(
            f"No dataset found at {DATASET_PATH}. Download Crop_recommendation.csv "
            "and place it there first (see docstring for where to get it)."
        )

    df = pd.read_csv(DATASET_PATH)
    missing_cols = set(FEATURE_COLUMNS + ["label"]) - set(df.columns)
    if missing_cols:
        raise ValueError(f"Dataset is missing expected columns: {missing_cols}")

    X = df[FEATURE_COLUMNS]
    y_raw = df["label"]

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"Test accuracy: {acc:.4f}\n")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

    os.makedirs(WEIGHTS_DIR, exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "scaler": scaler,
            "label_encoder": label_encoder,
            "feature_columns": FEATURE_COLUMNS,
        },
        MODEL_PATH,
    )
    print(f"\nSaved bundled model to {MODEL_PATH}")


if __name__ == "__main__":
    main()
