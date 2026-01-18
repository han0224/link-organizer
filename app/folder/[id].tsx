import LinkList from "@/components/link-list";
import { Header } from "@/components/ui";
import { FolderSchema } from "@/storage/folder-schema";
import { getFolderById } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { getLinksByFolderId } from "@/storage/link-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TabScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [folder, setFolder] = useState<FolderSchema | null>(null);
  useEffect(() => {
    loadLinks();
    loadFolder();
  }, [id]);

  const loadLinks = async () => {
    const links = await getLinksByFolderId(id);
    console.log("links", links);
    setLinks(links);
  };
  const loadFolder = async () => {
    const folder = await getFolderById(id);
    setFolder(folder);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 추가 */}
      <Header title={folder?.name || ""} />
      <LinkList links={links} onLinkDeleted={loadLinks} />
    </View>
  );
  // return <LinkList links={links} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  // 헤더 스타일 추가 (all.tsx와 동일한 높이)
  header: {
    height: 105 / 2,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "white",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
});
