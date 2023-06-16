import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type ButtonProps = {
  className?: string;
  type?: ButtonType;
  text?: string;
  onPress?: any;
  textColor?: string;
  bgColor?: string;
  textClassName?: string;
  icon?: IconProp;
};

export type ButtonType = "regular" | "invert";
