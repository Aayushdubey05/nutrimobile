package com.nutrivision.backend.analysis.dto.response;

import java.math.BigDecimal;

public record AiModelResultResponse(
        Long id,
        String modelName,
        String modelVersion,
        BigDecimal confidence,
        Integer processingTimeMs
) {
}