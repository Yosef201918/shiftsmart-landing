"use client";

import { Check, Share2 } from "lucide-react";

import { useShare } from "@/lib/useShare";

type ShareButtonProps = {
  className?: string;
};

/*
 * שלב 21 — כפתור שיתוף חכם. כל הלוגיקה (Web Share API עם נפילה אחורה להעתקה
 * ללוח) יושבת ב-lib/useShare.ts; כאן נשאר המראה בלבד.
 */
export default function ShareButton({ className = "" }: ShareButtonProps) {
  const { copied, share, label } = useShare();

  return (
    <button
      type="button"
      onClick={share}
      className={`panel inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm text-chalk transition duration-300 hover:-translate-y-0.5 hover:border-neon-deep hover:text-neon ${className}`}
    >
      {copied ? (
        <Check className="size-4 shrink-0 text-neon" strokeWidth={2} />
      ) : (
        <Share2 className="size-4 shrink-0 text-neon" strokeWidth={1.9} />
      )}
      {label}
    </button>
  );
}
