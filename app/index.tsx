// app/index.tsx
import BottomNavigation from "@/components/bottom-navigation";
import DashboardHeader from "@/components/dashboard-header";
import FloatingButton from "@/components/floating-button";
import FolderSection from "@/components/folder-section";
import RecentLinksSection from "@/components/recent-links-section";
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import { getAllFolders } from "@/storage/folder-storage";
import { LinkSchema } from "@/storage/link-schema";
import { getAllLinks } from "@/storage/link-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [links, setLinks] = useState<LinkSchema[]>([]);
  const [folders, setFolders] = useState<FolderSchema[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadLinks();
      loadFolders();
    }, []),
  );

  const loadLinks = async () => {
    const data = await getAllLinks();
    setLinks(data);
  };

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    setFolders(folderList);
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FolderSection folders={folders} />
        <RecentLinksSection links={links} />
      </ScrollView>
      <FloatingButton
        onPress={() => router.push("/add-link")}
        icon="add"
        style={styles.fab}
      />
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 하단 네비게이션과 FAB을 위한 공간
  },
  fab: {
    bottom: 96, // 하단 네비게이션 위에 위치
  },
});
