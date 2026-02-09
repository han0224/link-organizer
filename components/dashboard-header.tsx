import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREETING_MESSAGES = [
  "유용한 링크 저장해보아요",
  "새 링크 추가해보아요",
  "링크 정리해보아요",
  "정보 모아보아요",
  "링크 저장해보아요",
  "폴더로 분류해보아요",
  "태그로 찾아보아요",
  "링크 관리해보아요",
];

export default function DashboardHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 랜덤으로 문구 선택 (컴포넌트 마운트 시 한 번만)
  const randomGreeting = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * GREETING_MESSAGES.length);
    return GREETING_MESSAGES[randomIndex];
  }, []);

  return (
    <View style={[styles.header]}>
      <View style={styles.topSection}>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.profilePlaceholder}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.greeting}>링크 저장 어플</Text>
          {/* <Text style={styles.greeting}>{randomGreeting}</Text> */}
        </View>
        {/* <Pressable style={styles.notificationButton}>
          <Icon name="hamburger" size={20} color={BaseColors.gray[600]} />
        </Pressable> */}
      </View>
      <Pressable
        style={styles.searchContainer}
        onPress={() => router.push("/search-link")}
      >
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={20} color={BaseColors.gray[400]} />
        </View>
        <Text style={styles.searchPlaceholder}>링크 검색...</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BaseColors.background,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: `${BaseColors.primary[500]}33`,
    overflow: "hidden",
    backgroundColor: BaseColors.gray[200],
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BaseColors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
  },
  searchIconContainer: {
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchPlaceholder: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: BaseColors.gray[400],
  },
});
