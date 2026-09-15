package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.FoodNutrition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodNutritionRepository extends JpaRepository<FoodNutrition, Long> {

    Optional<FoodNutrition> findByFoodId(Long foodId);

    boolean existsByFoodId(Long foodId);
}