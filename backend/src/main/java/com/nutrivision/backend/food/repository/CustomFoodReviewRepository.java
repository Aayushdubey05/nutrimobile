package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.CustomFoodReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomFoodReviewRepository extends JpaRepository<CustomFoodReview, Long> {

    List<CustomFoodReview> findByCustomFoodIdOrderByReviewedAtDesc(Long customFoodId);

    List<CustomFoodReview> findByAdminIdOrderByReviewedAtDesc(Long adminId);

    Optional<CustomFoodReview> findFirstByCustomFoodIdOrderByReviewedAtDesc(Long customFoodId);
}