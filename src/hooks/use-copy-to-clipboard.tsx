import React from "react";
import { toast } from "sonner";

function useCopyToClipboard({
    timeout = 2000,
    onCopy,
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy to clipboard",
    showToast = true,
  }: {
    timeout?: number;
    onCopy?: () => void;
    successMessage?: string;
    errorMessage?: string;
    showToast?: boolean;
  } = {}) {
    const [isCopied, setIsCopied] = React.useState(false);

    const copyToClipboard = (value: string, customMessage?: string) => {
      if (typeof window === "undefined" || !navigator.clipboard.writeText) {
        if (showToast) {
          toast.error(errorMessage);
        }
        return;
      }

      if (!value) {
        if (showToast) {
          toast.error("No content to copy");
        }
        return;
      }

      navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);

        if (showToast) {
          toast.success(customMessage || successMessage);
        }

        if (onCopy) {
          onCopy();
        }

        setTimeout(() => {
          setIsCopied(false);
        }, timeout);
      }).catch((error) => {
        console.error("Copy failed:", error);
        if (showToast) {
          toast.error(errorMessage);
        }
      });
    };

    return { isCopied, copyToClipboard };
  }

export default useCopyToClipboard;
