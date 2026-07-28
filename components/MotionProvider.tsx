"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" מכבד את הגדרת מערכת ההפעלה של המשתמש:
 * מי שביקש להפחית אנימציות יקבל שינויי שקיפות בלבד, ללא תזוזה או שינוי גודל.
 * זה משלים את כלל ה-prefers-reduced-motion שב-globals.css, שמכסה רק אנימציות CSS.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
