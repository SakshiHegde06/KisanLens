from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.soil_classifier import soil_classifier
from app.schemas.soil import SoilPredictionResponse

router = APIRouter()


@router.post("/predict/soil", response_model=SoilPredictionResponse)
async def predict_soil(file: UploadFile = File(...)):
    image_bytes = await file.read()

    try:
        soil_type, confidence = soil_classifier.predict(image_bytes)
    except FileNotFoundError as e:
        # Model not trained/deployed yet - a clear 503 instead of a
        # confusing 500, matching MlServiceUnavailableException on the
        # Java side which expects a failure here to look like "service down".
        raise HTTPException(status_code=503, detail=str(e))

    return SoilPredictionResponse(soilType=soil_type, confidence=confidence)
