from fastapi import APIRouter, HTTPException

from app.models.crop_recommender import crop_recommender
from app.schemas.crop import CropAlternative, CropRecommendationRequest, CropRecommendationResponse

router = APIRouter()


@router.post("/predict/crop", response_model=CropRecommendationResponse)
async def predict_crop(payload: CropRecommendationRequest):
    try:
        crop, confidence, alternatives = crop_recommender.predict(
            nitrogen=payload.nitrogen,
            phosphorus=payload.phosphorus,
            potassium=payload.potassium,
            temperature=payload.temperature,
            humidity=payload.humidity,
            ph=payload.ph,
            rainfall=payload.rainfall,
        )
    except FileNotFoundError as e:
        # Model not trained/deployed yet - 503, same convention as
        # /predict/soil and /predict/disease.
        raise HTTPException(status_code=503, detail=str(e))

    return CropRecommendationResponse(
        crop=crop,
        confidence=confidence,
        alternatives=[CropAlternative(crop=c, confidence=conf) for c, conf in alternatives],
    )
