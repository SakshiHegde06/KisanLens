from pydantic import BaseModel


# Matches what com.kisanlens.mlclient.DiseasePredictionResult expects on the
# Java side - keep these two in sync if either changes.
class DiseasePredictionResponse(BaseModel):
    disease: str
    confidence: float
    severity: str
