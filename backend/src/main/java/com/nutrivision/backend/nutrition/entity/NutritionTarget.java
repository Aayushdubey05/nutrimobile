package com.nutrivision.backend.nutrition.entity;

import com.nutrivision.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "nutrition_target",
        indexes = {
                @Index(
                        name = "idx_nutrition_target_user_effective_from",
                        columnList = "user_id, effective_from DESC"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class NutritionTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_nutrition_target_user")
    )
    private User user;

    @Column(
            name = "calorie_target_kcal",
            nullable = false,
            precision = 8,
            scale = 2
    )
    private BigDecimal calorieTargetKcal;

    @Column(
            name = "protein_target_g",
            nullable = false,
            precision = 8,
            scale = 2
    )
    private BigDecimal proteinTargetG;

    @Column(
            name = "carbohydrate_target_g",
            nullable = false,
            precision = 8,
            scale = 2
    )
    private BigDecimal carbohydrateTargetG;

    @Column(
            name = "fat_target_g",
            nullable = false,
            precision = 8,
            scale = 2
    )
    private BigDecimal fatTargetG;

    @Column(name = "calculation_method", nullable = false, length = 100)
    private String calculationMethod;

    @Column(name = "is_customized", nullable = false)
    private boolean customized;

    @Column(name = "effective_from", nullable = false)
    private OffsetDateTime effectiveFrom;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}