// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "../types";

const LINKS_KEY = "links";

export async function getLinks(): Promise<Link[]> {
  const data = await AsyncStorage.getItem(LINKS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveLink(link: Link): Promise<void> {
  const links = await getLinks();
  const index = links.findIndex((l) => l.id === link.id);

  if (index >= 0) {
    links[index] = link;
  } else {
    links.unshift(link);
  }

  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export async function deleteLink(id: string): Promise<void> {
  const links = await getLinks();
  const filtered = links.filter((l) => l.id !== id);
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(filtered));
}

export async function getAllTags(): Promise<string[]> {
  const links = await getLinks();
  const tagSet = new Set<string>();

  links.forEach((link) => {
    link.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
