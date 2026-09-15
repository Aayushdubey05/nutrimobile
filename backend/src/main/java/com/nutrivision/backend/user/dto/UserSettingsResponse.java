package com.nutrivision.backend.user.dto;

import java.time.OffsetDateTime;

public record UserSettingsResponse(
        Long id,
        boolean notificationsEnabled,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}