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
}
