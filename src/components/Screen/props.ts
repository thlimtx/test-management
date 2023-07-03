import { ReactNode } from "react";

export type ScreenProps = {
  children: ReactNode;
  permission?: boolean;
  sidebar?: boolean;
};
