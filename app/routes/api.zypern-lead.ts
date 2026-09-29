import { json, type ActionFunctionArgs } from '@vercel/remix';
import { isVariantB, readExperimentCookie } from '~/components/zypern/ab';
import { PAGE_PATH } from '~/components/zypern/config';
import type { CrmLeadEvent } from '~/components/zypern/crm';
import { scoreLead, type AssistantAnswers, type ContactData, type ScoreResult } from '~/components/zypern/scoring';
import type { Attribution } from '~/components/zypern/tracking';
import { parseProfile, validateContact } from '~/components/zypern/validation';
import {
  emailDomainAcceptsMail,
  forwardToCrm,
  notifySales,
  rateLimited,
  verifyTurnstile,
} from '~/lib/.server/zypern-leads';

const SCORING_VERSION = '2026-09-v1';
const MIN_FILL_TIME_MS = 4000;

type Body = {
  intent: 'create' | 'qualify' | 'viewing';
  leadId?: string;
  profile: unknown;
  contact: ContactData;
  answers?: AssistantAnswers;
  note?: string;
  privacy: boolean;
  attribution?: Attribution;
  consent?: 'all' | 'necessary' | null;
  elapsedMs?: number;
  website?: string; // Honeypot
  turnstileToken?: string;
};

export type LeadResponse =
  | {
      ok: true;
      leadId: string;
      nextStep: ScoreResult['nextStep'];
      /** Conversion-Signale für das Tracking. Die Einstufung selbst wird nicht angezeigt. */
      signals: { qualified: boolean; highQuality: boolean; priority: boolean };
    }
  | { ok: false; errors?: Record<string, string>; message: string };

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function cleanAnswers(answers: unknown): AssistantAnswers {
  if (!answers || typeof answers !== 'object') {
    return {};
  }
  const result: AssistantAnswers = {};
  for (const [key, value] of Object.entries(answers).slice(0, 20)) {
    if (/^[a-z_]{2,30}$/.test(key)) {
      result[key] = clean(value, 60);
    }
  }
  return result;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Methode nicht erlaubt.' }, 405);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (rateLimited(ip ?? 'unknown')) {
    return json<LeadResponse>({ ok: false, message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }, 429);
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json<LeadResponse>({ ok: false, message: 'Ungültige Anfrage.' }, 400);
  }

  const profile = parseProfile(body.profile);
  if (!profile) {
    return json<LeadResponse>({ ok: false, message: 'Das Kaufprofil ist unvollständig.' }, 400);
  }

  const experiment = readExperimentCookie(request.headers.get('cookie')) ?? { test: null, variant: 'A' as const };
  const phoneRequired = !isVariantB(experiment, 'phone_required');

  const contact: ContactData = {
    firstName: clean(body.contact?.firstName, 60),
    lastName: clean(body.contact?.lastName, 60),
    email: clean(body.contact?.email, 254).toLowerCase(),
    phone: clean(body.contact?.phone, 20),
    contactPreference: body.contact?.contactPreference,
  };
  const errors = validateContact(contact, { phoneRequired, privacy: body.privacy === true });
  if (!errors.email && !(await emailDomainAcceptsMail(contact.email))) {
    errors.email = 'Diese E-Mail-Domain nimmt keine E-Mails an. Bitte prüfen Sie die Adresse.';
  }
  if (Object.keys(errors).length > 0) {
    return json<LeadResponse>({ ok: false, errors, message: 'Bitte prüfen Sie Ihre Angaben.' }, 422);
  }

  const isCreate = body.intent === 'create';
  const leadId = isCreate ? crypto.randomUUID() : clean(body.leadId, 64);
  if (!/^[0-9a-f-]{36}$/.test(leadId)) {
    return json<LeadResponse>({ ok: false, message: 'Ungültige Anfrage.' }, 400);
  }

  const answers = cleanAnswers(body.answers);
  if (body.intent === 'viewing') {
    answers.next_step = 'viewing_now';
  }
  const result = scoreLead(profile, contact, answers);
  const response: LeadResponse = {
    ok: true,
    leadId,
    nextStep: result.nextStep,
    signals: {
      qualified: result.tier !== 'C',
      highQuality: result.tier === 'A',
      priority: result.priority === 'highest',
    },
  };

  // Spam: Honeypot oder unrealistisch schnelles Ausfüllen → stillschweigend verwerfen.
  const suspicious = Boolean(body.website) || (isCreate && (body.elapsedMs ?? 0) < MIN_FILL_TIME_MS);
  if (isCreate && !(await verifyTurnstile(body.turnstileToken, ip))) {
    return json<LeadResponse>(
      { ok: false, message: 'Die Sicherheitsprüfung ist fehlgeschlagen. Bitte erneut versuchen.' },
      400,
    );
  }
  if (suspicious) {
    console.warn('[zypern-lead] Verdacht auf Spam verworfen', { leadId });
    return json(response);
  }

  const { nextStep, ...scoring } = result;
  const event: CrmLeadEvent = {
    schema_version: 1,
    event: body.intent === 'viewing' ? 'lead.viewing_requested' : isCreate ? 'lead.created' : 'lead.qualified',
    lead_id: leadId,
    occurred_at: new Date().toISOString(),
    source: 'landingpage_zypern_immobilien_kaufen',
    pipeline: 'zypern_immobilienkauf',
    contact,
    profile,
    assistant_answers: answers,
    assistant_note: clean(body.note, 1000) || undefined,
    scoring: { ...scoring, next_step: nextStep, scoring_version: SCORING_VERSION },
    sales_status: isCreate ? 'new' : 'ai_qualified',
    routing:
      result.tier === 'A' || result.priority === 'highest'
        ? 'setter_immediate'
        : result.tier === 'B'
          ? 'setter_follow_up'
          : 'nurture',
    attribution: body.attribution ?? {},
    experiment,
    consent: { privacy_accepted_at: new Date().toISOString(), tracking: body.consent ?? 'unknown' },
    meta: { user_agent: clean(request.headers.get('user-agent'), 300), page_path: PAGE_PATH },
  };

  const stored = await forwardToCrm(event);

  // Sofort-Benachrichtigung: A-Leads beim Absenden, später nur bei neuer Hochstufung oder Besichtigungswunsch.
  const wasAlreadyA = !isCreate && scoreLead(profile, contact).tier === 'A';
  const alert =
    result.priority === 'highest' || (result.tier === 'A' && (isCreate || !wasAlreadyA)) || (isCreate && !stored);
  // Ist kein CRM erreichbar, geht jeder neue Lead zusätzlich an den Alert-Kanal, damit nichts verloren geht.
  if (alert) {
    await notifySales(event);
  }

  return json(response);
}
