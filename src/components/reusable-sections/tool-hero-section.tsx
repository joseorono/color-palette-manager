import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolHeroSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const ToolHeroSection: React.FC<ToolHeroSectionProps> = ({
  icon: Icon,
  title,
  description,
  className = ""
}) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};
