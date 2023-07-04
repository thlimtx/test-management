import { useState } from "react";
import { ButtonProps } from "./props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Button = (props: ButtonProps) => {
  const {
    className,
    text,
    type = "regular",
    onPress,
    textClassName,
    icon,
  } = props;
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
      className={`flex flex-row items-center justify-center shadow ${
        colors.bg
      } border-primary border-2 px-3 py-1.5 cursor-pointer rounded ${
        isHover ? "opacity-50" : ""
      } ${className}`}
      onClick={onPress}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          size="sm"
          className={`mr-2 ${colors.text} ${textClassName}`}
        />
      )}
      <p className={`${colors.text} text-sm font-semibold ${textClassName}`}>
        {text}
      </p>
    </div>
  );
};
