import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function StatusCard() {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={18} color="#2E7D32" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Consistent Week</Text>

          <Text style={styles.subtitle}>
            You're staying consistent this week.
          </Text>
        </View>
      </View>

      <View style={styles.statusPill}>
        <Text style={styles.statusText}>On Target</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F1F8F3",
    borderWidth: 1,
    borderColor: "#D8EBDD",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#DCEFE0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },

  statusPill: {
    backgroundColor: "#DCEFE0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2E7D32",
  },
});
