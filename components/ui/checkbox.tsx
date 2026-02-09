import { BaseColors } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  color?: string;
  disabled?: boolean;
  label?: string;
  style?: ViewStyle;
}

const SIZES = {
  sm: { outer: 18, inner: 14, check: 10, borderRadius: 3, borderWidth: 1.5 },
  md: { outer: 24, inner: 20, check: 14, borderRadius: 4, borderWidth: 2 },
  lg: { outer: 32, inner: 28, check: 18, borderRadius: 6, borderWidth: 2 },
};

export function Checkbox({
  checked,
  onChange,
  size = "md",
  color = BaseColors.primary[500],
  disabled = false,
  label,
  style,
}: CheckboxProps) {
  const s = SIZES[size];

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <View
        style={[
          styles.outer,
          {
            width: s.outer,
            height: s.outer,
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: s.inner,
              height: s.inner,
              borderRadius: s.borderRadius,
              borderWidth: s.borderWidth,
              borderColor: checked ? color : BaseColors.gray[400],
              backgroundColor: checked ? color : BaseColors.white,
            },
            disabled && styles.disabled,
          ]}
        >
          {checked && (
            <Text
              style={[
                styles.checkMark,
                { fontSize: s.check, color: BaseColors.white },
              ]}
            >
              ✓
            </Text>
          )}
        </View>
      </View>
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  outer: {
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  checkMark: {
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#121617",
  },
  labelDisabled: {
    color: BaseColors.gray[400],
  },
});
