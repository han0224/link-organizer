// app/link/[id].tsx
import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getDomain = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const formatDate = (date: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [link, setLink] = useState<LinkSchema | null>(null);
  const [folder, setFolder] = useState<FolderSchema | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadLink();
    }, [id]),
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

  const formattedDate = formatDate(new Date(link.createdAt));

  return (
    <View style={styles.container}>
      {/* 상단 네비게이션 오버레이 */}
      <View
        style={[
          styles.topNav,
          {
            paddingTop: 16,
            // paddingTop: insets.top + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <Icon name="leftArrow" size={20} color={BaseColors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="cloud" size={20} color={BaseColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 이미지 */}
        {link.thumbnail && (
          <View style={styles.heroImageContainer}>
            <Image source={{ uri: link.thumbnail }} style={styles.heroImage} />
          </View>
        )}

        {/* 제목 & 메타데이터 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{link.title}</Text>
          <TouchableOpacity
            style={styles.urlRow}
            onPress={handleOpenLink}
            activeOpacity={0.7}
          >
            <Text style={styles.urlText}>{getDomain(link.url)}</Text>
            <Icon name="rightArrow" size={14} color="#637c83" />
          </TouchableOpacity>
        </View>

        {/* 폴더 & 태그 */}
        {(folder || (link.tags && link.tags.length > 0)) && (
          <View style={styles.chipsSection}>
            {folder && (
              <View style={styles.folderChip}>
                <Text style={styles.folderChipText}>📁 {folder.name}</Text>
              </View>
            )}
            {link.tags?.map((tag, index) => (
              <View key={index} style={styles.tagChip}>
                <Text style={styles.tagChipText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 메모 섹션 */}
        {link.memo && (
          <View style={styles.memoSection}>
            <View style={styles.memoHeader}>
              <Text style={styles.memoTitle}>메모</Text>
              <Icon name="file" size={18} color={BaseColors.gray[400]} />
            </View>
            <View style={styles.memoBox}>
              <Text style={styles.memoText}>{link.memo}</Text>
            </View>
          </View>
        )}

        {/* 저장 날짜 */}
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>Saved on {formattedDate}</Text>
        </View>
      </ScrollView>

      {/* 하단 고정 액션 버튼 */}
      <View style={[styles.bottomBar]}>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.openLinkButton}
            onPress={handleOpenLink}
          >
            <Icon name="file" size={20} color={BaseColors.white} />
            <Text style={styles.openLinkButtonText}>링크 열기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="file" size={20} color="#121617" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  topNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  heroImageContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#121617",
    lineHeight: 38,
    marginBottom: 8,
  },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  urlText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#637c83",
    textDecorationLine: "underline",
  },
  chipsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  folderChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: `${BaseColors.primary[500]}1A`,
    borderWidth: 1,
    borderColor: `${BaseColors.primary[500]}33`,
    justifyContent: "center",
    alignItems: "center",
  },
  folderChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  tagChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: `${BaseColors.gray[200]}99`,
    justifyContent: "center",
    alignItems: "center",
  },
  tagChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
  memoSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  memoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  memoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
  },
  memoBox: {
    width: "100%",
    backgroundColor: BaseColors.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
  },
  memoText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#344246",
    lineHeight: 24,
  },
  dateSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
    color: BaseColors.gray[400],
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${BaseColors.background}CC`,
    paddingHorizontal: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: BaseColors.gray[200],
    zIndex: 30,
  },
  bottomActions: {
    flexDirection: "row",
    gap: 12,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  openLinkButton: {
    flex: 1,
    height: 56,
    backgroundColor: BaseColors.primary[500],
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: BaseColors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  openLinkButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: BaseColors.white,
  },
  editButton: {
    width: 56,
    height: 56,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});
