from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.disease_classifier import disease_classifier
from app.schemas.disease import DiseasePredictionResponse

router = APIRouter()


@router.post("/predict/disease", response_model=DiseasePredictionResponse)
async def predict_disease(file: UploadFile = File(...)):
    image_bytes = await file.read()

    try:
        disease, confidence, severity = disease_classifier.predict(image_bytes)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return DiseasePredictionResponse(disease=disease, confidence=confidence, severity=severity)
