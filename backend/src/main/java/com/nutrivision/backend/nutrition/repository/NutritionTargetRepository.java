package com.nutrivision.backend.nutrition.repository;

import com.nutrivision.backend.nutrition.entity.NutritionTarget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NutritionTargetRepository extends JpaRepository<NutritionTarget, Long> {

    List<NutritionTarget> findByUserIdOrderByEffectiveFromDesc(Long userId);

    Optional<NutritionTarget> findFirstByUserIdOrderByEffectiveFromDesc(Long userId);
}