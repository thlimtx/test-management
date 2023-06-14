import { useState } from "react";
import { ButtonProps } from "./props";

export const Button = (props: ButtonProps) => {
  const { className, text, type = "regular", onPress } = props;
  const [isHover, setIsHover] = useState(false);

  const colors = {
    text: type === "invert" ? "text-primary" : "text-secondary",
    bg: type === "invert" ? "bg-secondary" : "bg-primary",
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
      } border-primary border-2 px-3 py-1.5 cursor-pointer rounded ${
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
