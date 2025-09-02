import { ColorRoleValidationResult } from "@/types/palette";

interface InvalidColorPaletteMessageProps {
  validationResult: ColorRoleValidationResult;
  height?: string | number;
}

export function InvalidColorPaletteMessage({
  validationResult,
  height = "25%",
}: InvalidColorPaletteMessageProps) {
  return (
    <div className="relative" style={{ height }}>
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 absolute inset-0 flex w-full flex-col items-center justify-start overflow-auto rounded-lg border border-border bg-card p-4 text-center shadow-sm">
        <div className="mb-2 rounded-full bg-muted p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-muted-foreground"
          >
            <path d="M17.5 8A6.5 6.5 0 0 0 4.5 8" />
            <path d="M4.5 16a6.5 6.5 0 0 0 13 0" />
            <path d="M9 10h1v4" />
            <path d="M14 10h1v4" />
            <path d="M12 10v4" />
          </svg>
        </div>
        <h3 className="mb-1 text-base font-medium">Invalid Color Palette</h3>
        <p className="mb-2 text-xs text-muted-foreground">
          The palette is missing required color roles needed for proper display.
        </p>
        <div className="flex w-full max-w-xs flex-col gap-2 overflow-auto">
          {validationResult.missingRoles.length > 0 && (
            <div className="w-full rounded-md bg-muted/50 p-2 text-left">
              <h4 className="mb-1 text-xs font-medium">Missing Roles:</h4>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                {validationResult.missingRoles.map((role) => (
                  <li key={role} className="truncate">
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {validationResult.invalidRoles.length > 0 && (
            <div className="w-full rounded-md bg-muted/50 p-2 text-left">
              <h4 className="mb-1 text-xs font-medium">Invalid Roles:</h4>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                {validationResult.invalidRoles.map((role: string) => (
                  <li key={role} className="truncate">
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
