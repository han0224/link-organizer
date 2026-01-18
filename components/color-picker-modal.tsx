// components/color-picker-modal.tsx
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = [
  "#FF0000", // 빨강
  "#00FF00", // 초록
  "#0000FF", // 파랑
  "#FFFF00", // 노랑
  "#FF00FF", // 마젠타
  "#00FFFF", // 시안
  "#FFA500", // 주황
  "#800080", // 보라
  "#FFC0CB", // 분홍
  "#A52A2A", // 갈색
  "#808080", // 회색
  "#000000", // 검정
  "#FFFFFF", // 흰색
  "#007AFF", // 파란색
];

interface ColorPickerModalProps {
  visible: boolean;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export default function ColorPickerModal({
  visible,
  selectedColor,
  onColorSelect,
  onClose,
}: ColorPickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>색상 선택</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => onColorSelect(color)}
              >
                {selectedColor === color && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});
