import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
}: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={21} color={colors.text} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 16,
    marginBottom: 10,
  },

  pressed: {
    opacity: 0.75,
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
