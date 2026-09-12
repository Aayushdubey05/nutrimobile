import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../constants/colors";

type NavItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

interface BottomNavProps {
  active: "home" | "diary" | "scan" | "progress" | "profile" | null;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    icon: "home-outline",
    route: "/(main)/dashboard",
  },
  {
    label: "Diary",
    icon: "book-outline",
    route: "/(main)/diary",
  },
  {
    label: "Scan",
    icon: "camera-outline",
    route: "/(main)/scan",
  },
  {
    label: "Progress",
    icon: "stats-chart-outline",
    route: "/(main)/progress",
  },
  {
    label: "Profile",
    icon: "person-outline",
    route: "/(main)/profile",
  },
];

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.label.toLowerCase();

        return (
          <Pressable
            key={item.label}
            style={styles.item}
            onPress={() => router.push(item.route as never)}
          >
            <View
              style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colors.text : colors.secondaryText}
              />
            </View>

            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 76,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingBottom: 5,
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    width: 38,
    height: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconWrapper: {
    backgroundColor: colors.background,
  },

  label: {
    fontSize: 10,
    color: colors.secondaryText,
    marginTop: 2,
  },

  activeLabel: {
    fontWeight: "600",
    color: colors.text,
  },
});
