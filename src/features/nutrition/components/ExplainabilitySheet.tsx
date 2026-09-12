import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "../../../constants/colors";
import ExplanationCard from "./ExplanationCard";

interface ExplainabilitySheetProps {
  visible: boolean;
  onClose: () => void;
}

const FOOD_IMAGE_URL =
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85";

export default function ExplainabilitySheet({
  visible,
  onClose,
}: ExplainabilitySheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Dimmed background */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Bottom Sheet */}
        <SafeAreaView style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            bounces={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>How was this estimated?</Text>

              <Pressable
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={8}
              >
                <Ionicons name="close" size={19} color={colors.text} />
              </Pressable>
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              The highlighted areas help identify the food and calculate
              accurate portion size.
            </Text>

            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: FOOD_IMAGE_URL }}
                style={styles.image}
                resizeMode="cover"
              />

              {/* Detection Highlight: Paneer */}
              <View style={styles.paneerHighlight}>
                <View style={styles.highlightDot} />
              </View>

              {/* Detection Highlight: Roti */}
              <View style={styles.rotiHighlight}>
                <View style={styles.highlightDot} />
              </View>

              {/* Image labels */}
              <View style={[styles.imageLabel, styles.paneerLabel]}>
                <Text style={styles.imageLabelText}>
                  Paneer & Makhani gravy
                </Text>
              </View>

              <View style={[styles.imageLabel, styles.rotiLabel]}>
                <Text style={styles.imageLabelText}>Whole wheat roti</Text>
              </View>
            </View>

            {/* Confidence */}
            <View style={styles.confidenceCard}>
              <View>
                <Text style={styles.confidenceLabel}>
                  Recognition confidence
                </Text>

                <Text style={styles.confidenceSubtext}>
                  Based on visual food recognition
                </Text>
              </View>

              <Text style={styles.confidenceValue}>92%</Text>
            </View>

            {/* Explanation Cards */}
            <View style={styles.explanations}>
              <ExplanationCard
                icon="scan-outline"
                title="Visual Detection"
                description="Identified Paneer Butter Masala and Whole Wheat Roti from visual surface texture and colors."
              />

              <ExplanationCard
                icon="cube-outline"
                title="Volume & Portion"
                description="3D depth analysis estimated a standard serving based on detected portion size and bowl/plate dimensions."
              />

              <ExplanationCard
                icon="nutrition-outline"
                title="Nutrition Lookup"
                description="Matched against verified Indian food composition reference data."
              />
            </View>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              Nutrition values are estimates based on the identified food items
              and detected portion volume.
            </Text>

            {/* Close */}
            <Pressable
              style={({ pressed }) => [
                styles.gotItButton,
                pressed && styles.pressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.gotItText}>Got it</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  sheet: {
    height: "68%",
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "700",
    color: colors.text,
    paddingRight: 12,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.secondaryText,
    marginTop: 7,
    marginBottom: 16,
  },

  imageContainer: {
    height: 190,
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#DDD8D2",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  /*
   * These are UI-only mock detection regions.
   * Later replace them with actual AI segmentation coordinates.
   */

  paneerHighlight: {
    position: "absolute",
    left: "15%",
    top: "27%",
    width: "43%",
    height: "42%",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 18,
  },

  rotiHighlight: {
    position: "absolute",
    right: "12%",
    bottom: "18%",
    width: "42%",
    height: "34%",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 50,
  },

  highlightDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.white,
    top: -4,
    left: -4,
  },

  imageLabel: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  paneerLabel: {
    left: 12,
    bottom: 12,
  },

  rotiLabel: {
    right: 12,
    top: 12,
  },

  imageLabelText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.white,
  },

  confidenceCard: {
    minHeight: 66,
    backgroundColor: "#EEF8F0",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  confidenceLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },

  confidenceSubtext: {
    fontSize: 10.5,
    color: colors.secondaryText,
    marginTop: 3,
  },

  confidenceValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#397A45",
  },

  explanations: {
    marginTop: 14,
  },

  disclaimer: {
    fontSize: 10.5,
    lineHeight: 16,
    color: colors.placeholder,
    marginTop: 8,
    marginBottom: 12,
  },

  gotItButton: {
    height: 52,
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  gotItText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primaryText,
  },

  pressed: {
    opacity: 0.82,
  },
});
