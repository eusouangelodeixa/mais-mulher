import { runReminders } from "@/lib/reminders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handle(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Não autorizado", { status: 401 });
  }
  const result = await runReminders(new Date());
  return Response.json(result);
}

export const GET = handle;
export const POST = handle;
