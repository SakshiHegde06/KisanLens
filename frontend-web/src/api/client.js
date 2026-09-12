import axios from "axios";

// Adjust to wherever the Spring Boot backend actually runs.
// Kept as an env var so it's one line to change for deployment.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const client = axios.create({
  baseURL: BASE_URL,
});

// Attach the JWT (if we have one) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("kisanlens_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says "your token is no good", clear it so the
// UI falls back to the login screen instead of silently failing forever.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("kisanlens_token");
    }
    return Promise.reject(error);
  }
);

export default client;
