import { createClient } from "@supabase/supabase-js";
import { createFormHandler, type SubmitResult } from "@/lib/server/formSubmission";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = {
    enabled: process.env.NEXT_PUBLIC_FORM_SUBMISSION_MODE === "server",
    secret: process.env.FORMS_RATE_LIMIT_SECRET,
    databaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    databaseKey: process.env.SUPABASE_SECRET_KEY,
    origins: (process.env.FORMS_ALLOWED_ORIGINS ?? "").split(",").map(value => value.trim()).filter(Boolean),
    vercel: process.env.VERCEL === "1",
    development: process.env.NODE_ENV === "development",
  };
  return createFormHandler(config, async (payload, key, signal) => {
    const client = createClient(config.databaseUrl!, config.databaseKey!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await client.rpc("submit_landing_form", {
      p_kind: payload.kind, p_key: key, p_name: payload.name,
      p_content: payload.content, p_rating: payload.rating ?? null,
    }).abortSignal(signal);
    if (error) throw new Error("Form database request failed");
    return data as SubmitResult;
  })(request);
}
