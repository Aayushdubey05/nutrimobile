package com.nutrivision.backend.analysis.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record FoodAnalysisItemResponse(
        Long id,
        Long foodId,
        String detectedName,
        BigDecimal confidence,
        BigDecimal estimatedWeightG,
        BigDecimal finalWeightG,
        Long finalFoodId,
        String finalFoodName,
        List<AiModelResultResponse> aiModelResults,
        ExplainabilityResultResponse explainability
) {
}