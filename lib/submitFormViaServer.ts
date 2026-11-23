import type { FormPayload } from "@/lib/server/formSubmission";

export async function submitFormViaServer(payload: FormPayload, signal: AbortSignal) {
  const response = await fetch("/api/forms", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), signal,
  });
  return { error: response.ok ? null : { message: "Form submission failed" }, rateLimited: response.status === 429 };
}
