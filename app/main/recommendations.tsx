import { Ionicons } from "@expo/vector-icons";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import { colors } from "@/constants/colors";
import ConsistencyCard from "@/features/recommendations/components/ConsistencyCard";
import NutritionStatusCard from "@/features/recommendations/components/NutritionStatusCard";
import RecommendationCard from "@/features/recommendations/components/RecommendationCard";

export default function RecommendationsScreen() {
  const handleRefresh = () => {
    Alert.alert(
      "Recommendations Updated",
      "Your latest nutrition insights are ready.",
    );
  };

  const handleAddToLog = (food: string) => {
    Alert.alert("Add to Log", `${food} will be added to your meal log.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Recommendations</Text>

            <Text style={styles.subtitle}>
              Suggestions based on your nutrition today
            </Text>
          </View>

          <Pressable style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh-outline" size={20} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Nutrition Summary */}
          <NutritionStatusCard consumed={1240} target={2000} remaining={760} />

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Insights & Advice</Text>

            <Text style={styles.updatedText}>Updated 10m ago</Text>
          </View>

          {/* Recommendation 1 */}
          <RecommendationCard
            category="Protein Focus"
            categoryColor="#2563EB"
            title="Add more protein"
            description="You're 38g below your protein goal today. Consider adding high-protein options like Paneer, Dal, or grilled tofu to your dinner."
            recommendation="Recommended: Paneer Tikka / Dal Tadka"
            showAddToLog
            onAddToLog={() => handleAddToLog("Paneer Tikka / Dal Tadka")}
          />

          {/* Recommendation 2 */}
          <RecommendationCard
            category="Micronutrients & Fiber"
            categoryColor="#2E7D32"
            title="Balance your meal"
            description="Try adding vegetables to your next meal. You're slightly low on key dietary fiber and micronutrients."
            recommendation="Mixed Vegetable Sabzi or Fresh Salad"
            showAddToLog
            onAddToLog={() =>
              handleAddToLog("Mixed Vegetable Sabzi or Fresh Salad")
            }
          />

          {/* Recommendation 3 */}
          <RecommendationCard
            category="Calorie Budget"
            categoryColor="#C58A00"
            title="Watch your calories"
            description="You have 760 kcal remaining. Opt for lighter cooking methods or smaller portions for your evening snack."
          />

          {/* Consistency */}
          <ConsistencyCard />

          {/* Footer message */}
          <View style={styles.footerMessage}>
            <Text style={styles.footerTitle}>All caught up?</Text>

            <Text style={styles.footerText}>
              Your recommendations refresh automatically as you log new meals
              throughout the day.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
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

  updatedText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
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
