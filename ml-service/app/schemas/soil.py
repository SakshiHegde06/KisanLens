from pydantic import BaseModel


# Matches what com.kisanlens.mlclient.SoilPredictionResult expects on the
# Java side - keep these two in sync if either changes.
class SoilPredictionResponse(BaseModel):
    soilType: str
    confidence: float
