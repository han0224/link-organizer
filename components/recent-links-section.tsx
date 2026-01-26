import { BaseColors } from "@/constants/theme";
import { LinkSchema } from "@/storage/link-schema";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "./ui";

interface RecentLinksSectionProps {
  links: LinkSchema[];
}

export default function RecentLinksSection({
  links,
}: RecentLinksSectionProps) {
  const router = useRouter();

  // 최대 4개만 표시
  const displayLinks = links.slice(0, 4);

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

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 링크</Text>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.viewAllText}>모두 보기</Text>
        </Pressable>
      </View>
      <View style={styles.linksContainer}>
        {displayLinks.length === 0 ? (
          <View style={styles.emptyLink}>
            <Text style={styles.emptyText}>링크가 없습니다</Text>
          </View>
        ) : (
          displayLinks.map((link) => (
            <View key={link.id} style={styles.linkCard}>
              <Pressable
                style={styles.linkCardPressable}
                onPress={() => router.push(`/link/${link.id}`)}
              >
                {link.thumbnail ? (
                  <Image
                    source={{ uri: link.thumbnail }}
                    style={styles.thumbnail}
                  />
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
              <Pressable
                style={styles.moreButton}
                onPress={() => router.push(`/link/${link.id}`)}
              >
                <Icon name="hamburger" size={20} color={BaseColors.gray[400]} />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: BaseColors.gray[500],
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: BaseColors.primary[500],
  },
  linksContainer: {
    gap: 8,
  },
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
  emptyLink: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: BaseColors.gray[400],
  },
});
