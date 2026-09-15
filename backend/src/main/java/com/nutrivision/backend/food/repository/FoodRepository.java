package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByCategoryIdOrderByNameAsc(Long categoryId);

    List<Food> findByNameContainingIgnoreCaseOrderByNameAsc(String name);
}