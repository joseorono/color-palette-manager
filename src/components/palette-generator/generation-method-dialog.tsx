import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";
import type { HarmonyPreset } from "@/types/color-harmonies";
import { COLOR_HARMONY_OPTIONS } from "@/constants/color-harmonies";

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
  const currentPresetPretty = COLOR_HARMONY_OPTIONS.find(
    (o) => o.value === currentPreset
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[30rem]">
        <DialogHeader>
          <DialogTitle>Select Generation Method</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={currentPreset || undefined}
            onValueChange={(value: HarmonyPreset) => onSelect(value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue className="text-start">
                {(() => {
                  const Icon = currentPresetPretty?.icon;
                  if (!currentPresetPretty) {
                    return <span>Select a generation method</span>;
                  }
                  return (
                    <div className="flex w-full items-center justify-start gap-2 text-ellipsis text-start">
                      {Icon && (
                        <Icon
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-muted-foreground"
                        />
                      )}
                      <div className="flex w-80 flex-col gap-1">
                        <span className="font-medium">
                          {currentPresetPretty.prettyName}
                        </span>
                        {currentPresetPretty.description && (
                          <span className="truncate text-xs text-muted-foreground">
                            {currentPresetPretty.description}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[30rem]">
              {COLOR_HARMONY_OPTIONS.map((option) => {
                const Icon = option.icon as LucideIcon;
                return (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="w-[30rem]"
                  >
                    <div className="flex w-full items-center justify-start gap-2">
                      {Icon && (
                        <Icon
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-muted-foreground"
                        />
                      )}
                      <div className="flex w-full flex-col gap-1">
                        <span className="font-medium">{option.prettyName}</span>
                        {option.description && (
                          <span className="text-xs leading-tight text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
