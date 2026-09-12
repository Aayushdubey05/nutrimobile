import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
}

export default function SectionHeader({
  title,
  action,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {action && (
        <Text onPress={onActionPress} style={styles.action}>
          {action}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  action: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },
});
