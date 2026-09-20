package com.nutrivision.backend.progress.service;

import com.nutrivision.backend.meal.entity.Meal;
import com.nutrivision.backend.meal.entity.MealItem;
import com.nutrivision.backend.meal.repository.MealRepository;
import com.nutrivision.backend.nutrition.entity.NutritionTarget;
import com.nutrivision.backend.nutrition.repository.NutritionTargetRepository;
import com.nutrivision.backend.progress.ProgressPeriod;
import com.nutrivision.backend.progress.dto.response.ProgressDailyData;
import com.nutrivision.backend.progress.dto.response.ProgressMacroAverages;
import com.nutrivision.backend.progress.dto.response.ProgressResponse;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserProfile;
import com.nutrivision.backend.user.entity.WeightHistory;
import com.nutrivision.backend.user.repository.UserProfileRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.user.repository.WeightHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final MealRepository mealRepository;
    private final NutritionTargetRepository nutritionTargetRepository;
    private final WeightHistoryRepository weightHistoryRepository;

    public ProgressResponse getProgress(
            Long userId,
            ProgressPeriod period
    ) {

        User user = findUser(userId);

        UserProfile profile =
                userProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User profile not found"
                                )
                        );

        DateRange dateRange = calculateDateRange(period);

        List<NutritionTarget> targets =
                nutritionTargetRepository
                        .findByUserIdOrderByEffectiveFromDesc(userId);

        if (targets.isEmpty()) {
            throw new IllegalArgumentException(
                    "Nutrition target not found"
            );
        }

        List<Meal> meals =
                mealRepository.findByUserIdAndMealDateBetweenWithItems(
                        userId,
                        dateRange.startDate(),
                        dateRange.endDate()
                );

        Map<LocalDate, DailyStats> dailyStats =
                initializeDailyStats(
                        dateRange.startDate(),
                        dateRange.endDate(),
                        targets
                );

        calculateMealNutrition(meals, dailyStats);

        List<ProgressDailyData> dailyData =
                dailyStats.values()
                        .stream()
                        .map(this::toDailyData)
                        .toList();

        BigDecimal calorieAverage =
                calculateAverage(
                        dailyStats.values()
                                .stream()
                                .map(DailyStats::calories)
                                .toList()
                );

        int goalAdherenceDays =
                calculateGoalAdherenceDays(dailyStats);

        int totalDays = dailyStats.size();

        BigDecimal adherencePercentage =
                totalDays == 0
                        ? BigDecimal.ZERO.setScale(2)
                        : BigDecimal.valueOf(goalAdherenceDays)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(
                                BigDecimal.valueOf(totalDays),
                                2,
                                RoundingMode.HALF_UP
                        );

        ProgressMacroAverages macroAverages =
                calculateMacroAverages(dailyStats);

        BigDecimal weightChange =
                calculateWeightChange(
                        userId,
                        dateRange.startDate(),
                        dateRange.endDate()
                );

        return new ProgressResponse(
                period,
                dateRange.startDate(),
                dateRange.endDate(),
                scale(calorieAverage),
                goalAdherenceDays,
                totalDays,
                scale(adherencePercentage),
                scale(profile.getCurrentWeightKg()),
                weightChange,
                dailyData,
                macroAverages
        );
    }

    private DateRange calculateDateRange(
            ProgressPeriod period
    ) {

        LocalDate today = LocalDate.now();

        return switch (period) {

            case WEEK -> {

                LocalDate start =
                        today.with(DayOfWeek.MONDAY);

                yield new DateRange(
                        start,
                        today
                );
            }

            case MONTH -> {

                LocalDate start =
                        today.withDayOfMonth(1);

                yield new DateRange(
                        start,
                        today
                );
            }
        };
    }

    private Map<LocalDate, DailyStats> initializeDailyStats(
            LocalDate startDate,
            LocalDate endDate,
            List<NutritionTarget> targets
    ) {

        Map<LocalDate, DailyStats> result =
                new LinkedHashMap<>();

        LocalDate date = startDate;

        while (!date.isAfter(endDate)) {

            NutritionTarget target =
                    findTargetForDate(
                            date,
                            targets
                    );

            DailyStats stats =
                    new DailyStats(
                            date,
                            target == null
                                    ? BigDecimal.ZERO
                                    : target.getCalorieTargetKcal(),
                            target == null
                                    ? BigDecimal.ZERO
                                    : target.getProteinTargetG(),
                            target == null
                                    ? BigDecimal.ZERO
                                    : target.getCarbohydrateTargetG(),
                            target == null
                                    ? BigDecimal.ZERO
                                    : target.getFatTargetG()
                    );

            result.put(date, stats);

            date = date.plusDays(1);
        }

        return result;
    }

    private NutritionTarget findTargetForDate(
            LocalDate date,
            List<NutritionTarget> targets
    ) {

        return targets.stream()
                .filter(target ->
                        !target.getEffectiveFrom()
                                .toLocalDate()
                                .isAfter(date)
                )
                .findFirst()
                .orElse(null);
    }

    private void calculateMealNutrition(
            List<Meal> meals,
            Map<LocalDate, DailyStats> dailyStats
    ) {

        for (Meal meal : meals) {

            DailyStats stats =
                    dailyStats.get(meal.getMealDate());

            if (stats == null) {
                continue;
            }

            for (MealItem item : meal.getItems()) {

                stats.addCalories(
                        item.getCaloriesKcal()
                );

                stats.addProtein(
                        item.getProteinG()
                );

                stats.addCarbohydrates(
                        item.getCarbohydratesG()
                );

                stats.addFat(
                        item.getFatG()
                );
            }
        }
    }

    private List<ProgressDailyData> toDailyDataList(
            Map<LocalDate, DailyStats> dailyStats
    ) {

        return dailyStats.values()
                .stream()
                .map(this::toDailyData)
                .toList();
    }

    private ProgressDailyData toDailyData(
            DailyStats stats
    ) {

        return new ProgressDailyData(
                stats.date(),
                scale(stats.calories()),
                scale(stats.targetCalories()),

                scale(stats.protein()),
                scale(stats.targetProtein()),

                scale(stats.carbohydrates()),
                scale(stats.targetCarbohydrates()),

                scale(stats.fat()),
                scale(stats.targetFat())
        );
    }

    private int calculateGoalAdherenceDays(
            Map<LocalDate, DailyStats> dailyStats
    ) {

        int count = 0;

        for (DailyStats stats : dailyStats.values()) {

            BigDecimal target =
                    stats.targetCalories();

            if (target.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal minimum =
                    target.multiply(
                            BigDecimal.valueOf(0.90)
                    );

            boolean withinTarget =
                    stats.calories()
                            .compareTo(minimum) >= 0
                            &&
                            stats.calories()
                                    .compareTo(target) <= 0;

            if (withinTarget) {
                count++;
            }
        }

        return count;
    }

    private BigDecimal calculateAverage(
            List<BigDecimal> values
    ) {

        if (values.isEmpty()) {
            return BigDecimal.ZERO.setScale(2);
        }

        BigDecimal total =
                values.stream()
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        return total.divide(
                BigDecimal.valueOf(values.size()),
                2,
                RoundingMode.HALF_UP
        );
    }

    private ProgressMacroAverages calculateMacroAverages(
            Map<LocalDate, DailyStats> dailyStats
    ) {

        List<DailyStats> values =
                new ArrayList<>(dailyStats.values());

        return new ProgressMacroAverages(
                calculateAverage(
                        values.stream()
                                .map(DailyStats::protein)
                                .toList()
                ),

                calculateAverage(
                        values.stream()
                                .map(DailyStats::targetProtein)
                                .toList()
                ),

                calculateAverage(
                        values.stream()
                                .map(DailyStats::carbohydrates)
                                .toList()
                ),

                calculateAverage(
                        values.stream()
                                .map(DailyStats::targetCarbohydrates)
                                .toList()
                ),

                calculateAverage(
                        values.stream()
                                .map(DailyStats::fat)
                                .toList()
                ),

                calculateAverage(
                        values.stream()
                                .map(DailyStats::targetFat)
                                .toList()
                )
        );
    }

    private BigDecimal calculateWeightChange(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        List<WeightHistory> histories =
                weightHistoryRepository
                        .findByUserIdOrderByRecordedAtDesc(userId);

        if (histories.isEmpty()) {
            return null;
        }

        List<WeightHistory> periodHistory =
                histories.stream()
                        .filter(history -> {

                            LocalDate date =
                                    history.getRecordedAt()
                                            .toLocalDate();

                            return !date.isBefore(startDate)
                                    && !date.isAfter(endDate);
                        })
                        .sorted(
                                Comparator.comparing(
                                        WeightHistory::getRecordedAt
                                )
                        )
                        .toList();

        if (periodHistory.isEmpty()) {
            return null;
        }

        WeightHistory latest =
                periodHistory.get(periodHistory.size() - 1);

        WeightHistory baseline =
                histories.stream()
                        .filter(history ->
                                history.getRecordedAt()
                                        .toLocalDate()
                                        .isBefore(startDate)
                        )
                        .findFirst()
                        .orElse(null);

        if (baseline != null) {

            return scale(
                    latest.getWeightKg()
                            .subtract(baseline.getWeightKg())
            );
        }

        if (periodHistory.size() < 2) {
            return null;
        }

        WeightHistory first =
                periodHistory.get(0);

        return scale(
                latest.getWeightKg()
                        .subtract(first.getWeightKg())
        );
    }

    private BigDecimal scale(BigDecimal value) {

        return value == null
                ? null
                : value.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    private User findUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    private record DateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {
    }

    private static class DailyStats {

        private final LocalDate date;

        private final BigDecimal targetCalories;
        private final BigDecimal targetProtein;
        private final BigDecimal targetCarbohydrates;
        private final BigDecimal targetFat;

        private BigDecimal calories = BigDecimal.ZERO;
        private BigDecimal protein = BigDecimal.ZERO;
        private BigDecimal carbohydrates = BigDecimal.ZERO;
        private BigDecimal fat = BigDecimal.ZERO;

        private DailyStats(
                LocalDate date,
                BigDecimal targetCalories,
                BigDecimal targetProtein,
                BigDecimal targetCarbohydrates,
                BigDecimal targetFat
        ) {

            this.date = date;
            this.targetCalories = targetCalories;
            this.targetProtein = targetProtein;
            this.targetCarbohydrates = targetCarbohydrates;
            this.targetFat = targetFat;
        }

        public void addCalories(BigDecimal value) {
            calories = calories.add(value);
        }

        public void addProtein(BigDecimal value) {
            protein = protein.add(value);
        }

        public void addCarbohydrates(BigDecimal value) {
            carbohydrates =
                    carbohydrates.add(value);
        }

        public void addFat(BigDecimal value) {
            fat = fat.add(value);
        }

        public LocalDate date() {
            return date;
        }

        public BigDecimal calories() {
            return calories;
        }

        public BigDecimal targetCalories() {
            return targetCalories;
        }

        public BigDecimal protein() {
            return protein;
        }

        public BigDecimal targetProtein() {
            return targetProtein;
        }

        public BigDecimal carbohydrates() {
            return carbohydrates;
        }

        public BigDecimal targetCarbohydrates() {
            return targetCarbohydrates;
        }

        public BigDecimal fat() {
            return fat;
        }

        public BigDecimal targetFat() {
            return targetFat;
        }
    }
}