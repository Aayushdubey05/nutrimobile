import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "../../src/components/Button";
import { colors } from "../../src/constants/colors";
import FoodDetectionCard from "../../src/features/food/components/FoodDetectionCard";
import SegmentationPreview from "../../src/features/food/components/SegmentationPreview";

export default function SegmentationReviewScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={styles.headerTitle}>Review your food</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Intro */}
          <View style={styles.intro}>
            <Text style={styles.title}>Detected food</Text>

            <Text style={styles.subtitle}>
              Review the detected items before continuing with nutrition
              analysis.
            </Text>
          </View>

          {/* Image / segmentation */}
          <SegmentationPreview />

          {/* Detected items */}
          <Text style={styles.sectionTitle}>Detected items</Text>

          <FoodDetectionCard
            icon="restaurant-outline"
            name="Paneer curry"
            description="Detected food"
          />

          <FoodDetectionCard
            icon="restaurant-outline"
            name="Jeera rice"
            description="Detected food"
          />

          <FoodDetectionCard
            icon="leaf-outline"
            name="Mixed salad"
            description="Detected food"
          />

          {/* Continue */}
          <View style={styles.buttonContainer}>
            <Button
              title="Continue analysis"
              onPress={() => router.push("/main/nutrition-result")}
              // onPress={() => {}}
            />
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

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
  },

  headerPlaceholder: {
    width: 42,
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
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.secondaryText,
    maxWidth: 340,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 14,
  },

  buttonContainer: {
    marginTop: 14,
  },
});
