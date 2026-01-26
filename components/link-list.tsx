// app/index.tsx
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import { getAllFolders } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { deleteLink } from "@/storage/link-storage";
import { SearchFilter, searchLinks, SearchResult } from "@/utils/search";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import SearchResultCard from "./link-card";

export default function LinkList({
  links,
  onLinkDeleted,
}: {
  links: LinkSchema[];
  onLinkDeleted?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const [folders, setFolders] = useState<Map<string, FolderSchema>>(new Map());
  const router = useRouter();

  useEffect(() => {
    loadFolders();
  }, []);

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

  const handleDelete = (linkId: string, linkTitle: string) => {
    Alert.alert("링크 삭제", `"${linkTitle}" 링크를 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLink(linkId);
            // 부모 컴포넌트에 삭제 완료 알림
            onLinkDeleted?.();
          } catch (error: any) {
            Alert.alert("오류", error.message || "링크 삭제에 실패했습니다");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {links.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>저장된 링크가 없습니다</Text>
          <Text style={styles.emptySubtext}>
            + 버튼을 눌러 링크를 추가하세요
          </Text>
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          <Text style={styles.emptySubtext}>다른 검색어를 입력해보세요</Text>
        </View>
      ) : (
        <>
          {isSearching && (
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-link")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  header: {
    height: 105,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 4,
  },
  hamburgerIcon: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    // padding: 12,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
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
});

// app/index.tsx
