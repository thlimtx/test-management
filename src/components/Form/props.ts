import { ReactNode } from "react";
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";
import { ButtonProps } from "../Button/props";
export type FormProps = {
  className?: string;
  title?: string;
  fields?: (React.HTMLProps<HTMLInputElement> & {
    register?: RegisterOptions<FieldValues, "">;
  })[];
  buttons?: ButtonProps[];
  onSubmit?: (data: any) => void;
  footer?: ReactNode;
  register?: UseFormRegister<FieldValues>;
  error?: string;
};
