import { CSSColorVariablesObject } from "@/types/palette";

export interface PreviewComponentProps {
  currentColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}
