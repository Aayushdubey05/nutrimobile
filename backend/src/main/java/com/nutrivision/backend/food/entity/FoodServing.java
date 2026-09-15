package com.nutrivision.backend.food.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "food_serving",
        indexes = {
                @Index(name = "idx_food_serving_food", columnList = "food_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class FoodServing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "food_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_food_serving_food")
    )
    private Food food;

    @Column(name = "serving_name", nullable = false, length = 100)
    private String servingName;

    @Column(name = "weight_g", nullable = false, precision = 7, scale = 2)
    private BigDecimal weightG;
}