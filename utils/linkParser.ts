// utils/linkParser.ts
import { LinkType } from "../types";

export function detectLinkType(url: string): LinkType {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  if (url.includes("vimeo.com") || url.includes("dailymotion.com")) {
    return "video";
  }
  if (
    url.includes("medium.com") ||
    url.includes("tistory.com") ||
    url.includes("naver.com/blog")
  ) {
    return "blog";
  }
  return "article";
}

export async function fetchLinkMetadata(
  url: string
): Promise<{ title: string; thumbnail?: string }> {
  // 실제 구현시 Open Graph 메타데이터 파싱
  // 간단한 버전으로 시작
  try {
    const response = await fetch(url);
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    return {
      title: titleMatch ? titleMatch[1] : url,
    };
  } catch {
    return { title: url };
  }
}
