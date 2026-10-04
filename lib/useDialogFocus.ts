import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * ניהול מיקוד למודאל נגיש, בלי ספרייה חיצונית: בפתיחה המיקוד עובר לשדה
 * הראשון בתוך החלון, Tab/Shift+Tab מסתובבים רק בתוך החלון, Escape סוגר,
 * ובסגירה המיקוד חוזר לכפתור שפתח את החלון. triggerRef מחוברת במפורש
 * לכפתור הפותח כי ב-Safari/Firefox ב-macOS לחיצה על כפתור לא ממקדת אותו,
 * ולכן document.activeElement לבדו לא אמין. שדות עם tabIndex=-1 (כמו
 * ה-honeypot) מוחרגים אוטומטית מהסיבוב.
 */
export function useDialogFocus(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const firstField = dialog.querySelector<HTMLElement>("input:not([tabindex='-1']), textarea");
    (firstField ?? getFocusable()[0])?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const trigger = triggerRef.current;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  return { dialogRef, triggerRef };
}
