package com.nutrivision.backend.analysis.dto.response;

public record ExplainabilityResultResponse(
        Long id,
        String heatmapUrl,
        String caption
) {
}