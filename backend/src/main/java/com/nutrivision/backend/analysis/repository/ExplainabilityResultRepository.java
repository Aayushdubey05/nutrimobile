package com.nutrivision.backend.analysis.repository;

import com.nutrivision.backend.analysis.entity.ExplainabilityResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExplainabilityResultRepository extends JpaRepository<ExplainabilityResult, Long> {

    Optional<ExplainabilityResult> findByAnalysisItemId(Long analysisItemId);

    boolean existsByAnalysisItemId(Long analysisItemId);
}