// components/link-action-buttons.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LinkActionButtonsProps {
  onOpenLink: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function LinkActionButtons({
  onOpenLink,
  onEdit,
  onDelete,
}: LinkActionButtonsProps) {
  return (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.openButton} onPress={onOpenLink}>
        <Text style={styles.openButtonText}>링크 열기</Text>
      </TouchableOpacity>

      <View style={styles.secondaryActions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 20,
    paddingBottom: 40,
  },
  openButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  openButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "500",
  },
});
