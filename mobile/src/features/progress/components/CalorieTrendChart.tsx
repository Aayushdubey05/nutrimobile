import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import type { ProgressDailyData } from "../types";

interface CalorieTrendChartProps {
  data: ProgressDailyData[];
}

export default function CalorieTrendChart({ data }: CalorieTrendChartProps) {
  const chartHeight = 190;

  const maxCalories = Math.max(
    ...data.map((item) => item.calories),
    ...data.map((item) => item.targetCalories),
    1,
  );

  const chartMax = maxCalories * 1.1;

  const firstTarget = data.length > 0 ? data[0].targetCalories : 0;

  const goalPosition = chartHeight - (firstTarget / chartMax) * chartHeight;

  const highest =
    data.length > 0
      ? data.reduce((highest, current) =>
          current.calories > highest.calories ? current : highest,
        )
      : null;

  const today = data.length > 0 ? data[data.length - 1] : null;

  const formatDay = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    if (data.length <= 7) {
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
      });
    }

    return String(day);
  };

  const formatNumber = (value: number) =>
    Math.round(value).toLocaleString("en-IN");

  const todayDifference = today ? today.targetCalories - today.calories : 0;

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />

          <Text style={styles.legendText}>Daily Intake</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={styles.goalLegendLine} />

          <Text style={styles.legendText}>Goal</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScroll}
      >
        <View
          style={[
            styles.chart,
            {
              width: Math.max(data.length * 52, 320),
            },
          ]}
        >
          <View
            style={[
              styles.goalLine,
              {
                top: goalPosition,
              },
            ]}
          />

          <View style={styles.barsContainer}>
            {data.map((item) => {
              const barHeight =
                item.calories > 0
                  ? (item.calories / chartMax) * chartHeight
                  : 2;

              const overGoal = item.calories > item.targetCalories;

              return (
                <View key={item.date} style={styles.barColumn}>
                  <View style={styles.barArea}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                        },
                      ]}
                    />

                    {overGoal && <View style={styles.overGoalDot} />}
                  </View>

                  <Text style={styles.day}>{formatDay(item.date)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {highest && (
        <Text style={styles.summaryText}>
          Highest:{" "}
          <Text style={styles.bold}>{formatNumber(highest.calories)} kcal</Text>{" "}
          ({formatDay(highest.date)})
        </Text>
      )}

      {today && (
        <Text style={styles.summaryText}>
          {todayDifference >= 0 ? "Remaining Today: " : "Over Target Today: "}

          <Text style={styles.bold}>
            {formatNumber(Math.abs(todayDifference))} kcal
          </Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },

  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
    marginRight: 6,
  },

  goalLegendLine: {
    width: 14,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: colors.secondaryText,
    marginRight: 6,
  },

  legendText: {
    fontSize: 11,
    color: colors.secondaryText,
  },

  chartScroll: {
    paddingBottom: 4,
  },

  chart: {
    height: 220,
    position: "relative",
  },

  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderTopColor: colors.secondaryText,
  },

  barsContainer: {
    height: 210,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },

  barColumn: {
    width: 40,
    height: 210,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  barArea: {
    height: 190,
    width: 24,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bar: {
    width: 18,
    borderRadius: 5,
    backgroundColor: colors.text,
  },

  overGoalDot: {
    position: "absolute",
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryText,
  },

  day: {
    marginTop: 7,
    fontSize: 10,
    color: colors.secondaryText,
  },

  summaryText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.secondaryText,
  },

  bold: {
    fontWeight: "700",
    color: colors.text,
  },
});
