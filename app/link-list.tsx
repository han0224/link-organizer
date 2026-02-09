// app/index.tsx
import BottomNavigation from "@/components/bottom-navigation";
import DashboardHeader from "@/components/dashboard-header";
import FloatingButton from "@/components/floating-button";
import LinkItem from "@/components/link-item";
import { BaseColors } from "@/constants/theme";
import { LinkSchema } from "@/storage/link-schema";
import { getAllLinks } from "@/storage/link-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function LinkListScreen() {
  const [links, setLinks] = useState<LinkSchema[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, []),
  );

  const loadLinks = async () => {
    const data = await getAllLinks();
    setLinks(data);
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.linksContainer}>
          {links.length === 0 ? (
            <View style={styles.emptyLink}>
              <Text style={styles.emptyText}>링크가 없습니다</Text>
            </View>
          ) : (
            links.map((link) => <LinkItem key={link.id} link={link} />)
          )}
        </View>
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
  linksContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyLink: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: BaseColors.gray[400],
  },
  fab: {
    bottom: 96, // 하단 네비게이션 위에 위치
  },
});
