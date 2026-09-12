import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SoilScanPage from "./pages/SoilScanPage";
import DiseaseScanPage from "./pages/DiseaseScanPage";
import HistoryPage from "./pages/HistoryPage";

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/scan/soil"
        element={
          <ProtectedLayout>
            <SoilScanPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/scan/disease"
        element={
          <ProtectedLayout>
            <DiseaseScanPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedLayout>
            <HistoryPage />
          </ProtectedLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
