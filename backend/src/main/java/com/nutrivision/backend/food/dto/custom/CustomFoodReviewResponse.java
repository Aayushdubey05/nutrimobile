package com.nutrivision.backend.food.dto.custom;

import com.nutrivision.backend.food.entity.CustomFoodStatus;

import java.time.OffsetDateTime;

public record CustomFoodReviewResponse(
        Long id,
        Long customFoodId,
        Long adminId,
        CustomFoodStatus status,
        String comment,
        OffsetDateTime reviewedAt
) {
}