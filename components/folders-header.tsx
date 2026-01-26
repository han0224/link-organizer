import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FoldersHeaderProps {
  editingMode: boolean;
  selectedCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  onCancel: () => void;
  onAdd: () => void;
  onBulkDelete: () => void;
  canDelete: boolean;
}

export default function FoldersHeader({
  editingMode,
  selectedCount,
  searchQuery,
  onSearchChange,
  onBack,
  onCancel,
  onAdd,
  onBulkDelete,
  canDelete,
}: FoldersHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          {editingMode ? (
            <TouchableOpacity style={styles.backButton} onPress={onCancel}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Icon
                name="leftArrow"
                size={24}
                color={BaseColors.primary[500]}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {editingMode ? `${selectedCount}개 선택됨` : "전체 폴더"}
          </Text>
        </View>
        {editingMode ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onBulkDelete}
            disabled={!canDelete}
          >
            <Icon
              name="trashFull"
              size={20}
              color={canDelete ? BaseColors.red[500] : BaseColors.gray[400]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Icon name="add" size={24} color={BaseColors.white} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchIconContainer}>
          <Icon name="search" size={20} color={BaseColors.gray[400]} />
        </View>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="폴더 검색..."
          placeholderTextColor={BaseColors.gray[400]}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BaseColors.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: BaseColors.primary[500],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#121617",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BaseColors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BaseColors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: BaseColors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIconContainer: {
    paddingLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
});
