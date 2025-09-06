import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HarmonyPreset } from "@/types/color-harmonies";
import { COLOR_HARMONY_OPTIONS } from "@/constants/color-harmonies";
import { cn } from "@/lib/utils";

export function GenerationMethodDialog({
  open,
  onOpenChange,
  onSelect,
  currentPreset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (preset: HarmonyPreset) => void;
  currentPreset: HarmonyPreset | null;
}) {
  const handleSelect = (preset: HarmonyPreset) => {
    onSelect(preset);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Generation Method</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {COLOR_HARMONY_OPTIONS.map((option) => {
            const Icon = option.icon as LucideIcon;
            const isSelected = currentPreset === option.value;
            
            return (
              <Card
                key={option.value}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {Icon && (
                        <Icon
                          size={20}
                          className={cn(
                            "transition-colors",
                            isSelected 
                              ? "text-primary" 
                              : "text-muted-foreground"
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-sm leading-tight">
                          {option.prettyName}
                        </h3>
                        {isSelected && (
                          <Check size={16} className="text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
