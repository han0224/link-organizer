import AddFolderModal from "@/components/add-folder-modal";
import AnimatedFolderItem from "@/components/animated-folder-item";
import BottomNavigation from "@/components/bottom-navigation";
import FoldersHeader from "@/components/folders-header";
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  updateFolder,
} from "@/storage/folder-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";

export default function FoldersScreen() {
  const router = useRouter();
  const [folders, setFolders] = useState<FolderSchema[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#007AFF");
  const [editingMode, setEditingMode] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [colorModalVisible, setColorModalVisible] = useState<string | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, []),
  );

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    setFolders(folderList);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert("오류", "폴더 이름을 입력해주세요");
      return;
    }

    try {
      await createFolder({
        name: newFolderName.trim(),
        color: newFolderColor,
      });
      await loadFolders();
      setShowAddModal(false);
      setNewFolderName("");
      setNewFolderColor("#007AFF");
    } catch (error: any) {
      Alert.alert("오류", error.message || "폴더 생성에 실패했습니다");
    }
  };

  const handleLongPress = (folder: FolderSchema) => {
    if (!editingMode) {
      // 햅틱 피드백
      if (Platform.OS !== "web") {
        Vibration.vibrate(50);
      }
      setEditingMode(true);
      setSelectedFolders(new Set([folder.id]));
    }
  };

  const handleToggleSelect = (folderId: string) => {
    if (!editingMode) return;
    const newSelected = new Set(selectedFolders);
    if (newSelected.has(folderId)) {
      newSelected.delete(folderId);
    } else {
      newSelected.add(folderId);
    }
    setSelectedFolders(newSelected);
    if (newSelected.size === 0) {
      setEditingMode(false);
    }
  };

  const handleStartEdit = (folder: FolderSchema) => {
    setEditingId(folder.id);
    setEditingName(folder.name);
    setEditingMode(false);
    setSelectedFolders(new Set());
  };

  const handleSaveEdit = async (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder || !editingName.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await updateFolder({
        ...folder,
        name: editingName.trim(),
      });
      setEditingId(null);
      await loadFolders();
    } catch (error: any) {
      Alert.alert("오류", error.message || "폴더 이름 변경에 실패했습니다");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (folder: FolderSchema) => {
    if (folder.links.length > 0) {
      Alert.alert(
        "폴더 삭제",
        `"${folder.name}" 폴더에 ${folder.links.length}개의 링크가 있습니다. 삭제하시겠습니까?`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteFolder(folder.id);
                await loadFolders();
                setEditingMode(false);
                setSelectedFolders(new Set());
              } catch (error: any) {
                Alert.alert(
                  "오류",
                  error.message || "폴더 삭제에 실패했습니다",
                );
              }
            },
          },
        ],
      );
    } else {
      Alert.alert("폴더 삭제", `"${folder.name}" 폴더를 삭제하시겠습니까?`, [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFolder(folder.id);
              await loadFolders();
              setEditingMode(false);
              setSelectedFolders(new Set());
            } catch (error: any) {
              Alert.alert("오류", error.message || "폴더 삭제에 실패했습니다");
            }
          },
        },
      ]);
    }
  };

  const handleColorChange = async (folder: FolderSchema, color: string) => {
    try {
      await updateFolder({
        ...folder,
        color,
      });
      setColorModalVisible(null);
      await loadFolders();
    } catch (error: any) {
      Alert.alert("오류", error.message || "색상 변경에 실패했습니다");
    }
  };

  const handleBulkDelete = () => {
    const selectedCount = selectedFolders.size;
    Alert.alert("폴더 삭제", `${selectedCount}개의 폴더를 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            for (const folderId of selectedFolders) {
              await deleteFolder(folderId);
            }
            await loadFolders();
            setEditingMode(false);
            setSelectedFolders(new Set());
          } catch (error: any) {
            Alert.alert("오류", error.message || "폴더 삭제에 실패했습니다");
          }
        },
      },
    ]);
  };

  // 검색 필터링
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <FoldersHeader
        editingMode={editingMode}
        selectedCount={selectedFolders.size}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBack={() => router.back()}
        onCancel={() => {
          setEditingMode(false);
          setSelectedFolders(new Set());
        }}
        onAdd={() => setShowAddModal(true)}
        onBulkDelete={handleBulkDelete}
        canDelete={selectedFolders.size > 0}
      />

      {/* 폴더 리스트 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredFolders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? "검색 결과가 없습니다" : "폴더가 없습니다"}
            </Text>
          </View>
        ) : (
          <View style={styles.folderList}>
            {filteredFolders.map((folder) => (
              <AnimatedFolderItem
                key={folder.id}
                folder={folder}
                isSelected={selectedFolders.has(folder.id)}
                editingMode={editingMode}
                onPress={() => {
                  if (editingMode) {
                    handleToggleSelect(folder.id);
                  } else if (editingId === folder.id) {
                    // 편집 중일 때는 아무 동작도 하지 않음
                  } else {
                    router.push(`/folder/${folder.id}`);
                  }
                }}
                onLongPress={() => handleLongPress(folder)}
                onToggleSelect={() => handleToggleSelect(folder.id)}
                onStartEdit={() => handleStartEdit(folder)}
                onDelete={() => handleDelete(folder)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNavigation />

      <AddFolderModal
        visible={showAddModal}
        folderName={newFolderName}
        folderColor={newFolderColor}
        onFolderNameChange={setNewFolderName}
        onFolderColorChange={setNewFolderColor}
        onSave={handleCreateFolder}
        onCancel={() => {
          setShowAddModal(false);
          setNewFolderName("");
          setNewFolderColor("#007AFF");
        }}
      />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  folderList: {
    gap: 12,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: BaseColors.gray[400],
  },
});
