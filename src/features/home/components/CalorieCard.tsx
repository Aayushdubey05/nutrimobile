import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface CalorieCardProps {
  consumed: number;
  target: number;
}

export default function CalorieCard({ consumed, target }: CalorieCardProps) {
  const remaining = Math.max(target - consumed, 0);
  const progress = Math.min(consumed / target, 1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Today's calories</Text>
          <Text style={styles.subLabel}>Daily target</Text>
        </View>

        <Text style={styles.target}>{target} kcal</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.ring}>
          <View style={styles.innerRing}>
            <Text style={styles.consumed}>{consumed}</Text>

            <Text style={styles.kcal}>kcal</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{remaining}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statValue}>{Math.round(progress * 100)}%</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  label: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  subLabel: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },

  target: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  ring: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 10,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },

  innerRing: {
    alignItems: "center",
    justifyContent: "center",
  },

  consumed: {
    fontSize: 25,
    fontWeight: "700",
    color: colors.text,
  },

  kcal: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 1,
  },

  stats: {
    flex: 1,
    marginLeft: 24,
    gap: 14,
  },

  stat: {
    alignItems: "flex-start",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  statLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },

  divider: {
    height: 1,
    width: "100%",
    backgroundColor: colors.border,
  },
});
