import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolSectionHeadingProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export const ToolSectionHeading: React.FC<ToolSectionHeadingProps> = ({
  title,
  description,
  icon: Icon,
  className = ""
}) => {
  return (
    <div className={`my-8 ${className}`}>
      <div className="text-center space-y-4">
        {Icon && (
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {/* Partial horizontal divider below heading */}
        <div className="flex justify-center pt-4">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
      </div>
    </div>
  );
};
