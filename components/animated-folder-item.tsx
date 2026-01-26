import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { FolderSchema } from "@/storage/folder-schema";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AnimatedFolderItemProps {
  folder: FolderSchema;
  isSelected: boolean;
  editingMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggleSelect: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}

export default function AnimatedFolderItem({
  folder,
  isSelected,
  editingMode,
  onPress,
  onLongPress,
  onToggleSelect,
  onStartEdit,
  onDelete,
}: AnimatedFolderItemProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
      style={({ pressed }) => [
        styles.folderItem,
        pressed && !editingMode && styles.folderItemPressed,
      ]}
    >
      <View
        style={[
          styles.folderItemContent,
          isSelected && styles.folderItemSelected,
        ]}
      >
        {editingMode && (
          <TouchableOpacity style={styles.checkbox} onPress={onToggleSelect}>
            <View
              style={[
                styles.checkboxInner,
                isSelected && styles.checkboxInnerSelected,
              ]}
            >
              {isSelected && <Text style={styles.checkMarkSmall}>✓</Text>}
            </View>
          </TouchableOpacity>
        )}
        <View
          style={[
            styles.folderIconContainer,
            {
              backgroundColor: `${folder.color || BaseColors.primary[500]}1A`,
            },
          ]}
        >
          <Icon
            name="folder"
            size={24}
            color={folder.color || BaseColors.primary[500]}
          />
        </View>
        <View style={styles.folderContent}>
          <Text style={styles.folderName} numberOfLines={1}>
            {folder.name}
          </Text>
          <Text style={styles.folderCount}>{folder.links.length}개의 링크</Text>
        </View>
        {editingMode ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={onStartEdit}
            >
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={onDelete}
            >
              <Icon name="trashFull" size={18} color={BaseColors.red[500]} />
            </TouchableOpacity>
          </View>
        ) : (
          <Icon name="rightArrow" size={20} color={BaseColors.gray[400]} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  folderItem: {
    borderRadius: 12,
    marginVertical: 0,
  },
  folderItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    transitionProperty: "all",
    transitionDuration: "200ms",
  },
  folderItemSelected: {
    borderColor: BaseColors.primary[500],
    borderWidth: 2,
    backgroundColor: `${BaseColors.primary[500]}0A`,
  },
  folderItemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: BaseColors.gray[400],
    backgroundColor: BaseColors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInnerSelected: {
    backgroundColor: BaseColors.primary[500],
    borderColor: BaseColors.primary[500],
  },
  checkMarkSmall: {
    fontSize: 14,
    color: BaseColors.white,
    fontWeight: "bold",
  },
  folderIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  folderContent: {
    flex: 1,
    minWidth: 0,
  },
  folderName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#121617",
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 12,
    color: BaseColors.gray[500],
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  editActionButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 18,
  },
});
