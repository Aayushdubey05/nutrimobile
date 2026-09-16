package com.nutrivision.backend.food.service;

import com.nutrivision.backend.food.dto.custom.CreateCustomFoodRequest;
import com.nutrivision.backend.food.dto.custom.CustomFoodResponse;
import com.nutrivision.backend.food.dto.custom.CustomFoodReviewResponse;
import com.nutrivision.backend.food.dto.custom.ReviewCustomFoodRequest;
import com.nutrivision.backend.food.dto.custom.UpdateCustomFoodRequest;
import com.nutrivision.backend.food.entity.CustomFood;
import com.nutrivision.backend.food.entity.CustomFoodReview;
import com.nutrivision.backend.food.entity.CustomFoodStatus;
import com.nutrivision.backend.food.repository.CustomFoodRepository;
import com.nutrivision.backend.food.repository.CustomFoodReviewRepository;
import com.nutrivision.backend.user.entity.User;
import com.nutrivision.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomFoodService {

    private final CustomFoodRepository customFoodRepository;
    private final CustomFoodReviewRepository customFoodReviewRepository;
    private final UserRepository userRepository;

    // =========================
    // USER
    // =========================

    @Transactional
    public CustomFoodResponse createCustomFood(
            Long userId,
            CreateCustomFoodRequest request
    ) {
        User user = findUser(userId);

        CustomFood customFood = new CustomFood();

        customFood.setUser(user);
        customFood.setName(request.name());
        customFood.setImageUrl(request.imageUrl());

        setNutritionValues(customFood, request);

        customFood.setStatus(CustomFoodStatus.PENDING);

        OffsetDateTime now = OffsetDateTime.now();
        customFood.setCreatedAt(now);
        customFood.setUpdatedAt(now);

        return toResponse(customFoodRepository.save(customFood));
    }

    public List<CustomFoodResponse> getMyCustomFoods(Long userId) {
        return customFoodRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CustomFoodResponse getMyCustomFood(
            Long userId,
            Long customFoodId
    ) {
        CustomFood customFood = findMyCustomFood(userId, customFoodId);

        return toResponse(customFood);
    }

    @Transactional
    public CustomFoodResponse updateCustomFood(
            Long userId,
            Long customFoodId,
            UpdateCustomFoodRequest request
    ) {
        CustomFood customFood =
                findMyCustomFood(userId, customFoodId);

        if (customFood.getStatus() == CustomFoodStatus.APPROVED) {
            throw new IllegalArgumentException(
                    "Approved custom food cannot be updated"
            );
        }

        customFood.setName(request.name());
        customFood.setImageUrl(request.imageUrl());

        setNutritionValues(customFood, request);

        /*
         * If a rejected food is corrected,
         * send it back to admin for review.
         */
        if (customFood.getStatus() == CustomFoodStatus.REJECTED) {
            customFood.setStatus(CustomFoodStatus.PENDING);
        }

        customFood.setUpdatedAt(OffsetDateTime.now());

        return toResponse(customFoodRepository.save(customFood));
    }

    @Transactional
    public void deleteCustomFood(
            Long userId,
            Long customFoodId
    ) {
        CustomFood customFood =
                findMyCustomFood(userId, customFoodId);

        customFoodRepository.delete(customFood);
    }

    // =========================
    // ADMIN
    // =========================

    public List<CustomFoodResponse> getCustomFoodsByStatus(
            CustomFoodStatus status
    ) {
        return customFoodRepository
                .findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CustomFoodResponse getAdminCustomFood(Long customFoodId) {
        return toResponse(findCustomFood(customFoodId));
    }

    @Transactional
    public CustomFoodReviewResponse reviewCustomFood(
            Long adminId,
            Long customFoodId,
            ReviewCustomFoodRequest request
    ) {
        if (request.status() == CustomFoodStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Review status must be APPROVED or REJECTED"
            );
        }

        User admin = findUser(adminId);

        CustomFood customFood = findCustomFood(customFoodId);

        if (customFood.getStatus() != CustomFoodStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending custom foods can be reviewed"
            );
        }

        customFood.setStatus(request.status());
        customFood.setUpdatedAt(OffsetDateTime.now());

        customFoodRepository.save(customFood);

        CustomFoodReview review = new CustomFoodReview();

        review.setCustomFood(customFood);
        review.setAdmin(admin);
        review.setStatus(request.status());
        review.setComment(request.comment());
        review.setReviewedAt(OffsetDateTime.now());

        return toReviewResponse(
                customFoodReviewRepository.save(review)
        );
    }

    public List<CustomFoodReviewResponse> getReviews(
            Long customFoodId
    ) {
        return customFoodReviewRepository
                .findByCustomFoodIdOrderByReviewedAtDesc(customFoodId)
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    // =========================
    // HELPERS
    // =========================

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }

    private CustomFood findCustomFood(Long customFoodId) {
        return customFoodRepository.findById(customFoodId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Custom food not found"
                        )
                );
    }

    private CustomFood findMyCustomFood(
            Long userId,
            Long customFoodId
    ) {
        return customFoodRepository
                .findByIdAndUserId(customFoodId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Custom food not found"
                        )
                );
    }

    private void setNutritionValues(
            CustomFood food,
            CreateCustomFoodRequest request
    ) {
        food.setCaloriesKcal(request.caloriesKcal());
        food.setProteinG(request.proteinG());
        food.setCarbohydratesG(request.carbohydratesG());
        food.setFatG(request.fatG());
        food.setFiberG(request.fiberG());
        food.setSugarG(request.sugarG());
        food.setSaturatedFatG(request.saturatedFatG());
        food.setSodiumMg(request.sodiumMg());
        food.setCholesterolMg(request.cholesterolMg());
        food.setServingSizeG(request.servingSizeG());
    }

    private void setNutritionValues(
            CustomFood food,
            UpdateCustomFoodRequest request
    ) {
        food.setCaloriesKcal(request.caloriesKcal());
        food.setProteinG(request.proteinG());
        food.setCarbohydratesG(request.carbohydratesG());
        food.setFatG(request.fatG());
        food.setFiberG(request.fiberG());
        food.setSugarG(request.sugarG());
        food.setSaturatedFatG(request.saturatedFatG());
        food.setSodiumMg(request.sodiumMg());
        food.setCholesterolMg(request.cholesterolMg());
        food.setServingSizeG(request.servingSizeG());
    }

    private CustomFoodResponse toResponse(CustomFood food) {
        return new CustomFoodResponse(
                food.getId(),
                food.getName(),
                food.getImageUrl(),
                food.getCaloriesKcal(),
                food.getProteinG(),
                food.getCarbohydratesG(),
                food.getFatG(),
                food.getFiberG(),
                food.getSugarG(),
                food.getSaturatedFatG(),
                food.getSodiumMg(),
                food.getCholesterolMg(),
                food.getServingSizeG(),
                food.getStatus(),
                food.getCreatedAt(),
                food.getUpdatedAt()
        );
    }

    private CustomFoodReviewResponse toReviewResponse(
            CustomFoodReview review
    ) {
        return new CustomFoodReviewResponse(
                review.getId(),
                review.getCustomFood().getId(),
                review.getAdmin().getId(),
                review.getStatus(),
                review.getComment(),
                review.getReviewedAt()
        );
    }
}