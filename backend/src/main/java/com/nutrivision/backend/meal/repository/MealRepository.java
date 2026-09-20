package com.nutrivision.backend.meal.repository;

import com.nutrivision.backend.meal.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {

    List<Meal> findByUserIdOrderByMealDateDescMealTimeDesc(Long userId);

    List<Meal> findByUserIdAndMealDateOrderByMealTimeDesc(
            Long userId,
            LocalDate mealDate
    );

    @Query("""
            SELECT DISTINCT m
            FROM Meal m
            LEFT JOIN FETCH m.items
            WHERE m.user.id = :userId
              AND m.mealDate BETWEEN :startDate AND :endDate
            """)
    List<Meal> findByUserIdAndMealDateBetweenWithItems(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}