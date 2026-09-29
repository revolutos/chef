import { resolveMx } from 'node:dns/promises';
import { getEnv } from './env';
import type { CrmLeadEvent } from '~/components/zypern/crm';

/**
 * Serverseitige Lead-Verarbeitung der Landingpage „Zypern Immobilien kaufen“.
 *
 * Konfiguration über Umgebungsvariablen:
 * - ZYPERN_CRM_WEBHOOK_URL     Pflicht im Livebetrieb: nimmt jedes Lead-Ereignis als JSON entgegen
 *                              (CRM direkt, oder n8n/Make/Zapier → HubSpot, Pipedrive, Close …).
 * - ZYPERN_CRM_WEBHOOK_SECRET  Optional: wird als Header `X-Webhook-Secret` mitgesendet.
 * - ZYPERN_ALERT_WEBHOOK_URL   Optional: Slack-Incoming-Webhook für A-Leads und Besichtigungswünsche.
 * - ZYPERN_TURNSTILE_SECRET    Optional: Cloudflare-Turnstile-Prüfung (mit ZYPERN_TURNSTILE_SITE_KEY).
 */

export async function emailDomainAcceptsMail(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  if (!domain) {
    return false;
  }
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    // Zeitüberschreitung: im Zweifel annehmen, um echte Anfragen nicht zu verlieren.
    return records === null || records.length > 0;
  } catch (error) {
    const code = (error as { code?: string }).code;
    return !(code === 'ENOTFOUND' || code === 'ENODATA');
  }
}

export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = getEnv('ZYPERN_TURNSTILE_SECRET');
  if (!secret) {
    return true;
  }
  if (!token) {
    return false;
  }
  const body = new URLSearchParams({ secret, response: token });
  if (ip) {
    body.set('remoteip', ip);
  }
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

/* Einfaches Rate-Limit pro Instanz. Für mehrere Instanzen z. B. durch Upstash/Redis ersetzen. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    hits.clear();
  }
  return recent.length > limit;
}

export async function forwardToCrm(event: CrmLeadEvent): Promise<boolean> {
  const url = getEnv('ZYPERN_CRM_WEBHOOK_URL');
  if (!url) {
    console.warn('[zypern-lead] ZYPERN_CRM_WEBHOOK_URL fehlt – Lead wird nur protokolliert.', {
      lead_id: event.lead_id,
      event: event.event,
      tier: event.scoring.tier,
    });
    return false;
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = getEnv('ZYPERN_CRM_WEBHOOK_SECRET');
  if (secret) {
    headers['X-Webhook-Secret'] = secret;
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(event) });
      if (response.ok) {
        return true;
      }
      console.error('[zypern-lead] CRM-Webhook antwortet mit', response.status);
    } catch (error) {
      console.error('[zypern-lead] CRM-Webhook nicht erreichbar', error);
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }
  return false;
}

/** Sofortbenachrichtigung an den Vertrieb (Slack-kompatibel). */
export async function notifySales(event: CrmLeadEvent) {
  const url = getEnv('ZYPERN_ALERT_WEBHOOK_URL');
  if (!url) {
    return;
  }
  const { contact, profile, scoring } = event;
  const title =
    event.event === 'lead.viewing_requested' || scoring.priority === 'highest'
      ? 'Besichtigung auf Zypern gewünscht – höchste Priorität'
      : `Neuer ${scoring.tier}-Lead Zypern`;
  const text = [
    `*${title}*`,
    `${contact.firstName} ${contact.lastName} · ${contact.phone || 'keine Nummer'} · ${contact.email}`,
    `Kontakt per: ${contact.contactPreference}`,
    `Ziel: ${profile.purpose} · Region: ${profile.region} · Objekt: ${profile.propertyType}`,
    `Budget: ${profile.budget} · Zeitraum: ${profile.timeline} · Finanzierung: ${profile.financing ?? '–'}`,
    `Score ${scoring.score} · ${scoring.reasons.join(', ') || '–'}`,
    scoring.flags.length ? `Hinweise: ${scoring.flags.join(', ')}` : '',
    `Lead-ID: ${event.lead_id}`,
  ]
    .filter(Boolean)
    .join('\n');
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (error) {
    console.error('[zypern-lead] Alert-Webhook fehlgeschlagen', error);
  }
}
