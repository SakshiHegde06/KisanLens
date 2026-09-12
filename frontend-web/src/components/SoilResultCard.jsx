import React from "react";
import ConfidenceBadge from "./ConfidenceBadge";

// Expects `result` shaped like the SoilScanResponse from the backend:
// { soilType, confidence, weather: { temperature, rainfall, humidity }, crops: [{ name, score }] }
export default function SoilResultCard({ result }) {
  return (
    <div className="bg-white border border-border rounded-lg p-6 max-w-xl">
      <p className="text-xs font-medium text-muted mb-1">Soil type detected</p>
      <h3 className="text-2xl font-semibold text-ink mb-4">
        {result.soilType}
      </h3>

      <ConfidenceBadge confidence={result.confidence} />

      {result.weather && (
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted">Temperature</p>
            <p className="font-medium text-ink">{result.weather.temperature}°C</p>
          </div>
          <div>
            <p className="text-muted">Rainfall</p>
            <p className="font-medium text-ink">{result.weather.rainfall} mm</p>
          </div>
          <div>
            <p className="text-muted">Humidity</p>
            <p className="font-medium text-ink">{result.weather.humidity}%</p>
          </div>
        </div>
      )}

      {result.crops && result.crops.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-ink mb-3">
            Recommended crops
          </p>
          <ul className="space-y-2">
            {result.crops.map((crop) => (
              <li
                key={crop.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-ink">{crop.name}</span>
                <span className="text-muted">
                  {Math.round(crop.score * 100)}% fit
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
