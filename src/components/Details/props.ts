import { ReactNode } from "react";
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";
export type DetailsProps = {
  data?: any;
  className?: string;
  title?: string;
  fields?: (React.HTMLProps<HTMLInputElement> & {
    register?: RegisterOptions<FieldValues, "">;
    render?: (data: {
      data: any;
      isEditing: boolean;
      renderDetails: (item: any) => ReactNode;
    }) => any;
    editable?: boolean;
  })[];
  onPressCancel?: () => void;
  onPressSave?: () => void;
  register?: UseFormRegister<FieldValues>;
  editable?: boolean;
};
