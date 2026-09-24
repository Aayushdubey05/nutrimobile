package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The prompt asks Gemini for {@code bounding_box: [left, top, width, height]}, so the
 * value normally arrives as a JSON array. Models occasionally return an object with
 * named keys instead, so deserialization accepts both shapes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonDeserialize(using = BoundingBoxDeserializer.class)
public class BoundingBox {

    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
}
