package com.nutrivision.backend.analysis.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoundingBox {

    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
}