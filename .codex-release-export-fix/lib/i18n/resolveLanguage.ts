import type { Lang } from "./dictionaries";

/** An explicit saved choice wins; otherwise use the first supported device language. */
export function resolveLanguage(saved: unknown, preferredLanguages: readonly string[]): Lang {
  if (saved === "he" || saved === "en") return saved;
  for (const language of preferredLanguages) {
    const base = language.toLowerCase().split(/[-_]/)[0];
    if (base === "he" || base === "iw") return "he";
    if (base === "en") return "en";
  }
  return "he";
}
