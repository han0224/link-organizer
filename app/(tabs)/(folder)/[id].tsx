import LinkList from "@/components/link-list";
import { DEFAULT_FOLDER, DEFAULT_FOLDER_NAME } from "@/constants";
import { Link } from "@/types";
import { getLinksByFolder } from "@/utils/storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TabScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [links, setLinks] = useState<Link[]>([]);
  useEffect(() => {
    loadLinks();
  }, [id]);

  const loadLinks = async () => {
    const links = await getLinksByFolder(id);
    setLinks(links);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 추가 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {DEFAULT_FOLDER === id ? DEFAULT_FOLDER_NAME : id}
        </Text>
        {/* <Text style={styles.headerTitle}>폴더</Text> */}
      </View>
      <LinkList links={links} />
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
