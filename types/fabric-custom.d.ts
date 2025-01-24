import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";

declare module "fabric" {
  export interface CustomTextboxOptions extends ITextboxOptions {
    backgroundColor?: string;
    borderColor?: string;
  }

  export class CustomTextbox extends fabric.Textbox {
    constructor(text: string, options?: CustomTextboxOptions);
    backgroundColor?: string;
    borderColor?: string;
  }
}
