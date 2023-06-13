import { UseFormRegister, FieldValues, RegisterOptions } from "react-hook-form";
export type TextInputProps = React.HTMLProps<HTMLInputElement> & {
  className?: string;
  type?: any;
  text?: string;
  onPress?: any;
  textColor?: string;
  bgColor?: string;
  placeholder?: string;
  id?: string;
  register?: UseFormRegister<FieldValues>;
  registerOptions?: RegisterOptions<FieldValues, "">;
};
