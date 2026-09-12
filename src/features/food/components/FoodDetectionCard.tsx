import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface FoodDetectionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  description: string;
}

export default function FoodDetectionCard({
  icon,
  name,
  description,
}: FoodDetectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.foodIcon}>
        <Ionicons name={icon} size={21} color={colors.text} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.check}>
        <Ionicons name="checkmark" size={16} color={colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  foodIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  description: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 3,
  },

  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
