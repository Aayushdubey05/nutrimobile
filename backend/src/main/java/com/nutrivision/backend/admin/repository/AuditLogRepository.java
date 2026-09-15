package com.nutrivision.backend.admin.repository;

import com.nutrivision.backend.admin.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByAdminIdOrderByCreatedAtDesc(Long adminId);

    List<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
            String entityType,
            Long entityId
    );
}