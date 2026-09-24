package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByCategoryIdOrderByNameAsc(Long categoryId);

    List<Food> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    Optional<Food> findByNameIgnoreCase(String name);

    List<Food> findAllByNameContainingIgnoreCase(String name);
}