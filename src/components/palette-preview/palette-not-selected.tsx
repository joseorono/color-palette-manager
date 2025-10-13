import { Palette, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PaletteNotSelectedProps {
  onSelectPalette?: () => void;
  className?: string;
}

export function PaletteNotSelected({
  onSelectPalette,
  className,
}: PaletteNotSelectedProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <Card className="max-w-md w-full mx-4 border-dashed border-2 border-muted-foreground/20">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-6">
          {/* Icon with gradient background */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Palette className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Main message */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              No Palette Selected
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Choose a palette to see a beautiful preview of how your colors work together in real UI components.
            </p>
          </div>

          {/* Action button */}
          {onSelectPalette && (
            <Button
              onClick={onSelectPalette}
              className="w-full max-w-xs"
              variant="default"
            >
              <Layers3 className="w-4 h-4 mr-2" />
              Browse Palettes
            </Button>
          )}

          {/* Visual decoration */}
          <div className="flex space-x-2 opacity-40">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
