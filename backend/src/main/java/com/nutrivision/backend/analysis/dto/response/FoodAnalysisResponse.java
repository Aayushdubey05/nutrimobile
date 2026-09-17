package com.nutrivision.backend.analysis.dto.response;

import com.nutrivision.backend.analysis.entity.AnalysisStatus;

import java.time.OffsetDateTime;
import java.util.List;

public record FoodAnalysisResponse(
        Long id,
        String imageUrl,
        AnalysisStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime completedAt,
        List<FoodAnalysisItemResponse> items
) {
}