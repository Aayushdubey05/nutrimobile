import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

interface DateSelectorProps {
  dateLabel: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onCalendarPress?: () => void;
}

export default function DateSelector({
  dateLabel,
  onPrevious,
  onNext,
  onCalendarPress,
}: DateSelectorProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.arrowButton} onPress={onPrevious} hitSlop={8}>
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </Pressable>

      <Pressable style={styles.dateButton} onPress={onCalendarPress}>
        <Ionicons name="calendar-outline" size={19} color={colors.text} />

        <Text style={styles.dateText}>{dateLabel}</Text>
      </Pressable>

      <Pressable style={styles.arrowButton} onPress={onNext} hitSlop={8}>
        <Ionicons name="chevron-forward" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },

  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },

  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
