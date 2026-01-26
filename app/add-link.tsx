// app/add-link.tsx
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import { createFolder, getAllFolders } from "@/storage/folder-storage";
import { CreateLinkSchema, LinkType } from "@/storage/link-schema";
import { createLink } from "@/storage/link-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../components/ui";
import { detectLinkType, fetchLinkMetadata } from "../utils/linkParser";

export default function AddLinkScreen() {
  const { sharedUrl, editId } = useLocalSearchParams<{
    sharedUrl?: string;
    editId?: string; // TODO: 수정은 페이지 하나 새로 추가
  }>();

  const router = useRouter();

  const [url, setUrl] = useState(sharedUrl || "");
  const [folder, setFolder] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LinkType>("other");
  const [tags, setTags] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<FolderSchema[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const insets = useSafeAreaInsets();
  // useEffect 수정
  useEffect(() => {
    loadFolders();
    if (editId) {
      loadExistingLink();
    } else if (sharedUrl) {
      setUrl(sharedUrl);
    }
  }, [editId, sharedUrl]);

  useEffect(() => {
    if (url) {
      parseUrl(url);
    }
  }, [url]);

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    setFolders(folderList);
  };

  const loadExistingLink = async () => {
    // TODO: 수정은 새로운 페이지에서 하도록 수정
    // const links = await getAllLinks();
    // const existing = links.find((l) => l.id === editId);
    // if (existing) {
    //   setUrl(existing.url);
    //   setTitle(existing.title);
    //   setType(existing.type);
    //   setTags(existing.tags);
    //   setMemo(existing.memo);
    //   setThumbnail(existing.thumbnail);
    // }
  };

  const parseUrl = async (inputUrl: string) => {
    setLoading(true);
    const detectedType = detectLinkType(inputUrl);
    setType(detectedType);

    const metadata = await fetchLinkMetadata(inputUrl);
    console.log(metadata);
    setThumbnail(metadata.thumbnail);
    setTitle(metadata.title);
    setLoading(false);
  };

  const handleSave = async () => {
    const link: CreateLinkSchema = {
      url,
      title,
      type,
      tags,
      memo,
      thumbnail,
      folder,
    };
    await createLink(link);
    router.back();
  };

  const handlePaste = async () => {
    // 클립보드에서 붙여넣기 (React Native에서는 Clipboard API 사용)
    // 일단 URL 입력 필드에 포커스를 주는 것으로 대체
    // 실제로는 expo-clipboard를 사용할 수 있음
  };

  const handleAddTag = () => {
    const tagToAdd = tagInput.trim();
    if (tagToAdd && !tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder({
        name: newFolderName.trim(),
      });
      await loadFolders();
      // 새로 생성된 폴더 찾기
      const updatedFolders = await getAllFolders();
      const newFolder = updatedFolders.find(
        (f) => f.name === newFolderName.trim(),
      );
      if (newFolder) {
        setFolder(newFolder.id);
      }
      setShowNewFolderInput(false);
      setNewFolderName("");
    } catch (error: any) {
      alert(error.message || "폴더 생성에 실패했습니다");
    }
  };

  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`;
    } catch {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="close" size={24} color={BaseColors.gray[400]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>새 링크 추가</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.urlRow}>
          <View style={styles.urlInputContainer}>
            <View style={styles.urlIconContainer}>
              <Icon name="file" size={20} color={BaseColors.gray[400]} />
            </View>
            <TextInput
              style={styles.urlInput}
              value={url}
              onChangeText={setUrl}
              placeholder="URL을 입력하세요"
              placeholderTextColor={BaseColors.gray[400]}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Text style={styles.pasteButtonText}>붙여넣기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 미리보기 섹션 */}
        {thumbnail && title && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>미리보기</Text>
            <View style={styles.previewCard}>
              <Image
                source={{ uri: thumbnail }}
                style={styles.previewThumbnail}
              />
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle} numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.previewDomain}>
                  {getFaviconUrl(url) && (
                    <Image
                      source={{ uri: getFaviconUrl(url)! }}
                      style={styles.favicon}
                    />
                  )}
                  <Text style={styles.previewDomainText}>{getDomain(url)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 폴더 선택 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>폴더 선택</Text>
            <TouchableOpacity onPress={() => router.push("/folders")}>
              <View style={styles.moreButton}>
                <Text style={styles.moreButtonText}>더보기</Text>
                <Icon
                  name="rightArrow"
                  size={16}
                  color={BaseColors.primary[500]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.folderButtons}>
            {folders.slice(0, 3).map((f) => {
              const isSelected = folder === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.folderButton,
                    isSelected && styles.folderButtonSelected,
                  ]}
                  onPress={() => setFolder(isSelected ? "" : f.id)}
                >
                  <Icon
                    name="folder"
                    size={16}
                    color={
                      isSelected
                        ? BaseColors.white
                        : f.color || BaseColors.primary[500]
                    }
                  />
                  <Text
                    style={[
                      styles.folderButtonText,
                      isSelected && styles.folderButtonTextSelected,
                    ]}
                  >
                    {f.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.newFolderButton}
              onPress={() => setShowNewFolderInput(!showNewFolderInput)}
            >
              <Icon name="add" size={16} color={BaseColors.gray[400]} />
              <Text style={styles.newFolderButtonText}>+ 새 폴더 만들기</Text>
            </TouchableOpacity>
          </View>
          {showNewFolderInput && (
            <View style={styles.newFolderInputContainer}>
              <TextInput
                style={styles.newFolderInput}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="폴더 이름을 입력하세요"
                placeholderTextColor={BaseColors.gray[400]}
                autoFocus
              />
              <TouchableOpacity
                style={styles.addFolderButton}
                onPress={handleCreateFolder}
              >
                <Text style={styles.addFolderButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 태그 추가 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>태그 추가</Text>
          <View style={styles.tagInputContainer}>
            <View style={styles.tagIconContainer}>
              <Icon name="file" size={20} color={BaseColors.gray[400]} />
            </View>
            <TextInput
              style={styles.tagInput}
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="태그를 입력하고 엔터를 누르세요"
              placeholderTextColor={BaseColors.gray[400]}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>#{tag}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveTag(index)}
                    style={styles.tagRemoveButton}
                  >
                    <Icon name="close" size={14} color={BaseColors.gray[500]} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 하단 고정 저장 버튼 */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>링크 저장하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  header: {
    backgroundColor: BaseColors.background,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
  },
  urlRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  urlInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  urlIconContainer: {
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  urlInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
  pasteButton: {
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${BaseColors.primary[500]}1A`,
    justifyContent: "center",
    alignItems: "center",
  },
  pasteButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 200,
    gap: 32,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BaseColors.gray[500],
    marginBottom: 12,
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  moreButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  previewCard: {
    backgroundColor: BaseColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: "hidden",
  },
  previewThumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: BaseColors.gray[200],
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#121617",
    lineHeight: 22,
    marginBottom: 8,
  },
  previewDomain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favicon: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  previewDomainText: {
    fontSize: 12,
    fontWeight: "500",
    color: BaseColors.gray[500],
  },
  folderButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  folderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
  },
  folderButtonSelected: {
    backgroundColor: BaseColors.primary[500],
    borderColor: BaseColors.primary[500],
    shadowColor: BaseColors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  folderButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: BaseColors.gray[600],
  },
  folderButtonTextSelected: {
    color: BaseColors.white,
    fontWeight: "700",
  },
  newFolderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: BaseColors.gray[300],
  },
  newFolderButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: BaseColors.gray[400],
  },
  newFolderInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginTop: 12,
    backgroundColor: BaseColors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${BaseColors.primary[500]}4D`,
    paddingHorizontal: 12,
  },
  newFolderInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
  addFolderButton: {
    marginLeft: 8,
  },
  addFolderButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tagIconContainer: {
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tagInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: BaseColors.gray[100],
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: BaseColors.gray[500],
  },
  tagRemoveButton: {
    padding: 2,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${BaseColors.background}CC`,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BaseColors.gray[100],
  },
  saveButton: {
    width: "100%",
    height: 56,
    backgroundColor: BaseColors.primary[500],
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BaseColors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: BaseColors.white,
  },
});
