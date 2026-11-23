"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Smartphone } from "lucide-react";
import { SITE_URL } from "@/lib/links";

const copy = {
  he: {
    back: "לאתר Shift Smart", kicker: "בודקים ביקוש · iPHONE", title: "עובדים במשמרות עם iPhone?",
    intro: "אנחנו בודקים ביקוש לגרסת iPhone של Shift Smart. שלוש תשובות קצרות יעזרו לנו לתעדף את הפיתוח.",
    note: "גרסת iPhone עדיין אינה זמינה ואין תאריך השקה.",
    questions: ["באיזה מכשיר אתם משתמשים?", "האם אתם עובדים במשמרות?", "אם תהיה גרסת iPhone, תרצו לנסות אותה?"],
    choices: [["iPhone", "Android", "שניהם", "אחר"], ["כן", "לא כרגע"], ["כן, רוצה לנסות", "אולי, צריך עוד פרטים", "לא רלוונטי לי"]],
    optional: "מה הכי חשוב לכם שיהיה באפליקציה?", optionalHint: "לא חובה · עד 500 תווים · בלי פרטים אישיים",
    review: "בדיקת התשובות", summary: "בדקו את התשובות לפני השליחה", edit: "חזרה לעריכה",
    shareTitle: "מכירים עוד מישהו שעובד במשמרות?", shareBody: "מכירים עוד מישהו שעובד במשמרות עם iPhone? שתפו איתו את הסקר הקצר ועזרו לנו להבין את הביקוש.",
    share: "שיתוף במכשיר", whatsapp: "שיתוף ב-WhatsApp", link: "העתקת קישור", copied: "הקישור הועתק", manual: "אפשר להעתיק את הקישור מכאן:",
    shareText: "עובדים במשמרות עם iPhone? מלאו סקר קצר כדי לעזור לנו להבין את הביקוש לגרסת iPhone של Shift Smart. שלוש שאלות, פחות מדקה:",
    social: "לאינסטגרם: מדביקים את הקישור במדבקת קישור בסטורי. הכפתורים כאן אינם מפרסמים דבר אוטומטית.", privacy: "מדיניות פרטיות", count: "3 שאלות · פחות מדקה · ללא שם או טלפון",
  },
  en: {
    back: "Shift Smart website", kicker: "INTEREST CHECK · iPHONE", title: "Work shifts with an iPhone?",
    intro: "We’re checking interest in an iPhone version of Shift Smart. Three quick answers will help us prioritize development.",
    note: "The iPhone version is not available yet. There is no release date.",
    questions: ["Which device do you use?", "Do you work shifts?", "Would you try an iPhone version?"],
    choices: [["iPhone", "Android", "Both", "Other"], ["Yes", "Not currently"], ["Yes, I’d like to try it", "Maybe, I need more details", "Not relevant to me"]],
    optional: "What would matter most to you in the app?", optionalHint: "Optional · up to 500 characters · no personal details",
    review: "Review answers", summary: "Review your answers before submitting", edit: "Back to editing",
    shareTitle: "Know someone else who works shifts?", shareBody: "Know someone who works shifts with an iPhone? Share the short survey to help us understand demand.",
    share: "Share on your device", whatsapp: "Share on WhatsApp", link: "Copy link", copied: "Link copied", manual: "You can copy the link here:",
    shareText: "Work shifts with an iPhone? Fill out a short survey to help us understand demand for Shift Smart on iPhone. Three questions, under a minute:",
    social: "For Instagram: paste the URL into a story link sticker. These buttons do not publish automatically.", privacy: "Privacy policy", count: "3 questions · under a minute · no name or phone number",
  },
};

function createSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function IphoneSurvey() {
  // The public survey is Hebrew-only for this launch. Enable English when the
  // US audience is in scope, together with its matching signup form.
  const lang = "he" as const;
  const dir = "rtl" as const;
  const c = copy.he;
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [comment, setComment] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const submission = useRef<{ fingerprint: string; id: string } | null>(null);
  const lock = useRef(false);
  // Public links deliberately point to the stable domain, never localhost or Preview.
  const url = `${SITE_URL}/iphone`;
  const shareText = `${c.shareText}\n${url}?source=whatsapp`;
  async function copyLink() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setManual(false); }
    catch { setManual(true); }
  }
  async function share() {
    if (!navigator.share) { await copyLink(); return; }
    try { await navigator.share({ title: c.title, text: c.shareText, url }); }
    catch (error) { if (!(error instanceof Error && error.name === "AbortError")) await copyLink(); }
  }
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewing(true);
  }
  async function submit() {
    if (lock.current || sent) return;
    lock.current = true; setSending(true); setError(false);
    const suppliedSource = new URLSearchParams(window.location.search).get("source") ?? "direct";
    const source = ["website", "instagram", "whatsapp", "direct", "other"].includes(suppliedSource) ? suppliedSource : "other";
    const payload = {
      device: ["iphone", "android", "both", "other"][Number(answers[0])],
      shift_worker: ["yes", "not_currently"][Number(answers[1])],
      interest: ["yes", "maybe", "not_relevant"][Number(answers[2])],
      comment: comment.trim(), language: lang, source, email: emailOptIn ? email.trim() : "", email_opt_in: emailOptIn,
    };
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const fingerprint = JSON.stringify(payload);
      if (submission.current?.fingerprint !== fingerprint) submission.current = { fingerprint, id: createSubmissionId() };
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 16000);
      const response = await fetch("/api/iphone-survey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: submission.current!.id }), signal: controller.signal });
      if (!response.ok || (await response.json()).ok !== true) throw new Error("submission_failed");
      setSent(true);
    } catch { setError(true); }
    finally { if (timeoutId !== undefined) clearTimeout(timeoutId); lock.current = false; setSending(false); }
  }
  const button = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-hair px-4 py-3 text-sm text-chalk transition hover:border-neon-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon";

  return (
    <main dir={dir} className="relative z-10 mx-auto w-full max-w-3xl px-5 py-6 pb-32 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-hair pb-5">
        <Link href="/" className="flex items-center gap-3 text-sm text-mist hover:text-neon">
          <Image src="/icon-192.png" alt="" width={40} height={40} className="brand-app-icon rounded-xl" />{c.back}
        </Link>
      </header>
      <div className="pb-8 pt-10 sm:pt-14">
        <p className="flex items-center gap-2 font-mono text-xs text-neon"><Smartphone size={16} />{c.kicker}</p>
        <h1 className="mt-4 max-w-xl font-display text-3xl leading-tight text-chalk sm:text-5xl">{c.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-mist">{c.intro}</p>
        <p className="mt-4 text-sm text-neon">{c.count}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist">{c.note}</p>
      </div>
      {reviewing ? <section className="rounded-2xl border border-hair bg-abyss/80 p-6" aria-live="polite">
        <h2 className="font-display text-xl text-chalk">{c.summary}</h2>
        <dl className="mt-5 space-y-4">{c.questions.map((q,i) => <div key={i}><dt className="text-sm text-mist">{q}</dt><dd className="mt-1 text-chalk">{c.choices[i][Number(answers[i])]}</dd></div>)}</dl>
        {comment.trim() && <p className="mt-4 whitespace-pre-wrap break-words text-mist">{comment}</p>}
        {emailOptIn && <p className="mt-4 break-words text-sm text-mist">{email} — {lang === "he" ? "ביקשתם עדכון על גרסת iPhone" : "iPhone update requested"}</p>}
        {sent ? <>
          <p role="status" className="mt-6 text-neon">{lang === "he" ? "תודה! התשובה נשמרה. אין עדיין תאריך להשקת גרסת iPhone." : "Thank you! Your response was saved. There is no iPhone release date yet."}</p>
          {emailOptIn && <div className="mt-6 rounded-2xl border border-neon/20 bg-neon/5 p-5 sm:p-6">
            <h3 className="font-display text-lg text-chalk">{lang === "he" ? "בקשת עדכוני iPhone במייל" : "iPhone email updates"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">{lang === "he" ? "כתובת המייל וההסכמה שסימנתם נשמרו יחד עם תשובת הסקר ב-Supabase, לצורך עדכון עתידי על גרסת iPhone בלבד. כרגע לא נשלח מייל אוטומטי, והכתובת לא נרשמת לרשימת תפוצה חיצונית." : "Your email and consent were saved with your survey response in Supabase for a future iPhone update only. No automatic email is sent now, and your address is not added to an external mailing list."}</p>
          </div>}
        </> : <>
          <p className="mt-6 text-sm leading-relaxed text-mist">{lang === "he" ? "התשובות יישמרו לצורך בדיקת הביקוש. אם תשאירו מייל ותסכימו, הוא יישמר עם התשובה לעדכוני iPhone בלבד. כרגע לא נשלח מייל אוטומטי בעקבות ההרשמה. אפשר לבקש מחיקה דרך פרטי הקשר במדיניות הפרטיות." : "Answers are stored to assess demand. If you provide an email and opt in, it is stored with the response for iPhone updates only. No automatic email is sent after submission. You can request deletion using the contact details in the privacy policy."}</p>
          {error && <p role="alert" className="mt-4 text-amber">{lang === "he" ? "לא הצלחנו לאשר את השמירה. אפשר לנסות שוב; ניסיון חוזר עם אותן תשובות לא ייספר פעמיים." : "We couldn’t confirm your response was saved. Try again; retries with the same answers won’t count twice."}</p>}
          <div className="mt-5 flex flex-wrap gap-3"><button disabled={sending} className={`${button} disabled:opacity-50`} type="button" onClick={() => setReviewing(false)}>{c.edit}</button>
          <button disabled={sending} type="button" onClick={submit} className="min-h-12 rounded-xl bg-neon px-6 text-[#021309] disabled:opacity-50">{sending ? (lang === "he" ? "שולחים…" : "Sending…") : (lang === "he" ? "שליחת התשובה" : "Submit response")}</button></div>
        </>}
      </section> : <form onSubmit={review} className="space-y-5">
        {c.questions.map((question, i) => <fieldset key={i} className="rounded-2xl border border-hair bg-abyss/80 p-5 sm:p-6">
          <legend className="sr-only">{question}</legend>
          <p aria-hidden="true" className="mb-4 font-medium text-chalk"><span className="me-2 font-mono text-sm text-neon">0{i+1}</span>{question}</p>
          <div className="grid gap-2 sm:grid-cols-2">{c.choices[i].map((choice,j) => <label key={j} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${answers[i] === String(j) ? "border-neon/50 bg-neon/5 text-chalk" : "border-hair text-mist"}`}>
            <input required type="radio" name={`question-${i}`} value={j} checked={answers[i] === String(j)} onChange={e => { setAnswers(a => a.map((v,k) => k === i ? e.target.value : v)); }} className="size-4 shrink-0 accent-[#5cff9d]" />{choice}
          </label>)}</div>
        </fieldset>)}
        <label className="block rounded-2xl border border-hair bg-abyss/80 p-5 sm:p-6"><span className="text-chalk">{c.optional}</span><span id="comment-hint" className="mt-2 block text-xs text-mist">{c.optionalHint}</span>
          <textarea aria-describedby="comment-hint" maxLength={500} rows={3} value={comment} onChange={e => setComment(e.target.value)} className="mt-4 w-full rounded-xl border border-hair bg-abyss/60 p-3 text-base text-chalk focus:border-neon focus:outline-none" />
        </label>
        <div className="rounded-2xl border border-hair bg-abyss/80 p-5 sm:p-6">
          <label className="flex min-h-12 cursor-pointer items-start gap-3 text-sm leading-relaxed text-chalk"><input type="checkbox" checked={emailOptIn} onChange={e => { setEmailOptIn(e.target.checked); if (!e.target.checked) setEmail(""); }} className="mt-1 size-4 shrink-0 accent-[#5cff9d]" />{lang === "he" ? "רוצה לקבל בעתיד עדכון במייל על גרסת iPhone (לא חובה). כתובת המייל תישמר למטרה זו בלבד; כרגע לא נשלח מייל אוטומטי." : "I’d like an email update about the iPhone version in the future (optional). My email will be stored only for this purpose; no automatic email is sent now."}</label>
          {emailOptIn && <label className="mt-4 block text-sm text-mist">{lang === "he" ? "כתובת מייל" : "Email address"}<input type="email" required maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} dir="ltr" className="mt-2 min-h-12 w-full rounded-xl border border-hair bg-abyss/60 px-3 text-base text-chalk focus:border-neon focus:outline-none" /></label>}
        </div>
        <button type="submit" className="min-h-14 w-full rounded-xl bg-neon px-6 font-display text-[#021309] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon">{c.review}</button>
      </form>}
      <section className="mt-10 border-t border-hair pt-8">
        <h2 className="font-display text-xl text-chalk">{c.shareTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">{c.shareBody}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={share} className={button}><ArrowUpRight size={17} />{c.share}</button>
          <a className={button} href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">{c.whatsapp}</a>
          <button type="button" onClick={copyLink} className={button}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? c.copied : c.link}</button>
        </div>
        <span role="status" className="sr-only">{copied ? c.copied : ""}</span>
        {manual && <label className="mt-4 block text-sm text-mist">{c.manual}<input readOnly value={url} onFocus={e=>e.currentTarget.select()} className="mt-2 w-full rounded-lg border border-hair p-3" /></label>}
        <p className="mt-4 text-xs leading-relaxed text-mist">{c.social}</p>
      </section>
      <footer className="mt-10 text-sm text-mist"><Link href="/privacy" className="underline underline-offset-4 hover:text-neon">{c.privacy}</Link></footer>
    </main>
  );
}
