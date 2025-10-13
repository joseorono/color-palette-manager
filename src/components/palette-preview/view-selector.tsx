import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type PreviewViewType = "desktop" | "ebook" | "mobile";

interface ViewSelectorProps {
  /**
   * The currently selected view
   */
  currentView: PreviewViewType;

  /**
   * Callback function when the view changes
   */
  onViewChange: (view: PreviewViewType) => void;
  
  /**
   * Available view types to display
   * @default ["desktop", "ebook", "mobile"]
   */
  availableViews?: PreviewViewType[];
}

/**
 * ViewSelector component for switching between different preview views
 */
export function ViewSelector({ 
  currentView, 
  onViewChange,
  availableViews = ["desktop", "ebook", "mobile"]
}: ViewSelectorProps) {
  return (
    <div className="mb-4">
      <Tabs
        value={currentView}
        onValueChange={(value) => onViewChange(value as PreviewViewType)}
      >
        <TabsList className={`grid w-full grid-cols-${availableViews.length}`}>
          {availableViews.includes("desktop") && (
            <TabsTrigger value="desktop">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-monitor"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                Desktop
              </span>
            </TabsTrigger>
          )}
          {availableViews.includes("ebook") && (
            <TabsTrigger value="ebook">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                E-Book
              </span>
            </TabsTrigger>
          )}
          {availableViews.includes("mobile") && (
            <TabsTrigger value="mobile">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-smartphone"
                >
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                Mobile
              </span>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
}
