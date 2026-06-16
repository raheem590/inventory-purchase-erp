"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CopyPurchaseListButtonProps {
  lines: string[];
}

export function CopyPurchaseListButton({ lines }: CopyPurchaseListButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = lines.join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
