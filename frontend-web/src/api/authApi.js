import client from "./client";

// Expected backend contract (matches AuthController in the Spring Boot app):
// POST /auth/login    { email, password } -> { token, name, email }
// POST /auth/register { name, email, password } -> { token, name, email }

export async function login(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

export async function register(name, email, password) {
  const { data } = await client.post("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}
