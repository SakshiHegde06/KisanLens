import React, { useEffect, useState } from "react";

/**
 * Shown once when the app first loads (not on every navigation - see
 * App.jsx, which only mounts this before the very first route render).
 *
 * Fade timeline: fade in (400ms) -> hold (1400ms) -> fade out (500ms) ->
 * onFinish() unmounts this and reveals the real app underneath.
 * Total: ~2.3s, short enough not to feel like a forced wait, long enough
 * to actually read the tagline.
 */
const FADE_IN_MS = 400;
const HOLD_MS = 1400;
const FADE_OUT_MS = 500;

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState("in"); // "in" | "hold" | "out"

  useEffect(() => {
    const toHold = setTimeout(() => setPhase("hold"), FADE_IN_MS);
    const toOut = setTimeout(() => setPhase("out"), FADE_IN_MS + HOLD_MS);
    const finish = setTimeout(onFinish, FADE_IN_MS + HOLD_MS + FADE_OUT_MS);

    return () => {
      clearTimeout(toHold);
      clearTimeout(toOut);
      clearTimeout(finish);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-dark transition-opacity ease-in-out"
      style={{
        opacity: phase === "out" ? 0 : 1,
        transitionDuration: phase === "out" ? `${FADE_OUT_MS}ms` : `${FADE_IN_MS}ms`,
      }}
    >
      <LeafMark className="w-16 h-16 mb-5 text-forest-light" />

      <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
        KisanLens
      </h1>

      <p className="text-sm text-forest-light/80 max-w-xs text-center px-6 leading-relaxed">
        AI-powered guidance for Indian farmers — grow the right crop, catch
        disease early.
      </p>
    </div>
  );
}

// Simple line-art leaf mark, drawn in the app's own palette rather than a
// stock photo - crisp at any size, no image request, no licensing concerns.
function LeafMark({ className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 58C18 54 8 42 8 26 8 14 18 6 32 6s24 8 24 20c0 16-10 28-24 32Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 6v52"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M32 20c-6 2-10 7-10 13M32 32c6 2 10 7 10 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}