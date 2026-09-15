package com.nutrivision.backend.analysis.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(
        name = "ai_model_result",
        indexes = {
                @Index(name = "idx_ai_model_result_analysis_item", columnList = "analysis_item_id"),
                @Index(name = "idx_ai_model_result_model", columnList = "model_name, model_version")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class AiModelResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "analysis_item_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_ai_model_result_analysis_item")
    )
    private FoodAnalysisItem analysisItem;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_version", nullable = false, length = 50)
    private String modelVersion;

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal confidence;

    @Column(name = "processing_time_ms", nullable = false)
    private Integer processingTimeMs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}