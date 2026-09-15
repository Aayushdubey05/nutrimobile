package com.nutrivision.backend.meal.entity;

import com.nutrivision.backend.food.entity.CustomFood;
import com.nutrivision.backend.food.entity.Food;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "meal_item",
        indexes = {
                @Index(name = "idx_meal_item_meal", columnList = "meal_id"),
                @Index(name = "idx_meal_item_food", columnList = "food_id"),
                @Index(name = "idx_meal_item_custom_food", columnList = "custom_food_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class MealItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "meal_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_meal_item_meal")
    )
    private Meal meal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "food_id",
            foreignKey = @ForeignKey(name = "fk_meal_item_food")
    )
    private Food food;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "custom_food_id",
            foreignKey = @ForeignKey(name = "fk_meal_item_custom_food")
    )
    private CustomFood customFood;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal quantity;

    @Column(name = "weight_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal weightG;

    @Column(name = "calories_kcal", nullable = false, precision = 10, scale = 2)
    private BigDecimal caloriesKcal;

    @Column(name = "protein_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal proteinG;

    @Column(name = "carbohydrates_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal carbohydratesG;

    @Column(name = "fat_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal fatG;

    @Column(name = "fiber_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal fiberG;

    @Column(name = "sugar_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal sugarG;

    @Column(name = "saturated_fat_g", nullable = false, precision = 10, scale = 2)
    private BigDecimal saturatedFatG;

    @Column(name = "sodium_mg", nullable = false, precision = 10, scale = 2)
    private BigDecimal sodiumMg;

    @Column(name = "cholesterol_mg", nullable = false, precision = 10, scale = 2)
    private BigDecimal cholesterolMg;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}