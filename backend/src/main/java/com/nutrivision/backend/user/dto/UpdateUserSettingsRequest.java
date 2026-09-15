package com.nutrivision.backend.user.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateUserSettingsRequest(

        @NotNull(message = "Notifications enabled value is required")
        Boolean notificationsEnabled

) {
}