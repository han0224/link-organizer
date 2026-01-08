// app/(tabs)/folder.tsx
import { Icon } from "@/components/ui/icon/icon";
import { Link } from "@/types";
import { getFolders, getLinksByFolder, saveLastTab } from "@/utils/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FolderScreen() {
  const [folders, setFolders] = useState<string[]>([]);
  const [folderLinks, setFolderLinks] = useState<Record<string, Link[]>>({});
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      saveLastTab("folder");
      loadFolders();
    }, [])
  );

  const loadFolders = async () => {
    const folderList = await getFolders();
    console.log("folderList", folderList);
    setFolders(folderList);

    // 각 폴더의 링크 개수와 썸네일 미리보기 로드
    const linksMap: Record<string, Link[]> = {};
    for (const folder of folderList) {
      const links = await getLinksByFolder(folder);
      linksMap[folder] = links;
    }
    setFolderLinks(linksMap);
  };

  const handleFolderPress = (folderName: string) => {
    // 폴더 상세 화면으로 이동 (또는 모달)
    // router.push({
    //   pathname: "/(tabs)/folder/[name]",
    //   params: { name: folderName },
    // });
    router.push({
      pathname: "/(tabs)/(folder)/[id]",
      params: { id: folderName },
    });
  };

  const getFolderThumbnail = (links: Link[]): string | null => {
    // 첫 번째 링크의 썸네일 반환
    return links.find((link) => link.thumbnail)?.thumbnail || null;
  };

  const renderFolderCard = ({ item: folderName }: { item: string }) => {
    const links = folderLinks[folderName] || [];
    const thumbnail = getFolderThumbnail(links);
    const linkCount = links.length;

    return (
      <TouchableOpacity
        style={styles.folderCard}
        onPress={() => handleFolderPress(folderName)}
      >
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.folderThumbnail} />
        ) : (
          <View style={styles.folderThumbnailPlaceholder}>
            <Icon name="folder" size={48} color="#999" />
          </View>
        )}
        <View style={styles.folderOverlay}>
          <View style={styles.folderInfo}>
            <Text style={styles.folderName} numberOfLines={1}>
              {folderName}
            </Text>
            <Text style={styles.folderCount}>{linkCount}개 링크</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 추가 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>폴더</Text>
      </View>
      {folders.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="folder" size={64} color="#ccc" />
          <Text style={styles.emptyText}>폴더가 없습니다</Text>
          <Text style={styles.emptySubtext}>
            링크를 추가할 때 폴더를 만들어보세요
          </Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          renderItem={renderFolderCard}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
        />
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
  // 헤더 스타일 추가 (all.tsx와 동일한 높이)
  header: {
    height: 105 / 2,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "white",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  row: {
    justifyContent: "space-between",
  },
  folderCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  folderThumbnail: {
    width: "100%",
    height: "100%",
  },
  folderThumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  folderOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 12,
  },
  folderInfo: {
    gap: 4,
  },
  folderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  folderCount: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
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
