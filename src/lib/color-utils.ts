import chroma from "chroma-js";
import { colord } from "colord";

export function generateRandomColor(): string {
  return chroma.random().hex();
}

export function generateHarmoniousPalette(
  baseColor?: string,
  count: number = 5
): string[] {
  const base = baseColor ? chroma(baseColor) : chroma.random();
  const colors: string[] = [base.hex()];

  // Generate complementary, triadic, and analogous colors
  const schemes = [
    // Analogous colors
    base.set("hsl.h", "+30").hex(),
    base.set("hsl.h", "-30").hex(),
    // Complementary
    base.set("hsl.h", "+180").hex(),
    // Triadic
    base.set("hsl.h", "+120").hex(),
    base.set("hsl.h", "-120").hex(),
    // Variations
    base.set("hsl.l", "*0.8").hex(),
    base.set("hsl.l", "*1.2").hex(),
    base.set("hsl.s", "*0.7").hex(),
    base.set("hsl.s", "*1.3").hex(),
  ];

  // Shuffle and take required count
  const shuffled = schemes.sort(() => Math.random() - 0.5);
  colors.push(...shuffled.slice(0, count - 1));

  return colors.slice(0, count);
}

export function getContrastRatio(color1: string, color2: string): number {
  return chroma.contrast(color1, color2);
}

export function getAccessibilityLevel(ratio: number): "fail" | "aa" | "aaa" {
  if (ratio >= 7) return "aaa";
  if (ratio >= 4.5) return "aa";
  return "fail";
}

export function generateShades(color: string, count: number = 9): string[] {
  const baseColor = colord(color);
  const hsl = baseColor.toHsl();
  const shades: string[] = [];

  for (let i = 0; i < count; i++) {
    const lightness = 0.1 + (i / (count - 1)) * 0.8; // Range from 10% to 90%
    const newColor = colord({ h: hsl.h, s: hsl.s, l: lightness });
    shades.push(newColor.toHex());
  }

  return shades;
}

export function extractColorsFromImage(
  imageData: ImageData,
  count: number = 5
): Promise<string[]> {
  return new Promise((resolve) => {
    const pixels: number[][] = [];

    // Sample pixels (every 10th pixel to improve performance)
    for (let i = 0; i < imageData.data.length; i += 40) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      if (a > 128) {
        // Only include non-transparent pixels
        pixels.push([r, g, b]);
      }
    }

    // Simple k-means clustering for color extraction
    const colors = kMeansColors(pixels, count);
    resolve(colors.map((color) => chroma.rgb(color).hex()));
  });
}

function kMeansColors(pixels: number[][], k: number): number[][] {
  // Initialize centroids randomly
  let centroids = Array.from(
    { length: k },
    () => pixels[Math.floor(Math.random() * pixels.length)]
  );

  for (let iteration = 0; iteration < 10; iteration++) {
    const clusters: number[][][] = Array.from({ length: k }, () => []);

    // Assign pixels to nearest centroid
    pixels.forEach((pixel) => {
      let minDistance = Infinity;
      let nearestCentroid = 0;

      centroids.forEach((centroid, index) => {
        const distance = Math.sqrt(
          Math.pow(pixel[0] - centroid[0], 2) +
            Math.pow(pixel[1] - centroid[1], 2) +
            Math.pow(pixel[2] - centroid[2], 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestCentroid = index;
        }
      });

      clusters[nearestCentroid].push(pixel);
    });

    // Update centroids
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[0];

      const sum = cluster.reduce(
        (acc, pixel) => [
          acc[0] + pixel[0],
          acc[1] + pixel[1],
          acc[2] + pixel[2],
        ],
        [0, 0, 0]
      );

      return [
        Math.round(sum[0] / cluster.length),
        Math.round(sum[1] / cluster.length),
        Math.round(sum[2] / cluster.length),
      ];
    });
  }

  return centroids;
}

export function getColorName(hex: string): string {
  const color = colord(hex);
  const hsl = color.toHsl();

  // Simple color naming based on HSL values
  const hue = hsl.h;
  const saturation = hsl.s;
  const lightness = hsl.l;

  let name = "";

  // Determine base color
  if (saturation < 0.1) {
    if (lightness > 0.9) name = "White";
    else if (lightness < 0.1) name = "Black";
    else name = "Gray";
  } else {
    if (hue < 15 || hue >= 345) name = "Red";
    else if (hue < 45) name = "Orange";
    else if (hue < 75) name = "Yellow";
    else if (hue < 105) name = "Yellow Green";
    else if (hue < 135) name = "Green";
    else if (hue < 165) name = "Green Cyan";
    else if (hue < 195) name = "Cyan";
    else if (hue < 225) name = "Blue";
    else if (hue < 255) name = "Blue Violet";
    else if (hue < 285) name = "Violet";
    else if (hue < 315) name = "Red Violet";
    else name = "Red";
  }

  // Add modifiers
  if (lightness > 0.8) name = `Light ${name}`;
  else if (lightness < 0.3) name = `Dark ${name}`;

  return name;
}
