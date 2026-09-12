import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, register as registerApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, trust whatever was saved in localStorage last session.
  // (No "verify token" round trip here — kept simple for the capstone;
  // a bad/expired token just gets cleared on the first 401, see client.js.)
  useEffect(() => {
    const token = localStorage.getItem("kisanlens_token");
    const name = localStorage.getItem("kisanlens_name");
    const email = localStorage.getItem("kisanlens_email");
    if (token && email) {
      setUser({ name, email });
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await loginApi(email, password);
    persistSession(data);
  }

  async function register(name, email, password) {
    const data = await registerApi(name, email, password);
    persistSession(data);
  }

  function persistSession(data) {
    localStorage.setItem("kisanlens_token", data.token);
    localStorage.setItem("kisanlens_name", data.name);
    localStorage.setItem("kisanlens_email", data.email);
    setUser({ name: data.name, email: data.email });
  }

  function logout() {
    localStorage.removeItem("kisanlens_token");
    localStorage.removeItem("kisanlens_name");
    localStorage.removeItem("kisanlens_email");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
