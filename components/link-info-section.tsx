// components/link-info-section.tsx
import { StyleSheet, Text, View, ViewProps } from "react-native";

interface LinkInfoSectionProps extends ViewProps {
  title: string;
  children: React.ReactNode;
}

export default function LinkInfoSection({
  title,
  children,
  style,
  ...props
}: LinkInfoSectionProps) {
  return (
    <View style={[styles.section, style]} {...props}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
});
