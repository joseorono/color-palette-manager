import chroma from "chroma-js";
import { formatHex, random } from "culori";
import { Color, ColorRole, ColorRoles } from "@/types/palette";
import { ColorUtils } from "@/lib/color-utils";

export class PaletteUtils {

  static generateHarmoniousPalette_legacy(
    baseColorArg?: string,
    count: number = 5,
    existingColors?: Color[]
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



  /**
   * Generate a harmonious color palette based on color theory principles
   * @param baseColorHex - Optional base color in hexadecimal format
   * @param count - Number of colors to generate (default: 5)
   * @param existingColorHexArray - Array of existing colors in hexadecimal format
   * @returns Array of hex color strings forming a harmonious palette
   */
  static generateHarmoniousPalette(
    baseColorHex?: string,
    count: number = 5,
    existingColorHexArray: string[] = []
  ): string[] {
    // Get or generate base color
    const baseColor = baseColorHex || (existingColorHexArray.length > 0 ? ColorUtils.getBaseColorHex(existingColorHexArray) : formatHex(random()));

    // Initialize with existing colors
    let colors = [...existingColorHexArray];

    // Add base color if not already present
    if (!colors.includes(baseColor)) {
      colors.unshift(baseColor);
    }

    // Early returns
    if (count === colors.length) {
      return colors;
    }
    if (count < colors.length) {
      return colors.slice(0, count);
    }

    // Calculate how many more colors we need
    let countToGenerate = count - colors.length;

    // Priority order for color generation
    const priorityColorsDuringGeneration = ["white", "black", "complementary", "analogous", "variations"];

    // Generate colors by priority
    for (const priority of priorityColorsDuringGeneration) {
      if (countToGenerate <= 0) break;

      switch (priority) {
        case "white": {
          const whiteVariant = ColorUtils.generateWhite(baseColor);
          if (!ColorUtils.isColorSimilar(whiteVariant, colors)) {
            colors.push(whiteVariant);
            countToGenerate--;
          }
          break;
        }

        case "black": {
          if (countToGenerate <= 0) break;
          const blackVariant = ColorUtils.generateBlack(baseColor);
          if (!ColorUtils.isColorSimilar(blackVariant, colors)) {
            colors.push(blackVariant);
            countToGenerate--;
          }
          break;
        }

        case "complementary": {
          if (countToGenerate <= 0) break;
          const complementary = ColorUtils.generateComplementary(baseColor);
          if (!ColorUtils.isColorSimilar(complementary, colors)) {
            colors.push(complementary);
            countToGenerate--;
          }
          break;
        }

        case "analogous": {
          if (countToGenerate <= 0) break;
          const analogousColors = ColorUtils.generateAnalogous(baseColor);
          for (const analogousColor of analogousColors) {
            if (countToGenerate <= 0) break;
            if (!ColorUtils.isColorSimilar(analogousColor, colors)) {
              colors.push(analogousColor);
              countToGenerate--;
            }
          }
          break;
        }

        case "variations": {
          if (countToGenerate <= 0) break;
          const variations = ColorUtils.generateVariations(baseColor);
          for (const variation of variations) {
            if (countToGenerate <= 0) break;
            if (!ColorUtils.isColorSimilar(variation, colors)) {
              colors.push(variation);
              countToGenerate--;
            }
          }
          break;
        }
      }
    }

    // If we still need more colors, generate random ones with safety limit
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops

    while (countToGenerate > 0 && attempts < maxAttempts) {
      const randomColor = formatHex(random());
      if (!ColorUtils.isColorSimilar(randomColor, colors)) {
        colors.push(randomColor);
        countToGenerate--;
      }
      attempts++;
    }

    // If we still need colors after max attempts, just add random ones
    while (countToGenerate > 0) {
      console.warn("Adding random color bc we ran out of attempts. This is unlikely and signals a serious performance issue. Optimize palette generation!");
      colors.push(formatHex(random()));
      countToGenerate--;
    }

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

  /**
   * Get available color roles for assignment, excluding already assigned roles
   * except for the current role (which can be reassigned)
   * @param assignedRoles - Set of roles already assigned to other colors
   * @param currentRole - The current role of the color being edited (optional)
   * @returns Array of available ColorRole values
   */
  static getAvailableRoles(
    assignedRoles: Set<ColorRole>,
    currentRole?: ColorRole
  ): ColorRole[] {
    return ColorRoles.filter(
      (role) => !assignedRoles.has(role) || role === currentRole
    );
  }
}