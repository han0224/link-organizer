// components/LinkCard.tsx
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "../types";

interface Props {
  link: Link;
  onPress: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  blog: "#00C853",
  article: "#2196F3",
  video: "#9C27B0",
  other: "#757575",
};

export default function LinkCard({ link, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: TYPE_COLORS[link.type] },
          ]}
        >
          <Text style={styles.typeText}>{link.type}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {link.title}
        </Text>
        <Text style={styles.url} numberOfLines={1}>
          {link.url}
        </Text>
        {link.tags.length > 0 && (
          <View style={styles.tags}>
            {link.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <View>
          {link.thumbnail && (
            <ImageBackground
              source={{ uri: link.thumbnail }}
              style={styles.thumbnail}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  typeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  url: { fontSize: 12, color: "#666", marginBottom: 8 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: { fontSize: 12, color: "#666" },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
});
