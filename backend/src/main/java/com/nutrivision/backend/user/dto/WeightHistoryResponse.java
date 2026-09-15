package com.nutrivision.backend.user.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record WeightHistoryResponse(
        Long id,
        BigDecimal weightKg,
        OffsetDateTime recordedAt
) {
}