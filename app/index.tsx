// app/index.tsx
import LinkList from "@/components/link-list";
import { Header } from "@/components/ui";
import { LinkSchema } from "@/storage/link-schema";
import { getAllLinks } from "@/storage/link-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [links, setLinks] = useState<LinkSchema[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, [])
  );

  const loadLinks = async () => {
    const data = await getAllLinks();
    setLinks(data);
  };

  return (
    <View style={styles.container}>
      <Header title="모든 링크" />
      <LinkList links={links} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
