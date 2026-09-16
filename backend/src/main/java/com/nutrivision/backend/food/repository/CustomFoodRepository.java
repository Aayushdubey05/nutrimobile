package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.CustomFood;
import com.nutrivision.backend.food.entity.CustomFoodStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomFoodRepository extends JpaRepository<CustomFood, Long> {

    List<CustomFood> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<CustomFood> findByStatusOrderByCreatedAtDesc(CustomFoodStatus status);

    Optional<CustomFood> findByIdAndUserId(Long id, Long userId);
}