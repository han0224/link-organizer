// app/link/[id].tsx
import LinkActionButtons from "@/components/link-action-buttons";
import LinkFolderInfo from "@/components/link-folder-info";
import LinkInfoSection from "@/components/link-info-section";
import LinkTags from "@/components/link-tags";
import { FolderSchema } from "@/storage/folder-schema";
import { getFolderById } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { deleteLink, getAllLinks } from "@/storage/link-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [link, setLink] = useState<LinkSchema | null>(null);
  const [folder, setFolder] = useState<FolderSchema | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLink();
    }, [id])
  );

  const loadLink = async () => {
    const links = await getAllLinks();
    const found = links.find((l) => l.id === id);
    setLink(found || null);

    // 폴더 정보 로드
    if (found?.folder) {
      try {
        const folderData = await getFolderById(found.folder);
        setFolder(folderData);
      } catch {
        setFolder(null);
      }
    } else {
      setFolder(null);
    }
  };

  const handleOpenLink = () => {
    if (link?.url) {
      Linking.openURL(link.url);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/edit-link",
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

  const formattedCreatedDate = new Date(link.createdAt).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const formattedUpdatedDate = new Date(link.updatedAt).toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <ScrollView style={styles.container}>
      {/* 썸네일 */}
      {link.thumbnail && (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: link.thumbnail }} style={styles.thumbnail} />
        </View>
      )}

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
      {link.tags && link.tags.length > 0 && (
        <LinkInfoSection title="태그">
          <LinkTags tags={link.tags} />
        </LinkInfoSection>
      )}

      {/* 폴더 정보 */}
      {folder && (
        <LinkInfoSection title="폴더">
          <LinkFolderInfo folder={folder} />
        </LinkInfoSection>
      )}

      {/* 메모 */}
      {link.memo && (
        <LinkInfoSection title="메모">
          <View style={styles.memoBox}>
            <Text style={styles.memoText}>{link.memo}</Text>
          </View>
        </LinkInfoSection>
      )}

      {/* 상태 */}
      <LinkInfoSection title="상태">
        <Text style={styles.statusText}>
          {link.status === "active"
            ? "활성"
            : link.status === "archived"
            ? "보관됨"
            : "삭제됨"}
        </Text>
      </LinkInfoSection>

      {/* 날짜 정보 */}
      <LinkInfoSection title="날짜">
        <Text style={styles.dateText}>생성일: {formattedCreatedDate}</Text>
        {formattedCreatedDate !== formattedUpdatedDate && (
          <Text style={styles.dateText}>수정일: {formattedUpdatedDate}</Text>
        )}
      </LinkInfoSection>

      {/* 액션 버튼들 */}
      <LinkActionButtons
        onOpenLink={handleOpenLink}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
  thumbnailContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusText: {
    fontSize: 15,
    color: "#666",
  },
});
