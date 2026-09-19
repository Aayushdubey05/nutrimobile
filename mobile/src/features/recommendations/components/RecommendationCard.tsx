import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { RecommendationFeedbackType } from "../types";

interface RecommendationCardProps {
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  reason?: string;
  feedback: RecommendationFeedbackType | null;
  onFeedback: (feedback: RecommendationFeedbackType) => void;
}

export default function RecommendationCard({
  category,
  categoryColor,
  title,
  description,
  reason,
  feedback,
  onFeedback,
}: RecommendationCardProps) {
  return (
    <View style={styles.card}>
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

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      {reason && (
        <View style={styles.recommendationBox}>
          <Ionicons
            name="bulb-outline"
            size={16}
            color={colors.secondaryText}
          />

          <Text style={styles.recommendationText}>{reason}</Text>
        </View>
      )}

      <View style={styles.bottomRow}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.helpfulText}>Helpful?</Text>

          <Pressable
            style={[
              styles.feedbackButton,
              feedback === "LIKE" && styles.feedbackButtonActive,
            ]}
            onPress={() => onFeedback("LIKE")}
          >
            <Text style={styles.feedbackEmoji}>👍</Text>
            <Text style={styles.feedbackText}>Yes</Text>
          </Pressable>

          <Pressable
            style={[
              styles.feedbackButton,
              feedback === "DISLIKE" && styles.feedbackButtonActive,
            ]}
            onPress={() => onFeedback("DISLIKE")}
          >
            <Text style={styles.feedbackEmoji}>👎</Text>
            <Text style={styles.feedbackText}>No</Text>
          </Pressable>
        </View>
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
    marginBottom: 12,
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
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    paddingHorizontal: 6,
    borderRadius: 8,
  },

  feedbackButtonActive: {
    backgroundColor: "#F0F0F0",
  },

  feedbackEmoji: {
    fontSize: 13,
  },

  feedbackText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.secondaryText,
  },
});
