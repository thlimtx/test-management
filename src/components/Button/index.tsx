import { useState } from "react";
import { ButtonProps } from "./props";

export const Button = (props: ButtonProps) => {
  const {
    className,
    text,
    type = "regular",
    onPress,
    textColor = "secondary",
    bgColor = "primary",
  } = props;
  const [isHover, setIsHover] = useState(false);
  const colors = {
    text: `text-${type === "invert" ? bgColor : textColor}`,
    bg: `bg-${type === "invert" ? textColor : bgColor}`,
  };

  /**
   * - handle pointer
   */
  const onMouseEnter = () => {
    setIsHover(true);
  };
  const onMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div
      className={`shadow ${
        colors.bg
      } border-primary border-2 px-3 py-1.5 cursor-pointer ${
        isHover ? "opacity-50" : ""
      } ${className}`}
      onClick={onPress}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className={`${colors.text} text-sm font-semibold`}>{text}</p>
    </div>
  );
};
