package com.nutrivision.backend.recommendation.dto.response;

import com.nutrivision.backend.recommendation.entity.RecommendationCategory;
import com.nutrivision.backend.recommendation.entity.RecommendationFeedbackType;
import com.nutrivision.backend.recommendation.entity.RecommendationStatus;

import java.time.OffsetDateTime;

public record RecommendationResponse(
        Long id,
        String title,
        String description,
        String reason,
        RecommendationCategory category,
        RecommendationStatus status,
        OffsetDateTime generatedAt,
        OffsetDateTime expiresAt,
        RecommendationFeedbackType feedback
) {}