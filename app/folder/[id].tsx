import BottomNavigation from "@/components/bottom-navigation";
import FloatingButton from "@/components/floating-button";
import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import { getFolderById } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { deleteLink, getLinksByFolderId } from "@/storage/link-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// TODO: 상단에 링크, 참여자 삭제 예정
// TODO: 편집 클릭 후 체크박스
export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [folder, setFolder] = useState<FolderSchema | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLinks();
      loadFolder();
    }, [id]),
  );

  const loadLinks = async () => {
    if (!id) return;
    const folderLinks = await getLinksByFolderId(id);
    setLinks(folderLinks);
  };

  const loadFolder = async () => {
    if (!id) return;
    try {
      const folderData = await getFolderById(id);
      setFolder(folderData);
    } catch {
      setFolder(null);
    }
  };

  const handleDelete = (linkId: string, linkTitle: string) => {
    Alert.alert("링크 삭제", `"${linkTitle}" 링크를 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLink(linkId);
            await loadLinks();
          } catch (error: any) {
            Alert.alert("오류", error.message || "링크 삭제에 실패했습니다");
          }
        },
      },
    ]);
  };

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  if (!folder) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>폴더를 찾을 수 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 */}
      <View
        style={[
          styles.nav,
          // {
          //   paddingTop: insets.top + 12,
          // },
        ]}
      >
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.back()}
          >
            <Icon name="leftArrow" size={24} color="#121617" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{folder.name}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>편집</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 통계 카드 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Icon name="file" size={18} color={BaseColors.primary[500]} />
              <Text style={styles.statLabel}>링크</Text>
            </View>
            <Text style={styles.statValue}>{links.length}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Icon name="cloud" size={18} color={BaseColors.primary[500]} />
              <Text style={styles.statLabel}>참여자</Text>
            </View>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>

        {/* 정렬/뷰 옵션 */}
        <View style={styles.optionsContainer}>
          <Pressable style={styles.sortButton}>
            <Text style={styles.sortButtonText}>최신순</Text>
            <Icon name="downArrow" size={16} color="#121617" />
          </Pressable>
          <Pressable style={styles.viewButton}>
            <Icon name="file" size={20} color="#121617" />
          </Pressable>
        </View>

        {/* 링크 리스트 */}
        <View style={styles.linksContainer}>
          {links.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>링크가 없습니다</Text>
            </View>
          ) : (
            links.map((link) => (
              <Pressable
                key={link.id}
                style={styles.linkCard}
                onPress={() => router.push(`/link/${link.id}`)}
              >
                {link.thumbnail ? (
                  <Image
                    source={{ uri: link.thumbnail }}
                    style={styles.linkThumbnail}
                  />
                ) : (
                  <View style={styles.linkThumbnailPlaceholder}>
                    <Icon name="file" size={24} color={BaseColors.gray[400]} />
                  </View>
                )}
                <View style={styles.linkContent}>
                  <View style={styles.linkHeader}>
                    <Text style={styles.linkTitle} numberOfLines={1}>
                      {link.title}
                    </Text>
                    <Pressable
                      style={styles.moreButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(link.id, link.title);
                      }}
                    >
                      <Icon
                        name="hamburger"
                        size={20}
                        color={BaseColors.gray[400]}
                      />
                    </Pressable>
                  </View>
                  <Text style={styles.linkDomain}>{getDomain(link.url)}</Text>
                  {link.memo && (
                    <Text style={styles.linkDescription} numberOfLines={2}>
                      {link.memo}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      {/* 플로팅 버튼 */}
      <FloatingButton
        onPress={() => router.push(`/add-link?folder=${id}`)}
        icon="add"
        style={styles.fab}
      />

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: BaseColors.background,
    borderBottomWidth: 1,
    borderBottomColor: BaseColors.gray[200],
  },
  navLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#121617",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: BaseColors.primary[500],
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BaseColors.gray[500],
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#121617",
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: BaseColors.gray[200],
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  linksContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  linkCard: {
    flexDirection: "row",
    gap: 16,
    padding: 12,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  linkThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
  },
  linkThumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    justifyContent: "center",
    alignItems: "center",
  },
  linkContent: {
    flex: 1,
    minWidth: 0,
  },
  linkHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  linkTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#121617",
    lineHeight: 22,
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
  linkDomain: {
    fontSize: 12,
    fontWeight: "500",
    color: BaseColors.primary[500],
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 14,
    color: BaseColors.gray[500],
    lineHeight: 20,
  },
  empty: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: BaseColors.gray[400],
  },
  fab: {
    bottom: 96,
  },
  notFound: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});
