"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import { RefreshCw, ChartColumnIncreasing, LogOut, Mail, Copy, Check } from "lucide-react";
import NewsletterAdminPanel from "@/components/NewsletterAdminPanel";
import { SITE_URL } from "@/lib/links";

type ResponseRow = {
  id: string;
  created_at: string;
  device: "iphone" | "android" | "both" | "other";
  shift_worker: "yes" | "not_currently";
  interest: "yes" | "maybe" | "not_relevant";
  comment: string;
  source: string;
  email: string | null;
  email_opt_in_at: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://misconfigured.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "misconfigured-anon-key",
);
const SURVEY_ADMIN_EMAILS = ["yoseffstor@gmail.com", "y0556771780@gmail.com"] as const;
const NEWSLETTER_ADMIN_EMAIL = SURVEY_ADMIN_EMAILS[0];

const labels = {
  device: { iphone: "iPhone", android: "Android", both: "שניהם", other: "אחר" },
  shift: { yes: "כן", not_currently: "לא כרגע" },
  interest: { yes: "כן, רוצה לנסות", maybe: "אולי", not_relevant: "לא רלוונטי" },
  source: { website: "אתר", instagram: "Instagram", whatsapp: "WhatsApp", direct: "ישיר", other: "אחר" },
} as const;

const card = "min-w-0 rounded-2xl border border-hair bg-abyss/75 p-5 sm:p-6";

export default function IphoneAdminDashboard() {
  const [tab, setTab] = useState<"survey" | "newsletter">("survey");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loginEmail, setLoginEmail] = useState<(typeof SURVEY_ADMIN_EMAILS)[number]>(SURVEY_ADMIN_EMAILS[0]);
  const [sentLink, setSentLink] = useState(false);
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [summaryText, setSummaryText] = useState("");

  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;
    let authEventReceived = false;
    let hasRestoredSession = false;
    let anonymousGraceTimer: ReturnType<typeof setTimeout> | undefined;

    const finishAnonymousCheck = () => {
      if (anonymousGraceTimer) clearTimeout(anonymousGraceTimer);
      anonymousGraceTimer = setTimeout(() => {
        if (active && !hasRestoredSession) setAuthReady(true);
      }, 800);
    };

    const updateSession = (nextSession: Session | null) => {
      setLoading(Boolean(nextSession));
      setError("");
      setSession(nextSession);
      if (!nextSession) {
        setRows([]);
        setUpdatedAt(null);
        setTab("survey");
      }
    };

    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      if (event === "INITIAL_SESSION") {
        if (!authEventReceived) {
          authEventReceived = true;
          hasRestoredSession = Boolean(nextSession);
          updateSession(nextSession);
          if (nextSession) setAuthReady(true);
          else finishAnonymousCheck();
        }
        return;
      }
      authEventReceived = true;
      hasRestoredSession = Boolean(nextSession);
      if (anonymousGraceTimer) clearTimeout(anonymousGraceTimer);
      updateSession(nextSession);
      setAuthReady(true);
    });

    void supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
      if (!active) return;
      if (sessionData.session) {
        authEventReceived = true;
        hasRestoredSession = true;
        if (anonymousGraceTimer) clearTimeout(anonymousGraceTimer);
        updateSession(sessionData.session);
        setAuthReady(true);
      } else if (sessionError) {
        setError("לא הצלחנו לבדוק את מצב ההתחברות. רענן את הדף ונסה שוב.");
        finishAnonymousCheck();
      } else if (!authEventReceived) {
        finishAnonymousCheck();
      }
    }).catch(() => {
      if (!active) return;
      if (!authEventReceived) {
        setError("לא הצלחנו לבדוק את מצב ההתחברות. רענן את הדף ונסה שוב.");
        finishAnonymousCheck();
      }
    });

    return () => {
      active = false;
      if (anonymousGraceTimer) clearTimeout(anonymousGraceTimer);
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    const loadResponses = async () => {
      try {
        const pageSize = 1000;
        const allResponses: ResponseRow[] = [];
        let queryError: { code?: string } | null = null;
        for (let offset = 0; ; offset += pageSize) {
          const page = await supabase
            .from("iphone_interest_responses")
            .select("id,created_at,device,shift_worker,interest,comment,source,email,email_opt_in_at")
            .order("created_at", { ascending: false })
            .order("id", { ascending: false })
            .range(offset, offset + pageSize - 1);
          if (page.error) {
            queryError = page.error;
            break;
          }
          const batch = (page.data ?? []) as ResponseRow[];
          allResponses.push(...batch);
          if (batch.length < pageSize) break;
        }
        if (!active) return;
        if (queryError) setError(queryError.code === "42501"
          ? "לחשבון שמחובר כרגע אין הרשאת צפייה. התחבר עם אחת מכתובות המנהל המורשות."
          : "לא הצלחנו לטעון את תשובות הסקר. אפשר לנסות שוב.");
        else {
          setRows(allResponses);
          setUpdatedAt(new Date());
        }
      } catch {
        if (active) setError("לא הצלחנו לטעון את תשובות הסקר. אפשר לנסות שוב.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadResponses();
    return () => { active = false; };
  }, [session, refreshCount]);

  const refreshResponses = () => {
    setLoading(true);
    setError("");
    setRefreshCount(count => count + 1);
  };

  const counts = useMemo(() => {
    const byInterest = { yes: 0, maybe: 0, not_relevant: 0 };
    const byDay = new Map<string, number>();
    for (const row of rows) {
      byInterest[row.interest] += 1;
      const day = new Date(row.created_at).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }
    const relevant = rows.filter(row => row.device === "iphone" && row.shift_worker === "yes");
    const wantsToTry = relevant.filter(row => row.interest === "yes").length;
    return { total: rows.length, byInterest, relevant: relevant.length, wantsToTry, emails: rows.filter(row => row.email && row.email_opt_in_at).length, byDay: [...byDay.entries()].reverse().slice(-7) };
  }, [rows]);
  const canViewNewsletter = session?.user.email?.toLowerCase() === NEWSLETTER_ADMIN_EMAIL;

  const copySurveySummary = async () => {
    const emailCount = rows.filter(row => row.email && row.email_opt_in_at).length;
    const countsFor = <T extends string>(values: T[], getValue: (row: ResponseRow) => T, names: Record<T, string>) =>
      values.map(value => `- ${names[value]}: ${rows.filter(row => getValue(row) === value).length}`).join("\n");
    const summary = [
      "סיכום תוצאות סקר הביקוש ל‑iPhone של Shift Smart",
      `מספר תשובות כולל: ${rows.length}`,
      "",
      "התפלגות לפי מכשיר:",
      countsFor(["iphone", "android", "both", "other"], row => row.device, labels.device),
      "",
      "עובדים במשמרות:",
      countsFor(["yes", "not_currently"], row => row.shift_worker, labels.shift),
      "",
      "עניין בגרסת iPhone:",
      countsFor(["yes", "maybe", "not_relevant"], row => row.interest, labels.interest),
      "",
      "השאירו מייל:",
      `- כן: ${emailCount}`,
      `- לא: ${rows.length - emailCount}`,
      "",
      "תשובות בודדות (לפי סדר קבלה):",
      rows.map((row, index) => [
        `${index + 1}. ${new Date(row.created_at).toLocaleString("he-IL")}`,
        `מכשיר: ${labels.device[row.device]}`,
        `עובד במשמרות: ${labels.shift[row.shift_worker]}`,
        `עניין ב-iPhone: ${labels.interest[row.interest]}`,
        `השאיר מייל: ${row.email && row.email_opt_in_at ? "כן" : "לא"}`,
        `מקור: ${labels.source[row.source as keyof typeof labels.source] ?? row.source}`,
        `הצעה/הערה: ${row.comment?.trim() || "ללא"}`,
      ].join(" | ")).join("\n\n"),
      "",
      "הערה: הסיכום כולל תשובות והערות חופשיות, אך אינו כולל כתובות מייל אישיות.",
    ].join("\n");
    setSummaryText(summary);

    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = summary;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) {
        setCopyStatus("לא הצלחנו להעתיק אוטומטית. אפשר לפתוח את הסיכום שמתחת ולהעתיק ידנית.");
        return;
      }
    }
    setCopyStatus("הסיכום הועתק. אפשר להדביק אותו ב‑Cloud Code.");
  };

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSentLink(false);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: { emailRedirectTo: `${SITE_URL}/admin/iphone`, shouldCreateUser: true },
    });
    if (authError) setError(authError.message.toLowerCase().includes("rate limit")
      ? "נשלחו לאחרונה יותר מדי קישורי התחברות. צריך להמתין עד שמגבלת השליחה של Supabase תתאפס."
      : "לא הצלחנו לשלוח קישור התחברות. אפשר לנסות שוב מאוחר יותר.");
    else setSentLink(true);
  };

  if (!authReady) return <main dir="rtl" className="relative z-10 mx-auto w-full max-w-xl px-5 py-12 sm:px-8" aria-busy="true">
    <div className={card}>
      <p role="status" className="flex items-center gap-2 text-sm text-mist"><RefreshCw size={16} className="animate-spin text-neon" />בודקים את מצב ההתחברות…</p>
    </div>
  </main>;

  if (!session) return <main dir="rtl" className="relative z-10 mx-auto w-full max-w-xl px-5 py-12 sm:px-8">
    <p className="font-mono text-xs text-neon">SHIFT SMART · אזור מפתחים</p>
    <h1 className="mt-3 font-display text-3xl text-chalk">סקר האייפון וניוזלטר</h1>
    <p className="mt-3 leading-relaxed text-mist">הכניסה מוגנת בקישור חד־פעמי למייל. רק חשבון שהורשה במסד יוכל לראות את התשובות.</p>
    <form onSubmit={login} className={`${card} mt-7 space-y-4`}>
      <label htmlFor="admin-login-email" className="block text-sm text-mist">בחר את כתובת המייל שאליה לשלוח קישור התחברות</label>
      <select id="admin-login-email" value={loginEmail} onChange={event => setLoginEmail(event.target.value as (typeof SURVEY_ADMIN_EMAILS)[number])} className="min-h-12 w-full rounded-xl border border-hair bg-abyss px-3 text-left text-chalk" dir="ltr">
        {SURVEY_ADMIN_EMAILS.map(email => <option key={email} value={email}>{email}</option>)}
      </select>
      <p className="text-xs leading-relaxed text-mist">רק הכתובות המורשות שמופיעות כאן יכולות לצפות בתשובות. יש לפתוח את הקישור באותו פרופיל דפדפן שבו פתוח הלוח.</p>
      <button className="min-h-12 w-full rounded-xl bg-neon px-5 font-medium text-[#021309]">שליחת קישור התחברות למנהל</button>
      {sentLink && <p role="status" className="text-sm leading-relaxed text-neon">נשלח קישור חד־פעמי אל {loginEmail}. פתח אותו באותו פרופיל דפדפן שבו פתוח לוח התוצאות.</p>}
      {error && <p role="alert" className="text-sm text-amber">{error}</p>}
    </form>
  </main>;

  const bars = Object.entries(counts.byInterest) as Array<[keyof typeof labels.interest, number]>;
  const peak = Math.max(1, ...counts.byDay.map(([, count]) => count));

  if (tab === "survey" && updatedAt === null) return <main dir="rtl" className="relative z-10 mx-auto w-full max-w-xl px-5 py-12 sm:px-8" aria-busy={loading}>
    <div className={card}>
      {loading ? <p role="status" className="flex items-center gap-2 text-sm text-mist"><RefreshCw size={16} className="animate-spin text-neon" />טוענים את תוצאות הסקר…</p> : <>
        <p role="alert" className="text-sm text-amber">{error || "לא הצלחנו לטעון את תשובות הסקר."}</p>
        <button type="button" onClick={refreshResponses} className="mt-4 min-h-11 rounded-xl border border-hair px-4 text-sm text-chalk">ניסיון חוזר</button>
      </>}
    </div>
  </main>;

  return <main dir="rtl" className="relative z-10 mx-auto w-full max-w-6xl overflow-x-clip px-5 py-8 sm:px-8 sm:py-12">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hair pb-6">
      <div><p className="font-mono text-xs text-neon">SHIFT SMART · אזור מפתחים</p><h1 className="mt-3 font-display text-3xl text-chalk sm:text-4xl">סקר האייפון וניוזלטר</h1><p className="mt-2 text-sm text-mist">אזור פרטי לצפייה בסקר ובנרשמים לעדכוני הגרסאות.</p></div>
      <div className="flex gap-2">{tab === "survey" && <button type="button" onClick={refreshResponses} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hair px-4 text-sm text-chalk"><RefreshCw size={16} />{loading ? "מרעננים…" : "רענון"}</button>}<button type="button" onClick={() => void supabase.auth.signOut()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hair px-4 text-sm text-mist"><LogOut size={16} />יציאה</button></div>
    </header>
    <nav aria-label="תצוגת נתונים" className="mt-6 flex gap-2 border-b border-hair pb-4">
      <button id="survey-tab" type="button" aria-pressed={tab === "survey"} onClick={() => setTab("survey")} className={`min-h-12 rounded-xl border px-5 text-sm ${tab === "survey" ? "border-neon/40 bg-neon/10 text-neon" : "border-hair text-mist"}`}>סקר iPhone</button>
      {canViewNewsletter && <button id="newsletter-tab" type="button" aria-pressed={tab === "newsletter"} aria-controls="newsletter-panel" onClick={() => setTab("newsletter")} className={`min-h-12 rounded-xl border px-5 text-sm ${tab === "newsletter" ? "border-neon/40 bg-neon/10 text-neon" : "border-hair text-mist"}`}>ניוזלטר</button>}
    </nav>
    {tab === "newsletter" && canViewNewsletter ? <NewsletterAdminPanel accessToken={session.access_token} /> : <>
    {error && <p role="alert" className="mt-5 rounded-xl border border-amber/30 bg-amber/5 p-4 text-sm text-amber">{error}</p>}
    <section className={`${card} mt-6`} aria-label="סיכום והעתקת תשובות">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-display text-lg text-chalk">סיכום כל תשובות הסקר</h2><p className="mt-1 text-sm leading-relaxed text-mist">מעתיק נתונים מסכמים ואת כל התשובות, כולל הערות. כתובות מייל אישיות לא נכללות.</p></div>
        <button type="button" onClick={() => void copySurveySummary()} disabled={loading || rows.length === 0} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-neon px-5 font-medium text-[#021309] disabled:cursor-not-allowed disabled:opacity-50"><Copy size={17} />העתקת הסיכום ל‑Cloud Code</button>
      </div>
      {copyStatus && <p role="status" aria-live="polite" className="mt-3 flex items-center gap-2 text-sm text-neon"><Check size={16} />{copyStatus}</p>}
      {summaryText && <details className="mt-4">
        <summary className="cursor-pointer text-sm text-neon">הצגת הסיכום</summary>
        <div dir="rtl" aria-label="סיכום תשובות הסקר" className="mt-3 max-h-[32rem] w-full overflow-auto rounded-xl border border-hair bg-abyss p-3 text-right text-sm leading-7 text-chalk [writing-mode:horizontal-tb] [unicode-bidi:plaintext]">
          <pre className="m-0 whitespace-pre-wrap [overflow-wrap:anywhere] [word-break:normal] font-sans">{summaryText}</pre>
        </div>
        <button type="button" onClick={() => void copySurveySummary()} className="mt-3 min-h-11 rounded-xl border border-hair px-4 text-sm text-chalk">העתקת הסיכום</button>
      </details>}
    </section>
    <section aria-label="מדדים מרכזיים" className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[["כל התשובות", counts.total], ["משתמשי iPhone שעובדים במשמרות", counts.relevant], ["רוצים לנסות", counts.wantsToTry], ["מיילים עם הסכמה", counts.emails]].map(([label, value]) => <article key={label} className={card}><p className="text-sm text-mist">{label}</p><p className="mt-3 font-display text-4xl text-neon">{value}</p></article>)}
    </section>
    <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
      <article className={card}><h2 className="flex items-center gap-2 font-display text-lg text-chalk"><ChartColumnIncreasing size={19} className="text-neon" />רמת העניין</h2><div className="mt-5 space-y-4">{bars.map(([key, value]) => <div key={key}><div className="mb-2 flex justify-between gap-3 text-sm"><span className="text-mist">{labels.interest[key]}</span><span className="font-mono text-chalk">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-hair"><div className="h-full rounded-full bg-neon transition-all" style={{ width: `${counts.total ? value / counts.total * 100 : 0}%` }} /></div></div>)}</div></article>
      <article className={`${card} overflow-hidden`}><h2 className="font-display text-lg text-chalk">תשובות לאורך זמן</h2>{counts.byDay.length ? <div className="mt-5 flex h-36 w-full min-w-0 items-end gap-2 overflow-hidden border-b border-hair pb-1" role="img" aria-label="גרף מספר התשובות בשבעת הימים האחרונים">{counts.byDay.map(([day, count]) => <div key={day} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="font-mono text-xs text-chalk">{count}</span><div className="w-full max-w-9 rounded-t bg-neon/80" style={{ height: `${Math.max(8, count / peak * 92)}px` }} /><span className="whitespace-nowrap text-[10px] text-mist">{day}</span></div>)}</div> : <p className="mt-5 text-sm text-mist">עדיין אין תשובות להצגה בגרף.</p>}</article>
    </section>
    <section className={`${card} mt-4`}><div className="flex items-center gap-2"><Mail size={18} className="text-neon" /><h2 className="font-display text-lg text-chalk">תשובות אחרונות</h2></div>{rows.length ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-right text-sm"><thead><tr className="border-b border-hair text-mist">{["תאריך", "מכשיר", "עובד במשמרות", "עניין ב-iPhone", "מקור", "מייל", "הצעה"].map(label => <th key={label} className="px-3 py-3 font-normal">{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-b border-hair/60 align-top text-chalk"><td className="px-3 py-3 whitespace-nowrap">{new Date(row.created_at).toLocaleString("he-IL")}</td><td className="px-3 py-3">{labels.device[row.device]}</td><td className="px-3 py-3">{labels.shift[row.shift_worker]}</td><td className="px-3 py-3">{labels.interest[row.interest]}</td><td className="px-3 py-3">{labels.source[row.source as keyof typeof labels.source] ?? row.source}</td><td className="px-3 py-3" dir="ltr">{row.email ?? "—"}</td><td className="max-w-[280px] whitespace-pre-wrap px-3 py-3 text-mist">{row.comment || "—"}</td></tr>)}</tbody></table></div> : !error && <p className="mt-4 text-sm text-mist">עדיין אין תשובות.</p>}</section>
    <p className="mt-4 text-xs text-mist">{updatedAt ? `עודכן ${updatedAt.toLocaleTimeString("he-IL")}` : ""} · הנתונים לא מוצגים לציבור.</p>
    </>}
  </main>;
}
