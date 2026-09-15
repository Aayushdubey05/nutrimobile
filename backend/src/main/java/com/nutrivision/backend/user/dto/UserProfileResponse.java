package com.nutrivision.backend.user.dto;

import com.nutrivision.backend.user.entity.ActivityLevelType;
import com.nutrivision.backend.user.entity.FitnessGoalType;
import com.nutrivision.backend.user.entity.GenderType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record UserProfileResponse(
        Long id,
        Short age,
        GenderType gender,
        BigDecimal heightCm,
        BigDecimal currentWeightKg,
        BigDecimal targetWeightKg,
        FitnessGoalType fitnessGoal,
        ActivityLevelType activityLevel,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}