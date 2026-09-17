package com.nutrivision.backend.recommendation.dto.response;

import com.nutrivision.backend.recommendation.entity.RecommendationFeedbackType;

import java.time.OffsetDateTime;

public record RecommendationFeedbackResponse(
        Long id,
        Long recommendationId,
        RecommendationFeedbackType feedback,
        OffsetDateTime createdAt
) {}