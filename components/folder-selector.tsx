import { DEFAULT_FOLDER, DEFAULT_FOLDER_NAME } from "@/constants";
import { createFolder, getFolders } from "@/utils/storage";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
}

export default function FolderSelector({
  selectedFolder,
  onSelectFolder,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    const folders = await getFolders();
    setFolders(folders);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName.trim());
      await loadFolders();

      onSelectFolder(newFolderName.trim());
      setNewFolderName("");
      setShowCreateInput(false);
      setModalVisible(false);
    } catch (error: any) {
      alert(error.message || "폴더 생성에 실패했습니다");
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.label}>폴더</Text>
        <Text style={styles.selectedFolder}>{selectedFolder}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>폴더 선택</Text>

            {showCreateInput ? (
              <View style={styles.createInputContainer}>
                <TextInput
                  style={styles.createInput}
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="폴더 이름 입력"
                  autoFocus
                />
                <View style={styles.createButtons}>
                  <TouchableOpacity
                    style={[styles.createButton, styles.cancelButton]}
                    onPress={() => {
                      setShowCreateInput(false);
                      setNewFolderName("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.createButton, styles.confirmButton]}
                    onPress={handleCreateFolder}
                  >
                    <Text style={styles.confirmButtonText}>생성</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.folderList}>
                  <TouchableOpacity
                    style={[
                      styles.folderItem,
                      selectedFolder === DEFAULT_FOLDER &&
                        styles.folderItemSelected,
                    ]}
                    onPress={() => {
                      onSelectFolder(DEFAULT_FOLDER);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.folderText,
                        selectedFolder === DEFAULT_FOLDER &&
                          styles.folderTextSelected,
                      ]}
                    >
                      {DEFAULT_FOLDER_NAME}
                    </Text>
                    {selectedFolder === DEFAULT_FOLDER && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                  {folders.map((folder) => (
                    <TouchableOpacity
                      key={folder}
                      style={[
                        styles.folderItem,
                        selectedFolder === folder && styles.folderItemSelected,
                      ]}
                      onPress={() => {
                        onSelectFolder(folder);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.folderText,
                          selectedFolder === folder &&
                            styles.folderTextSelected,
                        ]}
                      >
                        {folder}
                      </Text>
                      {selectedFolder === folder && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.newFolderButton}
                  onPress={() => setShowCreateInput(true)}
                >
                  <Text style={styles.newFolderButtonText}>
                    + 새 폴더 만들기
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 12,
    color: "#333",
  },
  selectedFolder: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  arrow: {
    fontSize: 12,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  folderList: {
    maxHeight: 300,
  },
  folderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  folderItemSelected: {
    backgroundColor: "#E3F2FD",
  },
  folderText: {
    fontSize: 16,
    color: "#333",
  },
  folderTextSelected: {
    color: "#1976D2",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 18,
    color: "#1976D2",
    fontWeight: "bold",
  },
  newFolderButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  newFolderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createInputContainer: {
    marginTop: 8,
  },
  createInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  createButtons: {
    flexDirection: "row",
    gap: 12,
  },
  createButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
