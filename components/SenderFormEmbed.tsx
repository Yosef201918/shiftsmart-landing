"use client";

import { useEffect, useRef, useState } from "react";

const ACCOUNT_ID = "22dff9d6a44209";
const SCRIPT_ID = "shiftsmart-sender-forms";
type SenderStub = ((...args: unknown[]) => void) & { q?: unknown[][]; l?: number; listeners?: Record<string, Array<() => void>>; on?: (event: string, callback: () => void) => void };

declare global {
  interface Window {
    sender?: (accountId: string) => void;
    __shiftSmartSenderInitialized?: boolean;
    senderFormsLoaded?: boolean;
    senderForms?: { render: (forms: string | string[], config?: { onRender?: (formId: string) => void }) => void; destroy: (forms: string) => void };
    Sender?: string;
  }
}

export default function SenderFormEmbed({ formId, unavailableText, lang = "he" }: { formId: string; unavailableText: string; lang?: "he" | "en" }) {
  const mount = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    let rendered = false;

    const initializeAccount = () => {
      if (!window.sender) {
        window.Sender = "sender";
        const sender = ((...args: unknown[]) => {
          const queue = sender as SenderStub;
          (queue.q = queue.q || []).push(args);
        }) as SenderStub;
        sender.l = Date.now();
        sender.on = (event, callback) => {
          sender.listeners ??= {};
          (sender.listeners[event] ??= []).push(callback);
        };
        window.sender = sender as unknown as (accountId: string) => void;
      }
      if (!window.__shiftSmartSenderInitialized) {
        window.sender(ACCOUNT_ID);
        window.__shiftSmartSenderInitialized = true;
      }
    };

    const renderForm = () => {
      if (!active || rendered || !window.senderFormsLoaded || !window.senderForms) return;
      rendered = true;
      try {
        window.senderForms.render(formId, { onRender: () => { if (active) setLoaded(true); } });
      } catch {
        setUnavailable(true);
      }
    };
    const failed = () => setUnavailable(true);
    const waitForForms = () => {
      window.addEventListener("onSenderFormsLoaded", renderForm, { once: true });
      if (window.senderFormsLoaded) renderForm();
    };

    // Queue the account before loading the async SDK so it can initialize the
    // account and its form before the SDK tries to render anything.
    initializeAccount();
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://cdn.sender.net/accounts_resources/universal.js?explicit=true";
      script.async = true;
      script.addEventListener("error", failed, { once: true });
      waitForForms();
      document.head.appendChild(script);
    } else waitForForms();

    const observer = new MutationObserver(() => {
      if (mount.current?.childElementCount) setLoaded(true);
    });
    if (mount.current) observer.observe(mount.current, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => setUnavailable(current => current || !mount.current?.childElementCount), 12000);
    return () => {
      active = false;
      script?.removeEventListener("error", failed);
      window.removeEventListener("onSenderFormsLoaded", renderForm);
      observer.disconnect();
      window.clearTimeout(timeout);
      window.senderForms?.destroy(formId);
    };
  }, [formId, attempt]);

  return <div>
    <div ref={mount} className="sender-form-field" data-sender-form-id={formId} />
    {!loaded && <div role="status" className="mt-4 rounded-xl border border-hair bg-abyss/60 p-4 text-sm leading-relaxed text-mist">
      <p>{unavailable ? unavailableText : lang === "he" ? "טוענים את טופס ההרשמה…" : "Loading the signup form…"}</p>
      {unavailable && <button type="button" onClick={() => { setUnavailable(false); setAttempt(value => value + 1); }} className="mt-3 min-h-10 rounded-lg border border-neon/40 px-3 text-neon hover:bg-neon/10">{lang === "he" ? "ניסיון טעינה מחדש" : "Try again"}</button>}
    </div>}
  </div>;
}
