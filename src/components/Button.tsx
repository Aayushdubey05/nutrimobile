import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
}

export default function Button({
  title,
  onPress,
  loading = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryText} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    width: "100%",
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  pressed: {
    opacity: 0.85,
  },

  text: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },
});
