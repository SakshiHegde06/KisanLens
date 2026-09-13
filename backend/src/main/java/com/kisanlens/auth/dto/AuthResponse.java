package com.kisanlens.auth.dto;

// Shape matches what frontend-web/src/context/AuthContext.jsx expects:
// { token, name, email }
public record AuthResponse(String token, String name, String email) {
}
