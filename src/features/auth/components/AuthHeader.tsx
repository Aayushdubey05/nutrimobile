import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../constants/colors";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NutriVision-3D</Text>

      <View style={styles.headingContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.subtitle}>{subtitle}</Text>
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
    marginBottom: 58,
  },

  headingContainer: {
    marginBottom: 28,
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
    maxWidth: 320,
  },
});
