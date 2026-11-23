export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_192;
const ALLOWED_ORIGINS = new Set([
  "https://www.shift-smartapp.com",
  "https://shift-smartapp.com",
]);

function reply(status: number, error?: string) {
  return Response.json(error ? { error } : { ok: true }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function readBoundedBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(body);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const localOrigin =
    process.env.NODE_ENV === "development" &&
    (origin === "http://localhost:3000" || origin === "http://localhost:3002");
  if (!origin || (!ALLOWED_ORIGINS.has(origin) && !localOrigin)) {
    return reply(403, "origin_not_allowed");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, "json_required");
  }

  const rawBody = await readBoundedBody(request);
  if (!rawBody) return reply(413, "invalid_or_oversized_body");
  try {
    JSON.parse(rawBody);
  } catch {
    return reply(400, "invalid_input");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return reply(503, "temporarily_unavailable");

  try {
    const endpoint = new URL("functions/v1/iphone-interest", supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: rawBody,
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (response.ok) return reply(200);
    if ([400, 413, 415].includes(response.status)) return reply(response.status, "invalid_input");
    if (response.status === 429) return reply(429, "rate_limited");
    return reply(503, "temporarily_unavailable");
  } catch {
    return reply(503, "temporarily_unavailable");
  }
}
