import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { HexColorString } from '@/types/palette';
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';

export interface ColorCardProps {
  hex: HexColorString;
  colorName: string;
  type?: 'exact' | 'close' | 'descriptive' | 'grayscale' | 'edge';
  showType?: boolean;
  className?: string;
}

export const ColorCard: React.FC<ColorCardProps> = ({ 
  hex, 
  colorName, 
  type = 'descriptive',
  showType = true,
  className = ""
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ 
    showToast: true,
    successMessage: `Color ${hex} copied to clipboard!`
  });
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'close': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'descriptive': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'grayscale': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'edge': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div
        className="h-20 w-full"
        style={{ backgroundColor: hex }}
      />
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-muted-foreground mb-1">
            {hex}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(hex)}
            title="Copy color code"
          >
            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        <div className="font-semibold text-sm text-foreground mb-2">
          {colorName}
        </div>
        {showType && (
          <Badge variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
            {type}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
