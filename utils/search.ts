// utils/search.ts
import { LinkSchema } from "@/storage/link-schema";

export type SearchFilter = "all" | "title" | "tag" | "memo";

export interface SearchResult {
  link: LinkSchema;
  matchedIn: ("title" | "tag" | "memo")[];
  matchedTags?: string[];
}

export function searchLinks(
  links: LinkSchema[],
  query: string,
  filter: SearchFilter = "all"
): SearchResult[] {
  if (!query.trim()) {
    return links.map((link) => ({ link, matchedIn: [] }));
  }

  const normalizedQuery = query.toLowerCase().trim();

  // #태그 형식으로 검색하면 태그만 검색
  const isTagSearch = normalizedQuery.startsWith("#");
  const searchTerm = isTagSearch ? normalizedQuery.slice(1) : normalizedQuery;

  if (isTagSearch || filter === "tag") {
    return searchByTag(links, searchTerm);
  }

  return links
    .map((link) => matchLink(link, searchTerm, filter))
    .filter((result) => result.matchedIn.length > 0);
}

function matchLink(
  link: LinkSchema,
  query: string,
  filter: SearchFilter
): SearchResult {
  const matchedIn: ("title" | "tag" | "memo")[] = [];
  const matchedTags: string[] = [];

  // 제목 검색
  if (
    (filter === "all" || filter === "title") &&
    link.title.toLowerCase().includes(query)
  ) {
    matchedIn.push("title");
  }

  // 태그 검색
  if (filter === "all" || filter === "tag") {
    link.tags?.forEach((tag) => {
      if (tag.toLowerCase().includes(query)) {
        if (!matchedIn.includes("tag")) matchedIn.push("tag");
        matchedTags.push(tag);
      }
    });
  }

  // 메모 검색
  if (
    (filter === "all" || filter === "memo") &&
    link.memo?.toLowerCase().includes(query)
  ) {
    matchedIn.push("memo");
  }

  return { link, matchedIn, matchedTags };
}

function searchByTag(links: LinkSchema[], tagQuery: string): SearchResult[] {
  return links
    .map((link) => {
      const matchedTags = link.tags?.filter((tag) =>
        tag.toLowerCase().includes(tagQuery)
      );
      return {
        link,
        matchedIn:
          matchedTags && matchedTags.length > 0 ? ["tag" as const] : [],
        matchedTags: matchedTags ?? [],
      };
    })
    .filter((result) => result.matchedIn.length > 0);
}
