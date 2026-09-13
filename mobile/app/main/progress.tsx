import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import { colors } from "@/constants/colors";

import CalorieTrendChart from "@/features/progress/components/CalorieTrendChart";
import MacroAverageCard from "@/features/progress/components/MacroAverageCard";
import ProgressStatCard from "@/features/progress/components/ProgressStatCard";
import StatusCard from "@/features/progress/components/StatusCard";

export default function ProgressScreen() {
  const [period, setPeriod] = useState<"Week" | "Month">("Week");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Progress</Text>

            <Text style={styles.subtitle}>
              Track your weekly nutrition trend & consistency
            </Text>
          </View>

          <Pressable style={styles.headerButton}>
            <Ionicons name="calendar-outline" size={19} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Segmented Control */}
          <View style={styles.segmentedControl}>
            <Pressable
              style={[
                styles.segment,
                period === "Week" && styles.activeSegment,
              ]}
              onPress={() => setPeriod("Week")}
            >
              <Text
                style={[
                  styles.segmentText,
                  period === "Week" && styles.activeSegmentText,
                ]}
              >
                Week
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.segment,
                period === "Month" && styles.activeSegment,
              ]}
              onPress={() => setPeriod("Month")}
            >
              <Text
                style={[
                  styles.segmentText,
                  period === "Month" && styles.activeSegmentText,
                ]}
              >
                Month
              </Text>
            </Pressable>
          </View>

          {/* Date Range */}
          <View style={styles.dateRange}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={colors.secondaryText}
            />

            <Text style={styles.dateRangeText}>1 Sep – 7 Sep</Text>
          </View>

          {/* Consistency Status */}
          <StatusCard />

          {/* Calorie Trend */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>CALORIE TREND</Text>

                <View style={styles.averageRow}>
                  <Text style={styles.averageNumber}>1,890</Text>

                  <Text style={styles.averageText}>daily avg</Text>
                </View>
              </View>
            </View>

            <CalorieTrendChart />
          </View>

          {/* Statistics */}
          <View style={styles.statsRow}>
            <ProgressStatCard
              title="GOAL ADHERENCE"
              value="5 / 7 days"
              subtitle="On Target"
              progress={71}
              progressLabel="71% adherence"
            />

            <ProgressStatCard
              title="CURRENT WEIGHT"
              value="59.0 kg"
              subtitle="-0.4 kg this week"
            />
          </View>

          {/* Macro Averages */}
          <View style={styles.macroSection}>
            <Text style={styles.sectionLabel}>MACRO AVERAGES</Text>

            <Text style={styles.macroSubtitle}>Weekly Target Balance</Text>

            <View style={styles.macroSpacing}>
              <MacroAverageCard />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 5,
    lineHeight: 19,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#EDEBE9",
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },

  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 9,
  },

  activeSegment: {
    backgroundColor: colors.white,
  },

  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  activeSegmentText: {
    color: colors.text,
  },

  dateRange: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 17,
  },

  dateRangeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
  },

  section: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
    marginTop: 17,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: colors.secondaryText,
  },

  averageRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
    gap: 7,
  },

  averageNumber: {
    fontSize: 29,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },

  averageText: {
    fontSize: 11,
    color: colors.secondaryText,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  macroSection: {
    marginTop: 27,
  },

  macroSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },

  macroSpacing: {
    marginTop: 13,
  },
});
