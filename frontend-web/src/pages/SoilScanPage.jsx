import React, { useState } from "react";
import ImageUploadForm from "../components/ImageUploadForm";
import SoilResultCard from "../components/SoilResultCard";
import { submitSoilScan } from "../api/soilScanApi";

export default function SoilScanPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit({ file, latitude, longitude }) {
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const data = await submitSoilScan(file, latitude, longitude);
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't analyze that photo. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-ink mb-1">Scan soil</h1>
      <p className="text-sm text-muted mb-6">
        Take a clear, close-up photo of the soil in daylight for the most
        accurate reading.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <ImageUploadForm
          title="Soil photo"
          helperText="We'll also use your current location to check local weather."
          buttonLabel="Analyze soil"
          requireLocation
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        <div className="flex-1">
          {error && <p className="text-sm text-rust mb-4">{error}</p>}
          {result && <SoilResultCard result={result} />}
        </div>
      </div>
    </div>
  );
}
