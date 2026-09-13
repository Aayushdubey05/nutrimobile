import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

interface SettingsRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showChevron?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export default function SettingsRow({
  title,
  subtitle,
  icon,
  onPress,
  showChevron = false,
  toggle = false,
  toggleValue = false,
  onToggle,
  destructive = false,
}: SettingsRowProps) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!onPress && !toggle}
    >
      <View
        style={[
          styles.iconContainer,
          destructive && styles.destructiveIconContainer,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? "#B42318" : colors.text}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, destructive && styles.destructiveText]}>
          {title}
        </Text>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {toggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{
            false: "#D4D4D4",
            true: "#A8D5AE",
          }}
          thumbColor={toggleValue ? "#2E7D32" : "#F5F5F5"}
        />
      )}

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={destructive ? "#B42318" : colors.secondaryText}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  destructiveIconContainer: {
    backgroundColor: "#FEF3F2",
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  destructiveText: {
    color: "#B42318",
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.secondaryText,
    marginTop: 3,
  },
});
