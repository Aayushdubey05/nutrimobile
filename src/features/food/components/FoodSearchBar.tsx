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
      <Ionicons name="search-outline" size={21} color={colors.icon} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        autoCapitalize="none"
        returnKeyType="search"
      />

      {value.length > 0 && (
        <Pressable onPress={onClear} hitSlop={10} style={styles.clearButton}>
          <Ionicons name="close-circle" size={19} color={colors.placeholder} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },

  clearButton: {
    marginLeft: 8,
  },
});
