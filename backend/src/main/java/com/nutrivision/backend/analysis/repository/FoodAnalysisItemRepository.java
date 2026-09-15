package com.nutrivision.backend.analysis.repository;

import com.nutrivision.backend.analysis.entity.FoodAnalysisItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodAnalysisItemRepository extends JpaRepository<FoodAnalysisItem, Long> {

    List<FoodAnalysisItem> findByAnalysisId(Long analysisId);

    List<FoodAnalysisItem> findByFoodId(Long foodId);

    List<FoodAnalysisItem> findByFinalFoodId(Long finalFoodId);
}