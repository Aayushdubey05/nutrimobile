package com.nutrivision.backend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrivision.backend.auth.controller.AuthController;
import com.nutrivision.backend.auth.dto.AuthResponse;
import com.nutrivision.backend.auth.dto.LoginRequest;
import com.nutrivision.backend.auth.dto.RefreshTokenRequest;
import com.nutrivision.backend.auth.dto.RegisterRequest;
import com.nutrivision.backend.auth.service.AuthService;
import com.nutrivision.backend.common.exception.EmailAlreadyExistsException;
import com.nutrivision.backend.common.exception.GlobalExceptionHandler;
import com.nutrivision.backend.common.exception.InvalidRefreshTokenException;
import com.nutrivision.backend.security.CustomUserDetailsService;
import com.nutrivision.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({AuthControllerTest.TestSecurityConfig.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;


    private AuthResponse createAuthResponse() {

        return new AuthResponse(
                "access-token",
                "refresh-token",
                900000L,
                new AuthResponse.UserInfo(
                        1L,
                        "Ritesh Test",
                        "ritesh.test@gmail.com",
                        "USER"
                )
        );
    }

    @Test
    void register_shouldReturn201() throws Exception {

        RegisterRequest request = new RegisterRequest(
                "Ritesh Test",
                "ritesh.test@gmail.com",
                "Password@123"
        );

        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(createAuthResponse());

        mockMvc.perform(
                        post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message")
                        .value("Registration successful"))
                .andExpect(jsonPath("$.data.accessToken")
                        .value("access-token"))
                .andExpect(jsonPath("$.data.user.email")
                        .value("ritesh.test@gmail.com"));
    }

    @Test
    void register_shouldReturn409ForDuplicateEmail()
            throws Exception {

        RegisterRequest request = new RegisterRequest(
                "Ritesh Test",
                "ritesh.test@gmail.com",
                "Password@123"
        );

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(
                        new EmailAlreadyExistsException(
                                "Email is already registered"
                        )
                );

        mockMvc.perform(
                        post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Email is already registered"));
    }

    @Test
    void register_shouldReturn400ForInvalidRequest()
            throws Exception {

        RegisterRequest request = new RegisterRequest(
                "",
                "invalid-email",
                "123"
        );

        mockMvc.perform(
                        post("/api/v1/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void login_shouldReturn200() throws Exception {

        LoginRequest request = new LoginRequest(
                "ritesh.test@gmail.com",
                "Password@123"
        );

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(createAuthResponse());

        mockMvc.perform(
                        post("/api/v1/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message")
                        .value("Login successful"))
                .andExpect(jsonPath("$.data.accessToken")
                        .value("access-token"));
    }

    @Test
    void refresh_shouldReturn200() throws Exception {

        RefreshTokenRequest request =
                new RefreshTokenRequest("refresh-token");

        when(authService.refresh(
                any(RefreshTokenRequest.class)
        )).thenReturn(createAuthResponse());

        mockMvc.perform(
                        post("/api/v1/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message")
                        .value("Token refreshed successfully"))
                .andExpect(jsonPath("$.data.refreshToken")
                        .value("refresh-token"));
    }

    @Test
    void refresh_shouldReturn401ForInvalidToken()
            throws Exception {

        RefreshTokenRequest request =
                new RefreshTokenRequest("invalid-token");

        when(authService.refresh(
                any(RefreshTokenRequest.class)
        )).thenThrow(
                new InvalidRefreshTokenException(
                        "Invalid refresh token"
                )
        );

        mockMvc.perform(
                        post("/api/v1/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message")
                        .value("Invalid refresh token"));
    }
}