import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../src/constants/colors";
import FoodDetectionCard from "../../src/features/food/components/FoodDetectionCard";
import SegmentationPreview, {
  INITIAL_SEGMENTS,
  SegmentItem,
} from "../../src/features/food/components/SegmentationPreview";
import { analysisService } from "../../src/features/analysis/services/analysisService";
import type { FoodAnalysisResponse } from "../../src/features/analysis/types";

export default function SegmentationReviewScreen() {
  const { analysisId } = useLocalSearchParams<{
    analysisId?: string;
  }>();

  const [analysis, setAnalysis] = useState<FoodAnalysisResponse | null>(null);

  const [segments, setSegments] = useState<SegmentItem[]>(INITIAL_SEGMENTS);

  const [confirmedIds, setConfirmedIds] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [analysisId]);

  const loadAnalysis = async () => {
    if (!analysisId) {
      Alert.alert("Analysis missing", "No analysis ID was provided.", [
        {
          text: "Go Back",
          onPress: () => router.back(),
        },
      ]);

      return;
    }

    try {
      setLoading(true);

      const data = await analysisService.getAnalysis(Number(analysisId));

      setAnalysis(data);

      const backendSegments: SegmentItem[] = data.items.map((item, index) => ({
        id: String(item.id),
        name: item.finalFoodName || item.detectedName,
        weight: `~${Math.round(Number(item.finalWeightG))}g`,
        description: `${Math.round(Number(item.confidence) * 100)}% confidence`,
        color: getSegmentColor(index),
        maskColor: getSegmentMaskColor(index),
        bgColor: getSegmentBackgroundColor(index),
        position: getSegmentPosition(index),
      }));

      setSegments(backendSegments);

      const initialConfirmed: Record<string, boolean> = {};

      data.items.forEach((item) => {
        initialConfirmed[String(item.id)] = true;
      });

      setConfirmedIds(initialConfirmed);
    } catch (error: any) {
      console.error("Failed to load analysis:", error);

      Alert.alert(
        "Unable to load analysis",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
        [
          {
            text: "Go Back",
            onPress: () => router.back(),
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConfirm = (id: string) => {
    setConfirmedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemoveSegment = (id: string) => {
    setSegments((prev) => prev.filter((segment) => segment.id !== id));
  };

  const handleAddItem = () => {
    router.push("/main/manual-entry");
  };

  const handleMergeSegments = () => {
    Alert.alert(
      "Merge Segments",
      "Select segments to merge into a single portion.",
      [{ text: "OK" }],
    );
  };

  const handleContinue = () => {
    if (!analysis) {
      return;
    }

    router.push({
      pathname: "/main/nutrition-result",
      params: {
        analysisId: String(analysis.id),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={styles.loadingText}>Loading food analysis...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>

          <Text style={styles.stepText}>STEP 2 OF 3</Text>

          <Pressable
            style={({ pressed }) => [
              styles.addItemButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleAddItem}
          >
            <Ionicons name="add" size={16} color={colors.text} />
            <Text style={styles.addItemText}>Add Item</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.intro}>
            <Text style={styles.title}>Review your food</Text>

            <Text style={styles.subtitle}>
              We detected these food items. Check before continuing.
            </Text>
          </View>

          {segments.length > 0 ? (
            <>
              <SegmentationPreview
                items={segments}
                imageUri={analysis?.imageUrl}
              />

              <View style={styles.portionsHeader}>
                <Text style={styles.portionsTitle}>
                  DETECTED PORTIONS ({segments.length})
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.mergeButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleMergeSegments}
                >
                  <Ionicons
                    name="git-merge-outline"
                    size={14}
                    color="#6B7280"
                    style={{ marginRight: 4 }}
                  />

                  <Text style={styles.mergeText}>Merge Segments</Text>
                </Pressable>
              </View>

              <View style={styles.cardsList}>
                {segments.map((item) => (
                  <FoodDetectionCard
                    key={item.id}
                    name={item.name}
                    weight={item.weight}
                    description={item.description}
                    color={item.color}
                    isConfirmed={confirmedIds[item.id] !== false}
                    onToggleConfirm={() => handleToggleConfirm(item.id)}
                    onRemove={() => handleRemoveSegment(item.id)}
                  />
                ))}
              </View>

              <View style={styles.fallbackCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fallbackTitle}>
                    We couldn't detect separate food items?
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.fallbackActionButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleAddItem}
                >
                  <Text style={styles.fallbackActionText}>
                    Enter food manually
                  </Text>
                </Pressable>
              </View>

              <View style={styles.bottomButtonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleContinue}
                >
                  <Text style={styles.primaryButtonText}>
                    Looks good, Continue →
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconBadge}>
                <Ionicons name="search-outline" size={32} color="#737373" />
              </View>

              <Text style={styles.emptyTitle}>No food items found</Text>

              <Text style={styles.emptySubtitle}>
                Try another photo or enter food manually.
              </Text>

              <View style={styles.emptyActionsRow}>
                <Pressable
                  style={styles.emptySecondaryButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.emptySecondaryText}>
                    Try Another Photo
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.emptyPrimaryButton}
                  onPress={handleAddItem}
                >
                  <Text style={styles.emptyPrimaryText}>Enter Manually</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/*
 * Temporary visual helpers.
 *
 * Backend currently does not return segmentation coordinates/colors.
 * These are only used to preserve your current UI.
 */

function getSegmentColor(index: number): string {
  const colorsList = ["#EF4444", "#F59E0B", "#EAB308", "#3B82F6", "#10B981"];

  return colorsList[index % colorsList.length];
}

function getSegmentMaskColor(index: number): string {
  const colorsList = [
    "rgba(239, 68, 68, 0.35)",
    "rgba(245, 158, 11, 0.35)",
    "rgba(234, 179, 8, 0.35)",
    "rgba(59, 130, 246, 0.35)",
    "rgba(16, 185, 129, 0.35)",
  ];

  return colorsList[index % colorsList.length];
}

function getSegmentBackgroundColor(index: number): string {
  const colorsList = ["#FEF2F2", "#FFFBEB", "#FEFCE8", "#EFF6FF", "#ECFDF5"];

  return colorsList[index % colorsList.length];
}

function getSegmentPosition(index: number): SegmentItem["position"] {
  const positions: SegmentItem["position"][] = [
    {
      top: "14%",
      left: "10%",
      width: "36%",
      height: "36%",
      borderRadius: 45,
    },
    {
      top: "12%",
      right: "10%",
      width: "38%",
      height: "36%",
      borderRadius: 50,
    },
    {
      bottom: "12%",
      left: "8%",
      width: "32%",
      height: "34%",
      borderRadius: 40,
    },
    {
      bottom: "14%",
      left: "38%",
      width: "32%",
      height: "34%",
      borderRadius: 40,
    },
    {
      bottom: "16%",
      right: "6%",
      width: "24%",
      height: "30%",
      borderRadius: 35,
    },
  ];

  return positions[index % positions.length];
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.secondaryText,
  },

  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  stepText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
  },

  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  addItemText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 3,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  intro: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.4,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.secondaryText,
  },

  portionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  portionsTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#737373",
  },

  mergeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  mergeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  cardsList: {
    marginBottom: 16,
  },

  fallbackCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  fallbackTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 18,
  },

  fallbackActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginLeft: 10,
  },

  fallbackActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },

  bottomButtonContainer: {
    marginTop: 4,
  },

  primaryButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.2,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 20,
  },

  emptyActionsRow: {
    flexDirection: "row",
    gap: 12,
  },

  emptySecondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },

  emptySecondaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },

  emptyPrimaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#171717",
  },

  emptyPrimaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.white,
  },
});
