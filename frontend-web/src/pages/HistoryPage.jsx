import React, { useEffect, useState } from "react";
import { getSoilScanHistory } from "../api/soilScanApi";
import { getDiseaseScanHistory } from "../api/diseaseScanApi";

export default function HistoryPage() {
  const [tab, setTab] = useState("soil"); // "soil" | "disease"
  const [soilScans, setSoilScans] = useState([]);
  const [diseaseScans, setDiseaseScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const [soil, disease] = await Promise.all([
          getSoilScanHistory(),
          getDiseaseScanHistory(),
        ]);
        setSoilScans(soil);
        setDiseaseScans(disease);
      } catch (err) {
        setError("Couldn't load your scan history right now.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const activeList = tab === "soil" ? soilScans : diseaseScans;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-ink mb-1">Scan history</h1>
      <p className="text-sm text-muted mb-6">
        Everything you've scanned so far, most recent first.
      </p>

      <div className="flex mb-6 border-b border-border">
        <button
          onClick={() => setTab("soil")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === "soil"
              ? "border-forest text-forest-dark"
              : "border-transparent text-muted"
          }`}
        >
          Soil scans
        </button>
        <button
          onClick={() => setTab("disease")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab === "disease"
              ? "border-forest text-forest-dark"
              : "border-transparent text-muted"
          }`}
        >
          Disease scans
        </button>
      </div>

      {loading && <p className="text-sm text-muted">Loading...</p>}
      {error && <p className="text-sm text-rust">{error}</p>}

      {!loading && !error && activeList.length === 0 && (
        <p className="text-sm text-muted">
          No {tab} scans yet. Run one from the dashboard to see it here.
        </p>
      )}

      <ul className="space-y-3">
        {activeList.map((scan) => (
          <li
            key={scan.id}
            className="bg-white border border-border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-ink">
                {tab === "soil" ? scan.soilType : scan.disease}
              </p>
              <p className="text-xs text-muted mt-0.5">
                {scan.createdAt
                  ? new Date(scan.createdAt).toLocaleString()
                  : ""}
              </p>
            </div>
            <span className="text-xs font-medium text-muted">
              {Math.round(scan.confidence * 100)}% confidence
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
