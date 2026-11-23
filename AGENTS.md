<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Production safety: iPhone survey and results dashboard

- Keep `/iphone`, `/admin/iphone`, `/api/iphone-survey`, and the `iphone-interest` Supabase Edge Function active in production. Do not disable, delete, redirect, or replace any of them with a deliberate 404 unless the user explicitly requests that change.
- A task limited to the survey or dashboard must preserve the current production website and homepage. Do not deploy a work in progress website as a replacement for production in that task.
- Before changing a production deployment or its aliases, inspect the current production target and confirm the proposed release preserves its files except for the changes the user requested. Verify the survey route, dashboard route, and homepage after deployment.
- Keep the dashboard out of search indexes and retain owner-only data access. Do not expose survey responses through a public homepage link or public endpoint.
