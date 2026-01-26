import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Icon } from "./ui";

interface FolderSectionProps {
  folders: FolderSchema[];
}

export default function FolderSection({ folders }: FolderSectionProps) {
  const router = useRouter();

  // 최대 4개만 표시
  const displayFolders = folders.slice(0, 4);

  const getFolderIcon = (color: string) => {
    // 색상에 따라 다른 아이콘을 반환할 수 있지만, 일단 folder 아이콘 사용
    return "folder";
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>내 폴더</Text>
        <Pressable onPress={() => router.push("/folders")}>
          <Text style={styles.viewAllText}>전체 보기</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.folderScroll}
      >
        {displayFolders.length === 0 ? (
          <View style={styles.emptyFolder}>
            <Text style={styles.emptyText}>폴더가 없습니다</Text>
          </View>
        ) : (
          displayFolders.map((folder) => (
            <Pressable
              key={folder.id}
              style={styles.folderCard}
              onPress={() => router.push(`/folder/${folder.id}`)}
            >
              <View
                style={[
                  styles.folderIconContainer,
                  { backgroundColor: `${folder.color}1A` },
                ]}
              >
                <Icon
                  name="folder"
                  size={18}
                  color={folder.color || BaseColors.primary[500]}
                />
              </View>
              <Text style={styles.folderName} numberOfLines={1}>
                {folder.name}
              </Text>
              <Text style={styles.folderCount}>
                {folder.links.length}개 링크
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: BaseColors.gray[500],
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  folderScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  folderCard: {
    width: 128,
    backgroundColor: BaseColors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  folderIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  folderName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#121617",
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 10,
    color: BaseColors.gray[500],
  },
  emptyFolder: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: BaseColors.gray[400],
  },
});
