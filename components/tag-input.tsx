// components/TagInput.tsx
import { getAllTags } from "@/storage/link-storage";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({
  tags,
  onTagsChange,
  placeholder = "태그 입력",
}: Props) {
  const [input, setInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

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

  // 추천 태그: 이미 존재하는 태그 중 아직 선택하지 않은 것들
  const recommendedTags = allTags.filter((tag) => !tags.includes(tag));

  const addTag = (tag?: string) => {
    const tagToAdd = tag || input.trim();
    if (tagToAdd && !tags.includes(tagToAdd)) {
      onTagsChange([...tags, tagToAdd]);
      setInput("");
      // 태그 추가 후에도 키보드 유지
      setTimeout(() => {
        inputRef.current?.focus();
        setIsFocused(true);
      }, 100);
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const showSuggestions = suggestions.length > 0;

  return (
    <View style={styles.container}>
      {/* 입력 영역 */}
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onSubmitEditing={() => {
            addTag();
            // 키보드 완료 버튼 눌렀을 때도 키보드 유지
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }}
          // blurOnSubmit={false}
          returnKeyType="done"
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // 추천 태그 클릭 시 blur 이벤트가 발생하지만, 포커스를 유지하기 위해 지연
            setTimeout(() => {
              // 포커스가 여전히 없으면 isFocused를 false로 설정
              if (!inputRef.current?.isFocused()) {
                setIsFocused(false);
              }
            }, 300);
          }}
        />
        {input.trim() && (
          <TouchableOpacity style={styles.addButton} onPress={() => addTag()}>
            <Text style={styles.addButtonText}>추가</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 자동완성 리스트 (입력 중일 때만) */}
      {/* {showSuggestions && (
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
      )} */}

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
      {/* 추천 태그 (항상 표시) */}
      {showSuggestions && (
        <View
          style={styles.recommendedContainer}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.recommendedTitle}>추천 태그</Text>
          <View style={styles.recommendedTags}>
            {suggestions.slice(0, 10).map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recommendedChip}
                onPress={() => {
                  addTag(tag);
                  // 포커스 유지
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 50);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.recommendedPlus}>+</Text>
                <Text style={styles.recommendedText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center",
    marginLeft: 8,
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
  recommendedContainer: {
    marginTop: 8,
  },
  recommendedTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  recommendedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recommendedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  recommendedPlus: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "600",
  },
  recommendedText: {
    fontSize: 14,
    color: "#1976D2",
  },
});
