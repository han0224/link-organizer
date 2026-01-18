import { Icon } from "@/components/ui";
import { useToggle } from "@/hooks/useToggle";
import { LinkSchema } from "@/storage/link-schema";
import { getAllLinks } from "@/storage/link-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SearchResultCard from "../components/search-result-card";
import { SearchFilter, searchLinks, SearchResult } from "../utils/search";

export default function HomeScreen() {
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, filterToggle] = useToggle(true);
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, [])
  );

  const loadLinks = async () => {
    const data = await getAllLinks();
    setLinks(data);
  };

  // 검색 결과
  const searchResults: SearchResult[] = searchLinks(
    links,
    searchQuery,
    searchFilter
  );

  const isSearching = searchQuery.length > 0;

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
          <Text>필터</Text>
          <TouchableOpacity onPress={filterToggle}>
            <Icon name={filterOpen ? "upArrow" : "downArrow"} />
          </TouchableOpacity>
        </View>
        {filterOpen && (
          <View style={styles.filterContent}>
            <TouchableOpacity style={styles.filterItem}>
              <Text>전체</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text>제목</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text>태그</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterItem}>
              <Text>메모</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {searchResults.length === 0 ? (
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
            renderItem={({ item }) => (
              <SearchResultCard
                result={item}
                query={searchQuery}
                onPress={() => router.push(`/link/${item.link.id}`)}
              />
            )}
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

    // height: 105,
    paddingTop: 12,
    paddingBottom: 8,
    // backgroundColor: "white",
    flexDirection: "row",
    alignItems: "flex-start",
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
    gap: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  backIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 16,
    color: "#999",
  },
  filterContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  filterContent: {
    paddingVertical: 12,
  },
  filterItem: {
    paddingVertical: 12,
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
