// Carrega variáveis do .env (Node >= 20.12 / 22).
try {
  (process as unknown as { loadEnvFile?: (p?: string) => void }).loadEnvFile?.();
} catch {}

const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
const secret = process.env.CRON_SECRET ?? "";

const res = await fetch(`${base}/api/cron/reminders`, {
  method: "POST",
  headers: { Authorization: `Bearer ${secret}` },
});
const text = await res.text();
console.log(`[cron] ${res.status} ${text}`);

export {};
