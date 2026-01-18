import DownArrowIcon from "../../../assets/svgs/arrow-down.svg";
import LeftArrowIcon from "../../../assets/svgs/arrow-left.svg";
import RightArrowIcon from "../../../assets/svgs/arrow-right.svg";
import UpArrowIcon from "../../../assets/svgs/arrow-up.svg";
import CloseIcon from "../../../assets/svgs/close.svg";
import CloudIcon from "../../../assets/svgs/cloud.svg";
import FileIcon from "../../../assets/svgs/file.svg";
import FolderOpenIcon from "../../../assets/svgs/folder-open.svg";
import FolderIcon from "../../../assets/svgs/folder.svg";
import FoldersIcon from "../../../assets/svgs/folders.svg";
import HamburgerIcon from "../../../assets/svgs/hamburger.svg";
import SearchIcon from "../../../assets/svgs/search.svg";
import TrashFullIcon from "../../../assets/svgs/trash-full.svg";

export const ICONS = {
  close: CloseIcon,
  leftArrow: LeftArrowIcon,
  rightArrow: RightArrowIcon,
  upArrow: UpArrowIcon,
  downArrow: DownArrowIcon,
  hamburger: HamburgerIcon,
  file: FileIcon,
  folder: FolderIcon,
  folderOpen: FolderOpenIcon,
  folders: FoldersIcon,
  search: SearchIcon,
  trashFull: TrashFullIcon,
  cloud: CloudIcon,
} as const;

export type IconName = keyof typeof ICONS;
