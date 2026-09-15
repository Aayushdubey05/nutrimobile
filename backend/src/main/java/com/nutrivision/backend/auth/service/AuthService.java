package com.nutrivision.backend.auth.service;

import com.nutrivision.backend.auth.dto.AuthResponse;
import com.nutrivision.backend.auth.dto.LoginRequest;
import com.nutrivision.backend.auth.dto.RefreshTokenRequest;
import com.nutrivision.backend.auth.dto.RegisterRequest;
import com.nutrivision.backend.common.exception.EmailAlreadyExistsException;
import com.nutrivision.backend.common.exception.InvalidRefreshTokenException;
import com.nutrivision.backend.security.JwtService;
import com.nutrivision.backend.user.entity.RefreshToken;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserRole;
import com.nutrivision.backend.auth.repository.RefreshTokenRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final long REFRESH_TOKEN_EXPIRATION_DAYS = 30;

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        String email = request.email().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new EmailAlreadyExistsException(
                    "Email is already registered"
            );
        }

        User user = new User();

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );
        user.setRole(UserRole.USER);
        user.setDeleted(false);

        OffsetDateTime now = OffsetDateTime.now();

        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        user = userRepository.save(user);

        return createAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email().trim(),
                        request.password()
                )
        );

        String email = authentication.getName();

        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() ->
                new IllegalArgumentException(
                        "User not found"
                )
        );

        if (user.isDeleted()) {
            throw new IllegalArgumentException(
                    "User account is unavailable"
            );
        }

        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);

        return createAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {

        String rawRefreshToken = request.refreshToken();

        String tokenHash = hashToken(rawRefreshToken);

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() ->
                        new InvalidRefreshTokenException(
                                "Invalid refresh token"
                        )
                );

        if (refreshToken.getRevokedAt() != null) {
            throw new InvalidRefreshTokenException(
                    "Refresh token has been revoked"
            );
        }

        if (refreshToken.getExpiresAt().isBefore(OffsetDateTime.now())) {

            throw new InvalidRefreshTokenException(
                    "Refresh token has expired"
            );
        }

        User user = refreshToken.getUser();

        if (user.isDeleted()) {
            throw new IllegalArgumentException(
                    "User account is unavailable"
            );
        }

        // Rotate refresh token
        refreshToken.setRevokedAt(OffsetDateTime.now());

        refreshTokenRepository.save(refreshToken);

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {

        String accessToken = jwtService.generateAccessToken(user);

        String refreshToken = generateRefreshToken();

        saveRefreshToken(user, refreshToken);

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpiration(),
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                )
        );
    }

    private void saveRefreshToken(
            User user,
            String rawToken
    ) {

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setTokenHash(
                hashToken(rawToken)
        );

        OffsetDateTime now = OffsetDateTime.now();

        refreshToken.setCreatedAt(now);
        refreshToken.setExpiresAt(
                now.plusDays(REFRESH_TOKEN_EXPIRATION_DAYS)
        );
        refreshToken.setRevokedAt(null);

        refreshTokenRepository.save(refreshToken);
    }

    private String generateRefreshToken() {

        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    private String hashToken(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            token.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    e
            );
        }
    }
}