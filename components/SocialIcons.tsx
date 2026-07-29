type IconProps = {
  className?: string;
  strokeWidth?: number;
};

/*
 * lucide-react v1 הסירה את כל אייקוני המותגים — אין בה Facebook ולא Instagram
 * (בדקנו: אפס תוצאות מתוך 2007 אייקונים). כדי לשמור על אחידות מלאה עם שאר
 * האייקונים בדף, שוחזרו כאן המסלולים המקוריים של lucide בגרסה 0:
 * viewBox של 24, קווי מתאר בלבד, currentColor, ו-stroke-linecap עגול.
 */
const BASE_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FacebookIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      {...BASE_PROPS}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function InstagramIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      {...BASE_PROPS}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
