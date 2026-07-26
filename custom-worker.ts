// @ts-expect-error `.open-next/worker.js` only exists after `opennextjs-cloudflare build`
import { default as handler } from "./.open-next/worker.js";

/**
 * Wraps the OpenNext-generated Next.js worker with a `scheduled` handler so
 * Cloudflare's native Cron Trigger (configured in wrangler.jsonc) can close
 * out expired 48h funding windows, the same job Vercel Cron runs via
 * vercel.json when deployed there instead. See lib/campaign-rules.ts and
 * app/api/campaigns/close-expired/route.ts for the actual rules/logic —
 * this file only invokes that route in-process on a schedule.
 */
const worker = {
  fetch: handler.fetch,

  async scheduled(_event: ScheduledEvent, env: Record<string, string>, ctx: ExecutionContext) {
    const request = new Request("https://vpn-app.internal/api/campaigns/close-expired", {
      method: "POST",
      headers: env.CRON_SECRET ? { Authorization: `Bearer ${env.CRON_SECRET}` } : {},
    });
    ctx.waitUntil(handler.fetch(request, env, ctx));
  },
};

export default worker;

// Only re-export these if your open-next.config.ts turns on the Durable
// Object queue / tag cache — the default config used here doesn't, so
// .open-next/worker.js won't generate them and re-exporting would break the
// build. See https://opennext.js.org/cloudflare/howtos/custom-worker
// export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";
