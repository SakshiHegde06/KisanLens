package com.kisanlens.soilscan;

import com.kisanlens.common.exception.ResourceNotFoundException;
import com.kisanlens.mlclient.MlInferenceClient;
import com.kisanlens.mlclient.SoilPredictionResult;
import com.kisanlens.recommendation.CropRecommendationEngine;
import com.kisanlens.recommendation.CropSuggestionDto;
import com.kisanlens.soilscan.dto.SoilScanResponse;
import com.kisanlens.storage.ImageStorageService;
import com.kisanlens.weather.WeatherClient;
import com.kisanlens.weather.WeatherSnapshot;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class SoilScanService {

    private final SoilScanRepository soilScanRepository;
    private final ImageStorageService imageStorageService;
    private final MlInferenceClient mlInferenceClient;
    private final WeatherClient weatherClient;
    private final CropRecommendationEngine cropRecommendationEngine;

    public SoilScanService(
            SoilScanRepository soilScanRepository,
            ImageStorageService imageStorageService,
            MlInferenceClient mlInferenceClient,
            WeatherClient weatherClient,
            CropRecommendationEngine cropRecommendationEngine
    ) {
        this.soilScanRepository = soilScanRepository;
        this.imageStorageService = imageStorageService;
        this.mlInferenceClient = mlInferenceClient;
        this.weatherClient = weatherClient;
        this.cropRecommendationEngine = cropRecommendationEngine;
    }

    public SoilScanResponse submitScan(String userId, MultipartFile image, double latitude, double longitude) {
        // 1. Persist the image first so we still have it even if a later step fails.
        String imageRef = imageStorageService.store(image, "soil");

        SoilScan scan = new SoilScan(userId, imageRef);
        scan = soilScanRepository.save(scan);

        try {
            // 2. Run the CNN via the FastAPI ml-service.
            SoilPredictionResult prediction = mlInferenceClient.predictSoil(image);

            // 3. Pull current weather at the given coordinates (never hard-fails - see WeatherClient).
            WeatherSnapshot weather = weatherClient.getCurrentWeather(latitude, longitude);

            // 4. Rank crops using soil type + weather.
            List<CropSuggestionDto> crops = cropRecommendationEngine.rank(prediction.soilType(), weather);

            scan.setSoilType(prediction.soilType());
            scan.setConfidence(prediction.confidence());
            scan.setWeather(weather);
            scan.setCrops(crops);
            scan.setStatus(SoilScan.ScanStatus.COMPLETE);
        } catch (RuntimeException ex) {
            scan.setStatus(SoilScan.ScanStatus.FAILED);
            soilScanRepository.save(scan);
            throw ex; // let GlobalExceptionHandler translate this into a clean HTTP response
        }

        scan = soilScanRepository.save(scan);
        return SoilScanResponse.from(scan);
    }

    public List<SoilScanResponse> getHistory(String userId) {
        return soilScanRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(SoilScanResponse::from)
                .toList();
    }

    public SoilScanResponse getById(String id, String userId) {
        SoilScan scan = soilScanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soil scan not found: " + id));

        if (!scan.getUserId().equals(userId)) {
            // Deliberately the same "not found" message as above rather than
            // a 403 - avoids confirming to one user that another user's scan ID exists.
            throw new ResourceNotFoundException("Soil scan not found: " + id);
        }

        return SoilScanResponse.from(scan);
    }
}
