import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="warning-outline" size={17} color={colors.error} />

      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -7,
    marginBottom: 17,
    paddingLeft: 2,
  },

  text: {
    marginLeft: 7,
    fontSize: 13,
    color: colors.error,
  },
});
