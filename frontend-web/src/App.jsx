import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SoilScanPage from "./pages/SoilScanPage";
import DiseaseScanPage from "./pages/DiseaseScanPage";
import HistoryPage from "./pages/HistoryPage";

const SPLASH_SESSION_KEY = "kisanlens-splash-shown";

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
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem(SPLASH_SESSION_KEY)
  );

  function handleSplashFinish() {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    setShowSplash(false);
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

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