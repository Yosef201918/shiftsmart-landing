# סביבת PostgreSQL מבודדת לבדיקות

עודכן: 28.10.2026. הסביבה הוקמה מקומית ונבדקה. אין שינוי במסד Supabase הפעיל ואין משאב ענן חדש.

## הסביבה

- PostgreSQL 17.11 נייד מארכיון EDB שאליו מפנה עמוד ההורדות הרשמי של PostgreSQL.
- קובצי התוכנה, הנתונים והסיסמה נמצאים ב-`%TEMP%\shiftsmart-postgres-17-qa` של משתמש Windows המארח. קובץ הסיסמה מוגבל ב-ACL למשתמש הנוכחי; ערכו לא הודפס ולא נשמר בפרויקט.
- האזנה ל-`127.0.0.1:55432` בלבד, אימות SCRAM, ללא התקנת שירות Windows וללא הגדרות autostart. האתר המקומי נשאר בפורט 3001.
- מסד הבדיקה: `shiftsmart_form_qa`. הוא מכיל טבלאות דמה עם המגבלות הרלוונטיות ו-RLS, ותפקידי anon/authenticated/service_role מקומיים בלבד. לא הועתקו רשומות משתמשים ולא נעשה שימוש במפתחות Supabase הפעילים.
- מקור הארכיון ו-SHA256 מתועדים ב-`output/postgres-qa-runtime.json`. חבילת PGlite הקודמת נשארת כלי בדיקה בזיכרון בתיקיית TEMP; היא אינה תלות של האתר.

## בדיקות שעברו

סקריפט `scripts/check-rate-sql-postgres.mjs` הריץ את ה-SQL שהוכן למיגרציה מול PostgreSQL אמיתי, עם חיבורי psql נפרדים:

| תרחיש | חיבורים נפרדים | התקבלו | הוגבלו |
| --- | --- | --- | --- |
| שליחות ראשונות במקביל | 20 | 1 | 19 |
| נותר מקום אחד במכסה | 20 | 1 | 19 |
| חלון מתגלגל עם מקום אחד שפג | 20 | 1 | 19 |

כל חיבור מזוהה באמצעות backend PID נפרד, והבדיקה מאמתת שמספר השורות שנוספו שווה למספר האישורים. נבדקו גם היגיון החלון, cooldown, rollback, ניקוי, RLS, חסימת הפונקציה והמונה לתפקידים הציבוריים, וחסימת INSERT ישיר לאחר ה-cutover המקומי. תפקיד השרת המקומי הצליח להוסיף הצעה אחרי ה-cutover.

דוח נתונים: `output/rate-postgres-qa-report.json`. דוח חזותי: `http://127.0.0.1:3004/` (שרת GET מקומי שמציג רק את הדוח).

## הפעלה וכיבוי

להריץ ב-PowerShell של משתמש Windows המארח; `%TEMP%` בסביבת sandbox עשוי להצביע לתיקייה אחרת.

```powershell
./scripts/local-postgres-qa.ps1 -Action Status
./scripts/local-postgres-qa.ps1 -Action Start
./scripts/local-postgres-qa.ps1 -Action Stop
```

כיבוי אינו מוחק את הנתונים. אין צורך להשאיר את המסד פועל כשלא מבצעים בדיקות.

```powershell
$taskPgRoot = Join-Path $env:TEMP 'shiftsmart-postgres-17-qa'
node scripts/check-rate-sql-postgres.mjs $taskPgRoot
node scripts/build-rate-qa-report.mjs
```

**הרצה חוזרת מאפסת את סכמות מסד ה-QA בלבד.** הסקריפט בודק לפני האיפוס שהחיבור הוא ל-loopback בפורט הקבוע, שם המסד הוא שם הבדיקה ו-data_directory שווה לתיקיית ה-TEMP הידועה. הוא מסרב לפעול מול cluster אחר. טבלאות הדמה אינן מיועדות לשמירת מידע אמיתי.

לשרת הדוח בלבד:

```powershell
node scripts/serve-rate-qa-report.mjs
```

## מה עדיין דורש בדיקה ואישור

בדיקת מקביליות PostgreSQL הושלמה. החיבור ל-Supabase REST עם מפתח שרת ולפריסת Vercel עדיין לא הופעל. יש לבדוק את השילוב הזה בסביבת Preview לפני שינוי ההרשאות במסד הפעיל. אין להסיק מבדיקות המסד המקומיות שההגבלה כבר מגינה על האתר החי.

מקור: [PostgreSQL — הורדות Windows וארכיונים ניידים](https://www.postgresql.org/download/windows/).
