import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

export interface SegmentItem {
  id: string;
  name: string;
  weight: string;
  description: string;
  color: string;
  maskColor: string;
  bgColor: string;
  position: {
    top?: `${number}%` | number;
    left?: `${number}%` | number;
    right?: `${number}%` | number;
    bottom?: `${number}%` | number;
    width: `${number}%` | number;
    height: `${number}%` | number;
    borderRadius?: number;
  };
}

export const INITIAL_SEGMENTS: SegmentItem[] = [
  {
    id: "paneer",
    name: "Paneer",
    weight: "~180g",
    description: "Rich paneer gravy curry",
    color: "#EF4444",
    maskColor: "rgba(239, 68, 68, 0.35)",
    bgColor: "#FEF2F2",
    position: {
      top: "14%",
      left: "10%",
      width: "36%",
      height: "36%",
      borderRadius: 45,
    },
  },
  {
    id: "roti",
    name: "Roti",
    weight: "2 pieces",
    description: "Whole wheat phulka",
    color: "#F59E0B",
    maskColor: "rgba(245, 158, 11, 0.35)",
    bgColor: "#FFFBEB",
    position: {
      top: "12%",
      right: "10%",
      width: "38%",
      height: "36%",
      borderRadius: 50,
    },
  },
  {
    id: "dal",
    name: "Dal",
    weight: "~150g",
    description: "Yellow lentil soup",
    color: "#EAB308",
    maskColor: "rgba(234, 179, 8, 0.35)",
    bgColor: "#FEFCE8",
    position: {
      bottom: "12%",
      left: "8%",
      width: "32%",
      height: "34%",
      borderRadius: 40,
    },
  },
  {
    id: "rice",
    name: "Rice",
    weight: "~140g",
    description: "Steamed basmati rice",
    color: "#3B82F6",
    maskColor: "rgba(59, 130, 246, 0.35)",
    bgColor: "#EFF6FF",
    position: {
      bottom: "14%",
      left: "38%",
      width: "32%",
      height: "34%",
      borderRadius: 40,
    },
  },
  {
    id: "salad",
    name: "Salad",
    weight: "~65g",
    description: "Cucumber, onion & tomato",
    color: "#10B981",
    maskColor: "rgba(16, 185, 129, 0.35)",
    bgColor: "#ECFDF5",
    position: {
      bottom: "16%",
      right: "6%",
      width: "24%",
      height: "30%",
      borderRadius: 35,
    },
  },
];

interface SegmentationPreviewProps {
  items?: SegmentItem[];
  imageUri?: string;
  onSelectSegment?: (id: string) => void;
  selectedId?: string | null;
}

export default function SegmentationPreview({
  items = INITIAL_SEGMENTS,
  imageUri = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=900&q=85",
}: SegmentationPreviewProps) {
  return (
    <View style={styles.container}>
      {/* Background Indian Thali Food Photo */}
      <Image
        source={{ uri: imageUri }}
        style={styles.foodImage}
        resizeMode="cover"
      />

      {/* Dark tint overlay for mask contrast */}
      <View style={styles.darkTint} />

      {/* Segmentation Mask Overlays */}
      <View style={styles.masksLayer}>
        {items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.maskBox,
              item.position,
              {
                borderColor: item.color,
                backgroundColor: item.maskColor,
              },
            ]}
          >
            {/* Pill Label on image */}
            <View
              style={[
                styles.labelBadge,
                {
                  borderColor: item.color,
                  backgroundColor: "rgba(23, 23, 23, 0.85)",
                },
              ]}
            >
              <View
                style={[styles.labelDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.labelText}>{item.name}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom info badge */}
      <View style={styles.overlayCountBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.overlayCountText}>
          {items.length} items segmented
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 290,
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#171717",
    marginBottom: 20,
    position: "relative",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  foodImage: {
    width: "100%",
    height: "100%",
  },

  darkTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
  },

  masksLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  maskBox: {
    position: "absolute",
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  labelText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
  },

  overlayCountBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "rgba(23, 23, 23, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },

  overlayCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
});
