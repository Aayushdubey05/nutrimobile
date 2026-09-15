package com.nutrivision.backend.auth.controller;

import com.nutrivision.backend.auth.dto.AuthResponse;
import com.nutrivision.backend.auth.dto.LoginRequest;
import com.nutrivision.backend.auth.dto.RefreshTokenRequest;
import com.nutrivision.backend.auth.dto.RegisterRequest;
import com.nutrivision.backend.auth.service.AuthService;
import com.nutrivision.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Registration successful",
                        authService.register(request)
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        authService.login(request)
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Token refreshed successfully",
                        authService.refresh(request)
                )
        );
    }
}