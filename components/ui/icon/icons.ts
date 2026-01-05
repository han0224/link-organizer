import CloseIcon from "../../../assets/svgs/close.svg";
import HamburgerIcon from "../../../assets/svgs/hamburger.svg";

export const ICONS = {
  close: CloseIcon,
  hamburger: HamburgerIcon,
} as const;

export type IconName = keyof typeof ICONS;
