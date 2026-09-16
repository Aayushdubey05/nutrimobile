package com.nutrivision.backend.food.entity;

import com.nutrivision.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "custom_food",
        indexes = {
                @Index(name = "idx_custom_food_user", columnList = "user_id"),
                @Index(name = "idx_custom_food_status", columnList = "status"),
                @Index(
                        name = "idx_custom_food_status_created_at",
                        columnList = "status, created_at DESC"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class CustomFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_custom_food_user")
    )
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "calories_kcal", nullable = false, precision = 8, scale = 2)
    private BigDecimal caloriesKcal;

    @Column(name = "protein_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal proteinG;

    @Column(name = "carbohydrates_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal carbohydratesG;

    @Column(name = "fat_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal fatG;

    @Column(name = "fiber_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal fiberG;

    @Column(name = "sugar_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal sugarG;

    @Column(name = "saturated_fat_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal saturatedFatG;

    @Column(name = "sodium_mg", nullable = false, precision = 10, scale = 2)
    private BigDecimal sodiumMg;

    @Column(name = "cholesterol_mg", nullable = false, precision = 10, scale = 2)
    private BigDecimal cholesterolMg;

    @Column(name = "serving_size_g", nullable = false, precision = 7, scale = 2)
    private BigDecimal servingSizeG;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "custom_food_status")
    private CustomFoodStatus status = CustomFoodStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}