import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import { colors } from "@/constants/colors";

import CalorieTrendChart from "@/features/progress/components/CalorieTrendChart";
import MacroAverageCard from "@/features/progress/components/MacroAverageCard";
import ProgressStatCard from "@/features/progress/components/ProgressStatCard";
import StatusCard from "@/features/progress/components/StatusCard";
import { progressService } from "@/features/progress/services/progressService";
import type {
  ProgressPeriod,
  ProgressResponse,
} from "@/features/progress/types";

export default function ProgressScreen() {
  const [period, setPeriod] = useState<ProgressPeriod>("WEEK");

  const [progress, setProgress] = useState<ProgressResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadProgress = async (selectedPeriod: ProgressPeriod) => {
    try {
      setLoading(true);
      setError(null);

      const data = await progressService.getProgress(selectedPeriod);

      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress(period);
  }, [period]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatNumber = (value: number) =>
    Math.round(value).toLocaleString("en-IN");

  const formatWeightChange = (value: number | null) => {
    if (value === null) {
      return "No previous record";
    }

    if (value === 0) {
      return "No change this period";
    }

    const sign = value > 0 ? "+" : "";

    return `${sign}${value.toFixed(1)} kg this period`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Progress</Text>

            <Text style={styles.subtitle}>
              Track your nutrition trend & consistency
            </Text>
          </View>

          <Pressable
            style={styles.headerButton}
            onPress={() => loadProgress(period)}
          >
            <Ionicons name="refresh-outline" size={19} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.segmentedControl}>
            <Pressable
              style={[
                styles.segment,
                period === "WEEK" && styles.activeSegment,
              ]}
              onPress={() => setPeriod("WEEK")}
            >
              <Text
                style={[
                  styles.segmentText,
                  period === "WEEK" && styles.activeSegmentText,
                ]}
              >
                Week
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.segment,
                period === "MONTH" && styles.activeSegment,
              ]}
              onPress={() => setPeriod("MONTH")}
            >
              <Text
                style={[
                  styles.segmentText,
                  period === "MONTH" && styles.activeSegmentText,
                ]}
              >
                Month
              </Text>
            </Pressable>
          </View>

          {loading && !progress ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="small" color={colors.text} />

              <Text style={styles.stateText}>Loading progress...</Text>
            </View>
          ) : error && !progress ? (
            <View style={styles.centerState}>
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={colors.text}
              />

              <Text style={styles.errorText}>{error}</Text>

              <Pressable
                style={styles.retryButton}
                onPress={() => loadProgress(period)}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : progress ? (
            <>
              <View style={styles.dateRange}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={colors.secondaryText}
                />

                <Text style={styles.dateRangeText}>
                  {formatDate(progress.startDate)} –{" "}
                  {formatDate(progress.endDate)}
                </Text>
              </View>

              <StatusCard
                adherenceDays={progress.goalAdherenceDays}
                totalDays={progress.totalDays}
                adherencePercentage={progress.adherencePercentage}
                period={progress.period}
              />

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>CALORIE TREND</Text>

                    <View style={styles.averageRow}>
                      <Text style={styles.averageNumber}>
                        {formatNumber(progress.calorieAverage)}
                      </Text>

                      <Text style={styles.averageText}>daily avg</Text>
                    </View>
                  </View>
                </View>

                <CalorieTrendChart data={progress.dailyData} />
              </View>

              <View style={styles.statsRow}>
                <ProgressStatCard
                  title="GOAL ADHERENCE"
                  value={`${progress.goalAdherenceDays} / ${progress.totalDays} days`}
                  subtitle="Within calorie target"
                  progress={progress.adherencePercentage}
                  progressLabel={`${Math.round(
                    progress.adherencePercentage,
                  )}% adherence`}
                />

                <ProgressStatCard
                  title="CURRENT WEIGHT"
                  value={`${progress.currentWeightKg.toFixed(1)} kg`}
                  subtitle={formatWeightChange(progress.weightChangeKg)}
                />
              </View>

              <View style={styles.macroSection}>
                <Text style={styles.sectionLabel}>MACRO AVERAGES</Text>

                <Text style={styles.macroSubtitle}>
                  {progress.period === "WEEK"
                    ? "Weekly Target Balance"
                    : "Monthly Target Balance"}
                </Text>

                <View style={styles.macroSpacing}>
                  <MacroAverageCard
                    proteinG={progress.macroAverages.proteinG}
                    targetProteinG={progress.macroAverages.targetProteinG}
                    carbohydratesG={progress.macroAverages.carbohydratesG}
                    targetCarbohydratesG={
                      progress.macroAverages.targetCarbohydratesG
                    }
                    fatG={progress.macroAverages.fatG}
                    targetFatG={progress.macroAverages.targetFatG}
                  />
                </View>
              </View>
            </>
          ) : null}
        </ScrollView>

        <BottomNav active="progress" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
    marginRight: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.secondaryText,
  },

  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },

  segment: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 9,
  },

  activeSegment: {
    backgroundColor: colors.text,
  },

  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  activeSegmentText: {
    color: colors.background,
  },

  dateRange: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  dateRangeText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.secondaryText,
  },

  section: {
    marginTop: 24,
  },

  sectionHeader: {
    marginBottom: 2,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: colors.secondaryText,
  },

  averageRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },

  averageNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
  },

  averageText: {
    marginLeft: 7,
    fontSize: 12,
    color: colors.secondaryText,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },

  macroSection: {
    marginTop: 28,
  },

  macroSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.secondaryText,
  },

  macroSpacing: {
    marginTop: 12,
  },

  centerState: {
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  stateText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.secondaryText,
  },

  errorText: {
    marginTop: 10,
    fontSize: 13,
    textAlign: "center",
    color: colors.text,
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.text,
  },

  retryText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: "600",
  },
});
