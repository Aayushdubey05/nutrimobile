package com.nutrivision.backend.recommendation.service;

import com.nutrivision.backend.nutrition.dto.response.DailyNutritionResponse;
import com.nutrivision.backend.nutrition.entity.NutritionTarget;
import com.nutrivision.backend.nutrition.repository.NutritionTargetRepository;
import com.nutrivision.backend.nutrition.service.NutritionService;
import com.nutrivision.backend.recommendation.dto.request.RecommendationFeedbackRequest;
import com.nutrivision.backend.recommendation.dto.response.RecommendationFeedbackResponse;
import com.nutrivision.backend.recommendation.dto.response.RecommendationResponse;
import com.nutrivision.backend.recommendation.entity.Recommendation;
import com.nutrivision.backend.recommendation.entity.RecommendationCategory;
import com.nutrivision.backend.recommendation.entity.RecommendationFeedback;
import com.nutrivision.backend.recommendation.entity.RecommendationFeedbackType;
import com.nutrivision.backend.recommendation.entity.RecommendationStatus;
import com.nutrivision.backend.recommendation.repository.RecommendationFeedbackRepository;
import com.nutrivision.backend.recommendation.repository.RecommendationRepository;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.entity.UserProfile;
import com.nutrivision.backend.user.repository.UserProfileRepository;
import com.nutrivision.backend.user.repository.UserRepository;
import com.nutrivision.backend.user.entity.FitnessGoalType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
//    private final NutritionTargetRepository nutritionTargetRepository;
    private final NutritionService nutritionService;
    private final RecommendationRepository recommendationRepository;
    private final RecommendationFeedbackRepository recommendationFeedbackRepository;

    @Transactional
    public List<RecommendationResponse> generateRecommendations(Long userId) {

        User user = findUser(userId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("User profile not found"));

//        NutritionTarget target = nutritionTargetRepository
//                .findFirstByUserIdOrderByEffectiveFromDesc(userId)
//                .orElseThrow(() -> new IllegalArgumentException("Nutrition target not found"));

        LocalDate today = LocalDate.now();

        DailyNutritionResponse dailyNutrition =
                nutritionService.getDailyNutrition(userId, today);

        // Expire previous active recommendations.
        List<Recommendation> activeRecommendations =
                recommendationRepository.findByUserIdAndStatusOrderByGeneratedAtDesc(
                        userId,
                        RecommendationStatus.ACTIVE
                );

        OffsetDateTime now = OffsetDateTime.now();

        for (Recommendation recommendation : activeRecommendations) {
            recommendation.setStatus(RecommendationStatus.EXPIRED);
        }

        recommendationRepository.saveAll(activeRecommendations);

        List<Recommendation> recommendations = new ArrayList<>();

        DailyNutritionResponse.NutritionValues consumed =
                dailyNutrition.consumed();

        DailyNutritionResponse.NutritionValues targetValues =
                dailyNutrition.target();

        // ---------------------------------------------------------
        // Rule 1: Protein
        // ---------------------------------------------------------

        if (isBelowPercentage(
                consumed.proteinG(),
                targetValues.proteinG(),
                0.70
        )) {

            recommendations.add(
                    createRecommendation(
                            user,
                            "Increase your protein intake",
                            "Add a protein-rich food to your next meal.",
                            "Your protein intake is currently below 70% of your daily target.",
                            RecommendationCategory.PROTEIN,
                            now
                    )
            );
        }

        // ---------------------------------------------------------
        // Rule 2: Calories
        // ---------------------------------------------------------

        if (isAbovePercentage(
                consumed.caloriesKcal(),
                targetValues.caloriesKcal(),
                0.90
        )) {

            String title;
            String description;
            String reason;

            if (consumed.caloriesKcal()
                    .compareTo(targetValues.caloriesKcal()) > 0) {

                title = "You have exceeded your calorie target";

                description =
                        "Consider choosing lighter foods for the rest of the day.";

                reason =
                        "Your calorie intake is above your daily calorie target.";

            } else {

                title = "You are close to your calorie target";

                description =
                        "Choose nutrient-dense foods that fit within your remaining calories.";

                reason =
                        "Your calorie intake has reached at least 90% of your daily target.";
            }

            recommendations.add(
                    createRecommendation(
                            user,
                            title,
                            description,
                            reason,
                            RecommendationCategory.CALORIES,
                            now
                    )
            );
        }

        // ---------------------------------------------------------
        // Rule 3: Fiber
        // ---------------------------------------------------------

        if (consumed.fiberG().compareTo(new BigDecimal("20")) < 0) {

            recommendations.add(
                    createRecommendation(
                            user,
                            "Add more fiber-rich foods",
                            "Include vegetables, fruits, legumes or whole grains in your meals.",
                            "Your current fiber intake is below 20 g today.",
                            RecommendationCategory.GENERAL_HEALTH,
                            now
                    )
            );
        }

        // ---------------------------------------------------------
        // Rule 4: Goal-based fallback
        // ---------------------------------------------------------

        if (recommendations.isEmpty()) {

            recommendations.add(
                    createGoalBasedRecommendation(
                            user,
                            profile.getFitnessGoal(),
                            now
                    )
            );
        }

        // Keep the first 3 recommendations maximum.
        if (recommendations.size() > 3) {
            recommendations = recommendations.subList(0, 3);
        }

        List<Recommendation> saved =
                recommendationRepository.saveAll(recommendations);

        return saved.stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RecommendationResponse> getRecommendations(Long userId) {

        findUser(userId);

        return recommendationRepository
                .findByUserIdOrderByGeneratedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RecommendationResponse> getActiveRecommendations(Long userId) {

        findUser(userId);

        return recommendationRepository
                .findByUserIdAndStatusOrderByGeneratedAtDesc(
                        userId,
                        RecommendationStatus.ACTIVE
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RecommendationFeedbackResponse addFeedback(
            Long userId,
            Long recommendationId,
            RecommendationFeedbackRequest request) {

        User user = findUser(userId);

        Recommendation recommendation =
                recommendationRepository.findById(recommendationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Recommendation not found"
                                )
                        );

        if (!recommendation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Recommendation does not belong to this user"
            );
        }

        OffsetDateTime now = OffsetDateTime.now();

        RecommendationFeedback feedback =
                recommendationFeedbackRepository
                        .findByRecommendationIdAndUserId(
                                recommendationId,
                                userId
                        )
                        .orElseGet(() -> {

                            RecommendationFeedback newFeedback =
                                    new RecommendationFeedback();

                            newFeedback.setRecommendation(recommendation);
                            newFeedback.setUser(user);

                            return newFeedback;
                        });

        feedback.setFeedback(request.feedback());
        feedback.setCreatedAt(now);

        RecommendationFeedback saved =
                recommendationFeedbackRepository.save(feedback);

        return toFeedbackResponse(saved);
    }

    private Recommendation createRecommendation(
            User user,
            String title,
            String description,
            String reason,
            RecommendationCategory category,
            OffsetDateTime generatedAt) {

        Recommendation recommendation = new Recommendation();

        recommendation.setUser(user);
        recommendation.setTitle(title);
        recommendation.setDescription(description);
        recommendation.setReason(reason);
        recommendation.setCategory(category);
        recommendation.setStatus(RecommendationStatus.ACTIVE);
        recommendation.setGeneratedAt(generatedAt);
        recommendation.setExpiresAt(generatedAt.plusDays(1));

        return recommendation;
    }

    private Recommendation createGoalBasedRecommendation(
            User user,
            FitnessGoalType goal,
            OffsetDateTime generatedAt) {

        return switch (goal) {

            case MUSCLE_GAIN, BODY_RECOMPOSITION -> createRecommendation(
                    user,
                    "Focus on protein-rich foods",
                    "Include a good source of protein in each main meal.",
                    "Your fitness goal benefits from adequate daily protein intake.",
                    RecommendationCategory.PROTEIN,
                    generatedAt
            );

            case WEIGHT_LOSS -> createRecommendation(
                    user,
                    "Choose nutrient-dense foods",
                    "Prefer vegetables, fruits, legumes and balanced meals while staying within your calorie target.",
                    "Your goal is weight loss, so managing calorie intake is important.",
                    RecommendationCategory.CALORIES,
                    generatedAt
            );

            case HEALTHY_WEIGHT_GAIN -> createRecommendation(
                    user,
                    "Add nutritious calorie-dense foods",
                    "Include foods such as dairy, nuts, legumes and whole grains in your meals.",
                    "Your goal requires increasing calorie intake with nutritious foods.",
                    RecommendationCategory.CALORIES,
                    generatedAt
            );

            case ATHLETIC_PERFORMANCE -> createRecommendation(
                    user,
                    "Stay hydrated and fuel your workouts",
                    "Maintain regular meals and adequate fluid intake around physical activity.",
                    "Your fitness goal requires consistent nutrition and hydration.",
                    RecommendationCategory.FITNESS,
                    generatedAt
            );

            case MAINTAIN_WEIGHT -> createRecommendation(
                    user,
                    "Maintain a balanced diet",
                    "Continue choosing a balanced combination of protein, carbohydrates, healthy fats and vegetables.",
                    "Your goal is to maintain your current weight.",
                    RecommendationCategory.GENERAL_HEALTH,
                    generatedAt
            );

            case GENERAL_HEALTH -> createRecommendation(
                    user,
                    "Keep your meals balanced",
                    "Try to include protein, vegetables, whole grains and healthy fats across your meals.",
                    "A balanced diet supports general health.",
                    RecommendationCategory.GENERAL_HEALTH,
                    generatedAt
            );
        };
    }

    private boolean isBelowPercentage(
            BigDecimal consumed,
            BigDecimal target,
            double percentage) {

        if (target == null || target.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        BigDecimal threshold = target.multiply(
                BigDecimal.valueOf(percentage)
        );

        return consumed.compareTo(threshold) < 0;
    }

    private boolean isAbovePercentage(
            BigDecimal consumed,
            BigDecimal target,
            double percentage) {

        if (target == null || target.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        BigDecimal threshold = target.multiply(
                BigDecimal.valueOf(percentage)
        );

        return consumed.compareTo(threshold) >= 0;
    }

    private RecommendationResponse toResponse(
            Recommendation recommendation) {

        RecommendationFeedbackType feedback =
                recommendationFeedbackRepository
                        .findByRecommendationIdAndUserId(
                                recommendation.getId(),
                                recommendation.getUser().getId()
                        )
                        .map(RecommendationFeedback::getFeedback)
                        .orElse(null);

        return new RecommendationResponse(
                recommendation.getId(),
                recommendation.getTitle(),
                recommendation.getDescription(),
                recommendation.getReason(),
                recommendation.getCategory(),
                recommendation.getStatus(),
                recommendation.getGeneratedAt(),
                recommendation.getExpiresAt(),
                feedback
        );
    }

    private RecommendationFeedbackResponse toFeedbackResponse(
            RecommendationFeedback feedback) {

        return new RecommendationFeedbackResponse(
                feedback.getId(),
                feedback.getRecommendation().getId(),
                feedback.getFeedback(),
                feedback.getCreatedAt()
        );
    }

    private User findUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }
}