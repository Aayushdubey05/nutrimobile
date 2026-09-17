package com.nutrivision.backend.recommendation.dto.request;

import com.nutrivision.backend.recommendation.entity.RecommendationFeedbackType;
import jakarta.validation.constraints.NotNull;

public record RecommendationFeedbackRequest(

        @NotNull(message = "Feedback is required")
        RecommendationFeedbackType feedback

) {}