import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SectionHeader from "../../src/components/SectionHeader";
import { colors } from "../../src/constants/colors";
import CalorieCard from "../../src/features/home/components/CalorieCard";
import FoodSummaryCard from "../../src/features/home/components/FoodSummaryCard";
import QuickAction from "../../src/features/home/components/QuickAction";

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>

            <Text style={styles.userName}>Ritesh</Text>
          </View>

          <Pressable style={styles.profileButton}>
            <Ionicons name="person-outline" size={21} color={colors.text} />
          </Pressable>
        </View>

        {/* Today's Overview */}
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Today's overview</Text>

          <Text style={styles.date}>Today</Text>
        </View>

        {/* Calories */}
        <CalorieCard consumed={1240} target={2200} />

        {/* Quick Actions */}
        <SectionHeader title="Quick actions" />

        <View style={styles.quickActions}>
          <QuickAction
            icon="camera-outline"
            title="Scan food"
            subtitle="Analyze a meal"
            onPress={() => router.push("/main/scan")}
          />

          <QuickAction
            icon="add-outline"
            title="Add meal"
            subtitle="Log food manually"
            onPress={() => {}}
          />

          <QuickAction
            icon="analytics-outline"
            title="Nutrition"
            subtitle="View your progress"
            onPress={() => {}}
          />

          <QuickAction
            icon="bulb-outline"
            title="Recommendations"
            subtitle="Personalized tips"
            onPress={() => {}}
          />
        </View>

        {/* Recent Meals */}
        <SectionHeader
          title="Recent meals"
          action="View all"
          onActionPress={() => {}}
        />

        <FoodSummaryCard
          name="Paneer Butter Masala"
          calories={420}
          protein={18}
          time="12:45 PM"
        />

        <FoodSummaryCard
          name="Vegetable Biryani"
          calories={380}
          protein={10}
          time="9:10 AM"
        />

        {/* Daily Nutrition */}
        <SectionHeader title="Daily nutrition" />

        <View style={styles.nutritionCard}>
          <NutritionItem label="Protein" value="62g" target="120g" />

          <NutritionItem label="Carbs" value="145g" target="250g" />

          <NutritionItem label="Fat" value="38g" target="70g" />
        </View>
      </ScrollView>
    </View>
  );
}

interface NutritionItemProps {
  label: string;
  value: string;
  target: string;
}

function NutritionItem({ label, value, target }: NutritionItemProps) {
  return (
    <View style={styles.nutritionItem}>
      <Text style={styles.nutritionLabel}>{label}</Text>

      <Text style={styles.nutritionValue}>{value}</Text>

      <Text style={styles.nutritionTarget}>/ {target}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  greeting: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 3,
  },

  userName: {
    fontSize: 27,
    fontWeight: "700",
    color: colors.text,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  overviewTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  date: {
    fontSize: 13,
    color: colors.secondaryText,
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  nutritionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  nutritionItem: {
    alignItems: "center",
    flex: 1,
  },

  nutritionLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 7,
  },

  nutritionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  nutritionTarget: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },
});
