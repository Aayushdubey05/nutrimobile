package com.nutrivision.backend.user.repository;

import com.nutrivision.backend.user.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository
        extends JpaRepository<UserSettings, Long> {

    Optional<UserSettings> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}