"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { dictionaries, type Dictionary, type Lang } from "./dictionaries";

const STORAGE_KEY = "shiftsmart-lang";
const DEFAULT_LANG: Lang = "he";

/*
 * חנות שפה זעירה מחוץ ל-React, בדפוס useSyncExternalStore הרשמי — ולא
 * useState + useEffect שקורא ל-localStorage. הסיבה: קריאה ל-localStorage
 * בתוך useEffect ואז setState היא בדיוק התבנית ש-React מזהיר מפניה
 * ("setState synchronously within an effect can trigger cascading
 * renders"). useSyncExternalStore פותר את זה נכון: הוא קורא ל-
 * getServerSnapshot בזמן ה-hydration כדי להתאים לפלט השרת, ועובר
 * ל-getSnapshot מיד אחריו באמצעות מנגנון פנימי של React — לא useEffect
 * ידני — ולכן אינו נחשב לאותה תבנית בעייתית וגם לא זורק אזהרת hydration.
 */
let currentLang: Lang = DEFAULT_LANG;
const listeners = new Set<() => void>();

function readStoredLang(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "he" || stored === "en" ? stored : DEFAULT_LANG;
}

/* מאותחל פעם אחת בזמן טעינת המודול בדפדפן, לפני שכל קומפוננטה מתחילה לרנדר */
if (typeof window !== "undefined") {
  currentLang = readStoredLang();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Lang {
  return currentLang;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

function commitLang(next: Lang) {
  currentLang = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* מצב פרטי או אחסון חסום — השפה עדיין מתעדכנת בזיכרון להמשך הסשן */
  }
  for (const listener of listeners) listener();
}

type LanguageContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((next: Lang) => commitLang(next), []);
  const toggleLang = useCallback(
    () => commitLang(lang === "he" ? "en" : "he"),
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === "he" ? "rtl" : "ltr",
      t: dictionaries[lang],
      setLang,
      toggleLang,
    }),
    [lang, setLang, toggleLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
