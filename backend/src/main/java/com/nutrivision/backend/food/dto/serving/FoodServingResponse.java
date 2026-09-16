package com.nutrivision.backend.food.dto.serving;

import java.math.BigDecimal;

public record FoodServingResponse(
        Long id,
        String servingName,
        BigDecimal weightG
) {
}