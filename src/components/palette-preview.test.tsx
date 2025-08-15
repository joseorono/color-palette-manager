import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Color } from "@/types/palette";
import {
  PalettePreview,
  SmallPalettePreview,
  MediumPalettePreview,
  LargePalettePreview,
  StripPalettePreview,
  TowerPalettePreview,
  PalettePreviewPresets,
  createPalettePreview,
} from "./palette-preview";

// Mock color palette for testing
const mockColors: Color[] = [
  { id: "1", hex: "#FF5733", locked: false },
  { id: "2", hex: "#33FF57", locked: true },
  { id: "3", hex: "#3357FF", locked: false },
];

const mockColorsWithNames: Color[] = [
  { id: "1", hex: "#FF5733", locked: false, name: "Red Orange" },
  { id: "2", hex: "#33FF57", locked: true, name: "Lime Green" },
  { id: "3", hex: "#3357FF", locked: false, name: "Royal Blue" },
];

describe("PalettePreview", () => {
  describe("Basic Rendering", () => {
    it("should render palette with correct colors", () => {
      render(<PalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute(
        "aria-label",
        "Color palette with 3 colors"
      );

      // Check that color segments are rendered
      const colorSegments = container.querySelectorAll("div");
      expect(colorSegments).toHaveLength(3);

      // Check background colors
      expect(colorSegments[0]).toHaveStyle("background-color: #FF5733");
      expect(colorSegments[1]).toHaveStyle("background-color: #33FF57");
      expect(colorSegments[2]).toHaveStyle("background-color: #3357FF");
    });

    it("should render with custom height", () => {
      render(<PalettePreview colors={mockColors} height="8rem" />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 8rem");
    });

    it("should apply custom className", () => {
      render(<PalettePreview colors={mockColors} className="custom-class" />);

      const container = screen.getByRole("img");
      expect(container).toHaveClass("custom-class");
    });

    it("should show tooltips with hex values by default", () => {
      render(<PalettePreview colors={mockColors} />);

      const colorSegments = screen.getAllByRole("button");
      expect(colorSegments[0]).toHaveAttribute("title", "#FF5733");
      expect(colorSegments[1]).toHaveAttribute("title", "#33FF57");
      expect(colorSegments[2]).toHaveAttribute("title", "#3357FF");
    });

    it("should show color names in tooltips when enabled", () => {
      render(
        <PalettePreview
          colors={mockColorsWithNames}
          showColorNames={true}
          showTooltips={true}
        />
      );

      const colorSegments = screen.getAllByRole("button");
      expect(colorSegments[0]).toHaveAttribute("title", "Red Orange - #FF5733");
      expect(colorSegments[1]).toHaveAttribute("title", "Lime Green - #33FF57");
      expect(colorSegments[2]).toHaveAttribute("title", "Royal Blue - #3357FF");
    });

    it("should hide tooltips when disabled", () => {
      render(<PalettePreview colors={mockColors} showTooltips={false} />);

      const container = screen.getByRole("img");
      const colorSegments = container.querySelectorAll("div");
      expect(colorSegments[0]).toHaveAttribute("title", "");
    });
  });

  describe("Layout and Styling", () => {
    it("should render horizontal layout by default", () => {
      render(<PalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveClass("flex");
      expect(container).not.toHaveClass("flex-col");
    });

    it("should render vertical layout when specified", () => {
      render(<PalettePreview colors={mockColors} orientation="vertical" />);

      const container = screen.getByRole("img");
      expect(container).toHaveClass("flex", "flex-col");
    });

    it("should apply correct border radius", () => {
      render(<PalettePreview colors={mockColors} borderRadius="xl" />);

      const container = screen.getByRole("img");
      expect(container).toHaveClass("rounded-xl");
    });

    it("should show border by default", () => {
      render(<PalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveClass("border");
    });

    it("should hide border when disabled", () => {
      render(<PalettePreview colors={mockColors} showBorder={false} />);

      const container = screen.getByRole("img");
      expect(container).not.toHaveClass("border");
    });
  });

  describe("Interaction", () => {
    it("should handle color clicks", () => {
      const handleColorClick = vi.fn();
      render(
        <PalettePreview colors={mockColors} onColorClick={handleColorClick} />
      );

      const colorSegments = screen.getAllByRole("button");
      fireEvent.click(colorSegments[0]);

      expect(handleColorClick).toHaveBeenCalledWith(mockColors[0], 0);
    });

    it("should handle color hover", () => {
      const handleColorHover = vi.fn();
      render(
        <PalettePreview colors={mockColors} onColorHover={handleColorHover} />
      );

      const colorSegments = screen.getAllByRole("button");
      fireEvent.mouseEnter(colorSegments[1]);

      expect(handleColorHover).toHaveBeenCalledWith(mockColors[1], 1);
    });

    it("should handle keyboard navigation", () => {
      const handleColorClick = vi.fn();
      render(
        <PalettePreview colors={mockColors} onColorClick={handleColorClick} />
      );

      const colorSegments = screen.getAllByRole("button");
      fireEvent.keyDown(colorSegments[0], { key: "Enter" });

      expect(handleColorClick).toHaveBeenCalledWith(mockColors[0], 0);
    });

    it("should handle spacebar for activation", () => {
      const handleColorClick = vi.fn();
      render(
        <PalettePreview colors={mockColors} onColorClick={handleColorClick} />
      );

      const colorSegments = screen.getAllByRole("button");
      fireEvent.keyDown(colorSegments[0], { key: " " });

      expect(handleColorClick).toHaveBeenCalledWith(mockColors[0], 0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty colors array", () => {
      render(<PalettePreview colors={[]} />);

      const container = screen.getByText("No colors to preview");
      expect(container).toBeInTheDocument();
    });

    it("should handle undefined colors", () => {
      render(<PalettePreview colors={undefined as any} />);

      const container = screen.getByText("No colors to preview");
      expect(container).toBeInTheDocument();
    });

    it("should handle single color", () => {
      const singleColor: Color[] = [{ id: "1", hex: "#FF0000", locked: false }];
      render(<PalettePreview colors={singleColor} />);

      const container = screen.getByRole("img");
      expect(container).toHaveAttribute(
        "aria-label",
        "Color palette with 1 colors"
      );

      const colorSegment = container.querySelector("div");
      expect(colorSegment).toHaveStyle("background-color: #FF0000");
    });

    it("should handle many colors", () => {
      const manyColors: Color[] = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        hex: `#${i.toString(16).padStart(6, "0")}`,
        locked: false,
      }));

      render(<PalettePreview colors={manyColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveAttribute(
        "aria-label",
        "Color palette with 20 colors"
      );

      const colorSegments = container.querySelectorAll("div");
      expect(colorSegments).toHaveLength(20);
    });
  });

  describe("Loading State", () => {
    it("should show loading state", () => {
      render(<PalettePreview colors={mockColors} isLoading={true} />);

      const container = screen.getByRole("img").parentElement;
      expect(container?.firstChild).toHaveClass("animate-pulse");
    });

    it("should show custom loading component", () => {
      const CustomLoader = () => <div>Custom Loading...</div>;
      render(
        <PalettePreview
          colors={mockColors}
          isLoading={true}
          loadingComponent={<CustomLoader />}
        />
      );

      expect(screen.getByText("Custom Loading...")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<PalettePreview colors={mockColors} onColorClick={() => {}} />);

      const colorSegments = screen.getAllByRole("button");
      expect(colorSegments[0]).toHaveAttribute(
        "aria-label",
        "Color 1: #FF5733"
      );
      expect(colorSegments[1]).toHaveAttribute(
        "aria-label",
        "Color 2: #33FF57"
      );
      expect(colorSegments[2]).toHaveAttribute(
        "aria-label",
        "Color 3: #3357FF"
      );
    });

    it("should be keyboard accessible", () => {
      render(<PalettePreview colors={mockColors} onColorClick={() => {}} />);

      const colorSegments = screen.getAllByRole("button");
      colorSegments.forEach((segment) => {
        expect(segment).toHaveAttribute("tabIndex", "0");
      });
    });

    it("should not have button role when not clickable", () => {
      render(<PalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      const colorSegments = container.querySelectorAll("div");
      colorSegments.forEach((segment) => {
        expect(segment).not.toHaveAttribute("role", "button");
        expect(segment).not.toHaveAttribute("tabIndex");
      });
    });
  });

  describe("Preset Components", () => {
    it("should render SmallPalettePreview with correct props", () => {
      render(<SmallPalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 2rem");
      expect(container).toHaveClass("rounded-md");
    });

    it("should render MediumPalettePreview with correct props", () => {
      render(<MediumPalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 4rem");
      expect(container).toHaveClass("rounded-lg");
    });

    it("should render LargePalettePreview with correct props", () => {
      render(<LargePalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 6rem");
      expect(container).toHaveClass("rounded-xl");
    });

    it("should render StripPalettePreview with correct props", () => {
      render(<StripPalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 1rem");
      expect(container).toHaveClass("rounded-full");
      expect(container).not.toHaveClass("border");
    });

    it("should render TowerPalettePreview with correct props", () => {
      render(<TowerPalettePreview colors={mockColors} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 12rem");
      expect(container).toHaveClass("flex-col", "rounded-lg");
    });
  });

  describe("Custom Preset Creation", () => {
    it("should create custom preset component", () => {
      const CustomPreview = createPalettePreview("medium", {
        showColorNames: true,
      });

      render(<CustomPreview colors={mockColorsWithNames} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle("height: 4rem");
      expect(container).toHaveClass("rounded-lg");

      // Should show color names due to override
      const colorSegments = screen.getAllByRole("button");
      expect(colorSegments[0]).toHaveAttribute("title", "Red Orange - #FF5733");
    });
  });

  describe("Presets Configuration", () => {
    it("should have correct preset configurations", () => {
      expect(PalettePreviewPresets.small.height).toBe("2rem");
      expect(PalettePreviewPresets.small.borderRadius).toBe("md");
      expect(PalettePreviewPresets.small.showTooltips).toBe(false);

      expect(PalettePreviewPresets.medium.height).toBe("4rem");
      expect(PalettePreviewPresets.medium.borderRadius).toBe("lg");
      expect(PalettePreviewPresets.medium.showTooltips).toBe(true);

      expect(PalettePreviewPresets.large.height).toBe("6rem");
      expect(PalettePreviewPresets.large.borderRadius).toBe("xl");
      expect(PalettePreviewPresets.large.showColorNames).toBe(true);

      expect(PalettePreviewPresets.strip.height).toBe("1rem");
      expect(PalettePreviewPresets.strip.borderRadius).toBe("full");
      expect(PalettePreviewPresets.strip.showBorder).toBe(false);

      expect(PalettePreviewPresets.tower.height).toBe("12rem");
      expect(PalettePreviewPresets.tower.orientation).toBe("vertical");
      expect(PalettePreviewPresets.tower.gap).toBe(1);
    });
  });
});
