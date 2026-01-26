import { BaseColors } from "@/constants/theme";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export type SearchFilterType = "all" | "link" | "folder" | "tag";

interface SearchFilterBarProps {
  selectedFilter: SearchFilterType;
  onFilterChange: (filter: SearchFilterType) => void;
}

const FILTER_OPTIONS: { value: SearchFilterType; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "link", label: "링크" },
  { value: "folder", label: "폴더" },
  { value: "tag", label: "태그" },
];

export default function SearchFilterBar({
  selectedFilter,
  onFilterChange,
}: SearchFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = selectedFilter === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.filterItem, isActive && styles.filterItemActive]}
            onPress={() => onFilterChange(option.value)}
          >
            <Text
              style={[styles.filterText, isActive && styles.filterTextActive]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: 68, // filterItem height (36) + paddingVertical (16 * 2)
    // backgroundColor: "blue",
  },
  container: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterItem: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: BaseColors.white,
    borderWidth: 1,
    borderColor: BaseColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  filterItemActive: {
    backgroundColor: BaseColors.primary[500],
    borderColor: BaseColors.primary[500],
    shadowColor: BaseColors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: BaseColors.gray[600],
  },
  filterTextActive: {
    color: BaseColors.white,
    fontWeight: "600",
  },
});
