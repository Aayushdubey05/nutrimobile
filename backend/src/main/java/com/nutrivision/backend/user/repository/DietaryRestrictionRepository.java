package com.nutrivision.backend.user.repository;

import com.nutrivision.backend.user.entity.DietaryRestriction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DietaryRestrictionRepository
        extends JpaRepository<DietaryRestriction, Long> {

    Optional<DietaryRestriction> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}