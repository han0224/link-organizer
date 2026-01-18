// app/setting/folder/index.tsx
import ColorPickerModal from "@/components/color-picker-modal";
import FolderItem from "@/components/folder-item";
import { Header } from "@/components/ui";
import { FolderSchema } from "@/storage/folder-schema";
import {
  createFolder,
  deleteFolder,
  getAllFolders,
  updateFolder,
} from "@/storage/folder-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingFolderScreen() {
  const [folders, setFolders] = useState<FolderSchema[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [colorModalVisible, setColorModalVisible] = useState<string | null>(
    null
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#007AFF");

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [])
  );

  const loadFolders = async () => {
    const folderList = await getAllFolders();
    setFolders(folderList);
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
              } catch (error: any) {
                Alert.alert(
                  "오류",
                  error.message || "폴더 삭제에 실패했습니다"
                );
              }
            },
          },
        ]
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
            } catch (error: any) {
              Alert.alert("오류", error.message || "폴더 삭제에 실패했습니다");
            }
          },
        },
      ]);
    }
  };

  const handleStartEdit = (folder: FolderSchema) => {
    setEditingId(folder.id);
    setEditingName(folder.name);
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

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert("오류", "폴더 이름을 입력해주세요");
      return;
    }

    try {
      await createFolder({
        name: newFolderName.trim(),
        color: newFolderColor,
      });
      setAddModalVisible(false);
      setNewFolderName("");
      setNewFolderColor("#007AFF");
      await loadFolders();
    } catch (error: any) {
      Alert.alert("오류", error.message || "폴더 생성에 실패했습니다");
    }
  };

  const handleCancelAdd = () => {
    setAddModalVisible(false);
    setNewFolderName("");
    setNewFolderColor("#007AFF");
  };

  const renderFolderItem = ({ item: folder }: { item: FolderSchema }) => {
    const isEditing = editingId === folder.id;

    return (
      <>
        <FolderItem
          folder={folder}
          isEditing={isEditing}
          editingName={editingName}
          onEditingNameChange={setEditingName}
          onSaveEdit={() => handleSaveEdit(folder.id)}
          onCancelEdit={handleCancelEdit}
          onStartEdit={() => handleStartEdit(folder)}
          onDelete={() => handleDelete(folder)}
          onColorChange={() => setColorModalVisible(folder.id)}
          colorModal={
            <ColorPickerModal
              visible={colorModalVisible === folder.id}
              selectedColor={folder.color}
              onColorSelect={(color) => handleColorChange(folder, color)}
              onClose={() => setColorModalVisible(null)}
            />
          }
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="폴더 관리" />
      {folders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>폴더가 없습니다</Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* 폴더 추가 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 폴더 추가 모달 */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelAdd}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancelAdd}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>새 폴더</Text>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>폴더 이름</Text>
              <TextInput
                style={styles.modalInput}
                value={newFolderName}
                onChangeText={setNewFolderName}
                placeholder="폴더 이름을 입력하세요"
                autoFocus
                onSubmitEditing={handleAddFolder}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>색상</Text>
              <View style={styles.colorGrid}>
                {[
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#FFA500",
                  "#800080",
                  "#FFC0CB",
                  "#A52A2A",
                  "#808080",
                  "#000000",
                  "#FFFFFF",
                  "#007AFF",
                ].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      newFolderColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setNewFolderColor(color)}
                  >
                    {newFolderColor === color && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelAdd}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddFolder}
              >
                <Text style={styles.saveButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderColor: "#007AFF",
    borderWidth: 3,
  },
  checkMark: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
