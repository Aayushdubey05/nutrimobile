import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

const DATA = [
  { day: "Mon", calories: 1780 },
  { day: "Tue", calories: 1920 },
  { day: "Wed", calories: 2100 },
  { day: "Thu", calories: 1840 },
  { day: "Fri", calories: 1980 },
  { day: "Sat", calories: 1820 },
  { day: "Sun", calories: 1860 },
];

const GOAL = 2000;
const MAX_CALORIES = 2200;

export default function CalorieTrendChart() {
  const chartHeight = 190;
  const goalPosition = chartHeight - (GOAL / MAX_CALORIES) * chartHeight;

  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Daily Intake</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={styles.goalLegendLine} />
          <Text style={styles.legendText}>Goal (2,000)</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chart}>
        {/* Goal line */}
        <View
          style={[
            styles.goalLine,
            {
              top: goalPosition,
            },
          ]}
        />

        <View style={styles.barsContainer}>
          {DATA.map((item) => {
            const barHeight = (item.calories / MAX_CALORIES) * chartHeight;

            return (
              <View key={item.day} style={styles.barColumn}>
                <View style={styles.barArea}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                      },
                    ]}
                  />

                  {item.calories > GOAL && <View style={styles.overGoalDot} />}
                </View>

                <Text style={styles.day}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Chart summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Highest: <Text style={styles.bold}>2,100 kcal</Text> (Wed)
        </Text>

        <Text style={styles.summaryText}>
          Remaining Today: <Text style={styles.bold}>760 kcal</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
    marginBottom: 14,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },

  goalLegendLine: {
    width: 15,
    height: 1,
    backgroundColor: colors.secondaryText,
  },

  legendText: {
    fontSize: 10,
    color: colors.secondaryText,
  },

  chart: {
    height: 220,
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: "#999999",
    zIndex: 1,
  },

  barsContainer: {
    height: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  barColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },

  barArea: {
    height: 190,
    width: 24,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: 20,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },

  overGoalDot: {
    position: "absolute",
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#C58A00",
  },

  day: {
    fontSize: 10,
    color: colors.secondaryText,
    marginTop: 9,
    marginBottom: 7,
  },

  summary: {
    marginTop: 14,
    gap: 5,
  },

  summaryText: {
    fontSize: 11,
    color: colors.secondaryText,
  },

  bold: {
    fontWeight: "700",
    color: colors.text,
  },
});
