package com.nutrivision.backend.food.repository;

import com.nutrivision.backend.food.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {

    Optional<FoodCategory> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}