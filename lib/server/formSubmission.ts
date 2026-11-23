import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { FORM_LIMITS, isValidFormText } from "@/lib/formGuards";

export type FormPayload = { kind: "review" | "feature"; name: string; content: string; rating?: number; website?: string };
export type FormServerConfig = { enabled: boolean; secret?: string; databaseUrl?: string; databaseKey?: string; origins: string[]; vercel: boolean; development: boolean };
export type SubmitResult = { accepted: boolean; retry_after_seconds: number };
type Submit = (payload: FormPayload, key: string, signal: AbortSignal) => Promise<SubmitResult>;
const MAX_BODY = 8192;

function reply(status: number, error?: string, retry?: number) {
  return Response.json(error ? { error } : { ok: true }, {
    status, headers: { "Cache-Control": "no-store", ...(retry ? { "Retry-After": String(retry) } : {}) },
  });
}

function validPayload(input: unknown): input is FormPayload {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const p = input as Record<string, unknown>;
  if (Object.keys(p).some(key => !["kind", "name", "content", "rating", "website"].includes(key))) return false;
  if (p.kind !== "review" && p.kind !== "feature") return false;
  if (typeof p.name !== "string" || typeof p.content !== "string") return false;
  if (!isValidFormText(p.name, FORM_LIMITS.name) || !isValidFormText(p.content, p.kind === "review" ? FORM_LIMITS.review : FORM_LIMITS.feature)) return false;
  if (p.website !== undefined && (typeof p.website !== "string" || p.website.length > 200)) return false;
  return p.kind === "review" ? typeof p.rating === "number" && Number.isInteger(p.rating) && p.rating >= 1 && p.rating <= 5 : p.rating === undefined;
}

export function createFormHandler(config: FormServerConfig, submit: Submit) {
  return async (request: Request): Promise<Response> => {
    if (!config.enabled) return reply(404, "not_enabled");
    const url = new URL(request.url);
    const local = config.development && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const origins = config.origins.length ? config.origins : local ? [url.origin] : [];
    if (!origins.includes(request.headers.get("origin") ?? "")) return reply(403, "origin_not_allowed");
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reply(415, "json_required");
    if (Number(request.headers.get("content-length")) > MAX_BODY) return reply(413, "body_too_large");
    let input: unknown;
    try {
      const reader = request.body?.getReader();
      if (!reader) return reply(400, "invalid_input");
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > MAX_BODY) { await reader.cancel(); return reply(413, "body_too_large"); }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
      const body = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
      input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
    } catch { return reply(400, "invalid_input"); }
    if (!validPayload(input)) return reply(400, "invalid_input");
    if (input.website) return reply(200);
    // Never trust client-supplied X-Forwarded-For outside Vercel.
    const ip = config.vercel ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : local ? "127.0.0.1" : undefined;
    if (!ip || !isIP(ip) || !config.secret || config.secret.length < 32 || !config.databaseUrl || !config.databaseKey) return reply(503, "temporarily_unavailable");
    const key = createHmac("sha256", config.secret).update(`${input.kind}\0${ip}`).digest("hex");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const result = await submit({ ...input, name: input.name.trim(), content: input.content.trim(), website: undefined }, key, controller.signal);
      if (typeof result?.accepted !== "boolean" || !Number.isInteger(result.retry_after_seconds) || result.retry_after_seconds < 0) return reply(503, "temporarily_unavailable");
      if (!result.accepted) return reply(429, "rate_limited", Math.min(600, Math.max(1, result.retry_after_seconds)));
      return reply(200);
    } catch { return reply(503, "temporarily_unavailable"); }
    finally { clearTimeout(timer); }
  };
}
