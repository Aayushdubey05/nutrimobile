package com.nutrivision.backend.recommendation.repository;

import com.nutrivision.backend.recommendation.entity.Recommendation;
import com.nutrivision.backend.recommendation.entity.RecommendationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByUserIdOrderByGeneratedAtDesc(Long userId);

    List<Recommendation> findByUserIdAndStatusOrderByGeneratedAtDesc(
            Long userId,
            RecommendationStatus status
    );
}