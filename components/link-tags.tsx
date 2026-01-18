// components/link-tags.tsx
import { StyleSheet, Text, View } from "react-native";

interface LinkTagsProps {
  tags: string[];
}

export default function LinkTags({ tags }: LinkTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <View style={styles.tags}>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>#{tag}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
