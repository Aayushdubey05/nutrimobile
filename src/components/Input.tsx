import { Ionicons } from "@expo/vector-icons";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colors } from "../constants/colors";

interface InputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function Input({
  label,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
        />

        {isPassword && (
          <Pressable
            onPress={onTogglePassword}
            style={styles.eyeButton}
            hitSlop={10}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={21}
              color={colors.icon}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 56,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 17,
    fontSize: 16,
    color: colors.text,
  },

  eyeButton: {
    width: 48,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
