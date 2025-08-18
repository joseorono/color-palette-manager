import chroma from "chroma-js";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUtils } from "./palette-utils";
import { ColorFrequencyData, ImageAnalysis } from "@/types/palette";

/**
 * Advanced image analysis for intelligent color extraction
 */
export class ImageAnalyzer {

    static extractColors_old(
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
          resolve(
            colors.map((color) => chroma.rgb(color[0], color[1], color[2]).hex())
          );
        });
    }

  /**
   * Extract dominant colors from an image using intelligent analysis
   * @param imageData - ImageData from canvas
   * @param count - Number of colors to extract (default: 5)
   * @returns Promise resolving to array of hex color strings
   */
  static async extractColors(
    imageData: ImageData,
    count: number = 5
  ): Promise<string[]> {
    const analysis = ImageAnalyzer.analyzeImage(imageData);

    if (analysis.pixels.length === 0) {
      return ['#000000']; // Fallback for empty images
    }

    // Choose extraction strategy based on image complexity
    const shouldUseDirectExtraction =
      analysis.uniqueColors <= count * 2 ||
      analysis.pixels.length < 1000 ||
      analysis.colorDiversity < 0.3;

    let colors: string[];

    if (shouldUseDirectExtraction) {
      colors = ImageAnalyzer.extractDirectColors(analysis.colorFrequency, count);
    } else {
      colors = ImageAnalyzer.extractWithKMeans(analysis.pixels, count);
    }

    // Deduplicate using ColorUtils.isColorSimilar
    const deduplicatedColors = ImageAnalyzer.deduplicateColors(colors);

    // Ensure we have enough colors
    return ImageAnalyzer.ensureColorCount(
      deduplicatedColors,
      count,
      analysis.colorFrequency
    );
  }

  /**
   * Analyze image to determine sampling strategy and color distribution
   * @param imageData - ImageData from canvas
   * @returns Analysis results
   */
  static analyzeImage(imageData: ImageData): ImageAnalysis {
    const pixels: number[][] = [];
    const colorFrequency = new Map<string, ColorFrequencyData>();
    const totalPixels = imageData.data.length / 4;

    // Adaptive sampling based on image size
    const samplingRate = ImageAnalyzer.calculateSamplingRate(totalPixels);

    // Sample pixels and track color frequency
    for (let i = 0; i < imageData.data.length; i += samplingRate * 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      if (a > 128) { // Only non-transparent pixels
        pixels.push([r, g, b]);

        // Quantize colors for frequency tracking (reduces similar colors)
        const colorKey = ImageAnalyzer.quantizeColor(r, g, b);
        if (colorFrequency.has(colorKey)) {
          colorFrequency.get(colorKey)!.count++;
        } else {
          colorFrequency.set(colorKey, {
            rgb: [r, g, b],
            count: 1,
            hex: chroma.rgb(r, g, b).hex()
          });
        }
      }
    }

    // Calculate color diversity (0-1, higher = more diverse)
    const uniqueColors = colorFrequency.size;
    const sampledPixels = pixels.length;
    const colorDiversity = sampledPixels > 0 ? uniqueColors / sampledPixels : 0;

    return {
      pixels,
      colorFrequency,
      uniqueColors,
      sampledPixels,
      colorDiversity,
      totalPixels,
      samplingRate
    };
  }

  /**
   * Calculate adaptive sampling rate based on image size
   * @param totalPixels - Total number of pixels in the image
   * @returns Sampling rate (every nth pixel)
   */
  static calculateSamplingRate(totalPixels: number): number {
    if (totalPixels < 10000) return 1;    // Small: sample every pixel
    if (totalPixels < 100000) return 4;   // Medium: every 4th pixel
    if (totalPixels < 500000) return 16;  // Large: every 16th pixel
    return 32;                            // Very large: every 32nd pixel
  }

  /**
   * Quantize color to reduce similar color variations
   * @param r - Red component
   * @param g - Green component
   * @param b - Blue component
   * @returns Quantized color key
   */
  static quantizeColor(r: number, g: number, b: number): string {
    const quantizationLevel = 16; // Reduce 256 levels to 16 levels
    const qR = Math.floor(r / quantizationLevel) * quantizationLevel;
    const qG = Math.floor(g / quantizationLevel) * quantizationLevel;
    const qB = Math.floor(b / quantizationLevel) * quantizationLevel;
    return `${qR}-${qG}-${qB}`;
  }

  /**
   * Extract colors directly from frequency map for simple images
   * @param colorFrequency - Map of color frequencies
   * @param count - Number of colors to extract
   * @returns Array of hex color strings
   */
  static extractDirectColors(
    colorFrequency: Map<string, ColorFrequencyData>,
    count: number
  ): string[] {
    return Array.from(colorFrequency.values())
      .sort((a, b) => b.count - a.count) // Sort by frequency
      .slice(0, count)
      .map(({ hex }) => hex);
  }

  /**
   * Extract colors using improved k-means clustering
   * @param pixels - Array of RGB pixel values
   * @param count - Number of colors to extract
   * @returns Array of hex color strings
   */
  static extractWithKMeans(pixels: number[][], count: number): string[] {
    if (pixels.length <= count) {
      return pixels.map(([r, g, b]) => chroma.rgb(r, g, b).hex());
    }

    // K-means++ initialization for better starting centroids
    let centroids = ImageAnalyzer.initializeCentroidsKMeansPlusPlus(pixels, count);
    const maxIterations = 20;
    const convergenceThreshold = 1.0;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const clusters: number[][][] = Array.from({ length: count }, () => []);
      const previousCentroids = centroids.map(c => [...c]);

      // Assign pixels to nearest centroid
      pixels.forEach((pixel) => {
        let minDistance = Infinity;
        let nearestCentroid = 0;

        centroids.forEach((centroid, index) => {
          const distance = ImageAnalyzer.calculateColorDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCentroid = index;
          }
        });

        clusters[nearestCentroid].push(pixel);
      });

      // Update centroids
      centroids = clusters.map((cluster) => {
        if (cluster.length === 0) {
          // Reinitialize empty cluster with random pixel
          return pixels[Math.floor(Math.random() * pixels.length)];
        }

        const sum = cluster.reduce(
          (acc, pixel) => [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]],
          [0, 0, 0]
        );

        return [
          Math.round(sum[0] / cluster.length),
          Math.round(sum[1] / cluster.length),
          Math.round(sum[2] / cluster.length),
        ];
      });

      // Check for convergence
      const maxMovement = Math.max(
        ...centroids.map((centroid, index) =>
          ImageAnalyzer.calculateColorDistance(centroid, previousCentroids[index])
        )
      );

      if (maxMovement < convergenceThreshold) {
        break; // Converged early
      }
    }

    return centroids.map(([r, g, b]) => chroma.rgb(r, g, b).hex());
  }

  /**
   * K-means++ initialization for better starting centroids
   * @param pixels - Array of RGB pixel values
   * @param k - Number of centroids to initialize
   * @returns Array of initial centroid RGB values
   */
  static initializeCentroidsKMeansPlusPlus(
    pixels: number[][],
    k: number
  ): number[][] {
    const centroids: number[][] = [];

    // Choose first centroid randomly
    centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);

    // Choose remaining centroids with probability proportional to squared distance
    for (let i = 1; i < k; i++) {
      const distances = pixels.map((pixel) => {
        return Math.min(
          ...centroids.map((centroid) =>
            Math.pow(ImageAnalyzer.calculateColorDistance(pixel, centroid), 2)
          )
        );
      });

      const totalDistance = distances.reduce((sum, d) => sum + d, 0);
      if (totalDistance === 0) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
        continue;
      }

      // Weighted random selection
      const random = Math.random() * totalDistance;
      let cumulativeDistance = 0;

      for (let j = 0; j < distances.length; j++) {
        cumulativeDistance += distances[j];
        if (cumulativeDistance >= random) {
          centroids.push(pixels[j]);
          break;
        }
      }
    }

    return centroids;
  }

  /**
   * Calculate Euclidean distance between two RGB colors
   * @param color1 - First RGB color
   * @param color2 - Second RGB color
   * @returns Distance value
   */
  static calculateColorDistance(color1: number[], color2: number[]): number {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
  }

  /**
   * Remove similar colors using ColorUtils.isColorSimilar
   * @param colors - Array of hex color strings
   * @returns Deduplicated array of hex color strings
   */
  static deduplicateColors(colors: string[]): string[] {
    const deduplicated: string[] = [];

    for (const color of colors) {
      if (!ColorUtils.isColorSimilar(color, deduplicated)) {
        deduplicated.push(color);
      }
    }

    return deduplicated;
  }

  /**
   * Ensure we have the requested number of colors
   * @param colors - Current array of colors
   * @param targetCount - Desired number of colors
   * @param colorFrequency - Frequency map for additional colors
   * @returns Array with target number of colors
   */
  static ensureColorCount(
    colors: string[],
    targetCount: number,
    colorFrequency: Map<string, ColorFrequencyData>
  ): string[] {
    if (colors.length >= targetCount) {
      return colors.slice(0, targetCount);
    }

    // Add more colors from frequency map
    const additionalColors = Array.from(colorFrequency.values())
      .sort((a, b) => b.count - a.count)
      .map(({ hex }) => hex)
      .filter(hex => !colors.includes(hex));

    const result = [...colors];

    for (const color of additionalColors) {
      if (result.length >= targetCount) break;
      if (!ColorUtils.isColorSimilar(color, result)) {
        result.push(color);
      }
    }

    // If still not enough, generate random colors
    while (result.length < targetCount) {
      const randomColor = chroma.random().hex();
      if (!ColorUtils.isColorSimilar(randomColor, result)) {
        result.push(randomColor);
      }
    }

    return result.slice(0, targetCount);
  }
}
