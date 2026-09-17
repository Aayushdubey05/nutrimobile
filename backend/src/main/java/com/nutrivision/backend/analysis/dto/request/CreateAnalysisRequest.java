package com.nutrivision.backend.analysis.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateAnalysisRequest(

        @NotBlank(message = "Image URL is required")
        String imageUrl

) {
}