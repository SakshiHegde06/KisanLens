import React, { useState } from "react";

/**
 * Shared capture form for both soil scans and disease scans.
 *
 * `capture="environment"` opens the rear camera directly on phone browsers,
 * which is what lets us skip building a separate React Native app for the
 * capstone — a farmer on a phone gets the same camera experience here.
 *
 * `requireLocation` is only true for soil scans, since crop recommendation
 * needs GPS to pull local weather; disease scans don't need it.
 */
export default function ImageUploadForm({
  title,
  helperText,
  buttonLabel,
  requireLocation = false,
  onSubmit,
  submitting,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [locationError, setLocationError] = useState("");

  function handleFileChange(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!file) return;

    if (!requireLocation) {
      onSubmit({ file });
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("This browser can't read location. Try a different device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationError("");
        onSubmit({
          file,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocationError("Location access was blocked. Allow it to get a weather-matched recommendation.");
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-border rounded-lg p-6 max-w-xl"
    >
      <h2 className="text-lg font-semibold text-ink mb-1">{title}</h2>
      <p className="text-sm text-muted mb-5">{helperText}</p>

      <label className="block border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-forest transition-colors">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected preview"
            className="w-full h-64 object-cover rounded-lg"
          />
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-muted">
            <span className="text-sm font-medium">Tap to take or choose a photo</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {locationError && (
        <p className="mt-3 text-sm text-rust">{locationError}</p>
      )}

      <button
        type="submit"
        disabled={!file || submitting}
        className="mt-5 w-full bg-forest text-white font-medium py-2.5 rounded-md hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Analyzing..." : buttonLabel}
      </button>
    </form>
  );
}
