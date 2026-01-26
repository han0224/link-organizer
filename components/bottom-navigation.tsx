import { BaseColors } from "@/constants/theme";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "./ui";

interface NavItem {
  name: string;
  icon: "folder" | "folderFilled" | "cloud" | "search" | "hamburger";
  route: string;
}

const navItems: NavItem[] = [
  { name: "홈", icon: "folder", route: "/" },
  { name: "공유", icon: "cloud", route: "/" }, // TODO: 공유 페이지 추가
  { name: "검색", icon: "search", route: "/search-link" },
  { name: "설정", icon: "hamburger", route: "/setting" },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // 경로 정규화 함수 (/, /index, /index/ 등을 동일하게 처리)
  const normalizePath = (path: string) => {
    // 끝의 슬래시 제거
    let normalized = path.replace(/\/$/, "");

    // /index 또는 /index/를 /로 변환
    if (normalized === "/index") {
      return "/";
    }

    // /setting/index를 /setting으로 변환
    if (normalized === "/setting/index") {
      return "/setting";
    }

    return normalized;
  };

  const normalizedPathname = normalizePath(pathname);

  return (
    <View style={[styles.nav]}>
      {navItems.map((item) => {
        const normalizedRoute = normalizePath(item.route);
        const isActive = normalizedPathname === normalizedRoute;
        const iconName =
          isActive && item.icon === "folder" ? "folderFilled" : item.icon;
        return (
          <Pressable
            key={item.name}
            style={styles.navItem}
            onPress={() => {
              // 현재 경로와 동일하면 아무 동작도 하지 않음
              if (!isActive) {
                router.push(item.route as any);
              }
            }}
          >
            <Icon
              name={iconName}
              size={24}
              color={isActive ? BaseColors.primary[500] : BaseColors.gray[400]}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {item.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${BaseColors.white}F2`,
    borderTopWidth: 1,
    borderTopColor: BaseColors.gray[100],
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: "500",
    color: BaseColors.gray[400],
  },
  navTextActive: {
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
});
