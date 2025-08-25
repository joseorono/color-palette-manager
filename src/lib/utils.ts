import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const noop = () => {};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function bin2bool(value: number): boolean {
  return value === 1;
}

/*
======================================
        Math Utils
======================================
*/

/**
 * Subtracts two numbers and ensures the result is not less than a minimum value.
 * @param a The first number to subtract from.
 * @param b The number to subtract.
 * @param min The minimum value to ensure the result is not less than. Defaults to 0.
 * @returns The result of the subtraction, clamped to the minimum value.
 */
export function substractionWithMin(a: number, b: number, min: number = 0): number {
  return Math.max(a - b, min);
}

/**
 * Adds two numbers and ensures the result is not greater than a maximum value.
 * @param a The first number to add.
 * @param b The second number to add.
 * @param max The maximum value to ensure the result is not greater than.
 * @returns The result of the addition, clamped to the maximum value.
 */
export function additionWithMax(a: number, b: number, max: number): number {
  return Math.min(a + b, max);
}

/*
======================================
        Statistical Utils
======================================
*/

/**
 * Calculates the average of an array of numbers.
 * @param numbers Array of numbers to average.
 * @returns The arithmetic mean of the numbers.
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Calculates a weighted average of values.
 * @param values Array of values to average.
 * @param weights Array of weights corresponding to each value.
 * @returns The weighted average.
 */
export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length || values.length === 0) return 0;
  
  const weightedSum = values.reduce((sum, value, index) => sum + value * weights[index], 0);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  return totalWeight === 0 ? 0 : weightedSum / totalWeight;
}

/**
 * Calculates the standard deviation of an array of numbers.
 * @param numbers Array of numbers.
 * @returns The standard deviation.
 */
export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const avg = average(numbers);
  const squaredDifferences = numbers.map(num => Math.pow(num - avg, 2));
  const variance = average(squaredDifferences);
  
  return Math.sqrt(variance);
}

/*
======================================
        Rounding & Precision Utils
======================================
*/

/**
 * Rounds a number to a specific step/increment.
 * @param value The number to round.
 * @param step The step size to round to.
 * @returns The rounded value.
 */
export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Rounds a number to a specific number of decimal places.
 * @param number The number to round.
 * @param precision The number of decimal places.
 * @returns The rounded number.
 */
export function precisionRound(number: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
