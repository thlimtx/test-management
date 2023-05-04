import { ButtonProps } from "./props";

export const Button = (props: ButtonProps) => {
  const color1 = "primary";
  const color2 = "secondary";
  return (
    <div className={`shadow bg-${color1} p-2 flex-row items-center rounded`}>
      <p className={`text-${color2}`}>Title</p>
    </div>
  );
};
