from pydantic import BaseModel, Field


class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., description="Soil nitrogen content (N), kg/ha", ge=0)
    phosphorus: float = Field(..., description="Soil phosphorus content (P), kg/ha", ge=0)
    potassium: float = Field(..., description="Soil potassium content (K), kg/ha", ge=0)
    temperature: float = Field(..., description="Ambient temperature, degrees C")
    humidity: float = Field(..., description="Relative humidity, percent", ge=0, le=100)
    ph: float = Field(..., description="Soil pH", ge=0, le=14)
    rainfall: float = Field(..., description="Rainfall, mm", ge=0)


class CropAlternative(BaseModel):
    crop: str
    confidence: float


# Matches what com.kisanlens.mlclient should expect on the Java side if/when
# this gets wired into the backend - keep in sync if either side changes.
class CropRecommendationResponse(BaseModel):
    crop: str
    confidence: float
    alternatives: list[CropAlternative]
