// app/link/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "../../types";
import { deleteLink, getLinks } from "../../utils/storage";

const TYPE_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  blog: "#00C853",
  article: "#2196F3",
  video: "#9C27B0",
  other: "#757575",
};

const TYPE_LABELS: Record<string, string> = {
  youtube: "YouTube",
  blog: "블로그",
  article: "아티클",
  video: "영상",
  other: "기타",
};

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [link, setLink] = useState<Link | null>(null);

  useEffect(() => {
    loadLink();
  }, [id]);

  const loadLink = async () => {
    const links = await getLinks();
    const found = links.find((l) => l.id === id);
    setLink(found || null);
  };

  const handleOpenLink = () => {
    if (link?.url) {
      Linking.openURL(link.url);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/add-link",
      params: { editId: link?.id },
    });
  };

  const handleDelete = () => {
    Alert.alert("링크 삭제", "이 링크를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          if (id) {
            await deleteLink(id);
            router.back();
          }
        },
      },
    ]);
  };

  if (!link) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>링크를 찾을 수 없습니다</Text>
      </View>
    );
  }

  const formattedDate = new Date(link.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ScrollView style={styles.container}>
      {/* 타입 배지 */}
      <View
        style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[link.type] }]}
      >
        <Text style={styles.typeText}>{TYPE_LABELS[link.type]}</Text>
      </View>

      {/* 제목 */}
      <Text style={styles.title}>{link.title}</Text>

      {/* URL */}
      <TouchableOpacity onPress={handleOpenLink}>
        <Text style={styles.url}>{link.url}</Text>
      </TouchableOpacity>

      {/* 태그 */}
      {link.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>태그</Text>
          <View style={styles.tags}>
            {link.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 메모 */}
      {link.memo ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메모</Text>
          <View style={styles.memoBox}>
            <Text style={styles.memoText}>{link.memo}</Text>
          </View>
        </View>
      ) : null}

      {/* 저장 날짜 */}
      <View style={styles.section}>
        <Text style={styles.dateText}>저장일: {formattedDate}</Text>
      </View>

      {/* 액션 버튼들 */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.openButton} onPress={handleOpenLink}>
          <Text style={styles.openButtonText}>링크 열기</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  notFound: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  typeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    lineHeight: 30,
  },
  url: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 24,
    textDecorationLine: "underline",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: "#1976D2",
    fontSize: 14,
  },
  memoBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  memoText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  dateText: {
    fontSize: 13,
    color: "#999",
  },
  actions: {
    marginTop: 20,
    paddingBottom: 40,
  },
  openButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  openButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "500",
  },
});
