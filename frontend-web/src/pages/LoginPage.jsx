import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Line-art crop panels for the left-hand login backdrop. No stock photos -
// same reasoning as SplashScreen's LeafMark: crisp at any size, no image
// request, no licensing concerns.
const heroCrops = [
  {
    name: "Tomato",
    caption: "Spot early blight before it spreads through the row.",
    accent: "#B3452C",
    Illustration: TomatoArt,
  },
  {
    name: "Arecanut",
    caption: "Grown from the fields of the Western Ghats.",
    accent: "#D9A441",
    Illustration: ArecanutArt,
  },
  {
    name: "Coffee",
    caption: "Match soil conditions to the crop that thrives there.",
    accent: "#6B4A2E",
    Illustration: CoffeeArt,
  },
];

function TomatoArt({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path d="M100 60c-28 0-48 22-48 54s20 58 48 58 48-26 48-58-20-54-48-54Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M100 60V38M84 46l10 12M116 46l-10 12"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 96c8-6 16-9 36-9s28 3 36 9" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function ArecanutArt({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path d="M100 20v150" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M100 ${40 + i * 30}c18-10 34-6 42 6-12 10-30 10-42 -6Z`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity={0.85 - i * 0.15}
        />
      ))}
      <ellipse cx="100" cy="176" rx="10" ry="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function CoffeeArt({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path d="M100 30c-30 20-46 44-46 72 0 34 26 58 46 58s46-24 46-58c0-28-16-52-46-72Z"
        fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M100 46v106" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <circle cx="82" cy="150" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="118" cy="150" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Decorative camera-viewfinder corner brackets, echoing the "Lens" in
// KisanLens. Purely cosmetic, absolutely positioned over its parent.
function ViewfinderFrame({ inset = 20, armLength = 22 }) {
  const corners = [
    { top: inset, left: inset, rotate: 0 },
    { top: inset, right: inset, rotate: 90 },
    { bottom: inset, right: inset, rotate: 180 },
    { bottom: inset, left: inset, rotate: 270 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {corners.map((corner, i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className="absolute h-10 w-10 text-canvas/70"
          style={{
            top: corner.top,
            left: corner.left,
            right: corner.right,
            bottom: corner.bottom,
            transform: `rotate(${corner.rotate}deg)`,
          }}
          aria-hidden="true"
        >
          <path
            d={`M2 ${armLength} V2 H${armLength}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}

function FieldIcon({ path }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  name: "M20 21a8 8 0 0 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  email: "M3 5h18v14H3zM3 6l9 7 9-7",
  password: "M6 10V7a6 6 0 0 1 12 0v3 M5 10h14v10H5z",
};

function Field({ label, icon, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-medium tracking-wide text-muted">
        {label}
      </span>
      <span className="mt-1.5 flex items-center gap-2.5 border-b border-border pb-2 text-ink transition-colors focus-within:border-forest">
        <span className="text-muted">
          <FieldIcon path={ICONS[icon]} />
        </span>
        <input
          {...props}
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
        />
      </span>
    </label>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const backdrop = heroCrops[1]; // arecanut -- steadier, less saturated than the others
  const Backdrop = backdrop.Illustration;

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
    <div className="min-h-screen bg-canvas lg:flex">
      {/* Left: field photography + brand, hidden on small screens */}
      <div className="relative hidden min-h-screen overflow-hidden bg-forest-deepest lg:flex lg:w-[46%]">
        <Backdrop className="absolute inset-0 h-full w-full scale-150 text-canvas/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deepest via-forest-deepest/60 to-forest-deepest/10" />
        <ViewfinderFrame inset={20} armLength={22} />

        <div className="relative z-20 flex h-full flex-col justify-between p-10 text-canvas">
          <span className="font-display text-2xl">KisanLens</span>

          <div className="max-w-xs">
            <p className="font-display text-3xl leading-tight">
              {backdrop.caption}
            </p>
            <p className="mt-3 text-sm text-canvas/70">
              Trained on tomato, arecanut and coffee — with more crops added
              as farmers scan them.
            </p>
          </div>
        </div>
      </div>

      {/* Right: the form */}
      <div className="flex min-h-screen flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-9 lg:hidden">
            <span className="font-display text-2xl text-forest-dark">
              KisanLens
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Log in to pick up your soil and disease scans."
              : "A minute to set up -- then start scanning your fields."}
          </p>

          <div className="mt-7 flex gap-6 border-b border-border text-sm font-medium">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`relative -mb-px pb-3 transition-colors ${
                  mode === m ? "text-forest-dark" : "text-muted hover:text-ink"
                }`}
              >
                {m === "login" ? "Log in" : "Sign up"}
                {mode === m && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-forest" />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {mode === "register" && (
              <Field
                label="Name"
                icon="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Field
              label="Email"
              icon="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Field
              label="Password"
              icon="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            {error && <p className="text-sm text-rust">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-forest py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-dark disabled:opacity-50"
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
    </div>
  );
}