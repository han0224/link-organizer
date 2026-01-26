import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DashboardHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header]}>
      <View style={styles.topSection}>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            {/* 프로필 이미지 - 나중에 실제 이미지로 교체 가능 */}
            <View style={styles.profilePlaceholder} />
          </View>
          <Text style={styles.greeting}>좋은 아침입니다, Elena</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <Icon name="hamburger" size={20} color={BaseColors.gray[600]} />
        </Pressable>
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
    backgroundColor: BaseColors.gray[300],
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
