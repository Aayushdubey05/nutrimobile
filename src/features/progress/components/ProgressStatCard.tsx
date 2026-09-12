import { colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

interface ProgressStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  progress?: number;
  progressLabel?: string;
}

export default function ProgressStatCard({
  title,
  value,
  subtitle,
  progress,
  progressLabel,
}: ProgressStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>

      {progress !== undefined && (
        <>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressLabel}>{progressLabel}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 15,
    minHeight: 135,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
    color: colors.secondaryText,
    marginBottom: 10,
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },

  subtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
  },

  progressBackground: {
    height: 5,
    backgroundColor: "#EDEDED",
    borderRadius: 5,
    marginTop: 14,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  progressLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.secondaryText,
    marginTop: 7,
  },
});
