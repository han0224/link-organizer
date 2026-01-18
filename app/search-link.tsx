import { Icon } from "@/components/ui";
import { useToggle } from "@/hooks/useToggle";
import { FolderSchema } from "@/storage/folder-schema";
import { getAllFolders } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { deleteLink, getAllLinks } from "@/storage/link-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SearchResultCard from "../components/link-card";
import { SearchFilter, searchLinks, SearchResult } from "../utils/search";

const FILTER_OPTIONS: { value: SearchFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "title", label: "제목" },
  { value: "tag", label: "태그" },
  { value: "memo", label: "메모" },
];

export default function HomeScreen() {
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, filterToggle] = useToggle(true);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const [folders, setFolders] = useState<Map<string, FolderSchema>>(new Map());
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadLinks();
      loadFolders();
    }, [])
  );

  const loadLinks = async () => {
    const data = await getAllLinks();
    setLinks(data);
  };

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    const folderMap = new Map<string, FolderSchema>();
    folderList.forEach((folder) => {
      folderMap.set(folder.id, folder);
    });
    setFolders(folderMap);
  };

  // 검색 결과
  const searchResults: SearchResult[] = searchLinks(
    links,
    searchQuery,
    searchFilter
  );

  const isSearching = searchQuery.length > 0;
  const hasResults = searchResults.length > 0;

  const handleFilterChange = (filter: SearchFilter) => {
    setSearchFilter(filter);
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
            await loadLinks(); // 삭제 후 리스트 새로고침
          } catch (error: any) {
            Alert.alert("오류", error.message || "링크 삭제에 실패했습니다");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="leftArrow" />
          </TouchableOpacity>
          <TextInput
            autoFocus
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="검색어 입력... (#태그로 태그 검색)"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Icon name="close" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterHeaderText}>필터</Text>
          <TouchableOpacity onPress={filterToggle}>
            <Icon name={filterOpen ? "upArrow" : "downArrow"} />
          </TouchableOpacity>
        </View>
        {filterOpen && (
          <View style={styles.filterContent}>
            {FILTER_OPTIONS.map((option) => {
              const isActive = searchFilter === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterItem,
                    isActive && styles.filterItemActive,
                  ]}
                  onPress={() => handleFilterChange(option.value)}
                >
                  <Text
                    style={[
                      styles.filterItemText,
                      isActive && styles.filterItemTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
      {!isSearching && links.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>저장된 링크가 없습니다</Text>
          <Text style={styles.emptySubtext}>
            + 버튼을 눌러 링크를 추가하세요
          </Text>
        </View>
      ) : isSearching && !hasResults ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          <Text style={styles.emptySubtext}>다른 검색어를 입력해보세요</Text>
        </View>
      ) : (
        <>
          {isSearching && hasResults && (
            <View style={styles.resultCount}>
              <Text style={styles.resultCountText}>
                {searchResults.length}개의 결과
              </Text>
            </View>
          )}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.link.id}
            renderItem={({ item }) => {
              const folder = item.link.folder
                ? folders.get(item.link.folder) || null
                : null;
              return (
                <SearchResultCard
                  result={item}
                  query={searchQuery}
                  onPress={() => router.push(`/link/${item.link.id}`)}
                  onDelete={() => handleDelete(item.link.id, item.link.title)}
                  folder={folder}
                />
              );
            }}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-link")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  filterContent: {
    paddingBottom: 12,
    flexDirection: "row",
    gap: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterItemActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterItemText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterItemTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultCountText: {
    fontSize: 13,
    color: "#666",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    marginTop: -2,
  },
});
