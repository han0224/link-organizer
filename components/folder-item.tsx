// components/folder-item.tsx
import { Icon } from "@/components/ui/icon/icon";
import { FolderSchema } from "@/storage/folder-schema";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FolderItemProps {
  folder: FolderSchema;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onColorChange: () => void;
  colorModal?: React.ReactNode;
}

export default function FolderItem({
  folder,
  isEditing,
  editingName,
  onEditingNameChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onColorChange,
  colorModal,
}: FolderItemProps) {
  return (
    <View style={styles.folderItem}>
      <View style={styles.folderHeader}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.nameInput}
              value={editingName}
              onChangeText={onEditingNameChange}
              autoFocus
              onSubmitEditing={onSaveEdit}
            />
            <TouchableOpacity style={styles.actionIcon} onPress={onSaveEdit}>
              <Text style={styles.checkIcon}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIcon} onPress={onCancelEdit}>
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.folderInfo}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: folder.color },
              ]}
            />
            <Text style={styles.folderName}>{folder.name}</Text>
            <Text style={styles.linkCount}>{folder.links.length}개</Text>
          </View>
        )}
      </View>

      {!isEditing && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onColorChange}>
            <View
              style={[styles.colorPreview, { backgroundColor: folder.color }]}
            />
            <Text style={styles.actionText}>색상</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onStartEdit}>
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.actionText}>이름</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Icon name="trashFull" size={20} color="#FF3B30" />
            <Text style={[styles.actionText, { color: "#FF3B30" }]}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      {colorModal}
    </View>
  );
}

const styles = StyleSheet.create({
  folderItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  folderHeader: {
    marginBottom: 12,
  },
  folderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  linkCount: {
    fontSize: 14,
    color: "#999",
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  actionIcon: {
    padding: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionText: {
    fontSize: 14,
    color: "#007AFF",
  },
  checkIcon: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "bold",
  },
  editIcon: {
    fontSize: 16,
  },
});
