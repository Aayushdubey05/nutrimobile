import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Button from "@/components/Button";
import { colors } from "@/constants/colors";
import { useOnboarding } from "@/features/profile/context/OnboardingContext";
import type {
  ActivityLevelType,
  FitnessGoalType,
} from "@/features/profile/types";

const goals: {
  label: string;
  value: FitnessGoalType;
}[] = [
  { label: "Weight Loss", value: "WEIGHT_LOSS" },
  { label: "Muscle Gain", value: "MUSCLE_GAIN" },
  {
    label: "Maintain Weight",
    value: "MAINTAIN_WEIGHT",
  },
  {
    label: "Body Recomposition",
    value: "BODY_RECOMPOSITION",
  },
  {
    label: "Healthy Weight Gain",
    value: "HEALTHY_WEIGHT_GAIN",
  },
  { label: "General Health", value: "GENERAL_HEALTH" },
  {
    label: "Athletic Performance",
    value: "ATHLETIC_PERFORMANCE",
  },
];

const activities: {
  label: string;
  value: ActivityLevelType;
}[] = [
  { label: "Sedentary", value: "SEDENTARY" },
  {
    label: "Lightly Active",
    value: "LIGHTLY_ACTIVE",
  },
  {
    label: "Moderately Active",
    value: "MODERATELY_ACTIVE",
  },
  { label: "Very Active", value: "VERY_ACTIVE" },
  { label: "Extra Active", value: "EXTRA_ACTIVE" },
];

export default function GoalsScreen() {
  const { data, updateData } = useOnboarding();

  const [goal, setGoal] = useState<FitnessGoalType | null>(data.fitnessGoal);

  const [activity, setActivity] = useState<ActivityLevelType | null>(
    data.activityLevel,
  );

  function handleNext() {
    if (!goal || !activity) {
      Alert.alert(
        "Incomplete Profile",
        "Please select your fitness goal and activity level.",
      );
      return;
    }

    updateData({
      fitnessGoal: goal,
      activityLevel: activity,
    });

    router.push("/onboarding/diet-health");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>STEP 2 OF 3</Text>

        <Text style={styles.title}>Your goals & activity</Text>

        <Text style={styles.subtitle}>
          Choose what you want to achieve and how active you are.
        </Text>

        <Text style={styles.label}>Fitness Goal</Text>

        <View style={styles.options}>
          {goals.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setGoal(item.value)}
              style={[
                styles.option,
                goal === item.value && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  goal === item.value && styles.selectedOptionText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Activity Level</Text>

        <View style={styles.options}>
          {activities.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setActivity(item.value)}
              style={[
                styles.option,
                activity === item.value && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  activity === item.value && styles.selectedOptionText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button title="Continue" onPress={handleNext} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 24,
    paddingBottom: 40,
  },

  step: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.secondaryText,
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    marginTop: 7,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
  },

  options: {
    gap: 8,
    marginBottom: 25,
  },

  option: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  selectedOption: {
    backgroundColor: "#E5F2E7",
    borderColor: "#9CC9A3",
  },

  optionText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },

  selectedOptionText: {
    color: "#2E7D32",
  },
});
