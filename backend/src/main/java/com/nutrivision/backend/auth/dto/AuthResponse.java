package com.nutrivision.backend.auth.dto;

public record AuthResponse(String accessToken, String refreshToken, long expiresIn, UserInfo user) {

    public record UserInfo(Long id, String name, String email, String role) {
    }
}