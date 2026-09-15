package com.nutrivision.backend.recommendation.repository;

import com.nutrivision.backend.recommendation.entity.RecommendationFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecommendationFeedbackRepository extends JpaRepository<RecommendationFeedback, Long> {

    Optional<RecommendationFeedback> findByRecommendationIdAndUserId(
            Long recommendationId,
            Long userId
    );

    boolean existsByRecommendationIdAndUserId(
            Long recommendationId,
            Long userId
    );
}