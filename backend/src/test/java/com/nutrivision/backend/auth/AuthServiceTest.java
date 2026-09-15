package com.nutrivision.backend.auth;

import com.nutrivision.backend.auth.dto.AuthResponse;
import com.nutrivision.backend.auth.dto.LoginRequest;
import com.nutrivision.backend.auth.dto.RefreshTokenRequest;
import com.nutrivision.backend.auth.dto.RegisterRequest;
import com.nutrivision.backend.auth.service.AuthService;
import com.nutrivision.backend.common.exception.EmailAlreadyExistsException;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserRole;
import com.nutrivision.backend.user.repository.RefreshTokenRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();

        user.setId(1L);
        user.setName("Ritesh Test");
        user.setEmail("ritesh.test@gmail.com");
        user.setPasswordHash("hashed-password");
        user.setRole(UserRole.USER);
        user.setDeleted(false);
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
    }

    @Test
    void register_shouldCreateUserSuccessfully() {

        RegisterRequest request = new RegisterRequest(
                "Ritesh Test",
                "ritesh.test@gmail.com",
                "Password@123"
        );

        when(userRepository.existsByEmailIgnoreCase(
                "ritesh.test@gmail.com"
        )).thenReturn(false);

        when(passwordEncoder.encode("Password@123"))
                .thenReturn("hashed-password");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        when(jwtService.generateAccessToken(any(User.class)))
                .thenReturn("access-token");

        when(jwtService.getAccessTokenExpiration())
                .thenReturn(900000L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access-token", response.accessToken());
        assertNotNull(response.refreshToken());
        assertEquals(900000L, response.expiresIn());

        assertEquals(1L, response.user().id());
        assertEquals("Ritesh Test", response.user().name());
        assertEquals("ritesh.test@gmail.com", response.user().email());
        assertEquals("USER", response.user().role());

        verify(userRepository).save(any(User.class));
        verify(refreshTokenRepository).save(any());

    }

    @Test
    void register_shouldRejectDuplicateEmail() {

        RegisterRequest request = new RegisterRequest(
                "Ritesh Test",
                "ritesh.test@gmail.com",
                "Password@123"
        );

        when(userRepository.existsByEmailIgnoreCase(
                "ritesh.test@gmail.com"
        )).thenReturn(true);

        assertThrows(
                EmailAlreadyExistsException.class,
                () -> authService.register(request)
        );

        verify(userRepository, never()).save(any(User.class));
        verify(refreshTokenRepository, never()).save(any());

    }
}