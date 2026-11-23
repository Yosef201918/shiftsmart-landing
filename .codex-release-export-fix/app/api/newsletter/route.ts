const notFound = () => Response.json({ error: "not_found" }, { status: 404, headers: { "Cache-Control": "no-store" } });

export async function GET() { return notFound(); }

export async function POST() { return notFound(); }
