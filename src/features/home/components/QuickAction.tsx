import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: "card" | "pill" | "row";
}

export default function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
  variant = "card",
}: QuickActionProps) {
  if (variant === "pill" || variant === "row") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pillContainer,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name={icon} size={18} color="#171717" style={styles.pillIcon} />
        <Text style={styles.pillTitle}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={21} color={colors.text} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },

  pillContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
  },

  pillIcon: {
    marginRight: 6,
  },

  pillTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },
});

