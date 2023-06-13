import { ReactNode } from "react";
import { FieldValues, RegisterOptions } from "react-hook-form";
export type FormProps = {
  className?: string;
  title?: string;
  fields?: (React.HTMLProps<HTMLInputElement> & {
    register?: RegisterOptions<FieldValues, "">;
  })[];
  buttons?: any;
  onSubmit?: (data: any) => void;
  footer?: ReactNode;
};
