import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { colors } from "../../src/constants/colors";
import CameraFrame from "../../src/features/food/components/CameraFrame";
import CameraTip from "../../src/features/food/components/CameraTip";

export default function ScanScreen() {
  return (
    <View style={styles.screen}>
      {/* Mock camera preview */}
      <View style={styles.cameraPreview}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={25} color={colors.white} />
            </Pressable>

            <Text style={styles.title}>Scan your food</Text>

            <Pressable style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="flash-outline" size={22} color={colors.white} />
            </Pressable>
          </View>

          {/* Camera scanning frame */}
          <CameraFrame />

          {/* Instruction */}
          <View style={styles.instruction}>
            <Text style={styles.instructionTitle}>Capture your meal</Text>

            <CameraTip />
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            {/* Gallery */}
            <Pressable style={styles.sideButton} onPress={() => {}}>
              <Ionicons name="images-outline" size={24} color={colors.white} />

              <Text style={styles.sideButtonText}>Gallery</Text>
            </Pressable>

            {/* Capture */}
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
              ]}
              onPress={() => {
                router.push("/main/segmentation-review");
              }}
            >
              <View style={styles.captureInner} pointerEvents="none" />
            </Pressable>

            {/* Placeholder */}
            <View style={styles.sideButton}>
              <View style={styles.sideButtonPlaceholder} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#111111",
  },

  /*
   * Temporary visual camera preview.
   * Later this View will be replaced with CameraView.
   */
  cameraPreview: {
    flex: 1,
    backgroundColor: "#292929",
  },

  safeArea: {
    flex: 1,
  },

  header: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.white,
  },

  instruction: {
    position: "absolute",
    top: "68%",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  instructionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 8,
  },

  bottomControls: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    height: 92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    zIndex: 10,
  },

  sideButton: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  sideButtonText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 6,
    opacity: 0.9,
  },

  sideButtonPlaceholder: {
    width: 44,
    height: 44,
  },

  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.35)",
  },

  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "#222222",
  },
});
