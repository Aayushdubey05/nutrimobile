package com.nutrivision.backend.analysis.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "explainability_result",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_explainability_result_analysis_item",
                        columnNames = "analysis_item_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class ExplainabilityResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "analysis_item_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_explainability_result_analysis_item")
    )
    private FoodAnalysisItem analysisItem;

    @Column(name = "heatmap_url", columnDefinition = "TEXT")
    private String heatmapUrl;

    @Column(columnDefinition = "TEXT")
    private String caption;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}