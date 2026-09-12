import React from "react";
import ConfidenceBadge from "./ConfidenceBadge";

// Expects `result` shaped like the DiseaseScanResponse from the backend:
// { disease, confidence, severity, treatment: { precautions: [], dosage: [], notes } }
const SEVERITY_STYLES = {
  low: "text-forest-dark bg-forest-light",
  moderate: "text-clay bg-clay-light",
  high: "text-rust bg-clay-light",
};

export default function DiseaseResultCard({ result }) {
  const severityKey = (result.severity || "").toLowerCase();
  const severityClass = SEVERITY_STYLES[severityKey] || "text-muted bg-border";

  return (
    <div className="bg-white border border-border rounded-lg p-6 max-w-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-muted mb-1">Diagnosis</p>
          <h3 className="text-2xl font-semibold text-ink">{result.disease}</h3>
        </div>
        {result.severity && (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${severityClass}`}
          >
            {result.severity} severity
          </span>
        )}
      </div>

      <ConfidenceBadge confidence={result.confidence} />

      {result.treatment?.precautions?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-ink mb-3">Precautions</p>
          <ul className="space-y-1.5 text-sm text-ink list-disc list-inside">
            {result.treatment.precautions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.treatment?.dosage?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-ink mb-3">
            Recommended treatment
          </p>
          <ul className="space-y-1.5 text-sm text-ink list-disc list-inside">
            {result.treatment.dosage.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.treatment?.notes && (
        <p className="mt-4 text-xs text-muted">{result.treatment.notes}</p>
      )}
    </div>
  );
}
