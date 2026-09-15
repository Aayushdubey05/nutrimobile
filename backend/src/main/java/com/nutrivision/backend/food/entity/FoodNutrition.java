package com.nutrivision.backend.food.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "food_nutrition",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_food_nutrition_food",
                        columnNames = "food_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class FoodNutrition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "food_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_food_nutrition_food")
    )
    private Food food;

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
}