import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Color, ColorRole } from "@/types/palette";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function getAssignedRoles(colors: Color[]): Set<ColorRole> {
  const assignedRoles = new Set<ColorRole>();
  colors.forEach((color) => {
    if (color.role) {
      assignedRoles.add(color.role);
    }
  });
  return assignedRoles;
}
