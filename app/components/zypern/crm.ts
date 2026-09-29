import type { AbTestId } from './config';
import type { AssistantAnswers, BuyingProfile, ContactData, ScoreResult } from './scoring';
import type { Attribution } from './tracking';

/**
 * Datensatz, der an das CRM (Webhook) übergeben wird. Jede Übergabe ist ein Ereignis;
 * das CRM führt die Ereignisse über `lead_id` zu einem Lead zusammen und protokolliert
 * jeden Statuswechsel (siehe docs/zypern-immobilien-kaufen/crm-und-lead-scoring.md).
 */
export type CrmLeadEvent = {
  schema_version: 1;
  event: 'lead.created' | 'lead.qualified' | 'lead.viewing_requested';
  lead_id: string;
  occurred_at: string;
  source: 'landingpage_zypern_immobilien_kaufen';
  pipeline: 'zypern_immobilienkauf';
  contact: ContactData;
  profile: BuyingProfile;
  assistant_answers: AssistantAnswers;
  assistant_note?: string;
  scoring: Omit<ScoreResult, 'nextStep'> & { next_step: ScoreResult['nextStep']; scoring_version: string };
  /** Initialer Sales-Status. Weitere Statuswechsel erfolgen ausschließlich im CRM. */
  sales_status: 'new' | 'ai_qualified';
  routing: 'setter_immediate' | 'setter_follow_up' | 'nurture';
  attribution: Attribution;
  experiment: { test: AbTestId | null; variant: 'A' | 'B' };
  consent: { privacy_accepted_at: string; tracking: 'all' | 'necessary' | 'unknown' };
  meta: { user_agent: string; page_path: string };
};

/** Vertriebsstufen im CRM. Reihenfolge = Pipeline. */
export const salesStages = [
  { id: 'new', label: 'Neu', owner: 'System' },
  { id: 'ai_qualified', label: 'Nachqualifiziert', owner: 'System' },
  { id: 'setter_contacted', label: 'Setter: Kontakt aufgenommen', owner: 'Setter' },
  { id: 'sales_accepted', label: 'Sales Accepted Lead', owner: 'Setter' },
  { id: 'appointment_set', label: 'Termin vereinbart', owner: 'Setter' },
  { id: 'closer_call_done', label: 'Beratungsgespräch geführt', owner: 'Closer' },
  { id: 'viewing_scheduled', label: 'Besichtigung geplant', owner: 'Closer' },
  { id: 'viewing_done', label: 'Besichtigung durchgeführt', owner: 'Closer' },
  { id: 'offer', label: 'Angebot / Reservierung', owner: 'Closer' },
  { id: 'purchased', label: 'Kauf abgeschlossen', owner: 'Closer' },
  { id: 'nurture', label: 'Nurturing', owner: 'Marketing' },
  { id: 'lost', label: 'Verloren (mit Grund)', owner: 'Setter/Closer' },
] as const;
