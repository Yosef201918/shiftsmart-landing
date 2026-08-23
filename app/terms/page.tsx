import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "תנאי שימוש — Shift Smart",
  description:
    "תנאי השימוש באפליקציית Shift Smart — הסכמה לתנאים, תיאור השירות, אחריות המשתמש, קניין רוחני והגבלת אחריות.",
};

/*
 * דף תנאי שימוש עצמאי — אותו מבנה בדיוק כמו app/privacy/page.tsx. הדף יורש
 * את app/layout.tsx (גופנים, רקע כהה, dir=rtl), ולכן לא צריך לשכפל כאן שום
 * עטיפת html/body. זהו Server Component רגיל (בלי "use client") כי אין בו
 * שום אינטראקטיביות — רק טקסט וקישור אחד.
 */
export default function TermsOfServicePage() {
  return (
    <main className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-mist transition duration-300 hover:text-neon"
      >
        <Home className="size-4 shrink-0 transition duration-300 group-hover:text-neon" strokeWidth={1.75} />
        חזרה לדף הבית
      </Link>

      <article className="mt-8">
        <h1 className="font-display text-3xl text-chalk sm:text-4xl">
          תנאי שימוש — Shift Smart
        </h1>
        <p className="mt-3 text-sm text-mist">עודכן לאחרונה: 17.08.2026</p>

        <p className="mt-8 text-base leading-relaxed text-mist">
          תנאי שימוש אלה (&quot;התנאים&quot;) חלים על השימוש באפליקציית
          Shift Smart (&quot;האפליקציה&quot;). התקנת האפליקציה או השימוש בה
          מהווים הסכמה מלאה לתנאים אלה. אם אינכם מסכימים לתנאי מהם, אנא
          הימנעו משימוש באפליקציה.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          תיאור השירות
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          Shift Smart היא אפליקציית אנדרואיד מקומית (offline-first) לניהול
          משמרות, שעון נוכחות וחישוב שכר. האפליקציה מסייעת לכם לעקוב אחרי
          שעות העבודה, לחשב שכר, שעות נוספות ותוספות בהתאם לנתונים שאתם
          מזינים, ולייצא דוחות וסיכומים. Shift Smart אינה שירות תשלומי שכר
          רשמי, אינה מחוברת למעסיק שלכם, ואינה מבצעת שום העברת כספים.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          גרסת בטא סגורה
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          האפליקציה נמצאת כרגע בשלב <strong className="text-chalk">בטא סגורה</strong>{" "}
          בחנות Google Play. המשמעות: ייתכנו תקלות, שגיאות חישוב, אובדן
          נתונים או שינויים תכופים בתכונות ובממשק. אנחנו לא מתחייבים לזמינות
          רצופה, לדיוק מוחלט של החישובים, או להמשך פיתוח וקיום השירות בצורתו
          הנוכחית. מומלץ לגבות את הנתונים שלכם באופן שוטף דרך תכונת הגיבוי
          שבאפליקציה.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          אחריות המשתמש
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              אתם אחראים להזין נתונים מדויקים — שעות עבודה, תעריף שעתי
              ותוספות — שכן דיוק החישובים תלוי לחלוטין בנתונים שהזנתם.
            </span>
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              Shift Smart היא כלי עזר בלבד ואינה תחליף לתלוש השכר הרשמי או
              לבדיקה מול המעסיק שלכם. חובה לוודא כל תשלום שכר בפועל מול
              המעסיק ומול תלוש השכר הרשמי.
            </span>
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              אתם אחראים לשימוש חוקי באפליקציה בלבד, ולא להשתמש בה בניגוד
              לכל דין או להסכם העסקה שלכם.
            </span>
          </li>
        </ul>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          קניין רוחני
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          כל הזכויות באפליקציה — לרבות הקוד, העיצוב, הלוגו והתוכן — שייכות
          לבעלי Shift Smart. אין להעתיק, להנדס לאחור, להפיץ מחדש או ליצור
          יצירות נגזרות מהאפליקציה ללא אישור מראש ובכתב.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          הגבלת אחריות
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          האפליקציה מסופקת &quot;כפי שהיא&quot; (AS IS), ללא כל התחייבות
          לדיוק, זמינות רצופה או התאמה למטרה מסוימת. Shift Smart ומפתחיה לא
          יישאו באחריות לכל נזק — ישיר או עקיף — שייגרם כתוצאה משימוש
          באפליקציה, לרבות טעויות חישוב שכר, אובדן נתונים או אי-זמינות
          זמנית של השירות.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          שינויים באפליקציה ובתנאים
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          אנחנו רשאים לעדכן, לשנות או להפסיק תכונות באפליקציה בכל עת, במיוחד
          בשלב הבטא. ייתכן שנעדכן גם את תנאי השימוש הללו מעת לעת — נעדכן את
          תאריך &quot;עודכן לאחרונה&quot; בראש העמוד בכל שינוי מהותי. המשך
          שימוש באפליקציה לאחר עדכון מהווה הסכמה לתנאים המעודכנים.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          דין חל וסמכות שיפוט
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          תנאי שימוש אלה כפופים לדיני מדינת ישראל בלבד, וסמכות השיפוט הבלעדית
          בכל מחלוקת הנוגעת אליהם נתונה לבתי המשפט המוסמכים בישראל.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          יצירת קשר
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          לשאלות בנוגע לתנאי שימוש אלה, ניתן ליצור קשר בכתובת:{" "}
          <a
            href="mailto:yoseffstor@gmail.com"
            dir="ltr"
            className="text-neon underline decoration-neon-deep underline-offset-4 transition duration-300 hover:text-neon-soft"
          >
            yoseffstor@gmail.com
          </a>
        </p>
      </article>

      <div className="rule-hair mt-12" />

      <Link
        href="/"
        className="group mt-6 inline-flex items-center gap-2 text-sm text-mist transition duration-300 hover:text-neon"
      >
        <Home className="size-4 shrink-0 transition duration-300 group-hover:text-neon" strokeWidth={1.75} />
        חזרה לדף הבית
      </Link>
    </main>
  );
}
