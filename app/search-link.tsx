import BottomNavigation from "@/components/bottom-navigation";
import SearchFilterBar, {
  SearchFilterType,
} from "@/components/search-filter-bar";
import SearchHeader from "@/components/search-header";
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import { getAllFolders } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { deleteLink, getAllLinks } from "@/storage/link-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Icon } from "../components/ui";
import { searchLinks, SearchResult } from "../utils/search";

export default function SearchScreen() {
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [allFolders, setAllFolders] = useState<FolderSchema[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>("all");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadLinks();
      loadFolders();
    }, []),
  );

  const loadLinks = async () => {
    const data = await getAllLinks();
    setLinks(data);
  };

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    setAllFolders(folderList);
  };

  // 링크 검색
  const searchLinkResults: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    if (searchFilter === "folder" || searchFilter === "tag") {
      // 폴더나 태그 필터일 때는 링크 검색 안 함
      return [];
    }
    return searchLinks(
      links,
      searchQuery,
      searchFilter === "all" ? "all" : "title",
    );
  }, [links, searchQuery, searchFilter]);

  // 검색 결과 폴더
  const searchFolderResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    if (searchFilter === "link" || searchFilter === "tag") {
      return [];
    }
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return allFolders.filter((folder) =>
      folder.name.toLowerCase().includes(normalizedQuery),
    );
  }, [allFolders, searchQuery, searchFilter]);

  const isSearching = searchQuery.length > 0;
  const hasLinkResults = searchLinkResults.length > 0;
  const hasFolderResults = searchFolderResults.length > 0;

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

  return (
    <View style={styles.container}>
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCancel={() => router.back()}
      />
      <SearchFilterBar
        selectedFilter={searchFilter}
        onFilterChange={setSearchFilter}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 폴더 섹션 */}
        {isSearching && hasFolderResults && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>폴더</Text>
              <Pressable onPress={() => router.push("/folders")}>
                <Text style={styles.viewAllText}>전체 보기</Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.folderScroll}
            >
              {searchFolderResults.map((folder) => (
                <Pressable
                  key={folder.id}
                  style={styles.folderCard}
                  onPress={() => router.push(`/folder/${folder.id}`)}
                >
                  <View
                    style={[
                      styles.folderIconContainer,
                      {
                        backgroundColor: `${
                          folder.color || BaseColors.primary[500]
                        }1A`,
                      },
                    ]}
                  >
                    <Icon
                      name="folder"
                      size={24}
                      color={folder.color || BaseColors.primary[500]}
                    />
                  </View>
                  <Text style={styles.folderName} numberOfLines={1}>
                    {folder.name}
                  </Text>
                  <Text style={styles.folderCount}>
                    {folder.links.length}개 링크
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 링크 섹션 */}
        {isSearching && hasLinkResults && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>링크</Text>
            </View>
            <View style={styles.linksContainer}>
              {searchLinkResults.map((result) => {
                const folder = result.link.folder
                  ? allFolders.find((f) => f.id === result.link.folder) || null
                  : null;
                return (
                  <Pressable
                    key={result.link.id}
                    style={styles.linkCard}
                    onPress={() => router.push(`/link/${result.link.id}`)}
                  >
                    {result.link.thumbnail ? (
                      <Image
                        source={{ uri: result.link.thumbnail }}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <View style={styles.thumbnailPlaceholder}>
                        <Icon
                          name="file"
                          size={24}
                          color={BaseColors.gray[400]}
                        />
                      </View>
                    )}
                    <View style={styles.linkContent}>
                      <Text style={styles.linkTitle} numberOfLines={2}>
                        {result.link.title}
                      </Text>
                      <Text style={styles.linkDomain} numberOfLines={1}>
                        {getDomain(result.link.url)}
                      </Text>
                      {folder && (
                        <View style={styles.linkFolderInfo}>
                          <Icon
                            name="folder"
                            size={14}
                            color={BaseColors.primary[500]}
                          />
                          <Text style={styles.linkFolderName}>
                            {folder.name.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* 빈 상태 */}
        {isSearching && !hasLinkResults && !hasFolderResults && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
            <Text style={styles.emptySubtext}>다른 검색어를 입력해보세요</Text>
          </View>
        )}
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
  scrollView: {
    height: "100%",
    // backgroundColor: "red",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BaseColors.gray[500],
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  folderScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  folderCard: {
    width: 176,
    backgroundColor: BaseColors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  folderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  folderName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101719",
    marginBottom: 4,
    lineHeight: 20,
  },
  folderCount: {
    fontSize: 12,
    fontWeight: "500",
    color: BaseColors.gray[400],
  },
  linksContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  linkCard: {
    flexDirection: "row",
    gap: 16,
    padding: 12,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  linkContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#101719",
    lineHeight: 22,
    marginBottom: 4,
  },
  linkDomain: {
    fontSize: 12,
    color: BaseColors.gray[400],
    marginBottom: 4,
  },
  linkFolderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  linkFolderName: {
    fontSize: 11,
    fontWeight: "700",
    color: BaseColors.primary[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: BaseColors.gray[600],
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: BaseColors.gray[400],
  },
});
