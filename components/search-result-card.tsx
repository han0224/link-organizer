// components/SearchResultCard.tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SearchResult } from "../utils/search";

interface Props {
  result: SearchResult;
  query: string;
  onPress: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  blog: "#00C853",
  article: "#2196F3",
  video: "#9C27B0",
  other: "#757575",
};

const MATCH_LABELS: Record<string, string> = {
  title: "제목",
  tag: "태그",
  memo: "메모",
};

export default function SearchResultCard({ result, query, onPress }: Props) {
  const { link, matchedIn, matchedTags } = result;

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <Text>{text}</Text>;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <Text>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <Text key={i} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* 썸네일 */}
      {/* {link.thumbnail ? (
        <Image source={{ uri: link.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
          <Text style={styles.placeholderIcon}>
            {link.type === "youtube"
              ? "🎬"
              : link.type === "article"
              ? "📄"
              : link.type === "blog"
              ? "📝"
              : "🔗"}
          </Text>
        </View>
      )} */}
      <View style={styles.thumbnailContainer}>
        {link.thumbnail ? (
          <Image
            source={{ uri: link.thumbnail }}
            style={styles.thumbnail}
            // resizeMode="contain"
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <Text style={styles.placeholderIcon}>
              {link.type === "youtube"
                ? "🎬"
                : link.type === "article"
                ? "📄"
                : link.type === "blog"
                ? "📝"
                : "🔗"}
            </Text>
          </View>
        )}
      </View>

      {/* 컨텐츠 */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: TYPE_COLORS[link.type] },
            ]}
          >
            <Text style={styles.typeText}>{link.type}</Text>
          </View>

          {matchedIn.length > 0 && (
            <View style={styles.matchBadges}>
              {matchedIn.map((match) => (
                <View key={match} style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>
                    {MATCH_LABELS[match]}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {matchedIn.includes("title")
            ? highlightText(link.title, query)
            : link.title}
        </Text>

        <Text style={styles.url} numberOfLines={1}>
          {link.url}
        </Text>

        {link.tags && link.tags.length > 0 && (
          <View style={styles.tags}>
            {link.tags.slice(0, 3).map((tag, i) => {
              const isMatched = matchedTags?.includes(tag);
              return (
                <View
                  key={i}
                  style={[styles.tag, isMatched && styles.tagMatched]}
                >
                  <Text
                    style={[styles.tagText, isMatched && styles.tagTextMatched]}
                  >
                    #{tag}
                  </Text>
                </View>
              );
            })}
            {link.tags.length > 3 && (
              <Text style={styles.moreTag}>+{link.tags.length - 3}</Text>
            )}
          </View>
        )}

        {matchedIn.includes("memo") && link.memo && (
          <View style={styles.memoPreview}>
            <Text style={styles.memoText} numberOfLines={1}>
              📝 {highlightText(link.memo, query)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 110,
  },
  thumbnailContainer: {
    width: 110,
    height: 80,
    borderRadius: 8,
    margin: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  placeholderThumbnail: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  matchBadges: {
    flexDirection: "row",
    gap: 4,
  },
  matchBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  matchBadgeText: {
    fontSize: 9,
    color: "#FF9800",
    fontWeight: "600",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
    lineHeight: 20,
  },
  highlight: {
    backgroundColor: "#FFEB3B",
    color: "#333",
  },
  url: {
    fontSize: 11,
    color: "#999",
    marginBottom: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagMatched: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  tagText: {
    fontSize: 11,
    color: "#666",
  },
  tagTextMatched: {
    color: "#1976D2",
    fontWeight: "600",
  },
  moreTag: {
    fontSize: 11,
    color: "#999",
  },
  memoPreview: {
    marginTop: 6,
  },
  memoText: {
    fontSize: 11,
    color: "#666",
  },
});
