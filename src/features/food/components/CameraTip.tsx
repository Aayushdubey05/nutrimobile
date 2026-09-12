import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

export default function CameraTip() {
  return (
    <View style={styles.container}>
      <Ionicons
        name="information-circle-outline"
        size={18}
        color={colors.white}
      />

      <Text style={styles.text}>
        Place the food inside the frame for a better analysis
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  text: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    marginLeft: 7,
    opacity: 0.9,
  },
});
