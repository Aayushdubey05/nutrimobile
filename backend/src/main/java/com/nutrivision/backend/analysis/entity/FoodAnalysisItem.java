package com.nutrivision.backend.analysis.entity;

import com.nutrivision.backend.food.entity.Food;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "food_analysis_item",
        indexes = {
                @Index(name = "idx_food_analysis_item_analysis", columnList = "analysis_id"),
                @Index(name = "idx_food_analysis_item_food", columnList = "food_id"),
                @Index(name = "idx_food_analysis_item_final_food", columnList = "final_food_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class FoodAnalysisItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "analysis_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_food_analysis_item_analysis")
    )
    private FoodAnalysis analysis;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "food_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_food_analysis_item_food")
    )
    private Food food;

    @Column(name = "detected_name", nullable = false, length = 150)
    private String detectedName;

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal confidence;

    @Column(name = "estimated_weight_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal estimatedWeightG;

    @Column(name = "final_weight_g", nullable = false, precision = 8, scale = 2)
    private BigDecimal finalWeightG;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "final_food_id",
            foreignKey = @ForeignKey(name = "fk_food_analysis_item_final_food")
    )
    private Food finalFood;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}