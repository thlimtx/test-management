import { FormProps } from "./props";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import map from "lodash/map";
import { Box } from "../Box";

export const Form = (props: FormProps) => {
  const { title, fields, buttons, register, footer, error } = props;

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
        <p className="error text-sm">{error}</p>
        {footer}
      </div>
      <div className="flex flex-row justify-end my-3">
        {map(buttons, (item, index) => {
          const { className, ...rest } = item;
          return (
            <Button
              className={`ml-2 ${className}`}
              {...rest}
              key={`button${index}`}
            />
          );
        })}
      </div>
    </Box>
  );
};
