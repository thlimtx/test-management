export type ButtonProps = {
  className?: string;
  type?: ButtonType;
  text?: string;
  onPress?: any;
  textColor?: string;
  bgColor?: string;
  textClassName?: string;
};

export type ButtonType = "regular" | "invert";
