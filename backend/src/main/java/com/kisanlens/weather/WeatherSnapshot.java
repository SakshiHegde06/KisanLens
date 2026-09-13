package com.kisanlens.weather;

// Embedded (not a top-level collection) inside SoilScan - a snapshot of
// conditions at the moment of the scan, not a live-updating reference.
public record WeatherSnapshot(double temperature, double rainfall, double humidity) {
}
