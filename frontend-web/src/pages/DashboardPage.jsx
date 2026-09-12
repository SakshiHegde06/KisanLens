import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-ink mb-1">
        {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
      </h1>
      <p className="text-sm text-muted mb-8">
        Choose what you'd like to check today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/scan/soil"
          className="block bg-white border border-border rounded-lg p-6 hover:border-forest transition-colors"
        >
          <h2 className="text-lg font-semibold text-ink mb-1">Scan soil</h2>
          <p className="text-sm text-muted">
            Photograph a soil sample to get a crop recommendation matched to
            local weather.
          </p>
        </Link>

        <Link
          to="/scan/disease"
          className="block bg-white border border-border rounded-lg p-6 hover:border-forest transition-colors"
        >
          <h2 className="text-lg font-semibold text-ink mb-1">
            Diagnose a plant
          </h2>
          <p className="text-sm text-muted">
            Photograph a leaf or fruit to identify disease and get a
            treatment plan.
          </p>
        </Link>
      </div>

      <Link
        to="/history"
        className="inline-block mt-6 text-sm font-medium text-forest-dark hover:underline"
      >
        View past scans
      </Link>
    </div>
  );
}
