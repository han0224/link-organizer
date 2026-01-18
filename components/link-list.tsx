// app/index.tsx
import { LinkSchema } from "@/storage/link-schema";
import { SearchFilter, searchLinks, SearchResult } from "@/utils/search";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchResultCard from "./search-result-card";

export default function LinkList({ links }: { links: LinkSchema[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const router = useRouter();

  // 검색 결과
  const searchResults: SearchResult[] = searchLinks(
    links,
    searchQuery,
    searchFilter
  );

  const isSearching = searchQuery.length > 0;

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

// app/index.tsx
