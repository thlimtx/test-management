import { FormProps } from "./props";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import { useForm } from "react-hook-form";
import map from "lodash/map";

export const Form = (props: FormProps) => {
  const { title, fields, buttons, footer } = props;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => props.onSubmit && props.onSubmit(data);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-3 flex-1">
      <div
        className="flex flex-1 flex-col shadow bg-secondary px-20 py-10"
        style={{
          maxWidth: 500,
          maxHeight: 600,
          width: "100%",
        }}
      >
        <p className="text-center text-3xl italic font-bold pb-4">{title}</p>
        {map(fields, (item, index) => {
          const { register: curRegister, ...rest } = item;
          return (
            <div key={`input${index}`}>
              <TextInput
                {...rest}
                register={register}
                registerOptions={curRegister}
              />
            </div>
          );
        })}
        <div className="flex flex-row justify-end my-3">
          {map(buttons, (item, index) => {
            const { className, submit, ...rest } = item;
            const onPressProps = submit
              ? { onPress: handleSubmit(onSubmit) }
              : {};
            return (
              <Button
                className={`ml-2 ${className}`}
                {...rest}
                {...onPressProps}
                key={`button${index}`}
              />
            );
          })}
        </div>
        {footer}
      </div>
    </div>
  );
};
