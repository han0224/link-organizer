// components/link-folder-info.tsx
import { FolderSchema } from "@/storage/folder-schema";
import { StyleSheet, Text, View } from "react-native";

interface LinkFolderInfoProps {
  folder: FolderSchema;
}

export default function LinkFolderInfo({ folder }: LinkFolderInfoProps) {
  return (
    <View style={styles.folderInfo}>
      <View style={[styles.folderColor, { backgroundColor: folder.color }]} />
      <Text style={styles.folderName}>{folder.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  folderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  folderColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  folderName: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
});
