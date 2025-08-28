import chroma from "chroma-js";
import { formatHex, random } from "culori";
import {
  Color,
  ColorRole,
  ColorRoles,
  CSSColorVariablesObject,
  HexColorString,
  NewPaletteFormValues,
  Palette,
  ColorRoleValidationResult,
  ColorRolesConversionResult,
} from "@/types/palette";
import {
  PALETTE_GENERATION_PRIORITIES,
  KMEANS_CONSTANTS,
  PALETTE_DEFAULTS,
} from "@/constants/palette-constants";
import { ColorUtils } from "@/lib/color-utils";
import { nanoidPaletteId } from "@/constants/nanoid";

export class PaletteUtils {
  static generateHarmoniousHexCsv_legacy(
    baseColorArg?: string,
    count: number = 5,
    existingColors?: Color[]
  ): HexColorString[] {
    const baseColor = baseColorArg ? chroma(baseColorArg) : chroma.random();
    const colors: HexColorString[] = [baseColor.hex()];

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

  static newPaletteFormValuesToPalette(
    formValues: NewPaletteFormValues
  ): Palette {
    const now = new Date();

    // Generate colors based on user preference
    let colors: Color[];
    if (formValues.generateFromBaseColor) {
      // Generate harmonious palette from base color
      const harmoniousHexColors = this.generateHarmoniousHexCsv(formValues.baseColor, 5);
      colors = harmoniousHexColors.map(hex => ColorUtils.HexToColor(hex));
    } else {
      // Just use the base color
      colors = [ColorUtils.HexToColor(formValues.baseColor, undefined, true)];
    }

    return {
      id: nanoidPaletteId(),
      ...formValues,
      colors,
      createdAt: now,
      updatedAt: now,
      favoriteCount: 0,
    };
  }

  static createEmptyPalette(): Palette {
    const now = new Date();
    return {
      id: nanoidPaletteId(),
      name: "Untitled Palette",
      colors: [],
      createdAt: now,
      updatedAt: now,
      isPublic: false,
      tags: [],
    };
  }

  /**
   * Generate a harmonious color palette based on color theory principles
   * @param baseColorHex - Optional base color in hexadecimal format
   * @param count - Number of colors to generate (default: 5)
   * @param existingColorHexArray - Array of existing colors in hexadecimal format
   * @returns Array of hex color strings forming a harmonious palette
   */
  static generateHarmoniousHexCsv(
    baseColorHex?: string,
    count: number = 5,
    existingColorHexArray: HexColorString[] = []
  ): HexColorString[] {
    console.log("In generateHarmoniousHexCsv got baseColorHex:", baseColorHex, "count:", count, "existingColorHexArray:", existingColorHexArray);
    console.log("Existing color hex array:", existingColorHexArray);
    console.log("Base color hex:", baseColorHex);
    // Get or generate base color
    const baseColor =
      baseColorHex ||
      (existingColorHexArray.length > 0
        ? ColorUtils.getBaseColorHex(existingColorHexArray)
        : formatHex(random()));

    console.log("generateHarmoniousHexCsv::Base color determined to be:", baseColor);

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
    console.log("generateHarmoniousHexCsv::Count to generate:", countToGenerate);

    // Priority order for color generation
    // ToDo: Make this configurable or based on the type of palette requested (e.g. monochrome, triadic, etc.)
    const priorityColorsDuringGeneration = PALETTE_GENERATION_PRIORITIES;

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
    const maxAttempts = PALETTE_DEFAULTS.MAX_GENERATION_ATTEMPTS; // Prevent infinite loops

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
      console.warn(
        "Adding random color bc we ran out of attempts. This is unlikely and signals a serious performance issue. Optimize palette generation!"
      );
      colors.push(formatHex(random()));
      countToGenerate--;
    }

    console.log("generateHarmoniousHexCsv::Colors generated:", colors);

    return colors.slice(0, count);
  }

  static generatePaletteFromColorHexArray(colorHexArray: HexColorString[]): Palette {
    const now = new Date();
    const palette: Palette = {
      id: nanoidPaletteId(),
      name: `Generated Palette (${colorHexArray.length} colors)`,
      description: `Generated from color hex array: ${colorHexArray.join(", ")}`,
      colors: colorHexArray.map((hex) => ColorUtils.HexToColor(hex)),
      createdAt: now,
      updatedAt: now,
      isPublic: false,
      tags: [],
    };
    return palette;
  }

  static validateColorRolesObject(colorRolesObject: CSSColorVariablesObject): ColorRoleValidationResult {
    const missingRoles: ColorRole[] = [];
    const invalidRoles: string[] = [];

    // Check for missing required roles
    for (const role of ColorRoles) {
      if (!colorRolesObject[role]) {
        missingRoles.push(role);
      }
    }

    // Check for invalid roles (keys that aren't in ColorRoles)
    for (const key in colorRolesObject) {
      if (!ColorRoles.includes(key as ColorRole)) {
        invalidRoles.push(key);
      }
    }

    const isValid = missingRoles.length === 0 && invalidRoles.length === 0;

    return {
      isValid,
      missingRoles,
      invalidRoles,
    };
  }

  static colorRolesObjectFromColors(colors: Color[]): ColorRolesConversionResult {
    let errorMessage: string | undefined;
    const colorRolesObject: Partial<CSSColorVariablesObject> = {};

    // Build the color roles object from colors that have roles assigned
    colors.forEach((color) => {
      if (color.role) {
        colorRolesObject[color.role] = color.hex;
      }
    });

    // Validate the resulting object
    const validation = this.validateColorRolesObject(colorRolesObject as CSSColorVariablesObject);

    if (!validation.isValid) {
      const assignedRoles = this.getAssignedRoles(colors);
      errorMessage = [
        "Invalid color roles object:",
        validation.missingRoles.length > 0 && `Missing roles: ${validation.missingRoles.join(', ')}`,
        validation.invalidRoles.length > 0 && `Invalid roles: ${validation.invalidRoles.join(', ')}`,
        `Currently assigned roles: ${Array.from(assignedRoles).join(', ') || 'none'}`
      ].filter(Boolean).join(' ');
    }

    return {
      wasSuccessful: validation.isValid,
      errorMessage: validation.isValid ? undefined : errorMessage,
      colorRolesObject: colorRolesObject as CSSColorVariablesObject,
    };
  }

  static kMeansColors(pixels: number[][], k: number): number[][] {
    // Initialize centroids randomly
    let centroids = Array.from(
      { length: k },
      () => pixels[Math.floor(Math.random() * pixels.length)]
    );

    for (let iteration = 0; iteration < KMEANS_CONSTANTS.MAX_ITERATIONS; iteration++) {
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

  /**
   * Get all assigned roles from an array of colors
   * @param colors - Array of Color objects to check for assigned roles
   * @returns Set of ColorRole values that are currently assigned
   */
  static getAssignedRoles(colors: Color[]): Set<ColorRole> {
    const assignedRoles = new Set<ColorRole>();
    colors.forEach((color) => {
      if (color.role !== undefined) {
        assignedRoles.add(color.role);
      }
    });
    return assignedRoles;
  }

  /**
   * Filter an array of colors to return only the locked/blocked colors
   * @param colors - Array of Color objects to filter
   * @returns Array of Color objects that are locked (blocked)
   */
  static getLockedColors(colors: Color[]): Color[] {
    return colors.filter((color) => color.locked === true);
  }

  /**
   * Filter an array of colors to return only the unlocked colors
   * @param colors - Array of Color objects to filter
   * @returns Array of Color objects that are not locked
   */
  static getUnlockedColors(colors: Color[]): Color[] {
    return colors.filter((color) => color.locked !== true);
  }
}
