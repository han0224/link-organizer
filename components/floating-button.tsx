import { BaseColors } from "@/constants/theme";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Icon } from "./ui";
import { IconName } from "./ui/icon/icons";

export default function FloatingButton({
  onPress,
  style,
  icon = "add",
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: IconName;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed, style]}
      onPress={onPress}
    >
      {<Icon name={icon} size={42} color="#fff" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 96, // 하단 네비게이션 위에 위치 (기본값, style prop으로 override 가능)
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BaseColors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BaseColors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabPressed: {
    transform: [{ scale: 0.9 }],
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  fabText: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: -2,
  },
});
