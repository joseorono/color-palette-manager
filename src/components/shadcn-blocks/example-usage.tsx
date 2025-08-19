import { Plus, Star, X } from "lucide-react";
import React from "react";
import CopyButton from "./copy-button";
import SplitButton from "./split-button";

/**
 * Example usage of the refactored shadcn-blocks components
 * This file demonstrates how to use the components with their new prop interfaces
 */
export const ExampleUsage = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">CopyButton Examples</h2>
        
        {/* Basic usage */}
        <CopyButton value="https://www.shadcnui-blocks.com" />
        
        {/* Custom display text */}
        <CopyButton 
          value="https://github.com/user/repo" 
          displayText="GitHub Repo"
        />
        
        {/* Custom styling */}
        <CopyButton 
          value="npm install @shadcn/ui"
          displayText="Install Command"
          buttonVariant="outline"
          maxDisplayChars={30}
          className="bg-muted"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">SplitButton Examples</h2>
        
        {/* Basic usage with original hardcoded data */}
        <SplitButton
          mainButtonText="Star"
          mainButtonIcon={Star}
          onMainButtonClick={() => console.log("Starred!")}
          menuLabel="Lists"
          showCloseButton={true}
          onCloseClick={() => console.log("Close clicked")}
          menuItems={[
            { id: "1", label: "🔮 Future ideas", onClick: () => console.log("Future ideas") },
            { id: "2", label: "🚀 My stack", onClick: () => console.log("My stack") },
            { id: "3", label: "✨ Inspiration", onClick: () => console.log("Inspiration") },
            { id: "separator", label: "", separator: true },
            { id: "4", label: "Create List", icon: Plus, onClick: () => console.log("Create list") },
          ]}
        />
        
        {/* Custom variant and different content */}
        <SplitButton
          mainButtonText="Actions"
          variant="outline"
          onMainButtonClick={() => console.log("Main action")}
          menuItems={[
            { id: "1", label: "Edit", onClick: () => console.log("Edit") },
            { id: "2", label: "Delete", onClick: () => console.log("Delete") },
            { id: "3", label: "Share", onClick: () => console.log("Share") },
          ]}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;
