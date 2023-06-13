import { TextInputProps } from "./props";

export const TextInput = (props: TextInputProps) => {
  const { type, placeholder, register, id, registerOptions, ...restProps } =
    props;
  const registerConfig = register
    ? { ...register(`${id}`, registerOptions) }
    : {};

  return (
    <div>
      <input
        type={type}
        className="border border-opacity-100 rounded-sm w-full px-2 py-1 my-2"
        placeholder={`${placeholder}`}
        {...registerConfig}
        {...restProps}
      />
    </div>
  );
};
