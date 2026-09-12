import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface ExplanationCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export default function ExplanationCard({
  icon,
  title,
  description,
}: ExplanationCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 3,
  },

  description: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.secondaryText,
  },
});
