import { useEffect, useState, useMemo } from "react";
import {
  CSSColorVariablesObject,
  Palette,
  ColorRole,
  ColorRoles,
  Color,
} from "@/types/palette";
import { UIPreviewCard } from "@/components/preview-views/ui-preview-card";
import {
  ViewSelector,
  PreviewViewType,
} from "@/components/preview-views/view-selector";
import { EbookPreviewCard } from "@/components/preview-views/ebook-preview-card";
import { MobileUIPreviewCard } from "@/components/preview-views/mobile-ui-preview-card";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { PaletteUtils } from "@/lib/palette-utils";

/**
 * PaletteTabsPreview Component
 *
 * A reusable component that displays a preview of UI elements with the provided colors.
 * This component is fully isolated and relies only on props for customization.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {CSSColorVariablesObject} props.initialColors - Initial colors to use for the preview
 * @param {string} [props.title] - Custom title for the preview section
 * @param {PreviewViewType} [props.initialView] - Initial view type to display
 * @param {Array<PreviewViewType>} [props.availableViews] - Which view types to make available
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {number} [props.previewHeight] - Height for the preview container in pixels
 * @param {string} [props.containerClassName] - Additional CSS classes for the outer container
 *
 * @example
 * // Basic usage with required colors
 * <PaletteTabsPreview initialColors={myColors} />
 *
 * @example
 * // Fully customized usage
 * <PaletteTabsPreview
 *   initialColors={{ primary: '#ff0000', secondary: '#00ff00', ... }}
 *   title="My Custom Preview"
 *   initialView="mobile"
 *   availableViews={["mobile", "desktop"]}
 *   className="my-custom-class"
 *   previewHeight={600}
 * />
 */
interface PropsPreviewProps {
  palette?: Palette;
  initialColors?: CSSColorVariablesObject;
  title?: string;
  initialView?: PreviewViewType;
  availableViews?: PreviewViewType[];
  className?: string;
  previewHeight?: number;
  containerClassName?: string;
}

export function PaletteTabsPreview({
  palette,
  initialColors,
  title,
  initialView = "desktop",
  className = "",
  previewHeight = 800,
  containerClassName = "",
}: PropsPreviewProps) {
  const [currentView, setCurrentView] = useState<PreviewViewType>(initialView);

  // Handle view selection
  const handleViewChange = (view: PreviewViewType) => {
    setCurrentView(view);
  };

  // Get color variables from palette or initialColors
  let colorVariables: CSSColorVariablesObject | undefined;

  if (palette?.colors) {
    // Create a default object with empty strings
    const colorVars = ColorRoles.reduce((acc, role) => {
      acc[role] = "";
      return acc;
    }, {} as CSSColorVariablesObject);

    // Fill in values from palette colors that have roles
    palette.colors.forEach((color) => {
      if (color.role) {
        colorVars[color.role] = color.hex;
      }
    });

    colorVariables = colorVars;
  }

  // // Validate the color variables
  // const validationResult = colorVariables
  //   ? PaletteUtils.validateColorRolesObject(colorVariables)
  //   : { isValid: false, missingRoles: ColorRoles, invalidRoles: [] };

  // console.log(colorVariables);

  // // Show error message if validation fails
  // if (!validationResult.isValid) {
  //   return (
  //     <div className="rounded-md border border-red-300 bg-red-50 p-4 lg:col-span-2">
  //       <h3 className="mb-2 text-lg font-medium text-red-800">
  //         Invalid Color Palette
  //       </h3>
  //       <p className="mb-4 text-sm text-red-700">
  //         The palette is missing required color roles needed for proper display.
  //       </p>
  //       {validationResult.missingRoles.length > 0 && (
  //         <div className="mb-2">
  //           <h4 className="text-sm font-medium text-red-800">Missing Roles:</h4>
  //           <ul className="list-inside list-disc text-sm text-red-700">
  //             {validationResult.missingRoles.map((role) => (
  //               <li key={role}>{role}</li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //       {validationResult.invalidRoles.length > 0 && (
  //         <div>
  //           <h4 className="text-sm font-medium text-red-800">Invalid Roles:</h4>
  //           <ul className="list-inside list-disc text-sm text-red-700">
  //             {validationResult.invalidRoles.map((role) => (
  //               <li key={role}>{role}</li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  // Apply the colors to CSS variables
  useEffect(() => {
    if (colorVariables) {
      // Inject colors to CSS variables
      injectColorVariablesObjectToCSS(colorVariables);
    }
  }, [colorVariables]);

  return (
    <div className="lg:col-span-2">
      {/* View Selector */}
      {
        <ViewSelector
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      }
      <div className="relative" style={{ minHeight: `${previewHeight}px` }}>
        {/* Desktop View */}
        {
          <div
            className={`absolute left-0 top-0 w-full transform transition-all duration-200 ease-in-out ${currentView === "desktop" ? "z-10 translate-y-0 opacity-100" : "pointer-events-none z-0 -translate-y-4 opacity-0"}`}
          >
            <UIPreviewCard currentColors={colorVariables} />
          </div>
        }
        {/* Ebook View */}
        {
          <div
            className={`absolute left-0 top-0 w-full transform transition-all duration-200 ease-in-out ${currentView === "ebook" ? "z-10 translate-y-0 opacity-100" : "pointer-events-none z-0 -translate-y-4 opacity-0"}`}
          >
            <EbookPreviewCard currentColors={colorVariables} />
          </div>
        }
        {/* Mobile View */}
        {
          <div
            className={`absolute left-0 top-0 flex w-full transform justify-center transition-all duration-200 ease-in-out ${currentView === "mobile" ? "z-10 translate-y-0 opacity-100" : "pointer-events-none z-0 -translate-y-4 opacity-0"}`}
          >
            <div className="w-[375px] overflow-hidden rounded-lg border-4 border-gray-800 shadow-lg">
              <MobileUIPreviewCard currentColors={colorVariables} />
            </div>
          </div>
        }
      </div>
    </div>
  );
}
