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

// YouTube 썸네일 추출
export function getYoutubeThumbnail(url: string): string | null {
  let videoId: string | null = null;

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }

  // youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    videoId = shortMatch[1];
  }

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?]+)/);
  if (shortsMatch) {
    videoId = shortsMatch[1];
  }

  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }

  return null;
}

export async function fetchLinkMetadata(
  url: string
): Promise<{ title: string; thumbnail?: string }> {
  // YouTube는 바로 썸네일 추출
  const youtubeThumbnail = getYoutubeThumbnail(url);

  try {
    const response = await fetch(url);
    const html = await response.text();

    // 제목 추출
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : url;

    // OG 이미지 추출 (YouTube 아닌 경우)
    let thumbnail = youtubeThumbnail;
    if (!thumbnail) {
      const ogImageMatch = html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
      );
      if (ogImageMatch) {
        thumbnail = ogImageMatch[1];
      }
    }

    return { title, thumbnail: thumbnail || undefined };
  } catch {
    return {
      title: url,
      thumbnail: youtubeThumbnail || undefined,
    };
  }
}
