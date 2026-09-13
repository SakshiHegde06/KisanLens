package com.kisanlens.recommendation;

import com.kisanlens.weather.WeatherSnapshot;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

/**
 * Deliberately simple rule-based scoring for the capstone scope - not a
 * trained model. Filters crops whose declared soil types include the
 * detected soil type, then scores each by how comfortably the current
 * temperature and rainfall sit inside that crop's known-good range.
 *
 * This is the kind of logic a future "V2" could replace with a real
 * ranking model without touching anything upstream (SoilScanService only
 * calls rank(), never these scoring internals).
 */
@Service
public class CropRecommendationEngine {

    private static final int TOP_N = 3;

    private final CropRepository cropRepository;

    public CropRecommendationEngine(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public List<CropSuggestionDto> rank(String soilType, WeatherSnapshot weather) {
        List<Crop> candidates = cropRepository.findBySuitableSoilTypesContaining(soilType);

        return candidates.stream()
                .map(crop -> new CropSuggestionDto(crop.getName(), score(crop, weather)))
                .sorted(Comparator.comparingDouble(CropSuggestionDto::score).reversed())
                .limit(TOP_N)
                .toList();
    }

    private double score(Crop crop, WeatherSnapshot weather) {
        double temperatureFit = rangeFit(weather.temperature(), crop.getMinTemperature(), crop.getMaxTemperature());
        double rainfallFit = rangeFit(weather.rainfall(), crop.getMinRainfallMm(), crop.getMaxRainfallMm());

        // Equally weighted for the capstone; a real system might weight
        // temperature more heavily since it's usually the harder constraint.
        return (temperatureFit + rainfallFit) / 2.0;
    }

    /**
     * Returns 1.0 if the value sits inside [min, max], decaying linearly
     * to 0.0 as it moves one full range-width outside either edge.
     */
    private double rangeFit(double value, double min, double max) {
        if (value >= min && value <= max) {
            return 1.0;
        }
        double rangeWidth = Math.max(max - min, 1.0); // avoid divide-by-zero on degenerate ranges
        double distanceOutside = value < min ? (min - value) : (value - max);
        double fit = 1.0 - (distanceOutside / rangeWidth);
        return Math.max(fit, 0.0);
    }
}
