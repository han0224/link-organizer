import BottomNavigation from "@/components/bottom-navigation";
import FloatingButton from "@/components/floating-button";
import LinkItem from "@/components/link-item";
import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import {
  getGroupById,
  getMockCurrentUserId,
} from "@/lib/mock-api/group-api";
import { GroupSchema } from "@/storage/group-schema";
import { getLinksByGroupId } from "@/storage/link-storage";
import { LinkSchema } from "@/storage/link-schema";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [group, setGroup] = useState<GroupSchema | null>(null);
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGroup = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [groupData, groupLinks] = await Promise.all([
        getGroupById(id),
        getLinksByGroupId(id),
      ]);
      setGroup(groupData);
      setLinks(groupLinks);
    } catch {
      setGroup(null);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadGroup();
    }, [loadGroup]),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={BaseColors.primary[500]} />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>그룹을 찾을 수 없습니다</Text>
      </View>
    );
  }

  const isOwner = group.ownerId === getMockCurrentUserId();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Icon name="leftArrow" size={22} color="#121617" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() =>
              router.push({
                pathname: "/group-settings",
                params: { id: group.id },
              })
            }
          >
            <Text style={styles.settingsButtonText}>설정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={[styles.heroAccent, { backgroundColor: group.color }]} />
          <Text style={styles.heroTitle}>{group.name}</Text>
          <Text style={styles.heroDescription}>
            {group.description || "그룹 소개가 아직 없습니다"}
          </Text>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>{group.members.length}명 참여</Text>
            <Text style={styles.heroMeta}>링크 {links.length}개</Text>
            <Text style={styles.heroMeta}>
              {isOwner ? "내가 오너" : "멤버"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>멤버</Text>
            <Text style={styles.sectionCaption}>설정에서 초대 가능</Text>
          </View>
          <View style={styles.memberList}>
            {group.members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.name.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberContent}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
                <Text style={styles.memberRole}>
                  {member.role === "owner" ? "오너" : "멤버"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>공유 링크</Text>
          <View style={styles.linkList}>
            {links.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>아직 링크가 없습니다</Text>
                <Text style={styles.emptyBody}>
                  아래 추가 버튼으로 그룹 전용 링크를 바로 모아보세요.
                </Text>
              </View>
            ) : (
              links.map((link) => <LinkItem key={link.id} link={link} />)
            )}
          </View>
        </View>
      </ScrollView>

      <FloatingButton
        onPress={() =>
          router.push({
            pathname: "/add-link",
            params: { group: group.id, groupName: group.name },
          })
        }
        icon="add"
        style={styles.fab}
      />
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: BaseColors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    minWidth: 64,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#121617",
  },
  heroCard: {
    backgroundColor: BaseColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    padding: 18,
    gap: 10,
  },
  heroAccent: {
    width: 44,
    height: 8,
    borderRadius: 999,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#121617",
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: BaseColors.gray[600],
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  heroMeta: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: `${BaseColors.primary[500]}14`,
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#121617",
  },
  sectionCaption: {
    fontSize: 12,
    color: BaseColors.gray[500],
  },
  memberList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${BaseColors.primary[500]}16`,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: BaseColors.primary[500],
  },
  memberContent: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#121617",
  },
  memberEmail: {
    fontSize: 12,
    color: BaseColors.gray[500],
  },
  memberRole: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  linkList: {
    gap: 8,
  },
  emptyCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#121617",
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 20,
    color: BaseColors.gray[500],
  },
  emptyText: {
    fontSize: 14,
    color: BaseColors.gray[500],
  },
  fab: {
    bottom: 96,
  },
});
