import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { HexColorPicker } from 'react-colorful';
import { ColorUtils } from '@/lib/color-utils';
import { useDebounce } from '@/hooks/use-debounce';
import { HexColorString } from '@/types/palette';

// Test color samples organized by category
const colorSamples = {
  "Database Colors (Exact Matches)": [
    "#FF0000", "#DC143C", "#B22222", "#8B0000", "#CD5C5C",
    "#FFA500", "#FF8C00", "#D2691E", "#A0522D", "#8B4513",
    "#FFFF00", "#FFD700", "#DAA520", "#B8860B", "#F0E68C",
    "#008000", "#00FF00", "#32CD32", "#228B22", "#006400",
    "#00FFFF", "#40E0D0", "#48D1CC", "#008B8B", "#008080",
    "#0000FF", "#4169E1", "#1E90FF", "#87CEEB", "#ADD8E6",
    "#800080", "#9400D3", "#BA55D3", "#DDA0DD", "#E6E6FA",
    "#FF00FF", "#FF1493", "#FF69B4", "#FFC0CB", "#FFB6C1"
  ],
  "Near-Database Colors (Close Matches)": [
    "#FF1111", "#DD1540", "#B33333", "#8C0505", "#CE5D5D",
    "#FFA600", "#FF8D10", "#D3701F", "#A1532E", "#8C4614",
    "#FFFF10", "#FFD810", "#DB9530", "#B98C1C", "#F1E79D"
  ],
  "Custom Colors (Descriptive Names)": [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#74B9FF", "#A29BFE", "#FD79A8", "#FDCB6E",
    "#6C5CE7", "#00B894", "#E17055", "#2D3436", "#636E72"
  ],
  "Grayscale Colors": [
    "#000000", "#111111", "#222222", "#333333", "#444444",
    "#555555", "#666666", "#777777", "#888888", "#999999",
    "#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#FFFFFF"
  ],
  "Edge Cases": [
    "#F00", "#0F0", "#00F", "#FFF", "#000",
    "#123456", "#ABCDEF", "#FEDCBA", "#987654", "#13579B"
  ]
};

interface ColorCardProps {
  hex: HexColorString;
  colorName: string;
  type: 'exact' | 'close' | 'descriptive' | 'grayscale' | 'edge';
}

const ColorCard: React.FC<ColorCardProps> = ({ hex, colorName, type }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-green-100 text-green-800';
      case 'close': return 'bg-blue-100 text-blue-800';
      case 'descriptive': return 'bg-purple-100 text-purple-800';
      case 'grayscale': return 'bg-gray-100 text-gray-800';
      case 'edge': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div 
        className="h-20 w-full" 
        style={{ backgroundColor: hex }}
      />
      <CardContent className="p-3">
        <div className="font-mono text-xs text-muted-foreground mb-1">
          {hex}
        </div>
        <div className="font-semibold text-sm text-foreground mb-2">
          {colorName}
        </div>
        <Badge variant="secondary" className={`text-xs ${getTypeColor(type)}`}>
          {type}
        </Badge>
      </CardContent>
    </Card>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, className = "" }) => (
  <Card className={className}>
    <CardContent className="p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
        {title}
      </div>
    </CardContent>
  </Card>
);

export const ColorNameTestPage: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<HexColorString>("#FF6B6B");
  const debouncedColor = useDebounce(selectedColor, 300);
  
  // Calculate stats
  const stats = useMemo(() => {
    const allColors = Object.values(colorSamples).flat();
    const uniqueNames = new Set<string>();
    let exactMatches = 0;
    let descriptiveNames = 0;

    allColors.forEach(hex => {
      const colorName = ColorUtils.getColorName(hex);
      uniqueNames.add(colorName);
      
      // Simple heuristic to determine if it's likely an exact match
      if (colorName.length <= 15 && !colorName.includes(' ')) {
        exactMatches++;
      } else {
        descriptiveNames++;
      }
    });

    return {
      totalColors: allColors.length,
      exactMatches,
      descriptiveNames,
      uniqueNames: uniqueNames.size
    };
  }, []);

  // Get color name for selected color with debouncing
  const selectedColorName = useMemo(() => {
    return ColorUtils.getColorName(debouncedColor);
  }, [debouncedColor]);

  const handleColorChange = useCallback((color: HexColorString) => {
    setSelectedColor(color);
  }, []);

  const getColorType = (sectionTitle: string): ColorCardProps['type'] => {
    if (sectionTitle.includes('Database')) return 'exact';
    if (sectionTitle.includes('Near-Database')) return 'close';
    if (sectionTitle.includes('Custom')) return 'descriptive';
    if (sectionTitle.includes('Grayscale')) return 'grayscale';
    return 'edge';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Color Name Test
        </h1>
        <p className="text-muted-foreground">
          Testing ColorUtils.getColorName() with comprehensive color samples
        </p>
      </div>

      {/* Interactive Color Picker Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Live Color Naming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-48 h-48">
                <HexColorPicker
                  color={selectedColor}
                  onChange={handleColorChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div>
                    <div className="font-mono text-sm text-muted-foreground">
                      {selectedColor}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {selectedColorName}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pick any color to see how our improved naming algorithm works in real-time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Colors" value={stats.totalColors} />
        <StatsCard title="Exact Matches" value={stats.exactMatches} />
        <StatsCard title="Descriptive Names" value={stats.descriptiveNames} />
        <StatsCard title="Unique Names" value={stats.uniqueNames} />
      </div>

      {/* Color Sections */}
      <div className="space-y-8">
        {Object.entries(colorSamples).map(([sectionTitle, colors]) => (
          <div key={sectionTitle}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {sectionTitle}
              </h2>
              <Separator />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {colors.map((hex) => (
                <ColorCard
                  key={hex}
                  hex={hex as HexColorString}
                  colorName={ColorUtils.getColorName(hex)}
                  type={getColorType(sectionTitle)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
