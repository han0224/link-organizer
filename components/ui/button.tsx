import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "primary" | "secondary" | "danger" | "success";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const COLORS = {
  primary: "#3B82F6",
  secondary: "#6B7280",
  danger: "#EF4444",
  success: "#22C55E",
};

const SIZES = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderRadius: 6,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 8,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 18,
    borderRadius: 10,
  },
};

export function Button({
  title,
  variant = "solid",
  size = "md",
  color = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const baseColor = COLORS[color];
  const sizeStyle = SIZES[size];

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: sizeStyle.paddingVertical,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      borderRadius: sizeStyle.borderRadius,
      opacity: isDisabled ? 0.5 : 1,
    };

    if (fullWidth) {
      base.width = "100%";
    }

    switch (variant) {
      case "solid":
        return { ...base, backgroundColor: baseColor };
      case "outline":
        return {
          ...base,
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: baseColor,
        };
      case "ghost":
        return { ...base, backgroundColor: "transparent" };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: sizeStyle.fontSize,
      fontWeight: "600",
    };

    switch (variant) {
      case "solid":
        return { ...base, color: "#FFFFFF" };
      case "outline":
      case "ghost":
        return { ...base, color: baseColor };
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "solid" ? "#FFFFFF" : baseColor}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={getTextStyle()}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}
