import { ReactNode } from "react";

export type BoxProps = {
  className?: string;
  title?: string;
  type?: "form";
  children: ReactNode;
};
