import { createClient } from "@supabase/supabase-js";
import type { NewsletterMember, NewsletterStatus } from "@/lib/newsletterAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER_EMAIL = "yoseffstor@gmail.com";
const NEWSLETTER_GROUP = "egG763";
const headers = { "Cache-Control": "private, no-store", "Vary": "Authorization", "X-Robots-Tag": "noindex, nofollow" };
const reply = (status: number, error: string) => Response.json({ error }, { status, headers });

function normalizeStatus(value: unknown): NewsletterStatus {
  if (typeof value !== "string") return "unknown";
  switch (value.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_")) {
    case "active": return "active";
    case "non_subscribed": case "nonsubscribed": return "pending";
    case "unsubscribed": return "unsubscribed";
    case "bounced": return "bounced";
    case "spam_reported": case "spam": return "spam";
    default: return "unknown";
  }
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ") || authorization.length > 8192) return reply(401, "unauthorized");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return reply(503, "auth_unavailable");
  try {
    const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error } = await auth.auth.getUser(authorization.slice(7));
    if (error || !user) return reply(401, "unauthorized");
    if (user.email?.toLowerCase() !== OWNER_EMAIL || !user.email_confirmed_at) return reply(403, "forbidden");
  } catch { return reply(503, "auth_unavailable"); }

  const pageText = new URL(request.url).searchParams.get("page") ?? "1";
  if (!/^[1-9]\d{0,5}$/.test(pageText)) return reply(400, "invalid_page");
  const page = Number(pageText);
  const token = process.env.SENDER_API_TOKEN;
  if (!token) return reply(503, "sender_not_connected");
  try {
    const endpoint = new URL(`https://api.sender.net/v2/groups/${NEWSLETTER_GROUP}/subscribers`);
    endpoint.searchParams.set("page", String(page));
    endpoint.searchParams.set("limit", "50");
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return reply(502, "sender_unavailable");
    const body = await response.json();
    if (!Array.isArray(body.data) || !Number.isSafeInteger(body.meta?.total) || !Number.isSafeInteger(body.meta?.last_page)) return reply(502, "invalid_provider_response");
    const members: NewsletterMember[] = body.data.map((row: { id?: unknown; email?: unknown; created?: unknown; status?: { email?: unknown } }) => {
      if (typeof row.id !== "string" || typeof row.email !== "string") throw new Error("Invalid member");
      return { id: row.id, email: row.email, created: typeof row.created === "string" ? row.created : null, status: normalizeStatus(row.status?.email) };
    });
    return Response.json({ members, page, total: body.meta.total, lastPage: Math.max(1, body.meta.last_page) }, { headers });
  } catch { return reply(502, "sender_unavailable"); }
}
