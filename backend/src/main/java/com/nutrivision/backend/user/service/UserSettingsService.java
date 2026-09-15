package com.nutrivision.backend.user.service;

import com.nutrivision.backend.user.dto.UpdateUserSettingsRequest;
import com.nutrivision.backend.user.dto.UserSettingsResponse;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserSettings;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    public UserSettingsResponse getSettings(Long userId) {

        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User settings not found")
                );

        return toResponse(settings);
    }

    @Transactional
    public UserSettingsResponse updateSettings(
            Long userId,
            UpdateUserSettingsRequest request
    ) {

        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() ->
                                    new IllegalArgumentException("User not found")
                            );

                    UserSettings newSettings = new UserSettings();
                    newSettings.setUser(user);
                    return newSettings;
                });

        settings.setNotificationsEnabled(
                request.notificationsEnabled()
        );

        return toResponse(userSettingsRepository.save(settings));
    }

    private UserSettingsResponse toResponse(UserSettings settings) {

        return new UserSettingsResponse(
                settings.getId(),
                settings.isNotificationsEnabled(),
                settings.getCreatedAt(),
                settings.getUpdatedAt()
        );
    }
}