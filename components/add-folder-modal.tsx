import { BaseColors } from "@/constants/theme";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = [
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
];

interface AddFolderModalProps {
  visible: boolean;
  folderName: string;
  folderColor: string;
  onFolderNameChange: (name: string) => void;
  onFolderColorChange: (color: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AddFolderModal({
  visible,
  folderName,
  folderColor,
  onFolderNameChange,
  onFolderColorChange,
  onSave,
  onCancel,
}: AddFolderModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onCancel}
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
              value={folderName}
              onChangeText={onFolderNameChange}
              placeholder="폴더 이름을 입력하세요"
              placeholderTextColor={BaseColors.gray[400]}
              autoFocus
              onSubmitEditing={onSave}
            />
          </View>
          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>색상</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    folderColor === color && styles.selectedColor,
                  ]}
                  onPress={() => onFolderColorChange(color)}
                >
                  {folderColor === color && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onSave}
            >
              <Text style={styles.confirmButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: BaseColors.white,
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121617",
    marginBottom: 16,
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#121617",
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#121617",
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
    borderColor: BaseColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderColor: BaseColors.primary[500],
    borderWidth: 3,
  },
  checkMark: {
    fontSize: 16,
    color: BaseColors.white,
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: BaseColors.gray[100],
  },
  confirmButton: {
    backgroundColor: BaseColors.primary[500],
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121617",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: BaseColors.white,
  },
});
