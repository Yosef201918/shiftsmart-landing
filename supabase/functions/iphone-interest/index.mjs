const MAX_BODY_BYTES = 8192;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEVICES = new Set(["iphone", "android", "both", "other"]);
const SHIFT_WORKERS = new Set(["yes", "not_currently"]);
const INTEREST = new Set(["yes", "maybe", "not_relevant"]);
const LANGUAGES = new Set(["he", "en"]);
const SOURCES = new Set(["website", "instagram", "whatsapp", "direct", "other"]);
const ALLOWED_FIELDS = new Set([
  "id", "device", "shift_worker", "interest", "comment",
  "language", "source", "email", "email_opt_in",
]);

function reply(status, body) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readBody(request) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new Error("unsupported_media");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("body_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

function validSubmission(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value;
  if (Object.keys(row).some((key) => !ALLOWED_FIELDS.has(key))) return false;
  if (typeof row.id !== "string" || !UUID_PATTERN.test(row.id)) return false;
  if (typeof row.device !== "string" || !DEVICES.has(row.device)) return false;
  if (typeof row.shift_worker !== "string" || !SHIFT_WORKERS.has(row.shift_worker)) return false;
  if (typeof row.interest !== "string" || !INTEREST.has(row.interest)) return false;
  if (typeof row.comment !== "string" || row.comment.length > 500) return false;
  if (typeof row.language !== "string" || !LANGUAGES.has(row.language)) return false;
  if (typeof row.source !== "string" || !SOURCES.has(row.source)) return false;
  if (typeof row.email_opt_in !== "boolean" || typeof row.email !== "string") return false;
  if (row.email_opt_in) {
    return row.email.length <= 254 && EMAIL_PATTERN.test(row.email.trim());
  }
  return row.email === "";
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return reply(405, { error: "method_not_allowed" });

  let submission;
  try {
    submission = await readBody(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "unsupported_media") return reply(415, { error: "json_required" });
    if (message === "body_too_large") return reply(413, { error: "body_too_large" });
    return reply(400, { error: "invalid_input" });
  }
  if (!validSubmission(submission)) return reply(400, { error: "invalid_input" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return reply(503, { error: "temporarily_unavailable" });
  }

  const emailOptIn = submission.email_opt_in === true;
  const record = {
    id: submission.id,
    survey_version: "iphone-v1",
    device: submission.device,
    shift_worker: submission.shift_worker,
    interest: submission.interest,
    comment: submission.comment,
    language: submission.language,
    source: submission.source,
    email: emailOptIn ? submission.email.trim().toLowerCase() : null,
    email_opt_in_at: emailOptIn ? new Date().toISOString() : null,
    consent_version: emailOptIn ? "iphone-email-v1" : null,
  };

  try {
    const endpoint = new URL("rest/v1/iphone_interest_responses?on_conflict=id", supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`);
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(10_000),
    });
    if (!result.ok) return reply(503, { error: "temporarily_unavailable" });
    return reply(200, { ok: true });
  } catch {
    return reply(503, { error: "temporarily_unavailable" });
  }
});
