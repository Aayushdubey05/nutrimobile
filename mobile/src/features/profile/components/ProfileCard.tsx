import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProfileCardProps {
  name: string;
  email: string;
  dietaryRestrictions: string[];
  onEditProfile?: () => void;
}

export default function ProfileCard({
  name,
  email,
  dietaryRestrictions,
  onEditProfile,
}: ProfileCardProps) {
  const initial = name?.trim().charAt(0).toUpperCase() || "?";

  const dietaryLabel =
    dietaryRestrictions.length === 0
      ? "No dietary restriction"
      : dietaryRestrictions.length === 1
        ? dietaryRestrictions[0]
        : `${dietaryRestrictions.length} dietary preferences`;

  return (
    <View style={styles.card}>
      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{dietaryLabel}</Text>
            </View>
          </View>

          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Pressable style={styles.editButton} onPress={onEditProfile}>
        <Ionicons name="create-outline" size={17} color={colors.text} />

        <Text style={styles.editText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 18,
  },

  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#E8F3EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E7D32",
  },

  details: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },

  badge: {
    backgroundColor: "#E5F2E7",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2E7D32",
  },

  email: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 17,
  },

  editButton: {
    height: 46,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  editText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
});
