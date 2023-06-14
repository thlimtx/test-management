import { ReactNode } from "react";
import { FieldValues, RegisterOptions } from "react-hook-form";
import { ButtonProps } from "../Button/props";
export type FormProps = {
  className?: string;
  title?: string;
  fields?: (React.HTMLProps<HTMLInputElement> & {
    register?: RegisterOptions<FieldValues, "">;
  })[];
  buttons?: (ButtonProps & { submit?: boolean })[];
  onSubmit?: (data: any) => void;
  footer?: ReactNode;
};
