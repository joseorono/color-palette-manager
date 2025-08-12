declare module 'culori' {
  export interface Color {
    mode: string;
    h?: number;
    s?: number;
    l?: number;
    r?: number;
    g?: number;
    b?: number;
    a?: number;
  }

  export function hsl(color: string | Color): Color | undefined;
  export function lab(color: string | Color): Color | undefined;
  export function rgb(color: string | Color): Color | undefined;
  export function formatHex(color: Color): string;
  export function random(): Color;
  export function differenceEuclidean(): (a: Color, b: Color) => number;
}
