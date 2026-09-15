package com.nutrivision.backend.analysis.repository;

import com.nutrivision.backend.analysis.entity.FoodAnalysis;
import com.nutrivision.backend.analysis.entity.AnalysisStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodAnalysisRepository extends JpaRepository<FoodAnalysis, Long> {

    List<FoodAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<FoodAnalysis> findByStatusOrderByCreatedAtDesc(AnalysisStatus status);
}