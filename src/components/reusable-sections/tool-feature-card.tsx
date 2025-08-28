import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColorClasses?: string;
  iconBgColorClasses?: string;
}

export function ToolFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColorClasses = "text-blue-600 dark:text-blue-400",
  iconBgColorClasses = "bg-blue-100 dark:bg-blue-900"
}: ToolFeatureCardProps) {
  return (
    <div className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
      <div className={`w-12 h-12 rounded-full ${iconBgColorClasses} flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`h-6 w-6 ${iconColorClasses}`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
