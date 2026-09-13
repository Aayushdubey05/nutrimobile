import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function ConsistencyCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={17} color="#2E7D32" />
        </View>

        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>Consistency</Text>
        </View>
      </View>

      <Text style={styles.title}>Great progress!</Text>

      <Text style={styles.description}>
        You've stayed close to your daily nutrition targets for 5 days this
        week.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F1F8F3",
    borderWidth: 1,
    borderColor: "#D8EBDD",
    borderRadius: 18,
    padding: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 14,
  },

  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#DCEFE0",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryPill: {
    backgroundColor: "#DCEFE0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2E7D32",
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 7,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondaryText,
  },
});
