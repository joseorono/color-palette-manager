import { useState } from "react";
import { ColorRole } from "@/types/palette";
import { PaletteUtils } from "@/lib/palette-utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleAssignerProps {
  currentRole?: ColorRole;
  onRoleAssign: (role: ColorRole | undefined) => void;
  assignedRoles: Set<ColorRole>; // Roles already assigned to other colors
  className?: string;
}

export function RoleAssigner({
  currentRole,
  onRoleAssign,
  assignedRoles,
  className,
}: RoleAssignerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSelect = (role: ColorRole) => {
    onRoleAssign(role);
    setIsOpen(false);
  };

  const handleRemoveRole = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRoleAssign(undefined);
  };

  const availableRoles = PaletteUtils.getAvailableRoles(assignedRoles, currentRole);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700",
            currentRole && "text-blue-600 dark:text-blue-400",
            className
          )}
          title={currentRole ? `Role: ${currentRole}` : "Assign role"}
        >
          <Tag className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {currentRole && (
          <>
            <div className="flex items-center justify-between px-2 py-1.5">
              <Badge variant="secondary" className="text-xs">
                {currentRole}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemoveRole}
                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                title="Remove role"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          </>
        )}
        
        {availableRoles.length > 0 ? (
          availableRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSelect(role)}
              className="cursor-pointer"
              disabled={role === currentRole}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">{role}</span>
                {assignedRoles.has(role) && role === currentRole && (
                  <Badge variant="outline" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          !currentRole && (
            <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">
              All roles assigned
            </div>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
