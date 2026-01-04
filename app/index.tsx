// app/index.tsx
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinkCard from "../components/link-card";
import { Link } from "../types";
import { getLinks } from "../utils/storage";

export default function HomeScreen() {
  const [links, setLinks] = useState<Link[]>([]);
  const router = useRouter();

  // 화면에 돌아올 때마다 새로고침
  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, [])
  );

  const loadLinks = async () => {
    const data = await getLinks();
    setLinks(data);
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
      ) : (
        <FlatList
          data={links}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LinkCard
              link={item}
              onPress={() => router.push(`/link/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {/* 추가 버튼 */}
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  list: { padding: 16, paddingBottom: 80 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#666" },
  emptySubtext: { fontSize: 14, color: "#999", marginTop: 8 },
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
