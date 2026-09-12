import React, { useState } from "react";
import ImageUploadForm from "../components/ImageUploadForm";
import DiseaseResultCard from "../components/DiseaseResultCard";
import { submitDiseaseScan } from "../api/diseaseScanApi";

export default function DiseaseScanPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit({ file }) {
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const data = await submitDiseaseScan(file);
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
      <h1 className="text-2xl font-semibold text-ink mb-1">
        Diagnose a plant
      </h1>
      <p className="text-sm text-muted mb-6">
        Photograph the affected leaf, fruit, or stem as closely as you can.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <ImageUploadForm
          title="Leaf or fruit photo"
          helperText="Include both healthy and affected areas if possible."
          buttonLabel="Get diagnosis"
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        <div className="flex-1">
          {error && <p className="text-sm text-rust mb-4">{error}</p>}
          {result && <DiseaseResultCard result={result} />}
        </div>
      </div>
    </div>
  );
}
