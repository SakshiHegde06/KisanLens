package com.kisanlens.mlclient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// Matches the FastAPI /predict/disease response schema (app/schemas/disease.py in ml-service)
@JsonIgnoreProperties(ignoreUnknown = true)
public record DiseasePredictionResult(String disease, double confidence, String severity) {
}
