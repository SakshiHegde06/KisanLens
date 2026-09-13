package com.kisanlens.mlclient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Matches the FastAPI /predict/soil response schema (app/schemas/soil.py in ml-service)
@JsonIgnoreProperties(ignoreUnknown = true)
public record SoilPredictionResult(String soilType, double confidence) {
}
