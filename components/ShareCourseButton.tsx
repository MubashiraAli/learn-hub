"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";

export function ShareCourseButton({
  courseTitle,
  className,
}: {
  courseTitle: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — ignore
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className={className}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Share ${courseTitle}`}
        description="Send this course to a friend or teammate."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy link"}
            </Button>
          </>
        }
      >
        <Input value={shareUrl} readOnly aria-label="Course link" />
      </Modal>
    </>
  );
}
