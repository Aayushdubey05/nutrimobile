package com.nutrivision.backend.user.dto;

import com.nutrivision.backend.user.entity.UserRole;
import java.time.OffsetDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        UserRole role,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}