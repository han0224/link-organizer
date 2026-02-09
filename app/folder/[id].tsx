import BottomNavigation from "@/components/bottom-navigation";
import FloatingButton from "@/components/floating-button";
import LinkItem from "@/components/link-item";
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
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [folder, setFolder] = useState<FolderSchema | null>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  useFocusEffect(
    useCallback(() => {
      loadLinks();
      loadFolder();
    }, [id])
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

  const handleLongPress = (linkId: string) => {
    if (!editingMode) {
      setEditingMode(true);
      setSelectedLinks([linkId]);
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

  const handleCheckChange = (linkId: string, checked: boolean) => {
    const newSelectedLinks = [...selectedLinks];
    if (checked) {
      newSelectedLinks.push(linkId);
    } else {
      newSelectedLinks.splice(newSelectedLinks.indexOf(linkId), 1);
    }
    setSelectedLinks(newSelectedLinks);
    console.log("handleCheckChange", newSelectedLinks);
    if (newSelectedLinks.length === 0) {
      console.log("handleCheckChange", "false");
      setEditingMode(false);
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
        {/* <View style={styles.statsContainer}>
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
        </View> */}

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
              <LinkItem
                key={link.id}
                link={link}
                isChecked={selectedLinks.includes(link.id)}
                onLongPress={() => handleLongPress(link.id)}
                isViewCheckbox={editingMode}
                onCheckChange={(checked) => handleCheckChange(link.id, checked)}
              />
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

      {/* 선택 삭제 하단 바 - 글래스 스타일 */}
      {editingMode && selectedLinks.length > 0 ? (
        <View style={[styles.deleteBarOuter, { paddingBottom: insets.bottom }]}>
          <View style={styles.deleteBarGlass}>
            <View style={styles.deleteBarTop}>
              <Text style={styles.selectedCount}>
                {selectedLinks.length}개 선택됨
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingMode(false);
                  setSelectedLinks([]);
                }}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  "링크 삭제",
                  `${selectedLinks.length}개의 링크를 삭제하시겠습니까?`,
                  [
                    { text: "취소", style: "cancel" },
                    {
                      text: "삭제",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          for (const linkId of selectedLinks) {
                            await deleteLink(linkId);
                          }
                          await loadLinks();
                          setEditingMode(false);
                          setSelectedLinks([]);
                        } catch (error: any) {
                          Alert.alert(
                            "오류",
                            error.message || "링크 삭제에 실패했습니다"
                          );
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Icon name="trashFull" size={18} color={BaseColors.white} />
              <Text style={styles.deleteButtonText}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <BottomNavigation />
      )}
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
    paddingTop: 16,
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
  deleteBarOuter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  deleteBarGlass: {
    backgroundColor: "rgba(30, 30, 30, 0.85)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  deleteBarTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedCount: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  deleteButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: BaseColors.red[500],
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: BaseColors.white,
  },
});
