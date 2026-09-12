import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface FoodDetectionCardProps {
  name: string;
  weight: string;
  description: string;
  color?: string;
  isConfirmed?: boolean;
  onToggleConfirm?: () => void;
  onRemove?: () => void;
}

export default function FoodDetectionCard({
  name,
  weight,
  description,
  color = "#3B82F6",
  isConfirmed = true,
  onToggleConfirm,
  onRemove,
}: FoodDetectionCardProps) {
  return (
    <View style={[styles.card, !isConfirmed && styles.unconfirmedCard]}>
      {/* Small colored circular indicator */}
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />

      {/* Info Column */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.weight}>— {weight}</Text>
        </View>

        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Green Check Button */}
        <Pressable
          style={({ pressed }) => [
            styles.checkButton,
            isConfirmed ? styles.confirmedCheck : styles.unconfirmedCheck,
            pressed && styles.pressed,
          ]}
          onPress={onToggleConfirm}
        >
          <Ionicons
            name="checkmark"
            size={16}
            color={isConfirmed ? "#15803D" : "#9CA3AF"}
          />
        </Pressable>

        {/* Gray Remove X Button */}
        <Pressable
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.pressed,
          ]}
          onPress={onRemove}
        >
          <Ionicons name="close" size={16} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,

    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },

  unconfirmedCard: {
    opacity: 0.65,
    backgroundColor: "#FAFAFA",
  },

  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  weight: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    marginLeft: 6,
  },

  description: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 10,
  },

  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmedCheck: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
  },

  unconfirmedCheck: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

