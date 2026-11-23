"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// שכבה מחוץ ל-main מונעת מכפתור ההורדה הצף לכסות את הטפסים.
export default function OverlayPortal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return mounted ? createPortal(children, document.body) : null;
}
