package com.kisanlens.soilscan.dto;

import com.kisanlens.recommendation.CropSuggestionDto;
import com.kisanlens.soilscan.SoilScan;
import com.kisanlens.weather.WeatherSnapshot;

import java.time.Instant;
import java.util.List;

// Matches frontend-web/src/components/SoilResultCard.jsx and HistoryPage.jsx:
// { id, soilType, confidence, weather: {temperature, rainfall, humidity}, crops: [{name, score}], createdAt }
public record SoilScanResponse(
        String id,
        String soilType,
        double confidence,
        WeatherSnapshot weather,
        List<CropSuggestionDto> crops,
        Instant createdAt
) {
    public static SoilScanResponse from(SoilScan scan) {
        return new SoilScanResponse(
                scan.getId(),
                scan.getSoilType(),
                scan.getConfidence(),
                scan.getWeather(),
                scan.getCrops(),
                scan.getCreatedAt()
        );
    }
}
