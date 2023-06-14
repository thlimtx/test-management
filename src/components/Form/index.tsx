import { FormProps } from "./props";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import { useForm } from "react-hook-form";
import map from "lodash/map";
import { Box } from "../Box";

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
    <Box title={title} type="form">
      <div>
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
      </div>
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
    </Box>
  );
};
