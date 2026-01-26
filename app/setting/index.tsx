import BottomNavigation from "@/components/bottom-navigation";
import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  isDanger?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  isDanger = false,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={[
          styles.settingIconContainer,
          isDanger && styles.settingIconContainerDanger,
        ]}
      >
        <Icon
          name={icon as any}
          size={20}
          color={isDanger ? "#ef4444" : BaseColors.primary[500]}
        />
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[styles.settingTitle, isDanger && styles.settingTitleDanger]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent || (
        <Icon name="rightArrow" size={20} color={BaseColors.gray[400]} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="leftArrow" size={20} color="#101719" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>설정</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN4jkuYb1sUNSbNZYfjqib4OntJ8WJk6t2nkXJ6SPwKO36KYkt8ZEAEO4ugONPOOH9YRfNZy7YtrkbngxU7S1DT3Fb4ecWlE7LsoWbNJbeN4dOSXvuDJB8VOpOIuW4zZgQiSKfGC14ge2Yzqb87qLw4rsQQHWFLifWPoFDhS9iQcR8LZznM9WhcZ8wtEZhyvRIZxFegNbFZsLPvTQtDw9epFyu5E_V5iybbSA36MnansCUuZGDJOIjqdd48Qs2Ml9xeoD5cfqqVb0",
              }}
              style={styles.profileImage}
            />
            <View style={styles.editProfileBadge}>
              <Icon name="file" size={12} color={BaseColors.white} />
            </View>
          </View>
          <Text style={styles.profileName}>Alex Kim</Text>
          <Text style={styles.profileEmail}>alex.kim@example.com</Text>
        </View>

        {/* 계정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <View style={styles.sectionCard}>
            <SettingItem icon="file" title="프로필 편집" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingItem icon="file" title="비밀번호 변경" onPress={() => {}} />
          </View>
        </View>

        {/* 앱 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 설정</Text>
          <View style={styles.sectionCard}>
            <SettingItem icon="file" title="알림 설정" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingItem
              icon="file"
              title="다크 모드"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{
                    false: BaseColors.gray[200],
                    true: BaseColors.primary[500],
                  }}
                  thumbColor={BaseColors.white}
                />
              }
            />
          </View>
        </View>

        {/* 데이터 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>데이터</Text>
          <View style={styles.sectionCard}>
            <SettingItem icon="file" title="링크 내보내기" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingItem
              icon="file"
              title="캐시 삭제"
              subtitle="현재 142 MB 사용 중"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* 지원 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지원</Text>
          <View style={styles.sectionCard}>
            <SettingItem icon="file" title="고객센터" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingItem
              icon="file"
              title="개인정보 처리방침"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="file"
              title="로그아웃"
              isDanger
              onPress={() => {
                Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
                  { text: "취소", style: "cancel" },
                  { text: "로그아웃", style: "destructive", onPress: () => {} },
                ]);
              }}
            />
          </View>
        </View>

        {/* 버전 정보 */}
        <Text style={styles.versionText}>버전 2.4.1 (102)</Text>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  header: {
    backgroundColor: BaseColors.background,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BaseColors.gray[200],
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BaseColors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101719",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 200,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: 32,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: BaseColors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  editProfileBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: BaseColors.primary[500],
    padding: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BaseColors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#101719",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "500",
    color: "#57818e",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#57818e",
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  sectionCard: {
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${BaseColors.primary[500]}1A`,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  settingIconContainerDanger: {
    backgroundColor: "#ef44441A",
  },
  settingContent: {
    flex: 1,
    minWidth: 0,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#101719",
  },
  settingTitleDanger: {
    fontWeight: "600",
    color: "#ef4444",
  },
  settingSubtitle: {
    fontSize: 11,
    color: "#57818e",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: BaseColors.gray[100],
    marginLeft: 68,
  },
  versionText: {
    fontSize: 11,
    color: "#57818e",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 16,
  },
});
