import { StyleSheet, View } from "react-native";
import { colors } from "../../../constants/colors";

export default function CameraFrame() {
  return (
    <View style={styles.container}>
      {/* Top-left corner */}
      <View style={[styles.corner, styles.topLeft]} />

      {/* Top-right corner */}
      <View style={[styles.corner, styles.topRight]} />

      {/* Bottom-left corner */}
      <View style={[styles.corner, styles.bottomLeft]} />

      {/* Bottom-right corner */}
      <View style={[styles.corner, styles.bottomRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "78%",
    height: "45%",
    alignSelf: "center",
    top: "23%",
  },

  corner: {
    position: "absolute",
    width: 34,
    height: 34,
    borderColor: colors.white,
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
});
