import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export enum FormItemType {
  TEXT = "text",
  CHECKBOX = "checkbox",
  DROPDOWN = "dropdown",
  LISTBOX = "listbox",
  DATEPICKER = "datepicker",
}

export type FormItem = {
  type: FormItemType;
  x: number;
  y: number;
  value: string | boolean | null;
  width: number;
  height: number;
};
