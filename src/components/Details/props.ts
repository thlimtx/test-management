import { ReactNode } from "react";
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

export type RenderDetailsProps = Omit<FieldItem, "render"> & {
  renderText?: (text: any) => ReactNode;
};

export type RenderProps = {
  /**
   * Data from data props
   */
  data?: any;
  isEditing?: boolean;
  /**
   * Render the default component for each field
   * @param item Each item in field props
   */
  renderDetails: (props: RenderDetailsProps) => ReactNode;
};

export type FieldItem = React.HTMLProps<HTMLInputElement> & {
  /**
   * Register options for useForm register of each field, register("id", registerOptions);
   */
  register?: RegisterOptions<FieldValues, "">;
  /**
   * Allows for custom fields
   * @param data
   * @returns
   */
  render?: (data: RenderProps) => any;
  /**
   * Whether the field is editable
   */
  editable?: boolean;
  /**
   * Whether the field has multiple lines
   */
  multiline?: boolean;
};

export type DetailsProps = {
  /**
   * Data of different fields to show
   * - data will show in fields based on data key -> field id
   */
  data?: any;
  className?: string;
  title?: string;
  /**
   * Each field of details and input fields when edit is on
   * - contains html input props
   * - default value can be determined by data props
   */
  fields?: FieldItem[];
  /**
   * On press back
   * @returns void
   */
  onPressBack?: () => void;
  /**
   * On press edit
   * @returns void
   */
  onPressEdit?: () => void;
  /**
   * On cancel edit
   * @returns void
   */
  onPressCancel?: () => void;
  /**
   * On save after edit mode
   * @returns void
   */
  onPressSave?: () => void;
  /**
   * On press run
   * @returns void
   */
  onPressRun?: () => void;
  /**
   * useForm register function
   */
  register?: UseFormRegister<FieldValues>;
  /**
   * Whether to allow showing edit option
   */
  editable?: boolean;
  /**
   * Toggle edit externally
   */
  isEditing?: boolean;
};
