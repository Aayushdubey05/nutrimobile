import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../constants/colors";

export default function SegmentationPreview() {
  return (
    <View style={styles.container}>
      {/* Mock food image */}
      <View style={styles.foodArea}>
        {/* Mock food objects */}
        <View style={[styles.foodShape, styles.paneer]}>
          <Text style={styles.label}>Paneer</Text>
        </View>

        <View style={[styles.foodShape, styles.rice]}>
          <Text style={styles.label}>Rice</Text>
        </View>

        <View style={[styles.foodShape, styles.salad]}>
          <Text style={styles.label}>Salad</Text>
        </View>
      </View>

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>3 foods detected</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#D8D3CD",
    marginBottom: 24,
  },

  foodArea: {
    flex: 1,
    position: "relative",
  },

  foodShape: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  paneer: {
    width: 135,
    height: 105,
    left: 30,
    top: 45,
    backgroundColor: "#B9A78C",
  },

  rice: {
    width: 145,
    height: 115,
    right: 25,
    top: 30,
    backgroundColor: "#E5DDD0",
  },

  salad: {
    width: 105,
    height: 85,
    left: 125,
    bottom: 25,
    backgroundColor: "#9C9E82",
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  overlay: {
    position: "absolute",
    left: 14,
    bottom: 14,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  overlayText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.white,
  },
});
