package com.nutrivision.backend.meal.repository;

import com.nutrivision.backend.meal.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {

    List<Meal> findByUserIdOrderByMealDateDescMealTimeDesc(Long userId);

    List<Meal> findByUserIdAndMealDateOrderByMealTimeDesc(
            Long userId,
            LocalDate mealDate
    );
}