package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.FoodServing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodServingRepository extends JpaRepository<FoodServing, Long> {

    List<FoodServing> findByFoodIdOrderByServingNameAsc(Long foodId);
}