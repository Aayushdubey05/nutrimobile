package com.nutrivision.backend.analysis.dto.gemini;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

/**
 * Accepts either {@code [left, top, width, height]} (what the prompt asks for) or an
 * object such as {@code {"x":.., "y":.., "width":.., "height":..}}. Anything else
 * yields {@code null} rather than failing the whole analysis, since the bounding box
 * is only used for an explainability caption.
 */
public class BoundingBoxDeserializer extends StdDeserializer<BoundingBox> {

    public BoundingBoxDeserializer() {
        super(BoundingBox.class);
    }

    @Override
    public BoundingBox deserialize(JsonParser parser, DeserializationContext context)
            throws IOException {

        JsonNode node = parser.getCodec().readTree(parser);

        if (node == null || node.isNull()) {
            return null;
        }

        if (node.isArray()) {
            if (node.size() < 4) {
                return null;
            }
            return new BoundingBox(
                    intOrNull(node.get(0)),
                    intOrNull(node.get(1)),
                    intOrNull(node.get(2)),
                    intOrNull(node.get(3))
            );
        }

        if (node.isObject()) {
            return new BoundingBox(
                    intOrNull(firstPresent(node, "x", "left")),
                    intOrNull(firstPresent(node, "y", "top")),
                    intOrNull(firstPresent(node, "width", "w")),
                    intOrNull(firstPresent(node, "height", "h"))
            );
        }

        return null;
    }

    private JsonNode firstPresent(JsonNode node, String... names) {
        for (String name : names) {
            JsonNode value = node.get(name);
            if (value != null && !value.isNull()) {
                return value;
            }
        }
        return null;
    }

    private Integer intOrNull(JsonNode node) {
        return node == null || !node.isNumber() ? null : node.asInt();
    }
}
