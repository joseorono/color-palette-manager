"use client";

import { Button } from "@/components/ui/button";
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { Check, Copy, LucideIcon } from "lucide-react";
import React from "react";

export interface CopyButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text/content to copy to clipboard */
  value: string;
  /** The text to display (defaults to value if not provided) */
  displayText?: string;
  /** Maximum characters to display before truncating */
  maxDisplayChars?: number;
  /** Custom icon for copy state */
  copyIcon?: LucideIcon;
  /** Custom icon for copied state */
  copiedIcon?: LucideIcon;
  /** Button variant */
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Button size */
  buttonSize?: "default" | "sm" | "lg" | "icon";
  /** Custom button className */
  buttonClassName?: string;
  /** Custom text className */
  textClassName?: string;
}

const CopyButton = React.forwardRef<HTMLDivElement, CopyButtonProps>(
  ({
    value,
    displayText,
    maxDisplayChars = 25,
    copyIcon: CopyIcon = Copy,
    copiedIcon: CopiedIcon = Check,
    buttonVariant = "default",
    buttonSize = "icon",
    buttonClassName,
    textClassName,
    className,
    ...props
  }, ref) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();
    const textToDisplay = displayText || value;

    return (
      <div 
        ref={ref}
        className={cn("flex items-center border rounded-full overflow-hidden p-1", className)}
        {...props}
      >
        <p className={cn(
          "pl-4 pr-2 text-ellipsis overflow-hidden whitespace-nowrap text-sm",
          `max-w-[${maxDisplayChars}ch]`,
          textClassName
        )}>
          {textToDisplay}
        </p>
        <Button
          size={buttonSize}
          variant={buttonVariant}
          className={cn("rounded-full", buttonClassName)}
          onClick={() => copyToClipboard(value)}
        >
          {isCopied ? <CopiedIcon /> : <CopyIcon />}
        </Button>
      </div>
    );
  }
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
export default CopyButton;