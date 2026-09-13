package com.kisanlens.soilscan;

import com.kisanlens.recommendation.CropSuggestionDto;
import com.kisanlens.weather.WeatherSnapshot;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("soil_scans")
public class SoilScan {

    @Id
    private String id;

    private String userId;

    private String imageRef; // reference returned by ImageStorageService

    private ScanStatus status = ScanStatus.PENDING;

    private String soilType;

    private double confidence;

    private WeatherSnapshot weather;

    private List<CropSuggestionDto> crops;

    private Instant createdAt = Instant.now();

    public SoilScan() {
    }

    public SoilScan(String userId, String imageRef) {
        this.userId = userId;
        this.imageRef = imageRef;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getImageRef() {
        return imageRef;
    }

    public void setImageRef(String imageRef) {
        this.imageRef = imageRef;
    }

    public ScanStatus getStatus() {
        return status;
    }

    public void setStatus(ScanStatus status) {
        this.status = status;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public WeatherSnapshot getWeather() {
        return weather;
    }

    public void setWeather(WeatherSnapshot weather) {
        this.weather = weather;
    }

    public List<CropSuggestionDto> getCrops() {
        return crops;
    }

    public void setCrops(List<CropSuggestionDto> crops) {
        this.crops = crops;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public enum ScanStatus {
        PENDING, COMPLETE, FAILED
    }
}
