import Image from "next/image";

/**
 * Backdrop — שכבות האטמוספרה של הדף.
 *
 * המכולה כולה היא position:fixed, ולכן תמונת הרקע שבתוכה מתנהגת כרקע "נעוץ"
 * בכל הדפדפנים — כולל Safari ב-iOS, שבו background-attachment: fixed שבור
 * וגורם לקפיצות בגלילה. התמונה עוברת דרך next/image ולכן מוגשת בפורמט מודרני
 * ובגודל שמתאים למסך, במקום קובץ המקור המלא.
 */

const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* תמונת הרקע — לוח המעגלים */}
      <Image
        src="/background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* הכהיה גורפת מעל תמונת הרקע — שומרת על יחס ניגודיות נגיש */}
      <div className="absolute inset-0 bg-void/88" />

      {/* ויניאטה: מרכז בהיר יחסית, קצוות שוקעים לשחור */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(10,20,32,0.55),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,6,11,0.35),transparent_22%,transparent_68%,rgba(3,6,11,0.95))]" />

      {/* רשת טכנית עדינה שנמוגה כלפי מטה */}
      <div className="grid-weave absolute inset-0" />

      {/* שתי הילות ניאון נושמות שיוצרות תנועה איטית ברקע */}
      <div className="haze absolute -top-40 right-[-12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(92,255,157,0.16),transparent_68%)] blur-3xl" />
      <div
        className="haze absolute bottom-[-18rem] left-[-14%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(43,68,87,0.35),transparent_70%)] blur-3xl"
        style={{ animationDelay: "-7s" }}
      />

      {/* גרעיניות דקה שמונעת מהגרדיאנטים להיראות "פלסטיים" */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{ backgroundImage: NOISE_TEXTURE }}
      />
    </div>
  );
}
