import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors } from "../../../constants/colors";

interface FoodSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export default function FoodSearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search food...",
}: FoodSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#9CA3AF" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        autoCapitalize="none"
        returnKeyType="search"
      />

      {value.length > 0 && (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
        >
          <Ionicons name="close-circle" size={19} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,

    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },

  clearButton: {
    marginLeft: 8,
  },

  pressed: {
    opacity: 0.7,
  },
});

