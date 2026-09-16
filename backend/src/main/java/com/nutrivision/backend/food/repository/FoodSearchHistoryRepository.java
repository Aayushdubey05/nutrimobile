package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.FoodSearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodSearchHistoryRepository extends JpaRepository<FoodSearchHistory, Long> {

    List<FoodSearchHistory> findByUserIdOrderBySearchedAtDesc(Long userId);

    Optional<FoodSearchHistory> findByUserIdAndFoodId(
            Long userId,
            Long foodId
    );
}