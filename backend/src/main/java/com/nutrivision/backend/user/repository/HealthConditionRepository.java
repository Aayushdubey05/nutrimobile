package com.nutrivision.backend.user.repository;

import com.nutrivision.backend.user.entity.HealthCondition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HealthConditionRepository
        extends JpaRepository<HealthCondition, Long> {

    Optional<HealthCondition> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}