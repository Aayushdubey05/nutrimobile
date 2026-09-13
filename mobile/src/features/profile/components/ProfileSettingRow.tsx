import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProfileSettingRowProps {
  title: string;
  value: string;
  rightText?: string;
  showChevron?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  isDestructive?: boolean;
}

export default function ProfileSettingRow({
  title,
  value,
  rightText,
  showChevron = false,
  children,
  onPress,
  isDestructive = false,
}: ProfileSettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={styles.content}>
        <Text style={[styles.title, isDestructive && styles.destructiveTitle]}>
          {title}
        </Text>

        <Text style={styles.value}>{value}</Text>

        {children}
      </View>

      {rightText && <Text style={styles.rightText}>{rightText}</Text>}

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={17}
          color={colors.secondaryText}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 67,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  content: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  value: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },

  rightText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text,
    marginRight: 7,
  },

  destructiveTitle: {
    color: "#B42318",
  },
});
