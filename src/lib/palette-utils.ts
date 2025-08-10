import chroma from "chroma-js";
import { Color, Palette } from "@/types/palette";

export class PaletteUtils {

  static generateHarmoniousPalette(
    baseColorArg?: string,
    count: number = 5
  ): string[] {
    const baseColor = baseColorArg ? chroma(baseColorArg) : chroma.random();
    const colors: string[] = [baseColor.hex()];

    // Generate complementary, triadic, and analogous colors
    const schemes = [
      // Analogous colors
      baseColor.set("hsl.h", "+30").hex(),
      baseColor.set("hsl.h", "-30").hex(),
      // Complementary
      baseColor.set("hsl.h", "+180").hex(),
      // Triadic
      baseColor.set("hsl.h", "+120").hex(),
      baseColor.set("hsl.h", "-120").hex(),
      // Variations
      baseColor.set("hsl.l", "*0.8").hex(),
      baseColor.set("hsl.l", "*1.2").hex(),
      baseColor.set("hsl.s", "*0.7").hex(),
      baseColor.set("hsl.s", "*1.3").hex(),
    ];

    // Shuffle and take required count
    const shuffled = schemes.sort(() => Math.random() - 0.5);
    console.log(count, shuffled.length);
    colors.push(...shuffled.slice(0, count - 1));
    console.log(colors);
    return colors.slice(0, count);
  }

  static extractColorsFromImage(
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
      const colors = PaletteUtils.kMeansColors(pixels, count);
      resolve(colors.map((color) => chroma.rgb(color[0], color[1], color[2]).hex()));
    });
  }

  private static kMeansColors(pixels: number[][], k: number): number[][] {
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
}