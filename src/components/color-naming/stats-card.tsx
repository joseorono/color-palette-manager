import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, className = "" }) => (
  <Card className={className}>
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
        {title}
      </div>
    </CardContent>
  </Card>
);
