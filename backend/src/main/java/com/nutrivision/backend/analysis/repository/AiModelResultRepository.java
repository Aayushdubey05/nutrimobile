package com.nutrivision.backend.analysis.repository;

import com.nutrivision.backend.analysis.entity.AiModelResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiModelResultRepository extends JpaRepository<AiModelResult, Long> {

    List<AiModelResult> findByAnalysisItemId(Long analysisItemId);

    List<AiModelResult> findByModelNameAndModelVersion(String modelName, String modelVersion);
}