// app/add-link.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import TagInput from "../components/tag-input";
import { Link, LinkType } from "../types";
import { detectLinkType, fetchLinkMetadata } from "../utils/linkParser";
import { getLinks, saveLink } from "../utils/storage";

export default function AddLinkScreen() {
  const { sharedUrl, editId } = useLocalSearchParams<{
    sharedUrl?: string;
    editId?: string;
  }>();

  const router = useRouter();

  const [url, setUrl] = useState(sharedUrl || "");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<LinkType>("other");
  const [tags, setTags] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect 수정
  useEffect(() => {
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

  const loadExistingLink = async () => {
    const links = await getLinks();
    const existing = links.find((l) => l.id === editId);
    if (existing) {
      setUrl(existing.url);
      setTitle(existing.title);
      setType(existing.type);
      setTags(existing.tags);
      setMemo(existing.memo);
    }
  };

  const parseUrl = async (inputUrl: string) => {
    setLoading(true);
    const detectedType = detectLinkType(inputUrl);
    setType(detectedType);

    const metadata = await fetchLinkMetadata(inputUrl);
    setTitle(metadata.title);
    setLoading(false);
  };

  // handleSave 수정
  const handleSave = async () => {
    const link: Link = {
      id: editId || uuidv4(), // 수정 시 기존 ID 유지
      url,
      title,
      type,
      tags,
      memo,
      createdAt: editId ? new Date() : new Date(), // 수정 시에도 일단 현재 시간
      updatedAt: new Date(),
    };

    await saveLink(link);
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
        <Text style={styles.saveButtonText}>저장</Text>
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
});
