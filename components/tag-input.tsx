// components/TagInput.tsx
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllTags } from "../utils/storage";

interface Props {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onTagsChange }: Props) {
  const [input, setInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // 기존 태그 목록 로드
  useEffect(() => {
    loadAllTags();
  }, []);

  const loadAllTags = async () => {
    const existingTags = await getAllTags();
    setAllTags(existingTags);
  };

  // 입력값에 따라 자동완성 필터링
  useEffect(() => {
    if (input.trim() === "") {
      setSuggestions([]);
    } else {
      // 입력 있으면 필터링
      const filtered = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(input.toLowerCase()) && !tags.includes(tag)
      );
      setSuggestions(filtered);
    }
  }, [input, allTags, tags]);

  const addTag = (tag?: string) => {
    const tagToAdd = tag || input.trim();
    if (tagToAdd && !tags.includes(tagToAdd)) {
      onTagsChange([...tags, tagToAdd]);
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <View style={styles.container}>
      {/* 입력 영역 */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="태그 입력"
          onSubmitEditing={() => addTag()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <TouchableOpacity
          style={[styles.addButton, !input.trim() && styles.addButtonDisabled]}
          onPress={() => addTag()}
          disabled={!input.trim()}
        >
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      {/* 자동완성 리스트 */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>태그 추천</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.suggestionsScroll}
          >
            {suggestions.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => addTag(tag)}
              >
                <Text style={styles.suggestionText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 선택된 태그들 */}
      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map((tag, i) => (
            <TouchableOpacity
              key={i}
              style={styles.tag}
              onPress={() => removeTag(i)}
            >
              <Text style={styles.tagText}>#{tag}</Text>
              <Text style={styles.tagRemove}> ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#ccc",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  suggestionsContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
  },
  suggestionsTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  suggestionsScroll: {
    flexGrow: 0,
  },
  suggestionChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    color: "#007AFF",
    fontSize: 14,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tagText: {
    color: "#1976D2",
    fontSize: 14,
  },
  tagRemove: {
    color: "#1976D2",
    fontSize: 12,
  },
});
