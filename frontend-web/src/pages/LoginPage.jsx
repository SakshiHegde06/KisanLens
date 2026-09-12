import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-forest-dark">
            KisanLens
          </h1>
          <p className="text-sm text-muted mt-1">
            Soil recommendations and crop disease diagnosis, from a photo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-border rounded-lg p-6"
        >
          <div className="flex mb-6 rounded-md bg-forest-light p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-medium py-1.5 rounded ${
                mode === "login" ? "bg-white text-forest-dark shadow-sm" : "text-muted"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 text-sm font-medium py-1.5 rounded ${
                mode === "register" ? "bg-white text-forest-dark shadow-sm" : "text-muted"
              }`}
            >
              Sign up
            </button>
          </div>

          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-ink mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-forest"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-forest"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-ink mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-forest"
            />
          </div>

          {error && <p className="text-sm text-rust mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-forest text-white font-medium py-2.5 rounded-md hover:bg-forest-dark transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
