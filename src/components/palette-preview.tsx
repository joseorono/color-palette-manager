import { Color } from "@/types/palette";
import { cn } from "@/lib/utils";

export interface PalettePreviewProps {
  /** Array of colors to display in the palette */
  colors: Color[];
  /** Height of the preview component */
  height?: string | number;
  /** Custom CSS classes to apply to the container */
  className?: string;
  /** Whether to show color hex values as tooltips */
  showTooltips?: boolean;
  /** Whether to show color names as tooltips (requires color names) */
  showColorNames?: boolean;
  /** Custom border radius */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  /** Whether to show a border around the preview */
  showBorder?: boolean;
  /** Layout orientation */
  orientation?: "horizontal" | "vertical";
  /** Gap between color segments (only for vertical orientation) */
  gap?: number;
  /** Minimum width/height for each color segment */
  minSegmentSize?: number;
  /** Click handler for individual color segments */
  onColorClick?: (color: Color, index: number) => void;
  /** Hover handler for individual color segments */
  onColorHover?: (color: Color, index: number) => void;
  /** Whether to show loading state */
  isLoading?: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Whether segments should have equal width/height */
  equalSegments?: boolean;
}

const borderRadiusMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function PalettePreview({
  colors,
  height = "4rem", // 16 in Tailwind (h-16)
  className,
  showTooltips = true,
  showColorNames = false,
  borderRadius = "lg",
  showBorder = true,
  orientation = "horizontal",
  gap = 0,
  minSegmentSize = 20,
  onColorClick,
  onColorHover,
  isLoading = false,
  loadingComponent,
  equalSegments = true,
}: PalettePreviewProps) {
  // Handle loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-200 dark:bg-gray-700",
          borderRadiusMap[borderRadius],
          showBorder && "border border-gray-300 dark:border-gray-600",
          className
        )}
        style={{ height }}
      />
    );
  }

  // Handle empty colors array
  if (!colors || colors.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
          borderRadiusMap[borderRadius],
          showBorder && "border border-gray-300 dark:border-gray-600",
          className
        )}
        style={{ height }}
      >
        <span className="text-sm">No colors to preview</span>
      </div>
    );
  }

  const isHorizontal = orientation === "horizontal";
  const containerClasses = cn(
    isHorizontal ? "flex" : "flex flex-col",
    "overflow-hidden",
    borderRadiusMap[borderRadius],
    showBorder && "border border-gray-300 dark:border-gray-600",
    className
  );

  const segmentStyle = isHorizontal
    ? {
        width: equalSegments ? `${100 / colors.length}%` : "auto",
        minWidth: minSegmentSize,
        height: "100%",
      }
    : {
        height: equalSegments ? `${100 / colors.length}%` : "auto",
        minHeight: minSegmentSize,
        width: "100%",
      };

  const getTooltipText = (color: Color): string => {
    const parts: string[] = [];
    
    if (showColorNames && color.name) {
      parts.push(color.name);
    }
    
    if (showTooltips) {
      parts.push(color.hex.toUpperCase());
    }
    
    return parts.join(" - ") || color.hex.toUpperCase();
  };

  return (
    <div
      className={containerClasses}
      style={{ height }}
      role="img"
      aria-label={`Color palette with ${colors.length} colors`}
    >
      {colors.map((color, index) => (
        <div
          key={color.id || index}
          className={cn(
            "transition-all duration-200",
            onColorClick && "cursor-pointer hover:scale-105 hover:z-10",
            onColorHover && "hover:brightness-110",
            !isHorizontal && gap > 0 && index < colors.length - 1 && `mb-${gap}`
          )}
          style={{
            backgroundColor: color.hex,
            ...segmentStyle,
          }}
          title={getTooltipText(color)}
          onClick={() => onColorClick?.(color, index)}
          onMouseEnter={() => onColorHover?.(color, index)}
          role={onColorClick ? "button" : undefined}
          tabIndex={onColorClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onColorClick && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onColorClick(color, index);
            }
          }}
          aria-label={`Color ${index + 1}: ${getTooltipText(color)}`}
        />
      ))}
    </div>
  );
}

// Preset configurations for common use cases
export const PalettePreviewPresets = {
  /** Small preview for cards or lists */
  small: {
    height: "2rem",
    borderRadius: "md" as const,
    showTooltips: false,
  },
  
  /** Medium preview for modals or forms */
  medium: {
    height: "4rem",
    borderRadius: "lg" as const,
    showTooltips: true,
  },
  
  /** Large preview for main displays */
  large: {
    height: "6rem",
    borderRadius: "xl" as const,
    showTooltips: true,
    showColorNames: true,
  },
  
  /** Compact horizontal strip */
  strip: {
    height: "1rem",
    borderRadius: "full" as const,
    showBorder: false,
    showTooltips: false,
  },
  
  /** Vertical tower layout */
  tower: {
    height: "12rem",
    orientation: "vertical" as const,
    borderRadius: "lg" as const,
    gap: 1,
  },
} as const;

// Helper function to create preset-based previews
export function createPalettePreview(
  preset: keyof typeof PalettePreviewPresets,
  overrides?: Partial<PalettePreviewProps>
) {
  return function PresetPalettePreview(props: Omit<PalettePreviewProps, keyof typeof PalettePreviewPresets[typeof preset]>) {
    return (
      <PalettePreview
        {...PalettePreviewPresets[preset]}
        {...overrides}
        {...props}
      />
    );
  };
}

// Export preset components for convenience
export const SmallPalettePreview = createPalettePreview("small");
export const MediumPalettePreview = createPalettePreview("medium");
export const LargePalettePreview = createPalettePreview("large");
export const StripPalettePreview = createPalettePreview("strip");
export const TowerPalettePreview = createPalettePreview("tower");
