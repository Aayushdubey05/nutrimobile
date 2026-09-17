package com.nutrivision.backend.nutrition.service;

import com.nutrivision.backend.nutrition.dto.request.CustomizeNutritionTargetRequest;
import com.nutrivision.backend.nutrition.dto.response.DailyNutritionResponse;
import com.nutrivision.backend.nutrition.dto.response.NutritionTargetResponse;
import com.nutrivision.backend.nutrition.entity.NutritionTarget;
import com.nutrivision.backend.nutrition.repository.NutritionTargetRepository;
import com.nutrivision.backend.user.entity.ActivityLevelType;
import com.nutrivision.backend.user.entity.FitnessGoalType;
import com.nutrivision.backend.user.entity.GenderType;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserProfile;
import com.nutrivision.backend.user.repository.UserProfileRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.meal.entity.Meal;
import com.nutrivision.backend.meal.entity.MealItem;
import com.nutrivision.backend.meal.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NutritionService {

    private final NutritionTargetRepository nutritionTargetRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final MealRepository mealRepository;

    public NutritionTargetResponse getCurrentTarget(Long userId) {

        NutritionTarget target =
                nutritionTargetRepository
                        .findFirstByUserIdOrderByEffectiveFromDesc(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Nutrition target not found"
                                )
                        );

        return toTargetResponse(target);
    }

    @Transactional
    public NutritionTargetResponse calculateAndCreateTarget(Long userId) {

        User user = findUser(userId);

        UserProfile profile =
                userProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User profile not found"
                                )
                        );

        NutritionCalculation calculation =
                calculateNutritionTarget(profile);

        OffsetDateTime now = OffsetDateTime.now();

        NutritionTarget target = new NutritionTarget();

        target.setUser(user);
        target.setCalorieTargetKcal(calculation.calories());
        target.setProteinTargetG(calculation.protein());
        target.setCarbohydrateTargetG(calculation.carbohydrates());
        target.setFatTargetG(calculation.fat());
        target.setCalculationMethod("MIFFLIN_ST_JEOR_ACTIVITY_GOAL");
        target.setCustomized(false);
        target.setEffectiveFrom(now);
        target.setCreatedAt(now);
        target.setUpdatedAt(now);

        NutritionTarget savedTarget =
                nutritionTargetRepository.save(target);

        return toTargetResponse(savedTarget);
    }

    @Transactional
    public NutritionTargetResponse customizeTarget(
            Long userId,
            CustomizeNutritionTargetRequest request
    ) {

        User user = findUser(userId);

        OffsetDateTime now = OffsetDateTime.now();

        NutritionTarget target = new NutritionTarget();

        target.setUser(user);
        target.setCalorieTargetKcal(
                scale(request.calorieTargetKcal())
        );
        target.setProteinTargetG(
                scale(request.proteinTargetG())
        );
        target.setCarbohydrateTargetG(
                scale(request.carbohydrateTargetG())
        );
        target.setFatTargetG(
                scale(request.fatTargetG())
        );
        target.setCalculationMethod("MANUAL");
        target.setCustomized(true);
        target.setEffectiveFrom(now);
        target.setCreatedAt(now);
        target.setUpdatedAt(now);

        NutritionTarget savedTarget =
                nutritionTargetRepository.save(target);

        return toTargetResponse(savedTarget);
    }

    public DailyNutritionResponse getDailyNutrition(
            Long userId,
            LocalDate date
    ) {

        findUser(userId);

        NutritionTarget target =
                nutritionTargetRepository
                        .findFirstByUserIdOrderByEffectiveFromDesc(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Nutrition target not found"
                                )
                        );

        List<Meal> meals =
                mealRepository.findByUserIdAndMealDateOrderByMealTimeDesc(
                        userId,
                        date
                );

        BigDecimal calories = BigDecimal.ZERO;
        BigDecimal protein = BigDecimal.ZERO;
        BigDecimal carbohydrates = BigDecimal.ZERO;
        BigDecimal fat = BigDecimal.ZERO;
        BigDecimal fiber = BigDecimal.ZERO;
        BigDecimal sugar = BigDecimal.ZERO;
        BigDecimal saturatedFat = BigDecimal.ZERO;
        BigDecimal sodium = BigDecimal.ZERO;
        BigDecimal cholesterol = BigDecimal.ZERO;

        for (Meal meal : meals) {

            for (MealItem item : meal.getItems()) {

                calories = calories.add(item.getCaloriesKcal());
                protein = protein.add(item.getProteinG());
                carbohydrates =
                        carbohydrates.add(item.getCarbohydratesG());
                fat = fat.add(item.getFatG());
                fiber = fiber.add(item.getFiberG());
                sugar = sugar.add(item.getSugarG());
                saturatedFat =
                        saturatedFat.add(item.getSaturatedFatG());
                sodium = sodium.add(item.getSodiumMg());
                cholesterol =
                        cholesterol.add(item.getCholesterolMg());
            }
        }

        DailyNutritionResponse.NutritionValues consumed =
                new DailyNutritionResponse.NutritionValues(
                        scale(calories),
                        scale(protein),
                        scale(carbohydrates),
                        scale(fat),
                        scale(fiber),
                        scale(sugar),
                        scale(saturatedFat),
                        scale(sodium),
                        scale(cholesterol)
                );

        DailyNutritionResponse.NutritionValues targetValues =
                new DailyNutritionResponse.NutritionValues(
                        scale(target.getCalorieTargetKcal()),
                        scale(target.getProteinTargetG()),
                        scale(target.getCarbohydrateTargetG()),
                        scale(target.getFatTargetG()),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2)
                );

        DailyNutritionResponse.NutritionValues remaining =
                new DailyNutritionResponse.NutritionValues(
                        remaining(
                                target.getCalorieTargetKcal(),
                                calories
                        ),
                        remaining(
                                target.getProteinTargetG(),
                                protein
                        ),
                        remaining(
                                target.getCarbohydrateTargetG(),
                                carbohydrates
                        ),
                        remaining(
                                target.getFatTargetG(),
                                fat
                        ),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2),
                        BigDecimal.ZERO.setScale(2)
                );

        return new DailyNutritionResponse(
                date,
                targetValues,
                consumed,
                remaining
        );
    }

    private NutritionCalculation calculateNutritionTarget(
            UserProfile profile
    ) {

        BigDecimal weight = profile.getCurrentWeightKg();
        BigDecimal height = profile.getHeightCm();

        int age = profile.getAge();

        BigDecimal bmr;

        if (profile.getGender() == GenderType.MALE) {

            bmr = BigDecimal.valueOf(10)
                    .multiply(weight)
                    .add(
                            BigDecimal.valueOf(6.25)
                                    .multiply(height)
                    )
                    .subtract(
                            BigDecimal.valueOf(5L * age)
                    )
                    .add(BigDecimal.valueOf(5));

        } else if (profile.getGender() == GenderType.FEMALE) {

            bmr = BigDecimal.valueOf(10)
                    .multiply(weight)
                    .add(
                            BigDecimal.valueOf(6.25)
                                    .multiply(height)
                    )
                    .subtract(
                            BigDecimal.valueOf(5L * age)
                    )
                    .subtract(BigDecimal.valueOf(161));

        } else {

            /*
             * For OTHER / PREFER_NOT_TO_SAY,
             * use the average of male and female
             * Mifflin-St Jeor equations.
             */
            BigDecimal maleBmr = BigDecimal.valueOf(10)
                    .multiply(weight)
                    .add(
                            BigDecimal.valueOf(6.25)
                                    .multiply(height)
                    )
                    .subtract(
                            BigDecimal.valueOf(5L * age)
                    )
                    .add(BigDecimal.valueOf(5));

            BigDecimal femaleBmr = BigDecimal.valueOf(10)
                    .multiply(weight)
                    .add(
                            BigDecimal.valueOf(6.25)
                                    .multiply(height)
                    )
                    .subtract(
                            BigDecimal.valueOf(5L * age)
                    )
                    .subtract(BigDecimal.valueOf(161));

            bmr = maleBmr
                    .add(femaleBmr)
                    .divide(
                            BigDecimal.valueOf(2),
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        BigDecimal activityMultiplier =
                getActivityMultiplier(profile.getActivityLevel());

        BigDecimal tdee = bmr
                .multiply(activityMultiplier);

        BigDecimal calorieTarget =
                applyGoalAdjustment(
                        tdee,
                        profile.getFitnessGoal()
                );

        calorieTarget = calorieTarget
                .max(BigDecimal.valueOf(1200))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal protein =
                calculateProtein(
                        weight,
                        profile.getFitnessGoal()
                );

        BigDecimal fat =
                calorieTarget
                        .multiply(BigDecimal.valueOf(0.25))
                        .divide(
                                BigDecimal.valueOf(9),
                                2,
                                RoundingMode.HALF_UP
                        );

        BigDecimal proteinCalories =
                protein.multiply(BigDecimal.valueOf(4));

        BigDecimal fatCalories =
                fat.multiply(BigDecimal.valueOf(9));

        BigDecimal carbohydrates =
                calorieTarget
                        .subtract(proteinCalories)
                        .subtract(fatCalories)
                        .divide(
                                BigDecimal.valueOf(4),
                                2,
                                RoundingMode.HALF_UP
                        )
                        .max(BigDecimal.ZERO);

        return new NutritionCalculation(
                calorieTarget,
                protein.setScale(2, RoundingMode.HALF_UP),
                carbohydrates.setScale(2, RoundingMode.HALF_UP),
                fat.setScale(2, RoundingMode.HALF_UP)
        );
    }

    private BigDecimal getActivityMultiplier(
            ActivityLevelType activityLevel
    ) {

        return switch (activityLevel) {

            case SEDENTARY ->
                    BigDecimal.valueOf(1.20);

            case LIGHTLY_ACTIVE ->
                    BigDecimal.valueOf(1.375);

            case MODERATELY_ACTIVE ->
                    BigDecimal.valueOf(1.55);

            case VERY_ACTIVE ->
                    BigDecimal.valueOf(1.725);

            case EXTRA_ACTIVE ->
                    BigDecimal.valueOf(1.90);
        };
    }

    private BigDecimal applyGoalAdjustment(
            BigDecimal tdee,
            FitnessGoalType goal
    ) {

        return switch (goal) {

            case WEIGHT_LOSS ->
                    tdee.multiply(BigDecimal.valueOf(0.85));

            case MUSCLE_GAIN ->
                    tdee.multiply(BigDecimal.valueOf(1.10));

            case HEALTHY_WEIGHT_GAIN ->
                    tdee.multiply(BigDecimal.valueOf(1.10));

            case BODY_RECOMPOSITION ->
                    tdee.multiply(BigDecimal.valueOf(1.00));

            case MAINTAIN_WEIGHT ->
                    tdee;

            case GENERAL_HEALTH ->
                    tdee;

            case ATHLETIC_PERFORMANCE ->
                    tdee.multiply(BigDecimal.valueOf(1.10));
        };
    }

    private BigDecimal calculateProtein(
            BigDecimal weight,
            FitnessGoalType goal
    ) {

        BigDecimal proteinPerKg =
                switch (goal) {

                    case MUSCLE_GAIN,
                         BODY_RECOMPOSITION,
                         ATHLETIC_PERFORMANCE ->
                            BigDecimal.valueOf(1.6);

                    case WEIGHT_LOSS ->
                            BigDecimal.valueOf(1.6);

                    case HEALTHY_WEIGHT_GAIN ->
                            BigDecimal.valueOf(1.4);

                    default ->
                            BigDecimal.valueOf(1.2);
                };

        return weight.multiply(proteinPerKg);
    }

    private BigDecimal remaining(
            BigDecimal target,
            BigDecimal consumed
    ) {

        return target
                .subtract(consumed)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private NutritionTargetResponse toTargetResponse(
            NutritionTarget target
    ) {

        return new NutritionTargetResponse(
                target.getId(),
                scale(target.getCalorieTargetKcal()),
                scale(target.getProteinTargetG()),
                scale(target.getCarbohydrateTargetG()),
                scale(target.getFatTargetG()),
                target.getCalculationMethod(),
                target.isCustomized(),
                target.getEffectiveFrom()
        );
    }

    private BigDecimal scale(BigDecimal value) {

        return value.setScale(
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

    private record NutritionCalculation(
            BigDecimal calories,
            BigDecimal protein,
            BigDecimal carbohydrates,
            BigDecimal fat
    ) {
    }
}