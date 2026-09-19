import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  nutritionService,
  type DailyNutritionResponse,
} from "@/features/nutrition/services/nutritionService";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";

import BottomNav from "@/components/BottomNav";
import { colors } from "@/constants/colors";
import NutritionStatusCard from "@/features/recommendations/components/NutritionStatusCard";
import RecommendationCard from "@/features/recommendations/components/RecommendationCard";
import { recommendationService } from "@/features/recommendations/services/recommendationService";
import type {
  Recommendation,
  RecommendationFeedbackType,
} from "@/features/recommendations/types";

const CATEGORY_CONFIG: Record<
  Recommendation["category"],
  { label: string; color: string }
> = {
  CALORIES: {
    label: "Calorie Focus",
    color: "#C58A00",
  },
  PROTEIN: {
    label: "Protein Focus",
    color: "#2563EB",
  },
  CARBOHYDRATES: {
    label: "Carbohydrates",
    color: "#8B5CF6",
  },
  FAT: {
    label: "Healthy Fats",
    color: "#D97706",
  },
  MEAL_TIMING: {
    label: "Meal Timing",
    color: "#0891B2",
  },
  FOOD_CHOICE: {
    label: "Food Choice",
    color: "#2E7D32",
  },
  HYDRATION: {
    label: "Hydration",
    color: "#0284C7",
  },
  GENERAL_HEALTH: {
    label: "General Health",
    color: "#2E7D32",
  },
  FITNESS: {
    label: "Fitness",
    color: "#DC2626",
  },
};

export default function RecommendationsScreen() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyNutrition, setDailyNutrition] =
    useState<DailyNutritionResponse | null>(null);

  const loadRecommendations = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [recommendationsData, nutritionData] = await Promise.all([
        recommendationService.getActiveRecommendations(),
        nutritionService.getDailyNutrition(today),
      ]);

      setRecommendations(recommendationsData);
      setDailyNutrition(nutritionData);
    } catch (error) {
      Alert.alert(
        "Unable to load recommendations",
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const today = new Date().toISOString().split("T")[0];

      const [generated, nutritionData] = await Promise.all([
        recommendationService.generateRecommendations(),
        nutritionService.getDailyNutrition(today),
      ]);

      setRecommendations(generated);
      setDailyNutrition(nutritionData);
    } catch (error) {
      Alert.alert(
        "Unable to update recommendations",
        error instanceof Error ? error.message : "Something went wrong.",
      );

      setRefreshing(false);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFeedback = async (
    recommendationId: number,
    feedback: RecommendationFeedbackType,
  ) => {
    try {
      await recommendationService.addFeedback(recommendationId, feedback);

      setRecommendations((current) =>
        current.map((recommendation) =>
          recommendation.id === recommendationId
            ? { ...recommendation, feedback }
            : recommendation,
        ),
      );
    } catch (error) {
      Alert.alert(
        "Feedback failed",
        error instanceof Error ? error.message : "Unable to save feedback.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Recommendations</Text>

            <Text style={styles.subtitle}>
              Suggestions based on your nutrition today
            </Text>
          </View>

          <Pressable
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Ionicons name="refresh-outline" size={20} color={colors.text} />
            )}
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Temporary until DailyNutritionResponse is wired */}
          {dailyNutrition && (
            <NutritionStatusCard
              consumed={dailyNutrition.consumed.caloriesKcal}
              target={dailyNutrition.target.caloriesKcal}
              remaining={dailyNutrition.remaining.caloriesKcal}
            />
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Insights & Advice</Text>
          </View>

          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={styles.stateText}>Loading recommendations...</Text>
            </View>
          ) : recommendations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="sparkles-outline"
                size={28}
                color={colors.secondaryText}
              />

              <Text style={styles.emptyTitle}>No recommendations yet</Text>

              <Text style={styles.emptyText}>
                Log some meals and refresh to generate today's nutrition
                recommendations.
              </Text>
            </View>
          ) : (
            recommendations.map((recommendation) => {
              const config = CATEGORY_CONFIG[recommendation.category];

              return (
                <RecommendationCard
                  key={recommendation.id}
                  category={config.label}
                  categoryColor={config.color}
                  title={recommendation.title}
                  description={recommendation.description}
                  reason={recommendation.reason}
                  feedback={recommendation.feedback}
                  onFeedback={(feedback) =>
                    handleFeedback(recommendation.id, feedback)
                  }
                />
              );
            })
          )}

          <View style={styles.footerMessage}>
            <Text style={styles.footerTitle}>All caught up?</Text>

            <Text style={styles.footerText}>
              Recommendations update as your nutrition and meals change.
            </Text>
          </View>
        </ScrollView>

        <BottomNav active={null} />
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
    paddingBottom: 16,
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

  refreshButton: {
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

  sectionHeader: {
    marginTop: 25,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  centerState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },

  stateText: {
    fontSize: 13,
    color: colors.secondaryText,
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 28,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 10,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
  },

  footerMessage: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 24,
  },

  footerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 5,
  },

  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.secondaryText,
    textAlign: "center",
  },
});
