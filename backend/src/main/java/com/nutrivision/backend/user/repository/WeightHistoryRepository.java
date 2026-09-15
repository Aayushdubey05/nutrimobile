package com.nutrivision.backend.user.repository;

import com.nutrivision.backend.user.entity.WeightHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeightHistoryRepository
        extends JpaRepository<WeightHistory, Long> {

    List<WeightHistory> findByUserIdOrderByRecordedAtDesc(Long userId);
}