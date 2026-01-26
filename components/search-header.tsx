import { Icon } from "@/components/ui";
import { BaseColors } from "@/constants/theme";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCancel: () => void;
}

export default function SearchHeader({
  searchQuery,
  onSearchChange,
  onCancel,
}: SearchHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header]}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Icon name="search" size={20} color={BaseColors.primary[500]} />
          </View>
          <TextInput
            autoFocus
            style={styles.input}
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="검색어 입력..."
            placeholderTextColor={BaseColors.gray[400]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={() => onSearchChange("")}
            >
              <View style={styles.clearButtonInner}>
                <Icon name="close" size={18} color={BaseColors.gray[500]} />
              </View>
            </Pressable>
          )}
        </View>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>취소</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: BaseColors.background,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    backgroundColor: BaseColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
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
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#101719",
  },
  clearButton: {
    paddingRight: 8,
  },
  clearButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: BaseColors.gray[100],
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: BaseColors.primary[500],
  },
});
