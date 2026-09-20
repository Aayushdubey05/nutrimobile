package com.nutrivision.backend.progress.dto.response;

import com.nutrivision.backend.progress.ProgressPeriod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ProgressResponse(
        ProgressPeriod period,

        LocalDate startDate,
        LocalDate endDate,

        BigDecimal calorieAverage,

        int goalAdherenceDays,
        int totalDays,
        BigDecimal adherencePercentage,

        BigDecimal currentWeightKg,
        BigDecimal weightChangeKg,

        List<ProgressDailyData> dailyData,

        ProgressMacroAverages macroAverages
) {
}