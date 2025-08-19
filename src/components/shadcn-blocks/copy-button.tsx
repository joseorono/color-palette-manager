"use client";

import { Button } from "@/components/ui/button";
import useCopyToClipboard from "@/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";
import React from "react";

const CopyButton = () => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const link = "https://www.shadcnui-blocks.com";

  return (
    <div className="flex items-center border rounded-full overflow-hidden p-1">
      <p className="pl-4 pr-2 max-w-[25ch] text-ellipsis overflow-hidden whitespace-nowrap text-sm">
        {link}
      </p>
      <Button
        size="icon"
        className="rounded-full"
        onClick={() => copyToClipboard(link)}
      >
        {isCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default CopyButton;