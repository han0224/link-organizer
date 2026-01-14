// app/add-link.tsx
import FolderSelector from "@/components/folder-selector";
import { LinkSchema, LinkType } from "@/storage/link-schema";
import { getAllLinks, updateLink } from "@/storage/link-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import TagInput from "../components/tag-input";
import { detectLinkType, fetchLinkMetadata } from "../utils/linkParser";

export default function EditLinkScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  const router = useRouter();

  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LinkType>("other");
  const [tags, setTags] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);
  const [currentLink, setCurrentLink] = useState<LinkSchema | null>(null);
  // useEffect 수정
  useEffect(() => {
    if (editId) {
      loadExistingLink();
    }
  }, [editId]);

  useEffect(() => {
    if (url) {
      parseUrl(url);
    }
  }, [url]);

  const loadExistingLink = async () => {
    const links = await getAllLinks();
    const link = links.find((l) => l.id === editId);
    setCurrentLink(link || null);
    if (link) {
      setUrl(link.url);
      setTitle(link.title);
      setType(link.type);
      setTags(link.tags || []);
      setMemo(link.memo || "");
      setThumbnail(link.thumbnail);
    }
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

  // handleSave 수정
  const handleSave = async () => {
    if (!currentLink) {
      Alert.alert("수정할 링크를 찾을 수 없습니다");
      return;
    }

    const link: LinkSchema = {
      ...currentLink,
      url,
      title,
      type,
      tags,
      memo,
      thumbnail,
      folder,
    };
    await updateLink(link);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="링크를 입력하세요"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={loading ? "불러오는 중..." : "제목"}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>타입: {type}</Text>
      </View>
      <View style={styles.field}>
        <FolderSelector selectedFolder={folder} onSelectFolder={setFolder} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>태그</Text>
        <TagInput tags={tags} onTagsChange={setTags} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>메모</Text>
        <TextInput
          style={[styles.input, styles.memoInput]}
          value={memo}
          onChangeText={setMemo}
          placeholder="메모를 입력하세요"
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>수정</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  memoInput: { height: 100, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  thumbnailText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
