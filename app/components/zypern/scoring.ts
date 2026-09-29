import {
  budgetOptions,
  contactPreferenceOptions,
  financingOptions,
  propertyTypeOptions,
  purposeOptions,
  regionOptions,
  scoring,
  timelineOptions,
  visitedOptions,
  type Budget,
  type ContactPreference,
  type Financing,
  type Option,
  type PropertyType,
  type Purpose,
  type Region,
  type Timeline,
  type Visited,
} from './config';

/** Antworten aus dem Multi-Step-Kaufprofil. Felder fehlen, wenn eine Funnel-Variante sie nicht abfragt. */
export type BuyingProfile = {
  purpose: Purpose;
  region: Region;
  propertyType: PropertyType;
  budget: Budget;
  timeline: Timeline;
  financing?: Financing;
  visited?: Visited;
};

export type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  /** Normalisiert im Format +491701234567. Leer, wenn die Nummer (Testvariante) optional war. */
  phone: string;
  contactPreference: ContactPreference;
};

/** Antworten aus dem Assistenten (Nachqualifizierung). Schlüssel = Frage-ID. */
export type AssistantAnswers = Record<string, string>;

export type LeadTier = 'A' | 'B' | 'C';

/** Nächster Schritt, den der Besucher sieht. Die Einstufung selbst wird nie angezeigt. */
export type NextStep = 'booking' | 'booking_optional' | 'confirmation';

export type ScoreResult = {
  tier: LeadTier;
  /** Normierter Basis-Score (0–100) plus Assistent-Boni. */
  score: number;
  reasons: string[];
  flags: string[];
  priority: 'highest' | 'high' | 'normal' | 'low';
  nextStep: NextStep;
};

function pointsFor<T extends string>(options: readonly Option<T>[], value: T | undefined) {
  if (value === undefined) {
    return null;
  }
  const option = options.find((o) => o.value === value);
  const max = Math.max(...options.map((o) => o.points));
  return { points: option?.points ?? 0, max };
}

const conversationalContact: ContactPreference[] = ['phone', 'whatsapp', 'video'];

export function scoreLead(profile: BuyingProfile, contact: ContactData, answers: AssistantAnswers = {}): ScoreResult {
  const reasons: string[] = [];
  const flags: string[] = [];

  const parts = [
    pointsFor(purposeOptions, profile.purpose),
    pointsFor(regionOptions, profile.region),
    pointsFor(propertyTypeOptions, profile.propertyType),
    pointsFor(budgetOptions, profile.budget),
    pointsFor(timelineOptions, profile.timeline),
    pointsFor(financingOptions, profile.financing),
    pointsFor(visitedOptions, profile.visited),
    pointsFor(contactPreferenceOptions, contact.contactPreference),
  ].filter((p): p is { points: number; max: number } => p !== null);

  const hasPhone = contact.phone.length > 0;
  parts.push({ points: hasPhone ? scoring.phonePoints : 0, max: scoring.phonePoints });

  const raw = parts.reduce((sum, p) => sum + p.points, 0);
  const max = parts.reduce((sum, p) => sum + p.max, 0);
  let score = Math.round((raw / max) * 100);

  const bonus = scoring.assistantBonus;
  if (answers.next_step === 'call') {
    score += bonus.wantsCall;
    reasons.push('möchte Gespräch');
  }
  if (answers.next_step === 'viewing_now') {
    score += bonus.onCyprusNow + bonus.wantsViewing;
    reasons.push('ist aktuell auf Zypern und möchte besichtigen');
  }
  if (answers.next_step === 'written') {
    score += bonus.emailOnly;
  }
  if (profile.visited === 'planned') {
    reasons.push('Besichtigungsreise bereits geplant');
  }

  // Einstufung nach Punktzahl
  let tier: LeadTier = score >= scoring.thresholds.A ? 'A' : score >= scoring.thresholds.B ? 'B' : 'C';

  // Harte Bedingungen für A
  const gates = scoring.aGates;
  const budgetIndex = budgetOptions.findIndex((b) => b.value === profile.budget);
  const gateFailures: string[] = [];
  if (budgetIndex < gates.minBudgetIndex) {
    gateFailures.push('Budget unter A-Mindeststufe');
  }
  if (!gates.allowedTimelines.includes(profile.timeline)) {
    gateFailures.push('Kaufzeitpunkt > 6 Monate');
  }
  if (profile.financing && gates.excludedFinancing.includes(profile.financing)) {
    gateFailures.push('Finanzierung offen');
  }
  if (!hasPhone) {
    gateFailures.push('keine Telefonnummer');
  }
  if (gates.requireConversationalContact && !conversationalContact.includes(contact.contactPreference)) {
    gateFailures.push('nur E-Mail-Kontakt gewünscht');
  }
  if (answers.next_step === 'written') {
    gateFailures.push('wünscht vorerst nur schriftliche Vorauswahl');
  }
  if (tier === 'A' && gateFailures.length > 0) {
    tier = 'B';
    reasons.push(...gateFailures.map((g) => `kein A: ${g}`));
  }

  // Obergrenzen
  const caps = [scoring.caps.timeline[profile.timeline], scoring.caps.budget[profile.budget]].filter(Boolean);
  if (caps.includes('C')) {
    tier = 'C';
  } else if (caps.includes('B') && tier === 'A') {
    tier = 'B';
  }

  // Wer vor Ort ist und besichtigen will, wird immer vom Vertrieb bearbeitet.
  if (answers.next_step === 'viewing_now' && tier === 'C') {
    tier = 'B';
  }

  // Hinweise für die manuelle Prüfung
  const emailDomain = contact.email.split('@')[1]?.toLowerCase() ?? '';
  if (scoring.agentEmailHints.some((hint) => emailDomain.includes(hint))) {
    flags.push('possible_agent_or_competitor');
  }
  if (!hasPhone) {
    flags.push('no_phone');
  }

  const priority: ScoreResult['priority'] =
    answers.next_step === 'viewing_now' ? 'highest' : tier === 'A' ? 'high' : tier === 'B' ? 'normal' : 'low';

  const nextStep: NextStep =
    answers.next_step === 'viewing_now' || tier === 'A'
      ? 'booking'
      : tier === 'B'
        ? 'booking_optional'
        : 'confirmation';

  return { tier, score, reasons, flags, priority, nextStep };
}
