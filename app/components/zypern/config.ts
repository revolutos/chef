/**
 * Zentrale, redaktionell editierbare Konfiguration der Landingpage
 * „Zypern Immobilien kaufen“ (/zypern-immobilien-kaufen).
 *
 * Alles, was sich ohne Code-Änderung anpassen lassen soll, steht hier:
 * Unternehmensdaten (Platzhalter), Budgetstufen, Scoring-Schwellen,
 * Conversion-Werte, A/B-Tests und Beispielobjekte.
 *
 * Regel: Keine erfundenen Angaben. Unbekannte Daten bleiben als
 * „[Platzhalter: …]“ stehen, bis sie durch echte Werte ersetzt werden.
 */

export const PAGE_PATH = '/zypern-immobilien-kaufen';
export const PAGE_URL = `https://revolutos.de${PAGE_PATH}`;

/** Demo-Modus: zeigt als Platzhalter markierte Inhalte (z. B. Beispielobjekte) an. Vor Livegang auf false setzen. */
export const DEMO_MODE = true;

export const company = {
  name: 'REVOLUTOS LTD',
  brand: 'REVOLUTOS',
  website: 'revolutos.de',
  websiteUrl: 'https://revolutos.de',
  positioning: 'Deutschsprachige Immobilienvermittlung und Kaufbegleitung auf Zypern',
  country: 'Zypern',
  // Alle folgenden Felder sind Platzhalter und müssen vor Livegang ersetzt werden.
  street: '[Platzhalter: Straße und Hausnummer]',
  postalCode: '[Platzhalter: PLZ]',
  city: '[Platzhalter: Ort]',
  email: '[Platzhalter: E-Mail]',
  phone: '[Platzhalter: Telefon]',
  registerNumber: '[Platzhalter: Handelsregisternummer (HE …)]',
  vatId: '[Platzhalter: USt-IdNr., falls vorhanden]',
  managingDirector: '[Platzhalter: Geschäftsführung]',
  /**
   * Rolle im Kaufprozess. Nur eintragen, was tatsächlich zutrifft.
   * Besitzt REVOLUTOS LTD keine eigene zypriotische Maklerlizenz, erfolgt die
   * Vermittlung über einen lizenzierten Partner.
   */
  brokerLicense: null as string | null, // z. B. 'Reg. No. … / Lic. No. …' – nur wenn vorhanden
  brokerPartner: '[Platzhalter: Name des lizenzierten zypriotischen Immobilienmaklers, Reg./Lic. No.]',
  legalPartner: '[Platzhalter: Partnerkanzlei / Rechtsanwalt auf Zypern]',
  taxPartner: '[Platzhalter: Steuerberater-Partner]',
  /** Antwortzeit, die im Dankes-Schritt genannt wird. Nur eine realistisch einhaltbare Zusage eintragen. */
  responseTime: '[Platzhalter: z. B. innerhalb eines Werktags]',
  impressumUrl: '/impressum',
  privacyUrl: '/datenschutz',
  termsUrl: null as string | null, // AGB-Link, falls erforderlich
} as const;

/* ------------------------------------------------------------------ */
/* Kaufprofil – Optionen                                               */
/* ------------------------------------------------------------------ */

export type Option<T extends string = string> = { value: T; label: string; points: number };

export const purposeOptions = [
  { value: 'self_use', label: 'Selbst darin wohnen', points: 5 },
  { value: 'holiday', label: 'Ferien-/Zweitwohnsitz', points: 5 },
  { value: 'investment', label: 'Kapitalanlage / Vermietung', points: 5 },
  { value: 'mixed', label: 'Eigennutzung + Vermietung', points: 5 },
  { value: 'undecided', label: 'Noch nicht entschieden', points: 0 },
] as const satisfies readonly Option[];

export const regionOptions = [
  { value: 'paphos', label: 'Paphos', points: 5 },
  { value: 'limassol', label: 'Limassol', points: 5 },
  { value: 'larnaca', label: 'Larnaca', points: 5 },
  { value: 'nicosia', label: 'Nikosia', points: 5 },
  { value: 'other', label: 'Andere Region', points: 4 },
  { value: 'advice', label: 'Ich möchte beraten werden', points: 3 },
] as const satisfies readonly Option[];

export const propertyTypeOptions = [
  { value: 'apartment', label: 'Apartment', points: 3 },
  { value: 'house', label: 'Haus / Villa', points: 3 },
  { value: 'new_build', label: 'Neubau', points: 3 },
  { value: 'resale', label: 'Bestandsimmobilie', points: 3 },
  { value: 'land', label: 'Grundstück', points: 3 },
  { value: 'open', label: 'Noch offen', points: 0 },
] as const satisfies readonly Option[];

/**
 * Budgetstufen – zentrale Lead-Qualifizierung. Frei konfigurierbar:
 * Reihenfolge, Beschriftung, Punkte und `index` (0 = niedrigste Stufe) steuern das Scoring.
 */
export const budgetOptions = [
  { value: 'b_u150', label: 'unter 150.000 €', points: 0 },
  { value: 'b_150_250', label: '150.000–250.000 €', points: 12 },
  { value: 'b_250_400', label: '250.000–400.000 €', points: 22 },
  { value: 'b_400_750', label: '400.000–750.000 €', points: 25 },
  { value: 'b_750_1500', label: '750.000–1.500.000 €', points: 25 },
  { value: 'b_o1500', label: 'über 1.500.000 €', points: 25 },
] as const satisfies readonly Option[];

export const timelineOptions = [
  { value: 'asap', label: 'so schnell wie möglich', points: 25 },
  { value: 'm0_3', label: 'innerhalb von 3 Monaten', points: 25 },
  { value: 'm3_6', label: '3–6 Monate', points: 20 },
  { value: 'm6_12', label: '6–12 Monate', points: 10 },
  { value: 'm12_plus', label: 'später als 12 Monate', points: 3 },
  { value: 'info', label: 'ich informiere mich zunächst', points: 0 },
] as const satisfies readonly Option[];

export const financingOptions = [
  { value: 'equity', label: 'Eigenkapital', points: 15 },
  { value: 'loan', label: 'Finanzierung', points: 7 },
  { value: 'mixed', label: 'Eigenkapital + Finanzierung', points: 12 },
  { value: 'open', label: 'noch offen', points: 0 },
] as const satisfies readonly Option[];

export const visitedOptions = [
  { value: 'yes', label: 'Ja', points: 6 },
  { value: 'no', label: 'Nein', points: 2 },
  { value: 'planned', label: 'Besichtigung ist bereits geplant', points: 10 },
] as const satisfies readonly Option[];

export const contactPreferenceOptions = [
  { value: 'phone', label: 'Telefon', points: 5 },
  { value: 'whatsapp', label: 'WhatsApp', points: 5 },
  { value: 'email', label: 'E-Mail', points: 0 },
  { value: 'video', label: 'Video-Call', points: 5 },
] as const satisfies readonly Option[];

export const phoneCountryCodes = [
  { value: '+49', label: 'DE +49' },
  { value: '+43', label: 'AT +43' },
  { value: '+41', label: 'CH +41' },
  { value: '+357', label: 'CY +357' },
  { value: '+352', label: 'LU +352' },
  { value: '+423', label: 'LI +423' },
  { value: 'other', label: 'Andere' },
] as const;

export type Purpose = (typeof purposeOptions)[number]['value'];
export type Region = (typeof regionOptions)[number]['value'];
export type PropertyType = (typeof propertyTypeOptions)[number]['value'];
export type Budget = (typeof budgetOptions)[number]['value'];
export type Timeline = (typeof timelineOptions)[number]['value'];
export type Financing = (typeof financingOptions)[number]['value'];
export type Visited = (typeof visitedOptions)[number]['value'];
export type ContactPreference = (typeof contactPreferenceOptions)[number]['value'];

/* ------------------------------------------------------------------ */
/* Lead-Scoring – alle Schwellen administrativ änderbar               */
/* ------------------------------------------------------------------ */

export const scoring = {
  /**
   * Mindestwert für A- bzw. B-Leads. Der Basis-Score ist in Prozent der für die
   * gestellten Fragen maximal erreichbaren Punkte normiert (0–100), damit kurze und
   * lange Funnel-Varianten vergleichbar bleiben. Assistent-Boni kommen absolut hinzu.
   */
  thresholds: { A: 70, B: 40 },
  /** Punkte für eine angegebene, formal gültige Telefonnummer. */
  phonePoints: 5,
  /** Harte Bedingungen für A-Leads – zusätzlich zur Punktzahl. */
  aGates: {
    /** Niedrigste Budgetstufe, die als A-Lead gilt (Index in budgetOptions). */
    minBudgetIndex: 1,
    allowedTimelines: ['asap', 'm0_3', 'm3_6'] as Timeline[],
    /** Finanzierung „noch offen“ schließt A aus. */
    excludedFinancing: ['open'] as Financing[],
    /** Kontaktpräferenz muss ein Gespräch ermöglichen. */
    requireConversationalContact: true,
  },
  /** Obergrenzen: Diese Angaben begrenzen die Einstufung unabhängig von der Punktzahl. */
  caps: {
    timeline: { m12_plus: 'C', info: 'C', m6_12: 'B' } as Partial<Record<Timeline, 'B' | 'C'>>,
    budget: { b_u150: 'B' } as Partial<Record<Budget, 'B' | 'C'>>,
  },
  /** Zusatzpunkte aus der Nachqualifizierung (Assistent). */
  assistantBonus: {
    wantsCall: 10,
    wantsViewing: 15,
    onCyprusNow: 15,
    emailOnly: -5,
  },
  /** E-Mail-Domains/-Bestandteile, die auf Makler/Wettbewerber hindeuten → Flag zur manuellen Prüfung. */
  agentEmailHints: ['immobilien', 'immo', 'realestate', 'real-estate', 'property', 'properties', 'makler', 'estate'],
} as const;

/**
 * Conversion-Werte für Google Ads (Value-Based Bidding).
 * Platzhalterwerte – anhand realer Abschlussquoten und Provisionen kalibrieren.
 */
export const conversionValues = {
  lead_submitted: 1,
  qualified_lead: 40,
  high_quality_lead: 120,
  appointment_booked: 250,
  viewing_requested: 300,
  sales_accepted_lead: 600,
  /** property_purchase: tatsächlicher Wert (Provision/Marge) aus dem CRM. */
  currency: 'EUR',
} as const;

/* ------------------------------------------------------------------ */
/* Terminbuchung                                                       */
/* ------------------------------------------------------------------ */

export const booking = {
  /** Calendly- oder Cal.com-Link für das 15-Minuten-Kaufgespräch. Leer = Platzhalter anzeigen. */
  calendarUrl: '',
  durationLabel: '15-Minuten',
};

/* ------------------------------------------------------------------ */
/* A/B-Tests – immer nur EIN Test aktiv                                */
/* ------------------------------------------------------------------ */

export type AbTestId =
  | 'hero_headline'
  | 'hero_cta'
  | 'hero_form'
  | 'budget_position'
  | 'phone_required'
  | 'funnel_length'
  | 'examples_position'
  | 'booking_timing'
  | 'trust_position';

export type AbTest = {
  id: AbTestId;
  hypothesis: string;
  primaryMetric: string;
  variants: { id: 'A' | 'B'; weight: number; description: string }[];
};

export const abTests: Record<AbTestId, AbTest> = {
  hero_headline: {
    id: 'hero_headline',
    hypothesis:
      'Eine Headline, die das Keyword als Frage aufgreift und Passung verspricht, erhöht den Anteil gestarteter Kaufprofile.',
    primaryMetric: 'qualified_lead / Klick',
    variants: [
      { id: 'A', weight: 50, description: 'Zypern Immobilien kaufen – ohne sich durch hunderte Angebote zu kämpfen.' },
      { id: 'B', weight: 50, description: 'Sie möchten eine Immobilie auf Zypern kaufen? Wir finden die, die …' },
    ],
  },
  hero_cta: {
    id: 'hero_cta',
    hypothesis: '„Kaufprofil starten“ signalisiert Aufwand und filtert besser als „Passende Immobilien anfragen“.',
    primaryMetric: 'high_quality_lead / Klick',
    variants: [
      { id: 'A', weight: 50, description: 'Passende Immobilien anfragen' },
      { id: 'B', weight: 50, description: 'Kaufprofil starten' },
    ],
  },
  hero_form: {
    id: 'hero_form',
    hypothesis: 'Die erste Frage direkt im Hero senkt die Einstiegshürde, ohne die Lead-Qualität zu verschlechtern.',
    primaryMetric: 'qualified_lead / Klick',
    variants: [
      { id: 'A', weight: 50, description: 'CTA im Hero, Kaufprofil darunter' },
      { id: 'B', weight: 50, description: 'Kaufprofil direkt im Hero' },
    ],
  },
  budget_position: {
    id: 'budget_position',
    hypothesis:
      'Budget als erste Frage filtert früher, kostet aber Starts. Netto-Effekt auf qualifizierte Leads messen.',
    primaryMetric: 'qualified_lead / Klick',
    variants: [
      { id: 'A', weight: 50, description: 'Budget an Position 4' },
      { id: 'B', weight: 50, description: 'Budget an Position 1' },
    ],
  },
  phone_required: {
    id: 'phone_required',
    hypothesis: 'Telefonnummer optional erhöht Leads, senkt aber den Anteil erreichbarer A-Leads.',
    primaryMetric: 'sales_accepted_lead / Klick',
    variants: [
      { id: 'A', weight: 50, description: 'Telefonnummer Pflicht' },
      { id: 'B', weight: 50, description: 'Telefonnummer optional' },
    ],
  },
  funnel_length: {
    id: 'funnel_length',
    hypothesis: 'Ohne Finanzierungs- und Besichtigungsfrage steigen Abschlüsse des Profils; Qualität prüfen.',
    primaryMetric: 'high_quality_lead / Klick',
    variants: [
      { id: 'A', weight: 50, description: '7 Fragen' },
      { id: 'B', weight: 50, description: '5 Fragen (ohne Finanzierung, Besichtigung)' },
    ],
  },
  examples_position: {
    id: 'examples_position',
    hypothesis: 'Beispielobjekte vor dem Kaufprofil steigern die Motivation, das Profil auszufüllen.',
    primaryMetric: 'qualification_completed / Klick',
    variants: [
      { id: 'A', weight: 50, description: 'Objekte nach der Qualifizierung' },
      { id: 'B', weight: 50, description: 'Objekte vor der Qualifizierung' },
    ],
  },
  booking_timing: {
    id: 'booking_timing',
    hypothesis: 'A-Leads, denen der Kalender sofort angeboten wird, buchen häufiger als nach der Nachqualifizierung.',
    primaryMetric: 'appointment_booked / A-Lead',
    variants: [
      { id: 'A', weight: 50, description: 'Termin nach dem Assistenten' },
      { id: 'B', weight: 50, description: 'Termin direkt nach dem Absenden' },
    ],
  },
  trust_position: {
    id: 'trust_position',
    hypothesis: 'Vertrauens-Section direkt nach dem Hero reduziert Abbrüche bei der Kontaktabfrage.',
    primaryMetric: 'lead_submitted / qualification_completed',
    variants: [
      { id: 'A', weight: 50, description: 'Vertrauen nach Beispielobjekten' },
      { id: 'B', weight: 50, description: 'Vertrauen direkt nach dem Kaufprofil' },
    ],
  },
};

/** Der aktuell laufende Test. `null` = kein Test, alle Besucher sehen Variante A. */
export const activeAbTest: AbTestId | null = 'hero_headline';

/* ------------------------------------------------------------------ */
/* Beispielobjekte                                                     */
/* ------------------------------------------------------------------ */

export type ExampleProperty = {
  id: string;
  region: string;
  type: string;
  bedrooms: string;
  livingArea: string;
  price: string;
  status: string;
  /** Bildpfad (AVIF/WebP, z. B. /zypern/objekt-1.avif). null = neutraler Bildplatz. */
  image: string | null;
  imageAlt: string;
  /** true = Demo-Platzhalter; wird nur bei DEMO_MODE angezeigt. */
  placeholder: boolean;
};

export const exampleProperties: ExampleProperty[] = [
  {
    id: 'demo-1',
    region: 'Paphos',
    type: 'Apartment',
    bedrooms: '[Anzahl]',
    livingArea: '[m²]',
    price: 'ab [Preis] €',
    status: '[Neubau / bezugsfertig]',
    image: null,
    imageAlt: 'Apartment in Paphos, Zypern',
    placeholder: true,
  },
  {
    id: 'demo-2',
    region: 'Limassol',
    type: 'Haus / Villa',
    bedrooms: '[Anzahl]',
    livingArea: '[m²]',
    price: '[Preis] €',
    status: '[Bestand]',
    image: null,
    imageAlt: 'Villa in Limassol, Zypern',
    placeholder: true,
  },
  {
    id: 'demo-3',
    region: 'Larnaca',
    type: 'Neubau-Apartment',
    bedrooms: '[Anzahl]',
    livingArea: '[m²]',
    price: 'ab [Preis] €',
    status: '[Fertigstellung Quartal/Jahr]',
    image: null,
    imageAlt: 'Neubauprojekt in Larnaca, Zypern',
    placeholder: true,
  },
];

/**
 * „Nicht jedes verfügbare Objekt wird öffentlich veröffentlicht.“
 * Nur auf true setzen, wenn diese Aussage nachweislich zutrifft.
 */
export const showOffMarketNote = false;

/**
 * Hero-Bild. Echtes Foto einer Immobilie auf Zypern (eigene Aufnahme oder lizenziert).
 * Ohne Bild zeigt der Hero eine Karten-Grafik der Republik Zypern.
 */
export const heroImage: { avif: string; webp: string; alt: string; width: number; height: number } | null = null;

/** Teamfotos erst einbinden, wenn echte Personen und Fotos vorliegen. */
export const team: { name: string; role: string; photo: string }[] = [];
