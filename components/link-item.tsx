import { BaseColors } from "@/constants/theme";
import { LinkSchema } from "@/storage/link-schema";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Checkbox, Icon } from "./ui";

export default function LinkItem({
  link,
  onLongPress,
  isChecked = false,
  onCheckChange = () => {},
  isViewCheckbox = false,
}: {
  link: LinkSchema;
  onLongPress?: () => void;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  isViewCheckbox?: boolean;
}) {
  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=14`;
    } catch {
      return null;
    }
  };
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return url;
    }
  };
  const handleLongPress = () => {
    onLongPress?.();
    console.log("long press");
  };
  return (
    <View key={link.id} style={styles.linkCard}>
      <Pressable
        style={({ pressed }) => [
          styles.linkCardPressable,
          pressed && styles.linkCardPressed,
        ]}
        onLongPress={handleLongPress}
        delayLongPress={300}
        onPress={() => {
          if (isViewCheckbox) {
            onCheckChange(!isChecked);
          } else {
            router.push(`/link/${link.id}`);
          }
        }}
      >
        {isViewCheckbox && (
          <Checkbox checked={isChecked} onChange={onCheckChange} size="md" />
        )}
        {link.thumbnail ? (
          <Image source={{ uri: link.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Icon name="file" size={20} color={BaseColors.gray[400]} />
          </View>
        )}
        <View style={styles.linkContent}>
          <Text style={styles.linkTitle} numberOfLines={1}>
            {link.title}
          </Text>
          <View style={styles.linkMeta}>
            {getFaviconUrl(link.url) ? (
              <Image
                source={{ uri: getFaviconUrl(link.url)! }}
                style={styles.favicon}
              />
            ) : (
              <Icon name="file" size={14} color={BaseColors.gray[400]} />
            )}
            <Text style={styles.linkDomain} numberOfLines={1}>
              {getDomain(link.url)}
            </Text>
          </View>
        </View>
      </Pressable>
      {/* <Pressable
        style={styles.moreButton}
        onPress={() => router.push(`/link/${link.id}`)}
      >
        <Icon name="hamburger" size={20} color={BaseColors.gray[400]} />
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
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
  linkCardPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
  },
  thumbnailPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: BaseColors.gray[200],
    justifyContent: "center",
    alignItems: "center",
  },
  linkContent: {
    flex: 1,
    minWidth: 0,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#121617",
    marginBottom: 4,
  },
  linkMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  favicon: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  linkDomain: {
    fontSize: 12,
    color: BaseColors.gray[500],
  },
  moreButton: {
    padding: 4,
  },
});
