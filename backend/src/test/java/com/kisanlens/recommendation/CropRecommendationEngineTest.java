package com.kisanlens.recommendation;

import com.kisanlens.weather.WeatherSnapshot;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CropRecommendationEngineTest {

    @Test
    void ranksCropWithinIdealRangeHigherThanCropOutsideIt() {
        CropRepository cropRepository = mock(CropRepository.class);

        Crop goodFit = new Crop();
        goodFit.setName("Rice");
        goodFit.setMinTemperature(20);
        goodFit.setMaxTemperature(35);
        goodFit.setMinRainfallMm(100);
        goodFit.setMaxRainfallMm(300);

        Crop poorFit = new Crop();
        poorFit.setName("Wheat");
        poorFit.setMinTemperature(5);
        poorFit.setMaxTemperature(15);
        poorFit.setMinRainfallMm(20);
        poorFit.setMaxRainfallMm(60);

        when(cropRepository.findBySuitableSoilTypesContaining("loamy"))
                .thenReturn(List.of(goodFit, poorFit));

        CropRecommendationEngine engine = new CropRecommendationEngine(cropRepository);
        WeatherSnapshot currentWeather = new WeatherSnapshot(28.0, 150.0, 70.0);

        List<CropSuggestionDto> ranked = engine.rank("loamy", currentWeather);

        assertEquals(2, ranked.size());
        assertEquals("Rice", ranked.get(0).name());
        assertTrue(ranked.get(0).score() > ranked.get(1).score());
    }
}
