import CloseIcon from "../../../assets/svgs/close.svg";
import FileIcon from "../../../assets/svgs/file.svg";
import FolderIcon from "../../../assets/svgs/folder.svg";
import HamburgerIcon from "../../../assets/svgs/hamburger.svg";

export const ICONS = {
  close: CloseIcon,
  hamburger: HamburgerIcon,
  file: FileIcon,
  folder: FolderIcon,
} as const;

export type IconName = keyof typeof ICONS;
