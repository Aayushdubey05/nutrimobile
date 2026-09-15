package com.nutrivision.backend.admin.entity;

import com.nutrivision.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "audit_log",
        indexes = {
                @Index(
                        name = "idx_audit_log_admin_created_at",
                        columnList = "admin_id, created_at DESC"
                ),
                @Index(
                        name = "idx_audit_log_entity",
                        columnList = "entity_type, entity_id"
                ),
                @Index(
                        name = "idx_audit_log_created_at",
                        columnList = "created_at DESC"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "admin_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_audit_log_admin")
    )
    private User admin;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}