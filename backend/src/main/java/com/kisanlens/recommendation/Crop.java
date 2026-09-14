package com.kisanlens.recommendation;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("crops")
public class Crop {

    @Id
    private String id;

    private String name;

    // Soil types this crop grows well in, e.g. ["loamy", "sandy"]
    private List<String> suitableSoilTypes;

    private double minTemperature;
    private double maxTemperature;
    private double minRainfallMm;
    private double maxRainfallMm;
    private double minPh;
    private double maxPh;
    private double minHumidity;
    private double maxHumidity;

    // Informational only for now - the CNN doesn't predict pH or humidity,
    // so these aren't wired into CropRecommendationEngine's scoring yet.
    // They're here so the crop's full profile can be shown to the farmer
    // and so a future version could ask the user for a soil test pH
    // reading and score against it too.
    private List<String> commonDiseases;

    public Crop() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getSuitableSoilTypes() {
        return suitableSoilTypes;
    }

    public void setSuitableSoilTypes(List<String> suitableSoilTypes) {
        this.suitableSoilTypes = suitableSoilTypes;
    }

    public double getMinTemperature() {
        return minTemperature;
    }

    public void setMinTemperature(double minTemperature) {
        this.minTemperature = minTemperature;
    }

    public double getMaxTemperature() {
        return maxTemperature;
    }

    public void setMaxTemperature(double maxTemperature) {
        this.maxTemperature = maxTemperature;
    }

    public double getMinRainfallMm() {
        return minRainfallMm;
    }

    public void setMinRainfallMm(double minRainfallMm) {
        this.minRainfallMm = minRainfallMm;
    }

    public double getMaxRainfallMm() {
        return maxRainfallMm;
    }

    public void setMaxRainfallMm(double maxRainfallMm) {
        this.maxRainfallMm = maxRainfallMm;
    }

    public double getMinPh() {
        return minPh;
    }

    public void setMinPh(double minPh) {
        this.minPh = minPh;
    }

    public double getMaxPh() {
        return maxPh;
    }

    public void setMaxPh(double maxPh) {
        this.maxPh = maxPh;
    }

    public double getMinHumidity() {
        return minHumidity;
    }

    public void setMinHumidity(double minHumidity) {
        this.minHumidity = minHumidity;
    }

    public double getMaxHumidity() {
        return maxHumidity;
    }

    public void setMaxHumidity(double maxHumidity) {
        this.maxHumidity = maxHumidity;
    }

    public List<String> getCommonDiseases() {
        return commonDiseases;
    }

    public void setCommonDiseases(List<String> commonDiseases) {
        this.commonDiseases = commonDiseases;
    }
}