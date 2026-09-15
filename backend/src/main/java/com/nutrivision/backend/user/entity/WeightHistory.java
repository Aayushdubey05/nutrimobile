package com.nutrivision.backend.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "weight_history",
        indexes = {
                @Index(
                        name = "idx_weight_history_user_recorded_at",
                        columnList = "user_id, recorded_at DESC"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class WeightHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_weight_history_user")
    )
    private User user;

    @Column(name = "weight_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "recorded_at", nullable = false)
    private OffsetDateTime recordedAt;
}