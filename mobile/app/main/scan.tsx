import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, type FlashMode } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../src/constants/colors";
import CameraFrame from "../../src/features/food/components/CameraFrame";
import CameraTip from "../../src/features/food/components/CameraTip";
import { analysisService } from "../../src/features/analysis/services/analysisService";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<FlashMode>("off");
  const [cameraReady, setCameraReady] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  /** Uploads the image and moves on to the review screen. */
  const analyze = async (
    uri: string,
    mimeType?: string | null,
    fileName?: string | null,
  ) => {
    try {
      setLoading(true);

      const analysis = await analysisService.analyzeImage(
        uri,
        mimeType ?? "image/jpeg",
        fileName ?? "meal.jpg",
      );

      router.push({
        pathname: "/main/segmentation-review",
        params: {
          analysisId: String(analysis.id),
          // The stored image is served from an authenticated endpoint, so show the
          // local file we just captured instead of re-fetching it.
          imageUri: uri,
        },
      });
    } catch (error: any) {
      console.error("Analysis failed:", error);

      Alert.alert(
        "Analysis failed",
        error?.response?.data?.message ||
          error?.message ||
          "Unable to analyze the food image.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    if (loading || !cameraReady) {
      return;
    }

    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
      });

      if (!photo?.uri) {
        throw new Error("Could not capture the photo.");
      }

      await analyze(photo.uri, "image/jpeg", "meal.jpg");
    } catch (error: any) {
      console.error("Capture failed:", error);

      Alert.alert("Capture failed", error?.message || "Unable to take a photo.");
    }
  };

  const handlePickFromGallery = async () => {
    if (loading) {
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        return;
      }

      await analyze(asset.uri, asset.mimeType, asset.fileName);
    } catch (error: any) {
      console.error("Gallery pick failed:", error);

      Alert.alert(
        "Could not open gallery",
        error?.message || "Unable to select an image.",
      );
    }
  };

  // Permissions are still loading.
  if (!permission) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  // Camera access not granted yet - ask for it instead of showing a dead screen.
  if (!permission.granted) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <Ionicons name="camera-outline" size={56} color={colors.white} />

          <Text style={styles.permissionTitle}>Camera access needed</Text>

          <Text style={styles.permissionText}>
            NutriVision uses your camera to scan meals and estimate their
            nutrition.
          </Text>

          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant access</Text>
          </Pressable>

          <Pressable style={styles.permissionSecondary} onPress={handlePickFromGallery}>
            <Text style={styles.permissionSecondaryText}>
              Choose from gallery instead
            </Text>
          </Pressable>

          <Pressable style={styles.permissionSecondary} onPress={() => router.back()}>
            <Text style={styles.permissionSecondaryText}>Go back</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.cameraPreview}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flash}
          onCameraReady={() => setCameraReady(true)}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.iconButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons name="chevron-back" size={25} color={colors.white} />
            </Pressable>

            <Text style={styles.title}>Scan your food</Text>

            <Pressable
              style={styles.iconButton}
              onPress={() => setFlash((current) => (current === "off" ? "on" : "off"))}
              disabled={loading}
            >
              <Ionicons
                name={flash === "on" ? "flash" : "flash-outline"}
                size={22}
                color={colors.white}
              />
            </Pressable>
          </View>

          {/* Camera scanning frame */}
          <CameraFrame />

          {/* Instruction */}
          <View style={styles.instruction}>
            <Text style={styles.instructionTitle}>
              {loading ? "Analyzing your meal..." : "Capture your meal"}
            </Text>

            {loading ? (
              <ActivityIndicator color={colors.white} style={styles.spinner} />
            ) : (
              <CameraTip />
            )}
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            {/* Gallery */}
            <Pressable
              style={styles.sideButton}
              onPress={handlePickFromGallery}
              disabled={loading}
            >
              <Ionicons name="images-outline" size={24} color={colors.white} />

              <Text style={styles.sideButtonText}>Gallery</Text>
            </Pressable>

            {/* Capture */}
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                pressed && !loading && styles.capturePressed,
                (loading || !cameraReady) && styles.captureDisabled,
              ]}
              onPress={handleCapture}
              disabled={loading || !cameraReady}
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

  centered: {
    alignItems: "center",
    justifyContent: "center",
  },

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

  spinner: {
    marginTop: 4,
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

  capturePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },

  captureDisabled: {
    opacity: 0.6,
  },

  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    marginTop: 18,
  },

  permissionText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  permissionButton: {
    marginTop: 26,
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 14,
    // Light pill on the dark camera screen; colors.primary is near-black here.
    backgroundColor: colors.white,
  },

  permissionButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  permissionSecondary: {
    marginTop: 16,
  },

  permissionSecondaryText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
});
