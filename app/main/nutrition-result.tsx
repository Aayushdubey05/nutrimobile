import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import Button from "../../src/components/Button";
import { colors } from "../../src/constants/colors";
import NutritionMacroCard from "../../src/features/nutrition/components/NutritionMacroCard";
import PortionSizeCard from "../../src/features/nutrition/components/PortionSizeCard";

const FOOD_IMAGE_URL =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85";

export default function NutritionResultScreen() {
  const [foodName, setFoodName] = useState("Paneer Butter Masala");

  const [editingName, setEditingName] = useState(false);

  const [saved, setSaved] = useState(false);

  const [portion, setPortion] = useState(250);

  const [selectedPreset, setSelectedPreset] = useState(250);

  const [showEstimation, setShowEstimation] = useState(false);

  const handleDecrease = () => {
    setPortion((current) => Math.max(50, current - 50));

    setSelectedPreset(0);
  };

  const handleIncrease = () => {
    setPortion((current) => Math.min(1000, current + 50));

    setSelectedPreset(0);
  };

  const handlePresetSelect = (value: number) => {
    setPortion(value);
    setSelectedPreset(value);
  };

  const handleSaveToLog = () => {
    // UI-only for now.
    // Later this will call the backend.
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={23} color={colors.text} />
          </Pressable>

          <Pressable
            style={styles.headerButton}
            onPress={() => setSaved((current) => !current)}
            hitSlop={8}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={21}
              color={colors.text}
            />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Food Image */}
          <Image
            source={{ uri: FOOD_IMAGE_URL }}
            style={styles.foodImage}
            resizeMode="cover"
          />

          {/* Status Pills */}
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Ionicons name="sparkles-outline" size={14} color={colors.text} />

              <Text style={styles.pillText}>Recognition confidence: 92%</Text>
            </View>

            <View style={styles.pill}>
              <Ionicons name="leaf-outline" size={14} color={colors.text} />

              <Text style={styles.pillText}>100% Vegetarian</Text>
            </View>
          </View>

          {/* Food Name */}
          <View style={styles.foodNameRow}>
            {editingName ? (
              <TextInput
                value={foodName}
                onChangeText={setFoodName}
                autoFocus
                style={styles.foodNameInput}
                onBlur={() => setEditingName(false)}
                onSubmitEditing={() => setEditingName(false)}
                returnKeyType="done"
              />
            ) : (
              <Text style={styles.foodName}>{foodName}</Text>
            )}

            <Pressable
              onPress={() => setEditingName((current) => !current)}
              hitSlop={10}
              style={styles.editButton}
            >
              <Ionicons name="pencil-outline" size={18} color={colors.icon} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Served with whole wheat roti · North Indian
          </Text>

          {/* Nutrition Summary */}
          <View style={styles.nutritionCard}>
            <View style={styles.calorieSection}>
              <Text style={styles.calorieValue}>620 kcal</Text>

              <Text style={styles.calorieLabel}>Estimated Energy</Text>
            </View>

            <View style={styles.goalSection}>
              <Text style={styles.goalValue}>31% of daily goal</Text>

              <Text style={styles.goalLabel}>Target: 2,000 kcal / day</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.macrosRow}>
              <NutritionMacroCard
                label="Protein"
                value="28g"
                progress={0.7}
                indicatorColor="#4A90E2"
              />

              <NutritionMacroCard
                label="Carbs"
                value="42g"
                progress={0.58}
                indicatorColor="#63A66A"
              />

              <NutritionMacroCard
                label="Fat"
                value="36g"
                progress={0.51}
                indicatorColor="#D9A441"
              />
            </View>
          </View>

          {/* Portion */}
          <View style={styles.portionSection}>
            <PortionSizeCard
              portion={portion}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
              selectedPreset={selectedPreset}
              onPresetSelect={handlePresetSelect}
            />
          </View>

          {/* Estimation Explanation */}
          <Pressable
            style={styles.explanationHeader}
            onPress={() => setShowEstimation((current) => !current)}
          >
            <View style={styles.explanationTitleRow}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={colors.secondaryText}
              />

              <Text style={styles.explanationTitle}>
                How was this estimated?
              </Text>
            </View>

            <Ionicons
              name={showEstimation ? "chevron-up" : "chevron-down"}
              size={19}
              color={colors.secondaryText}
            />
          </Pressable>

          {showEstimation && (
            <View style={styles.explanationBody}>
              <Text style={styles.explanationText}>
                Calculated using 3D depth estimation and Indian food composition
                data.
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button title="✓  Add to Daily Log" onPress={handleSaveToLog} />

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push("/main/scan")}
            >
              <Text style={styles.secondaryButtonText}>
                Update Ingredients or Retake
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
  },

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 50,
  },

  foodImage: {
    width: "100%",
    height: 270,
    borderRadius: 22,
    backgroundColor: "#DDD8D2",
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  pill: {
    minHeight: 32,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  pillText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.text,
  },

  foodNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  foodName: {
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.text,
  },

  foodNameInput: {
    flex: 1,
    minHeight: 42,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    fontSize: 27,
    fontWeight: "700",
    color: colors.text,
    paddingVertical: 2,
  },

  editButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondaryText,
    marginTop: 6,
  },

  nutritionCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    marginTop: 22,
  },

  calorieSection: {
    flex: 1,
  },

  calorieValue: {
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "700",
    color: colors.text,
  },

  calorieLabel: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 3,
  },

  goalSection: {
    marginTop: 18,
  },

  goalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  goalLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },

  macrosRow: {
    flexDirection: "row",
    gap: 8,
  },

  portionSection: {
    marginTop: 16,
  },

  explanationHeader: {
    minHeight: 52,
    marginTop: 18,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  explanationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  explanationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondaryText,
  },

  explanationBody: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 4,
  },

  explanationText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.secondaryText,
  },

  actions: {
    marginTop: 12,
  },

  secondaryButton: {
    height: 56,
    width: "100%",
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
});
