import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

export default function AuthHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NutriVision-3D</Text>

      <View style={styles.headingContainer}>
        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Log in to continue tracking your nutrition.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  logo: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 70,
  },

  headingContainer: {
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.secondaryText,
    maxWidth: 300,
  },
});
