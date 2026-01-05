import { SvgProps } from "react-native-svg";
import { ICONS, IconName } from "./icons";

interface Props extends SvgProps {
  name: IconName;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
}

export function Icon({
  name,
  size = 24,
  width,
  height,
  color = "#333",
  ...props
}: Props) {
  const Svg = ICONS[name];

  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      color={color}
      {...props}
    />
  );
}
