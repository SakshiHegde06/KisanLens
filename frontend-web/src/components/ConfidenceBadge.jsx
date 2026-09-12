import React from "react";

// Shown as a labeled bar rather than a colored pill — a farmer needs to
// see roughly how sure the model is, not just a decorative badge.
// Below the LOW_CONFIDENCE_THRESHOLD we say so explicitly, since acting
// on a low-confidence disease diagnosis (wrong dosage) is a real risk.
const LOW_CONFIDENCE_THRESHOLD = 0.6;

export default function ConfidenceBadge({ confidence }) {
  const percent = Math.round(confidence * 100);
  const isLow = confidence < LOW_CONFIDENCE_THRESHOLD;

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted">Confidence</span>
        <span
          className={`text-xs font-semibold ${
            isLow ? "text-rust" : "text-forest-dark"
          }`}
        >
          {percent}%
        </span>
      </div>
      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            isLow ? "bg-rust" : "bg-forest"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {isLow && (
        <p className="mt-2 text-xs text-rust">
          This result isn't very certain. Consider retaking the photo in
          better light before acting on it.
        </p>
      )}
    </div>
  );
}
