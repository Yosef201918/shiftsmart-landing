"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, Users, MailCheck } from "lucide-react";
import { newsletterStatusLabels, type NewsletterPage, type NewsletterStatus } from "@/lib/newsletterAdmin";

export default function NewsletterAdminPanel({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<NewsletterPage | null>(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<NewsletterStatus | "all">("all");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function load() {
      setLoading(true); setError(""); setData(null);
      try {
        const response = await fetch(`/api/admin/newsletter?page=${page}`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store", signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error === "sender_not_connected" ? "הלשונית מוכנה. חיבור מאובטח ל־Sender עדיין לא הושלם, ולכן הנתונים אינם מוצגים כאן כרגע." : response.status === 401 || response.status === 403 ? "אין הרשאת צפייה. יש להתחבר מחדש לחשבון המנהל." : "לא הצלחנו לטעון את הרשימה. אפשר לנסות שוב בעוד רגע.");
        if (active) setData(result);
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "לא הצלחנו לטעון את הרשימה.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; controller.abort(); };
  }, [accessToken, page, refresh]);

  const visible = data?.members.filter(member => member.email.toLowerCase().includes(query.trim().toLowerCase()) && (status === "all" || member.status === status)) ?? [];
  const card = "rounded-2xl border border-hair bg-abyss/75 p-5 sm:p-6";

  return <section id="newsletter-panel" aria-labelledby="newsletter-tab" className="mt-7" aria-busy={loading}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="flex items-center gap-2 font-display text-2xl text-chalk"><MailCheck size={24} className="text-neon" />עדכוני הגרסאות</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">מי השאירו מייל, מי אישרו הצטרפות ומי הסירו הרשמה. הרשימה מגיעה מ־Sender; אין כאן אפשרות לשלוח מייל או לשנות הרשמה.</p></div>
      <button type="button" disabled={loading} onClick={() => setRefresh(value => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hair px-4 text-sm text-chalk disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} />רענון רשימה</button>
    </div>
    <p className="mt-4 text-xs leading-relaxed text-mist">מבקרים שלא הזינו כתובת מייל אינם מזוהים ולא מופיעים ברשימה. נרשמי סקר האייפון אינם מצורפים אליה אוטומטית.</p>
    {loading && <p role="status" className={`${card} mt-5 text-mist`}>טוענים את רשימת ההרשמות…</p>}
    {error && <p role="alert" className={`${card} mt-5 text-amber`}>{error}</p>}
    {data && <>
      <div className={`${card} mt-5 flex items-center gap-4`}><Users className="text-neon" size={23} /><div><p className="text-sm text-mist">כתובות ברשימת עדכוני הגרסאות · בכל הסטטוסים</p><p className="mt-1 font-display text-3xl text-chalk">{data.total}</p></div></div>
      <div className={`${card} mt-4`}>
        <div className="flex flex-wrap gap-3">
          <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-hair px-3"><Search size={17} aria-hidden className="shrink-0 text-mist" /><span className="sr-only">חיפוש מייל בעמוד הנוכחי</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="חיפוש מייל בעמוד" className="min-w-0 w-full bg-transparent py-2 text-sm text-chalk outline-none" /></label>
          <label className="flex items-center gap-2 text-sm text-mist">סטטוס בעמוד<select value={status} onChange={event => setStatus(event.target.value as NewsletterStatus | "all")} className="min-h-11 rounded-xl border border-hair bg-abyss px-3 text-chalk"><option value="all">הכול</option>{Object.entries(newsletterStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>
        {visible.length ? <ul className="mt-5 divide-y divide-hair">{visible.map(member => <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0"><p dir="ltr" className="break-all text-right text-sm text-chalk">{member.email}</p><p className="mt-1 text-xs text-mist">נוסף לרשימה: <bdi>{member.created || "לא זמין"}</bdi></p></div><span className={`rounded-full border px-3 py-1.5 text-xs ${member.status === "active" ? "border-neon/30 bg-neon/10 text-neon" : "border-hair text-mist"}`}>{newsletterStatusLabels[member.status]}</span></li>)}</ul> : <p className="py-8 text-center text-sm text-mist">{data.total === 0 ? "עדיין אין כתובות ברשימה." : "אין תוצאות במסננים של העמוד הזה."}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-hair pt-4 text-sm text-mist"><span>עמוד {data.page} מתוך {data.lastPage} · החיפוש והסינון חלים על העמוד הזה</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="min-h-11 rounded-xl border border-hair px-4 disabled:opacity-35">הקודם</button><button type="button" disabled={page >= data.lastPage} onClick={() => setPage(value => value + 1)} className="min-h-11 rounded-xl border border-hair px-4 disabled:opacity-35">הבא</button></div></div>
      </div>
    </>}
  </section>;
}
