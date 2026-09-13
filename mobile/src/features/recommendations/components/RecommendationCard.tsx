import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RecommendationCardProps {
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  recommendation?: string;
  showAddToLog?: boolean;
  onAddToLog?: () => void;
}

export default function RecommendationCard({
  category,
  categoryColor,
  title,
  description,
  recommendation,
  showAddToLog = false,
  onAddToLog,
}: RecommendationCardProps) {
  return (
    <View style={styles.card}>
      {/* Category */}
      <View
        style={[styles.categoryPill, { backgroundColor: `${categoryColor}18` }]}
      >
        <View
          style={[styles.categoryDot, { backgroundColor: categoryColor }]}
        />

        <Text style={[styles.categoryText, { color: categoryColor }]}>
          {category}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Recommendation */}
      {recommendation && (
        <View style={styles.recommendationBox}>
          <Ionicons
            name="bulb-outline"
            size={16}
            color={colors.secondaryText}
          />

          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
      )}

      {/* Bottom actions */}
      <View style={styles.bottomRow}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.helpfulText}>Helpful?</Text>

          <Pressable style={styles.feedbackButton}>
            <Text style={styles.feedbackEmoji}>👍</Text>
            <Text style={styles.feedbackText}>Yes</Text>
          </Pressable>

          <Pressable style={styles.feedbackButton}>
            <Text style={styles.feedbackEmoji}>👎</Text>
            <Text style={styles.feedbackText}>No</Text>
          </Pressable>
        </View>

        {showAddToLog && (
          <Pressable style={styles.addButton} onPress={onAddToLog}>
            <Text style={styles.addButtonText}>Add to Log</Text>

            <Ionicons name="arrow-forward" size={15} color={colors.text} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
  },

  categoryPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },

  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginRight: 6,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondaryText,
  },

  recommendationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 11,
    marginTop: 15,
    gap: 8,
  },

  recommendationText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },

  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  helpfulText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginRight: 2,
  },

  feedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 5,
  },

  feedbackEmoji: {
    fontSize: 13,
  },

  feedbackText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
});
