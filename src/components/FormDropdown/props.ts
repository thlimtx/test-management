import { FieldValues, UseFormRegister } from "react-hook-form";

export type FormDropdownProps = {
  id: string;
  title: string;
  register: UseFormRegister<FieldValues>;
  options: any;
  onSelect: (key: string, value?: any) => void;
  value: any;
};
