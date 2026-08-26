import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "מדיניות פרטיות — Shift Smart",
  description:
    "מדיניות הפרטיות של אפליקציית Shift Smart — אילו נתונים האפליקציה משתמשת בהם, אילו הרשאות היא מבקשת, ואיך נשמרים הנתונים שלך.",
};

/*
 * דף מדיניות פרטיות עצמאי — נדרש לקישור ישיר מתוך חנות Google Play
 * (למשל /privacy). הדף יורש את app/layout.tsx (גופנים, רקע כהה, dir=rtl),
 * ולכן לא צריך לשכפל כאן שום עטיפת html/body. זהו Server Component רגיל
 * (בלי "use client") כי אין בו שום אינטראקטיביות — רק טקסט וקישור אחד.
 */
export default function PrivacyPolicyPage() {
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
          מדיניות פרטיות — Shift Smart
        </h1>
        <p className="mt-3 text-sm text-mist">עודכן לאחרונה: 26.08.2026</p>

        <p className="mt-8 text-base leading-relaxed text-mist">
          תודה שאתם משתמשים ב-Shift Smart (&quot;האפליקציה&quot;). מדיניות זו
          מסבירה אילו נתונים האפליקציה משתמשת בהם ואיך.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          עיקרון מרכזי: הנתונים שלך נשארים אצלך
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          Shift Smart היא אפליקציה מקומית (offline-first). כל הנתונים שאתם
          מזינים — עבודות, משמרות, שכר, הערות, תמונות שמצורפות למשמרות,
          הגדרות — נשמרים <strong className="text-chalk">רק על המכשיר שלכם</strong>,
          באחסון המקומי של האפליקציה. אנחנו לא מפעילים שרת שאוסף, מאחסן או
          מעבד את הנתונים האלה, ואיננו מוכרים או משתפים אותם עם צד שלישי.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          אילו הרשאות האפליקציה מבקשת ולמה
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              <strong className="text-chalk">מיקום (כולל ברקע):</strong> משמש
              אך ורק כדי לזהות אוטומטית יציאה מאזור העבודה שהגדרתם
              (Geofencing), למשל לתזכורת &quot;שכחת להחתים יציאה?&quot; או
              לסיום משמרת אוטומטי אם הפעלתם את האפשרות. נתוני המיקום
              מעובדים על המכשיר בלבד ולא נשלחים לשום שרת חיצוני.
            </span>
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              <strong className="text-chalk">התראות:</strong> משמשות
              לתזכורות משמרת מתוכננת, אישורי סיום משמרת, והתראות יעד שכר.
              כל ההתראות הן מקומיות (Local Notifications) — לא נעשה שימוש
              בשירותי Push מרוחקים.
            </span>
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              <strong className="text-chalk">יומן (קריאה/כתיבה):</strong> משמשת
              אך ורק לתכונת סנכרון המשמרות ליומן — ורק אם בחרתם להפעיל או
              להשתמש בתכונה זו. אירועי היומן נוצרים ונקראים מקומית על המכשיר
              בלבד, ואיננו שולחים שום נתון יומן לשרת חיצוני.
            </span>
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              <strong className="text-chalk">מצלמה/גלריה:</strong> משמשות
              רק אם בחרתם לצרף תמונה (למשל קבלה או תלוש) למשמרת בהיסטוריה.
              התמונה נשמרת מקומית על המכשיר.
            </span>
          </li>
          <li className="flex gap-3 text-base leading-relaxed text-mist">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-neon" />
            <span>
              <strong className="text-chalk">אימות ביומטרי (טביעת אצבע/פנים):</strong>{" "}
              אופציונלי, לנעילת האפליקציה בלבד — לא נשלח ולא נשמר שום נתון
              ביומטרי על ידינו; האימות מתבצע כולו על ידי מערכת ההפעלה של
              המכשיר.
            </span>
          </li>
        </ul>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          גיבוי ושחזור
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          האפליקציה מאפשרת לכם לייצא גיבוי של הנתונים שלכם לקובץ, ולשתף אותו
          (לדוגמה לענן האישי שלכם או לאחסון אחר) לפי בחירתכם בלבד. אנחנו לא
          מקבלים או שומרים עותק מהגיבוי הזה בשום שלב.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          שיתוף עם צדדים שלישיים
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          האפליקציה מאפשרת לכם לשתף דוחות (PDF/טקסט) בעצמכם דרך אפליקציות
          אחרות המותקנות על המכשיר (למשל וואטסאפ, מייל) — זו פעולה יזומה
          שלכם, ואנחנו לא מעורבים בהעברת המידע הזה ולא רואים אותו.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          מחיקת נתונים
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          אתם יכולים למחוק עבודות, משמרות בודדות, או לאפס את כל נתוני
          האפליקציה בכל עת מתוך ההגדרות. מחיקה כזו היא מיידית ומלאה על
          המכשיר.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          קטינים
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          האפליקציה אינה מיועדת לילדים מתחת לגיל 13, ואיננו אוספים ביודעין
          מידע מקטינים.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          שינויים במדיניות זו
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          ייתכן שנעדכן מדיניות זו מעת לעת עם הוספת פיצ&apos;רים לאפליקציה.
          נעדכן את תאריך &quot;עודכן לאחרונה&quot; בראש העמוד בכל שינוי
          מהותי.
        </p>

        <h2 className="mt-10 font-display text-xl text-chalk sm:text-2xl">
          יצירת קשר
        </h2>
        <p className="mt-4 text-base leading-relaxed text-mist">
          לשאלות בנוגע למדיניות פרטיות זו, ניתן ליצור קשר בכתובת:{" "}
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
