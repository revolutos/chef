/**
 * Statische Demo-Daten für das KI Business OS (Landing + Dashboard).
 * In einer späteren Ausbaustufe kommen diese Werte aus dem Backend.
 */

export interface RevenuePoint {
  label: string;
  value: number;
}

export const revenueSeries: RevenuePoint[] = [
  { label: '1. Jun', value: 12400 },
  { label: '2. Jun', value: 12900 },
  { label: '3. Jun', value: 12600 },
  { label: '4. Jun', value: 13800 },
  { label: '5. Jun', value: 14100 },
  { label: '6. Jun', value: 13700 },
  { label: '7. Jun', value: 15200 },
  { label: '8. Jun', value: 15800 },
  { label: '9. Jun', value: 15400 },
  { label: '10. Jun', value: 16600 },
  { label: '11. Jun', value: 16200 },
  { label: '12. Jun', value: 17400 },
  { label: '13. Jun', value: 18100 },
  { label: '14. Jun', value: 17600 },
  { label: '15. Jun', value: 18900 },
  { label: '16. Jun', value: 19600 },
  { label: '17. Jun', value: 19100 },
  { label: '18. Jun', value: 20300 },
  { label: '19. Jun', value: 21000 },
  { label: '20. Jun', value: 20400 },
  { label: '21. Jun', value: 21800 },
  { label: '22. Jun', value: 22600 },
  { label: '23. Jun', value: 22100 },
  { label: '24. Jun', value: 23400 },
  { label: '25. Jun', value: 22900 },
  { label: '26. Jun', value: 24100 },
  { label: '27. Jun', value: 23700 },
  { label: '28. Jun', value: 24600 },
  { label: '29. Jun', value: 24200 },
  { label: '30. Jun', value: 24860 },
];

export interface LeadSource {
  name: string;
  value: number;
}

export const leadSources: LeadSource[] = [
  { name: 'Instagram', value: 128 },
  { name: 'YouTube', value: 86 },
  { name: 'Newsletter', value: 64 },
  { name: 'Affiliates', value: 41 },
  { name: 'Organisch', value: 23 },
];

export type PipelineStatus = 'Neu' | 'Qualifiziert' | 'Call gebucht' | 'Gewonnen';

export interface PipelineLead {
  name: string;
  offer: string;
  status: PipelineStatus;
  value: string;
  date: string;
}

export const pipelineLeads: PipelineLead[] = [
  { name: 'Sarah Klein', offer: '1:1 Coaching „Scale"', status: 'Call gebucht', value: '2.400 €', date: 'Heute' },
  { name: 'Jonas Weber', offer: 'KI-Workshop Team', status: 'Qualifiziert', value: '4.800 €', date: 'Heute' },
  { name: 'Mia Lorenz', offer: 'Online-Kurs Funnel Pro', status: 'Gewonnen', value: '990 €', date: 'Gestern' },
  { name: 'David Roth', offer: 'Consulting Retainer', status: 'Neu', value: '3.500 €', date: 'Gestern' },
  { name: 'Lena Hoffmann', offer: 'Membership Creator Club', status: 'Qualifiziert', value: '588 €', date: '2. Jul' },
  { name: 'Tim Berger', offer: 'Affiliate-Partnerschaft', status: 'Neu', value: '1.200 €', date: '1. Jul' },
];

export interface ActivityItem {
  text: string;
  detail: string;
  time: string;
}

export const aiActivities: ActivityItem[] = [
  { text: 'Follow-up-Sequenz gesendet', detail: '12 Leads · E-Mail + WhatsApp', time: 'vor 8 Min.' },
  { text: 'Instagram-Post generiert & geplant', detail: 'Reel-Skript + Caption · morgen 18:00', time: 'vor 32 Min.' },
  { text: 'Lead als „heiß" eingestuft', detail: 'Jonas Weber · Score 92/100', time: 'vor 1 Std.' },
  { text: 'Rechnung #1042 erstellt & versendet', detail: 'Mia Lorenz · 990 €', time: 'vor 2 Std.' },
  { text: 'Wochenreport vorbereitet', detail: 'Umsatz, Funnel & Content-Performance', time: 'vor 5 Std.' },
];

export const quickPrompts = [
  'Erstelle meinen Content-Plan für Juli',
  'Analysiere meinen Launch-Funnel',
  'Schreibe ein Follow-up an alle offenen Leads',
];

/* ---------------------------------- CRM ---------------------------------- */

export type CrmStage = 'Neu' | 'Qualifiziert' | 'Call gebucht' | 'Angebot' | 'Gewonnen' | 'Verloren';

export const crmStages: CrmStage[] = ['Neu', 'Qualifiziert', 'Call gebucht', 'Angebot', 'Gewonnen', 'Verloren'];

export const crmSources = ['Instagram', 'YouTube', 'Newsletter', 'Affiliates', 'Empfehlung', 'LinkedIn'] as const;
export type CrmSource = (typeof crmSources)[number];

export type CrmActivityKind = 'note' | 'call' | 'email' | 'meeting' | 'stage' | 'task' | 'system';

export interface CrmActivity {
  id: string;
  kind: CrmActivityKind;
  text: string;
  detail?: string;
  time: string;
}

export interface CrmLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  offer: string;
  source: CrmSource;
  stage: CrmStage;
  value: number;
  /** KI-Lead-Score 0–100 */
  score: number;
  lastActivity: string;
  nextAction: string;
  notes: string;
  activities: CrmActivity[];
}

const baseCrmLeads: Omit<CrmLead, 'phone' | 'activities'>[] = [
  {
    id: 'l1',
    name: 'Sarah Klein',
    company: 'Klein Coaching',
    email: 'sarah@klein-coaching.de',
    offer: '1:1 Coaching „Scale"',
    source: 'Instagram',
    stage: 'Call gebucht',
    value: 2400,
    score: 88,
    lastActivity: 'Heute, 09:12',
    nextAction: 'Discovery-Call morgen 14:00',
    notes: 'Kommt über Reel-Kampagne Juni. Will von 5k auf 20k MRR skalieren.',
  },
  {
    id: 'l2',
    name: 'Jonas Weber',
    company: 'Weber & Partner',
    email: 'j.weber@weberpartner.de',
    offer: 'KI-Workshop Team',
    source: 'LinkedIn',
    stage: 'Qualifiziert',
    value: 4800,
    score: 92,
    lastActivity: 'Heute, 08:40',
    nextAction: 'Angebot bis Freitag senden',
    notes: 'Team mit 12 Personen, Budget bestätigt. Entscheider ist Jonas selbst.',
  },
  {
    id: 'l3',
    name: 'Mia Lorenz',
    company: 'Lorenz Digital',
    email: 'mia@lorenz.digital',
    offer: 'Online-Kurs Funnel Pro',
    source: 'YouTube',
    stage: 'Gewonnen',
    value: 990,
    score: 97,
    lastActivity: 'Gestern, 17:05',
    nextAction: 'Onboarding-Sequenz läuft',
    notes: 'Kauf nach Webinar. Upsell auf Membership in 30 Tagen prüfen.',
  },
  {
    id: 'l4',
    name: 'David Roth',
    company: 'Roth Consulting',
    email: 'david@roth-consulting.de',
    offer: 'Consulting Retainer',
    source: 'Empfehlung',
    stage: 'Angebot',
    value: 3500,
    score: 76,
    lastActivity: 'Gestern, 11:30',
    nextAction: 'Follow-up am Donnerstag',
    notes: 'Empfehlung von Mia Lorenz. Vergleicht noch zwei Anbieter.',
  },
  {
    id: 'l5',
    name: 'Lena Hoffmann',
    company: 'Creator Club',
    email: 'lena@creatorclub.io',
    offer: 'Membership Creator Club',
    source: 'Newsletter',
    stage: 'Qualifiziert',
    value: 588,
    score: 71,
    lastActivity: '2. Jul, 15:20',
    nextAction: 'Case Study senden',
    notes: 'Öffnet jede Mail, klickt Pricing-Seite. Zögert beim Jahresplan.',
  },
  {
    id: 'l6',
    name: 'Tim Berger',
    company: 'Berger Media',
    email: 'tim@bergermedia.de',
    offer: 'Affiliate-Partnerschaft',
    source: 'Affiliates',
    stage: 'Neu',
    value: 1200,
    score: 54,
    lastActivity: '1. Jul, 19:44',
    nextAction: 'Erstkontakt qualifizieren',
    notes: 'Reichweite 40k auf TikTok. Fit für Affiliate-Programm prüfen.',
  },
  {
    id: 'l7',
    name: 'Anna Schmitt',
    company: 'Schmitt Studio',
    email: 'anna@schmitt.studio',
    offer: 'Brand-Sprint Paket',
    source: 'Instagram',
    stage: 'Neu',
    value: 1900,
    score: 63,
    lastActivity: '1. Jul, 10:02',
    nextAction: 'Quiz-Ergebnis auswerten',
    notes: 'Kam über Lead-Magnet „Brand-Check". Studio mit 3 Mitarbeiterinnen.',
  },
  {
    id: 'l8',
    name: 'Felix Brandt',
    company: 'Brandt Ventures',
    email: 'felix@brandt.vc',
    offer: 'KI-Workshop Team',
    source: 'LinkedIn',
    stage: 'Call gebucht',
    value: 6200,
    score: 84,
    lastActivity: '30. Jun, 16:15',
    nextAction: 'Call am Mittwoch 10:00',
    notes: 'Portfolio-Firmen sollen KI-Workflows lernen. Multi-Deal möglich.',
  },
  {
    id: 'l9',
    name: 'Nina Vogel',
    company: 'Vogelperspektive',
    email: 'nina@vogelperspektive.de',
    offer: 'Online-Kurs Funnel Pro',
    source: 'YouTube',
    stage: 'Verloren',
    value: 990,
    score: 22,
    lastActivity: '28. Jun, 13:50',
    nextAction: 'Re-Engagement in 90 Tagen',
    notes: 'Budget aktuell nicht vorhanden. In Nurture-Sequenz verschoben.',
  },
  {
    id: 'l10',
    name: 'Marc Steiner',
    company: 'Steiner Fitness',
    email: 'marc@steiner.fit',
    offer: '1:1 Coaching „Scale"',
    source: 'Empfehlung',
    stage: 'Angebot',
    value: 2400,
    score: 79,
    lastActivity: '29. Jun, 09:31',
    nextAction: 'Einwand „Zeit" behandeln',
    notes: 'Fitness-Coach, 15k Follower. Angebot liegt vor, zögert wegen Zeit.',
  },
  {
    id: 'l11',
    name: 'Julia Krämer',
    company: 'Krämer Kanzlei',
    email: 'julia@kraemer-kanzlei.de',
    offer: 'Consulting Retainer',
    source: 'Newsletter',
    stage: 'Qualifiziert',
    value: 5000,
    score: 81,
    lastActivity: 'Heute, 07:58',
    nextAction: 'Bedarfsanalyse-Call anbieten',
    notes: 'Kanzlei will Mandanten-Kommunikation automatisieren. Hohes Budget.',
  },
  {
    id: 'l12',
    name: 'Paul Winter',
    company: 'Winterwerk',
    email: 'paul@winterwerk.de',
    offer: 'Membership Creator Club',
    source: 'Affiliates',
    stage: 'Gewonnen',
    value: 588,
    score: 90,
    lastActivity: '27. Jun, 20:12',
    nextAction: 'Community-Onboarding',
    notes: 'Über Partner-Link von Tim B. gekommen. Sehr aktiv in der Community.',
  },
];

/** Deterministische Telefonnummer aus der Lead-ID (nur Demo). */
function seedPhone(id: string): string {
  const n = id.replace(/\D/g, '').padEnd(7, '4').slice(0, 7);
  return `+49 151 ${n.slice(0, 3)} ${n.slice(3, 7)}`;
}

/** Baut eine plausible Aktivitäten-Historie aus den Kern-Feldern eines Leads. */
function seedActivities(lead: Omit<CrmLead, 'phone' | 'activities'>): CrmActivity[] {
  const activities: CrmActivity[] = [
    {
      id: `${lead.id}-a1`,
      kind: 'system',
      text: 'KI-Score aktualisiert',
      detail: `Neuer Score: ${lead.score}/100`,
      time: lead.lastActivity,
    },
  ];
  if (lead.stage === 'Gewonnen') {
    activities.push({
      id: `${lead.id}-a2`,
      kind: 'stage',
      text: 'Deal gewonnen 🎉',
      detail: `${lead.offer} · ${lead.value.toLocaleString('de-DE')} €`,
      time: lead.lastActivity,
    });
  } else if (lead.stage === 'Angebot') {
    activities.push({
      id: `${lead.id}-a2`,
      kind: 'email',
      text: 'Angebot gesendet',
      detail: lead.offer,
      time: lead.lastActivity,
    });
  } else if (lead.stage === 'Call gebucht') {
    activities.push({
      id: `${lead.id}-a2`,
      kind: 'meeting',
      text: 'Termin gebucht',
      detail: lead.nextAction,
      time: lead.lastActivity,
    });
  }
  activities.push({
    id: `${lead.id}-a3`,
    kind: 'system',
    text: 'Lead erstellt',
    detail: `Quelle: ${lead.source}`,
    time: '24. Jun, 08:11',
  });
  return activities;
}

export const crmLeads: CrmLead[] = baseCrmLeads.map((lead) => ({
  ...lead,
  phone: seedPhone(lead.id),
  activities: seedActivities(lead),
}));

/* ------------------------------ Automationen ------------------------------ */

export type AutomationStatus = 'Aktiv' | 'Pausiert' | 'Entwurf';

export type AutomationIcon = 'mail' | 'lead' | 'content' | 'invoice' | 'chat' | 'report';

export type AutomationStepKind =
  | 'trigger'
  | 'condition'
  | 'delay'
  | 'email'
  | 'whatsapp'
  | 'push'
  | 'task'
  | 'generate'
  | 'invoice'
  | 'report'
  | 'branch';

export interface AutomationStep {
  kind: AutomationStepKind;
  title: string;
  detail: string;
  /** Betreffzeile für E-Mail-Schritte. */
  subject?: string;
  /** Tatsächlicher Nachrichten-/Aktionsinhalt (das „was dahinter steckt"). */
  body?: string;
  /** Kompakte Performance-Zeile, z. B. „68 % geöffnet · 24 % geklickt". */
  stats?: string;
}

export type AutomationRunResult = 'Erfolgreich' | 'Läuft' | 'Wartet' | 'Übersprungen' | 'Fehler';

export interface AutomationRun {
  time: string;
  lead: string;
  step: string;
  result: AutomationRunResult;
}

export interface AutomationSettings {
  activeHours: string;
  priority: 'Niedrig' | 'Normal' | 'Hoch';
  stopOnReply: boolean;
  channel: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  status: AutomationStatus;
  runs30d: number;
  timeSavedHours: number;
  lastRun: string;
  icon: AutomationIcon;
  steps: AutomationStep[];
  runs: AutomationRun[];
  metrics: { label: string; value: string; hint: string }[];
  settings: AutomationSettings;
}

export const automations: Automation[] = [
  {
    id: 'a1',
    name: 'Lead-Nurture-Sequenz',
    description: 'Begrüßt neue Leads automatisch und wärmt sie mit einer 5-teiligen Sequenz auf.',
    trigger: 'Neuer Lead',
    condition: 'KI-Score ≥ 50',
    action: 'E-Mail-Sequenz starten',
    status: 'Aktiv',
    runs30d: 214,
    timeSavedHours: 12.5,
    lastRun: 'vor 18 Min.',
    icon: 'mail',
    metrics: [
      { label: 'Ausführungen', value: '214', hint: 'letzte 30 Tage' },
      { label: 'Öffnungsrate', value: '61,4 %', hint: 'über alle Mails' },
      { label: 'Klickrate', value: '18,2 %', hint: 'über alle Mails' },
      { label: 'Abschlüsse', value: '9', hint: 'aus dieser Sequenz' },
    ],
    steps: [
      { kind: 'trigger', title: 'Auslöser: Neuer Lead', detail: 'Startet, sobald ein Lead im CRM angelegt wird.' },
      {
        kind: 'condition',
        title: 'Bedingung: KI-Score ≥ 50',
        detail: 'Nur Leads mit ausreichender Qualität durchlaufen die Sequenz. Kältere Leads werden übersprungen.',
      },
      {
        kind: 'email',
        title: 'E-Mail 1 · sofort',
        detail: 'Willkommen & Erwartung setzen',
        subject: 'Schön, dass du da bist 👋',
        body: 'Hi {{vorname}},\n\nschön, dass du dich für {{angebot}} interessierst! In den nächsten Tagen zeige ich dir, wie andere in deiner Situation den Sprung geschafft haben – ohne mehr Stunden zu arbeiten.\n\nHeute nur eine Frage: Was ist gerade deine größte Hürde? Antworte einfach auf diese Mail – ich lese jede persönlich.\n\nBis gleich,\nViktor',
        stats: '68 % geöffnet · 21 % geantwortet',
      },
      { kind: 'delay', title: 'Warte 1 Tag', detail: 'Pausiert bis zum nächsten Werktag, 09:00 Uhr.' },
      {
        kind: 'email',
        title: 'E-Mail 2 · Tag 2',
        detail: 'Mehrwert & Vertrauen aufbauen',
        subject: 'Der Fehler, den 90 % machen',
        body: 'Hi {{vorname}},\n\ndie meisten starten mit Taktiken – neue Tools, neue Kanäle. Der eigentliche Hebel liegt aber woanders: bei einem System, das ohne dich läuft.\n\nIn diesem 4-Minuten-Video zeige ich dir die 3 Bausteine, die den Unterschied machen: [Link]\n\nViktor',
        stats: '59 % geöffnet · 24 % geklickt',
      },
      { kind: 'delay', title: 'Warte 2 Tage', detail: 'Pausiert bis Tag 4, 09:00 Uhr.' },
      {
        kind: 'email',
        title: 'E-Mail 3 · Tag 4',
        detail: 'Case Study / Social Proof',
        subject: 'Wie Sarah in 60 Tagen auf 20k kam',
        body: 'Hi {{vorname}},\n\nSarah war da, wo du vielleicht gerade stehst: viel zu tun, wenig System. 60 Tage später macht sie 20k im Monat – bei weniger Arbeitsstunden.\n\nHier ist ihre Geschichte in 3 Schritten: [Link]\n\nMorgen zeige ich dir, wie das für dich aussehen könnte.\n\nViktor',
        stats: '57 % geöffnet · 19 % geklickt',
      },
      { kind: 'delay', title: 'Warte 2 Tage', detail: 'Pausiert bis Tag 6, 09:00 Uhr.' },
      {
        kind: 'email',
        title: 'E-Mail 4 · Tag 6',
        detail: 'Angebot & klarer Call-to-Action',
        subject: 'Bereit für den nächsten Schritt?',
        body: 'Hi {{vorname}},\n\nwenn du magst, schauen wir gemeinsam auf dein Business und finden den schnellsten Hebel für dich. Unverbindlich, 20 Minuten.\n\n👉 Hier deinen Termin sichern: [Kalender-Link]\n\nDie Plätze diese Woche sind begrenzt.\n\nViktor',
        stats: '54 % geöffnet · 12 % gebucht',
      },
      {
        kind: 'branch',
        title: 'Verzweigung: hat geklickt?',
        detail:
          'Wenn der Lead den Kalender-Link öffnet, aber nicht bucht, wird eine persönliche Aufgabe für dich erstellt.',
      },
      {
        kind: 'task',
        title: 'Aufgabe: persönlich nachfassen',
        detail: 'Erstellt eine CRM-Aufgabe „Warmen Lead anrufen" mit Kontext aus der Sequenz.',
      },
    ],
    runs: [
      { time: 'Heute, 09:12', lead: 'Anna Schmitt', step: 'E-Mail 1 · Willkommen', result: 'Erfolgreich' },
      { time: 'Heute, 09:00', lead: 'Julia Krämer', step: 'E-Mail 3 · Case Study', result: 'Erfolgreich' },
      { time: 'Heute, 08:41', lead: 'Tim Berger', step: 'Bedingung: KI-Score ≥ 50', result: 'Übersprungen' },
      { time: 'Gestern, 09:03', lead: 'Marc Steiner', step: 'E-Mail 4 · Angebot', result: 'Erfolgreich' },
      { time: 'Gestern, 09:00', lead: 'Lena Hoffmann', step: 'Warte 2 Tage', result: 'Wartet' },
    ],
    settings: {
      activeHours: 'Werktags 09:00–18:00',
      priority: 'Hoch',
      stopOnReply: true,
      channel: 'E-Mail (Postfach: viktor@revolutos.de)',
    },
  },
  {
    id: 'a2',
    name: 'Heiße Leads alarmieren',
    description: 'Meldet dir sofort, wenn ein Lead abschlussbereit wird — bevor er kalt wird.',
    trigger: 'KI-Score steigt über 80',
    condition: 'Phase ≠ Gewonnen',
    action: 'Push + WhatsApp an dich',
    status: 'Aktiv',
    runs30d: 37,
    timeSavedHours: 4,
    lastRun: 'vor 1 Std.',
    icon: 'lead',
    metrics: [
      { label: 'Ausführungen', value: '37', hint: 'letzte 30 Tage' },
      { label: 'Ø Reaktionszeit', value: '8 Min.', hint: 'bis du reagierst' },
      { label: 'Kontaktquote', value: '92 %', hint: 'noch am selben Tag' },
      { label: 'Abschlüsse', value: '6', hint: 'aus Alarmen' },
    ],
    steps: [
      {
        kind: 'trigger',
        title: 'Auslöser: KI-Score steigt über 80',
        detail: 'Reagiert in Echtzeit, sobald das Scoring-Modell einen Lead als abschlussbereit einstuft.',
      },
      {
        kind: 'condition',
        title: 'Bedingung: Phase ≠ Gewonnen',
        detail: 'Bereits gewonnene Kunden lösen keinen Alarm aus.',
      },
      {
        kind: 'push',
        title: 'Push-Benachrichtigung',
        detail: 'Sofortige Meldung auf deinem Handy',
        body: '🔥 Heißer Lead: {{name}} ({{firma}}) – Score {{score}}. Angebot: {{angebot}}, Wert {{wert}}. Jetzt kontaktieren, solange das Interesse hoch ist.',
        stats: '100 % zugestellt',
      },
      {
        kind: 'whatsapp',
        title: 'WhatsApp an dich',
        detail: 'Backup-Kanal mit Direkt-Link ins CRM',
        body: 'Heißer Lead {{name}} wartet 👀 Score {{score}}/100. Profil öffnen: [CRM-Link] · Direkt anrufen: {{telefon}}',
        stats: '97 % gelesen',
      },
      {
        kind: 'task',
        title: 'Aufgabe: heute kontaktieren',
        detail: 'Legt eine priorisierte CRM-Aufgabe mit Fälligkeit „heute" an.',
      },
    ],
    runs: [
      { time: 'vor 1 Std.', lead: 'Jonas Weber', step: 'WhatsApp an dich', result: 'Erfolgreich' },
      { time: 'Heute, 07:58', lead: 'Julia Krämer', step: 'Push-Benachrichtigung', result: 'Erfolgreich' },
      { time: 'Gestern, 16:20', lead: 'Felix Brandt', step: 'Aufgabe: heute kontaktieren', result: 'Erfolgreich' },
    ],
    settings: {
      activeHours: 'Täglich 07:00–22:00',
      priority: 'Hoch',
      stopOnReply: false,
      channel: 'Push + WhatsApp',
    },
  },
  {
    id: 'a3',
    name: 'Content-Recycling',
    description: 'Verwandelt deinen besten Post der Woche automatisch in ein neues Reel-Skript.',
    trigger: 'Montags, 08:00',
    condition: 'Top-Post nach Reichweite',
    action: 'Reel-Skript + Caption generieren',
    status: 'Aktiv',
    runs30d: 4,
    timeSavedHours: 6,
    lastRun: 'Mo, 08:00',
    icon: 'content',
    metrics: [
      { label: 'Ausführungen', value: '4', hint: 'letzte 30 Tage' },
      { label: 'Skripte erstellt', value: '4', hint: 'zur Freigabe' },
      { label: 'Ø Zeitersparnis', value: '90 Min.', hint: 'pro Skript' },
      { label: 'Freigabequote', value: '75 %', hint: 'ohne große Edits' },
    ],
    steps: [
      { kind: 'trigger', title: 'Auslöser: Montags, 08:00', detail: 'Wöchentlicher Zeitplan, jeweils Montagmorgen.' },
      {
        kind: 'condition',
        title: 'Bedingung: Top-Post nach Reichweite',
        detail: 'Wählt automatisch den reichweitenstärksten Post der letzten 7 Tage aus.',
      },
      {
        kind: 'generate',
        title: 'Reel-Skript generieren',
        detail: 'KI schreibt ein 30-Sekunden-Skript in deiner Tonalität',
        body: 'HOOK (0–3s): „Der eine Fehler, der dich Kunden kostet …"\nAUFBAU (3–20s): 3 Punkte aus dem Top-Post, gekürzt & zugespitzt.\nCTA (20–30s): „Speicher dir das – und folge für Teil 2.\"\n\nCaption: Kurze Version + 5 passende Hashtags, automatisch aus deinem Nischen-Set gewählt.',
        stats: 'Entwurf wartet auf Freigabe',
      },
      {
        kind: 'task',
        title: 'Zur Freigabe vorlegen',
        detail: 'Legt das Skript in der Content-Engine als Entwurf an und benachrichtigt dich.',
      },
    ],
    runs: [
      { time: 'Mo, 08:00', lead: 'Post „5 KI-Tools\"', step: 'Reel-Skript generieren', result: 'Erfolgreich' },
      { time: '23. Jun, 08:00', lead: 'Post „Mein Setup\"', step: 'Reel-Skript generieren', result: 'Erfolgreich' },
    ],
    settings: {
      activeHours: 'Montags 08:00',
      priority: 'Normal',
      stopOnReply: false,
      channel: 'Content-Engine (Entwurf)',
    },
  },
  {
    id: 'a4',
    name: 'Rechnung bei Abschluss',
    description: 'Erstellt und versendet die Rechnung in dem Moment, in dem der Deal gewonnen ist.',
    trigger: 'Deal gewonnen',
    condition: 'Immer',
    action: 'Rechnung erstellen & senden',
    status: 'Aktiv',
    runs30d: 9,
    timeSavedHours: 3,
    lastRun: 'Gestern, 17:05',
    icon: 'invoice',
    metrics: [
      { label: 'Ausführungen', value: '9', hint: 'letzte 30 Tage' },
      { label: 'Ø Zahlungseingang', value: '3,2 Tage', hint: 'nach Versand' },
      { label: 'Fehlerquote', value: '0 %', hint: 'korrekte Rechnungen' },
      { label: 'Offen', value: '1', hint: 'noch unbezahlt' },
    ],
    steps: [
      {
        kind: 'trigger',
        title: 'Auslöser: Deal gewonnen',
        detail: 'Startet, sobald ein Lead in die Phase „Gewonnen" wandert.',
      },
      { kind: 'condition', title: 'Bedingung: Immer', detail: 'Gilt für jeden gewonnenen Deal ohne Ausnahme.' },
      {
        kind: 'invoice',
        title: 'Rechnung erstellen',
        detail: 'Zieht Betrag, Angebot und Kundendaten automatisch aus dem CRM',
        body: 'Rechnung Nr. {{nummer}}\nEmpfänger: {{name}}, {{firma}}\nPosition: {{angebot}}\nBetrag: {{wert}} (inkl. USt.)\nZahlungsziel: 14 Tage\n\nPDF wird automatisch erzeugt und im Kundenprofil abgelegt.',
        stats: 'PDF automatisch erzeugt',
      },
      {
        kind: 'email',
        title: 'Rechnung versenden',
        detail: 'Freundliche Begleit-Mail mit PDF im Anhang',
        subject: 'Deine Rechnung & die nächsten Schritte',
        body: 'Hi {{vorname}},\n\nfreut mich riesig, dass wir zusammenarbeiten! Im Anhang findest du deine Rechnung. Dein Onboarding startet automatisch – du bekommst gleich eine separate Mail mit allen Zugängen.\n\nAuf eine großartige Zusammenarbeit,\nViktor',
        stats: '100 % zugestellt',
      },
    ],
    runs: [
      { time: 'Gestern, 17:05', lead: 'Mia Lorenz', step: 'Rechnung versenden', result: 'Erfolgreich' },
      { time: '27. Jun, 20:12', lead: 'Paul Winter', step: 'Rechnung versenden', result: 'Erfolgreich' },
    ],
    settings: {
      activeHours: 'Rund um die Uhr',
      priority: 'Hoch',
      stopOnReply: false,
      channel: 'Rechnungssystem + E-Mail',
    },
  },
  {
    id: 'a5',
    name: 'No-Show Follow-up',
    description: 'Holt verpasste Calls zurück: sendet automatisch einen neuen Terminlink.',
    trigger: 'Call verpasst',
    condition: 'KI-Score ≥ 60',
    action: 'Neuen Terminlink senden',
    status: 'Pausiert',
    runs30d: 11,
    timeSavedHours: 2,
    lastRun: '28. Jun, 14:10',
    icon: 'chat',
    metrics: [
      { label: 'Ausführungen', value: '11', hint: 'letzte 30 Tage' },
      { label: 'Rückbuchungen', value: '6', hint: 'neuer Termin gebucht' },
      { label: 'Rückholquote', value: '55 %', hint: 'der No-Shows' },
      { label: 'Status', value: 'Pausiert', hint: 'aktuell inaktiv' },
    ],
    steps: [
      {
        kind: 'trigger',
        title: 'Auslöser: Call verpasst',
        detail: 'Startet, wenn ein gebuchter Termin ohne Erscheinen verstreicht.',
      },
      {
        kind: 'condition',
        title: 'Bedingung: KI-Score ≥ 60',
        detail: 'Nur bei Leads, bei denen sich ein zweiter Anlauf lohnt.',
      },
      {
        kind: 'email',
        title: 'Terminlink erneut senden · nach 15 Min.',
        detail: 'Ohne Vorwurf, mit direktem Rebooking-Link',
        subject: 'Verpasst? Kein Problem – neuer Termin in 30 Sek.',
        body: 'Hi {{vorname}},\n\nwir haben uns eben verpasst – passiert! Such dir einfach einen neuen Slot, der besser passt: [Kalender-Link]\n\nIch freu mich auf dich,\nViktor',
        stats: '71 % geöffnet · 38 % neu gebucht',
      },
      { kind: 'delay', title: 'Warte 2 Tage', detail: 'Wenn keine Neubuchung erfolgt, folgt eine letzte Erinnerung.' },
      {
        kind: 'whatsapp',
        title: 'WhatsApp-Erinnerung',
        detail: 'Letzter, persönlicher Anstoß',
        body: 'Hey {{vorname}}, wollen wir den Call nachholen? Hier dein Link: [Kalender]. Danach lass ich dich in Ruhe 🙂',
        stats: '64 % gelesen · 22 % gebucht',
      },
    ],
    runs: [
      { time: '28. Jun, 14:10', lead: 'David Roth', step: 'Terminlink erneut senden', result: 'Erfolgreich' },
      { time: '26. Jun, 11:30', lead: 'Anna Schmitt', step: 'WhatsApp-Erinnerung', result: 'Übersprungen' },
    ],
    settings: {
      activeHours: 'Werktags 09:00–19:00',
      priority: 'Normal',
      stopOnReply: true,
      channel: 'E-Mail + WhatsApp',
    },
  },
  {
    id: 'a6',
    name: 'Wochenreport',
    description: 'Fasst Umsatz, Leads und Content-Performance jeden Freitag für dich zusammen.',
    trigger: 'Freitags, 17:00',
    condition: 'Immer',
    action: 'Report generieren & mailen',
    status: 'Entwurf',
    runs30d: 0,
    timeSavedHours: 0,
    lastRun: '—',
    icon: 'report',
    metrics: [
      { label: 'Ausführungen', value: '0', hint: 'noch nicht aktiv' },
      { label: 'Status', value: 'Entwurf', hint: 'wartet auf Aktivierung' },
      { label: 'Geplant', value: 'Fr 17:00', hint: 'wöchentlich' },
      { label: 'Empfänger', value: '1', hint: 'du' },
    ],
    steps: [
      { kind: 'trigger', title: 'Auslöser: Freitags, 17:00', detail: 'Wöchentlicher Zeitplan zum Wochenabschluss.' },
      { kind: 'condition', title: 'Bedingung: Immer', detail: 'Läuft jede Woche, unabhängig von den Zahlen.' },
      {
        kind: 'report',
        title: 'Report generieren',
        detail: 'KI fasst die Woche in einer Seite zusammen',
        body: '📊 Deine Woche im Überblick:\n• Umsatz: {{umsatz}} ({{delta}} vs. Vorwoche)\n• Neue Leads: {{leads}} · davon {{heiss}} heiß\n• Bester Kanal: {{kanal}}\n• Top-Content: {{post}}\n\n💡 KI-Empfehlung der Woche: {{empfehlung}}',
        stats: 'Vorschau verfügbar',
      },
      {
        kind: 'email',
        title: 'Report mailen',
        detail: 'Sendet die Zusammenfassung an dein Postfach',
        subject: 'Deine Woche in Zahlen 📊',
        body: 'Anbei dein automatischer Wochenreport. Die 3 wichtigsten Punkte stehen ganz oben – der Rest ist zum Nachlesen.',
      },
    ],
    runs: [],
    settings: {
      activeHours: 'Freitags 17:00',
      priority: 'Niedrig',
      stopOnReply: false,
      channel: 'E-Mail',
    },
  },
];

export interface AutomationTemplate {
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  icon: AutomationIcon;
}

/* -------------------------------- Analytics ------------------------------- */

export type AnalyticsRangeKey = '7d' | '30d' | '90d';

export interface AnalyticsKpi {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

export interface FunnelStage {
  stage: string;
  value: number;
}

export interface ChannelRow {
  name: string;
  leads: number;
  conversion: number;
  revenue: number;
  deltaPct: number;
}

/** Deterministischer PRNG, damit Server- und Client-Render identisch sind. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'];

/** 90 Tage Lead-Trend, endet am 30. Juni: steigender Trend mit Wochenend-Dip. */
function buildLeadTrend(): RevenuePoint[] {
  const rand = mulberry32(42);
  const points: RevenuePoint[] = [];
  const end = new Date(2025, 5, 30);
  for (let i = 89; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(end.getDate() - i);
    const progress = (89 - i) / 89;
    const weekday = date.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.6 : 1;
    const base = (6 + progress * 10) * weekendDip;
    const value = Math.max(2, Math.round(base + (rand() - 0.5) * 4));
    points.push({ label: `${date.getDate()}. ${monthNames[date.getMonth()]}`, value });
  }
  return points;
}

const leadTrend90 = buildLeadTrend();

export const analyticsRanges: Record<
  AnalyticsRangeKey,
  {
    label: string;
    kpis: AnalyticsKpi[];
    leadTrend: RevenuePoint[];
    funnel: FunnelStage[];
    channels: ChannelRow[];
  }
> = {
  '7d': {
    label: 'Letzte 7 Tage',
    kpis: [
      { label: 'Neue Leads', value: '86', delta: '+9,2 %', up: true },
      { label: 'Conversion-Rate', value: '5,1 %', delta: '+0,4 Pkt.', up: true },
      { label: 'Ø Deal-Wert', value: '1.840 €', delta: '−120 €', up: false },
      { label: 'Umsatz pro Lead', value: '94 €', delta: '+6 €', up: true },
    ],
    leadTrend: leadTrend90.slice(-7),
    funnel: [
      { stage: 'Besucher', value: 4820 },
      { stage: 'Leads', value: 86 },
      { stage: 'Qualifiziert', value: 31 },
      { stage: 'Kunden', value: 4 },
    ],
    channels: [
      { name: 'Instagram', leads: 34, conversion: 5.8, revenue: 3400, deltaPct: 14 },
      { name: 'YouTube', leads: 21, conversion: 4.9, revenue: 2180, deltaPct: 6 },
      { name: 'Newsletter', leads: 16, conversion: 6.2, revenue: 1560, deltaPct: -3 },
      { name: 'Affiliates', leads: 9, conversion: 3.8, revenue: 740, deltaPct: 11 },
      { name: 'LinkedIn', leads: 6, conversion: 4.1, revenue: 520, deltaPct: 22 },
    ],
  },
  '30d': {
    label: 'Letzte 30 Tage',
    kpis: [
      { label: 'Neue Leads', value: '342', delta: '+12,4 %', up: true },
      { label: 'Conversion-Rate', value: '4,8 %', delta: '+0,6 Pkt.', up: true },
      { label: 'Ø Deal-Wert', value: '1.960 €', delta: '+140 €', up: true },
      { label: 'Umsatz pro Lead', value: '87 €', delta: '+11 €', up: true },
    ],
    leadTrend: leadTrend90.slice(-30),
    funnel: [
      { stage: 'Besucher', value: 19400 },
      { stage: 'Leads', value: 342 },
      { stage: 'Qualifiziert', value: 118 },
      { stage: 'Kunden', value: 16 },
    ],
    channels: [
      { name: 'Instagram', leads: 128, conversion: 5.2, revenue: 11200, deltaPct: 18 },
      { name: 'YouTube', leads: 86, conversion: 4.6, revenue: 7900, deltaPct: 9 },
      { name: 'Newsletter', leads: 64, conversion: 6.0, revenue: 5400, deltaPct: 4 },
      { name: 'Affiliates', leads: 41, conversion: 3.9, revenue: 2800, deltaPct: -5 },
      { name: 'LinkedIn', leads: 23, conversion: 4.3, revenue: 1900, deltaPct: 31 },
    ],
  },
  '90d': {
    label: 'Letzte 90 Tage',
    kpis: [
      { label: 'Neue Leads', value: '891', delta: '+28,7 %', up: true },
      { label: 'Conversion-Rate', value: '4,4 %', delta: '+1,1 Pkt.', up: true },
      { label: 'Ø Deal-Wert', value: '1.870 €', delta: '+220 €', up: true },
      { label: 'Umsatz pro Lead', value: '82 €', delta: '+19 €', up: true },
    ],
    leadTrend: leadTrend90,
    funnel: [
      { stage: 'Besucher', value: 52600 },
      { stage: 'Leads', value: 891 },
      { stage: 'Qualifiziert', value: 297 },
      { stage: 'Kunden', value: 39 },
    ],
    channels: [
      { name: 'Instagram', leads: 331, conversion: 4.9, revenue: 27800, deltaPct: 24 },
      { name: 'YouTube', leads: 224, conversion: 4.2, revenue: 19600, deltaPct: 15 },
      { name: 'Newsletter', leads: 168, conversion: 5.7, revenue: 13900, deltaPct: 8 },
      { name: 'Affiliates', leads: 102, conversion: 3.6, revenue: 6800, deltaPct: -2 },
      { name: 'LinkedIn', leads: 66, conversion: 4.0, revenue: 4700, deltaPct: 41 },
    ],
  },
};

export const heatmapDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const heatmapSlots = ['6–10', '10–14', '14–18', '18–24'];

/** Lead-Aufkommen pro Wochentag × Tageszeit (relativ, 0–1). */
export const leadHeatmap: number[][] = [
  [0.35, 0.7, 0.55, 0.85],
  [0.4, 0.75, 0.6, 0.8],
  [0.3, 0.65, 0.5, 0.7],
  [0.45, 0.8, 0.65, 0.9],
  [0.35, 0.6, 0.45, 0.65],
  [0.15, 0.3, 0.35, 0.5],
  [0.1, 0.25, 0.4, 1.0],
];

export const automationTemplates: AutomationTemplate[] = [
  {
    name: 'Webinar-Follow-up',
    description: 'Teilnehmer nach dem Webinar automatisch in dein Angebot führen.',
    trigger: 'Webinar beendet',
    condition: 'Teilnahme ≥ 30 Min.',
    action: 'Angebots-Sequenz starten',
    icon: 'mail',
  },
  {
    name: 'Warenkorb-Retter',
    description: 'Abgebrochene Käufe mit einer Erinnerung + Bonus zurückholen.',
    trigger: 'Checkout abgebrochen',
    condition: 'Warenkorb ≥ 100 €',
    action: 'Erinnerung nach 2 Std. senden',
    icon: 'invoice',
  },
  {
    name: 'Testimonial-Anfrage',
    description: 'Zufriedene Kunden automatisch um eine Bewertung bitten.',
    trigger: '30 Tage nach Kauf',
    condition: 'Kein offenes Ticket',
    action: 'Bewertungs-Anfrage senden',
    icon: 'chat',
  },
  {
    name: 'Re-Engagement',
    description: 'Inaktive Kontakte mit persönlichem Inhalt reaktivieren.',
    trigger: '90 Tage inaktiv',
    condition: 'Newsletter-Abonnent',
    action: 'Reaktivierungs-Mail senden',
    icon: 'lead',
  },
];

/* ----------------------------- Content-Engine ----------------------------- */

export const contentPlatforms = ['Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'Newsletter', 'Blog'] as const;
export type ContentPlatform = (typeof contentPlatforms)[number];

export const contentStatuses = ['Idee', 'Entwurf', 'Geplant', 'Veröffentlicht'] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export const contentFormats = ['Post', 'Reel', 'Karussell', 'Story', 'Video', 'Artikel', 'E-Mail'] as const;
export type ContentFormat = (typeof contentFormats)[number];

export const contentTones = ['Inspirierend', 'Direkt', 'Storytelling', 'Experte', 'Locker'] as const;
export type ContentTone = (typeof contentTones)[number];

export const weekdayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export interface ContentMetrics {
  reach: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: ContentPlatform;
  format: ContentFormat;
  status: ContentStatus;
  tone: ContentTone;
  body: string;
  hashtags: string[];
  /** 0 = Montag … 6 = Sonntag; für den Kalender. */
  weekday: number;
  time: string;
  dateLabel: string;
  aiGenerated: boolean;
  metrics?: ContentMetrics;
}

export const contentItems: ContentItem[] = [
  {
    id: 'c1',
    title: '5 KI-Tools, die dein Business 2026 verändern',
    platform: 'Instagram',
    format: 'Reel',
    status: 'Veröffentlicht',
    tone: 'Direkt',
    body: 'Diese 5 Tools sparen dir jede Woche 10+ Stunden 👇\n\n1. Dein Business OS für Leads & Follow-ups\n2. KI-Texter für Captions in deiner Stimme\n3. Auto-Scheduler für alle Kanäle\n4. Smart-Analytics mit Prognose\n5. Der KI-Assistent, der deine Zahlen kennt\n\nSpeicher dir das für später – und folge für Teil 2.',
    hashtags: ['#KIBusiness', '#Solopreneur', '#Automatisierung', '#OnlineBusiness', '#Produktivität'],
    weekday: 0,
    time: '18:00',
    dateLabel: 'Mo, 18:00',
    aiGenerated: true,
    metrics: { reach: 24800, likes: 1840, comments: 212, shares: 486 },
  },
  {
    id: 'c2',
    title: 'Warum 90 % der Coaches am Marketing scheitern',
    platform: 'LinkedIn',
    format: 'Post',
    status: 'Geplant',
    tone: 'Experte',
    body: 'Die meisten Coaches sind großartig in ihrem Handwerk – und unsichtbar im Markt.\n\nDer Grund ist selten das Angebot. Es ist ein fehlendes System, das aus Aufmerksamkeit planbar Kunden macht.\n\n3 Bausteine, die den Unterschied machen:\n→ Ein klares Signature-Angebot\n→ Content, der Vertrauen aufbaut\n→ Follow-ups, die nicht im Sande verlaufen\n\nWelchen dieser Bausteine baust du gerade aus?',
    hashtags: ['#Coaching', '#Marketing', '#Selbstständigkeit'],
    weekday: 2,
    time: '08:00',
    dateLabel: 'Mi, 08:00',
    aiGenerated: false,
  },
  {
    id: 'c3',
    title: 'Juli-Newsletter: Dein Content-System in 30 Minuten/Woche',
    platform: 'Newsletter',
    format: 'E-Mail',
    status: 'Entwurf',
    tone: 'Storytelling',
    body: 'Letzten Sonntag saß ich mit einem Kaffee da und habe meine komplette Woche an Content in 30 Minuten geplant.\n\nKein Stress, kein leeres Blatt. In dieser Ausgabe zeige ich dir mein System Schritt für Schritt …',
    hashtags: [],
    weekday: 3,
    time: '10:00',
    dateLabel: 'Do, 10:00',
    aiGenerated: true,
  },
  {
    id: 'c4',
    title: 'So baust du einen Funnel in 5 Schritten',
    platform: 'Instagram',
    format: 'Karussell',
    status: 'Geplant',
    tone: 'Direkt',
    body: 'Slide 1: Dein Funnel in 5 Schritten (speichern!)\nSlide 2: Lead-Magnet, der wirklich zieht\nSlide 3: Die Landingpage-Formel\nSlide 4: Die 4-teilige E-Mail-Sequenz\nSlide 5: Das Angebot, das konvertiert\nSlide 6: Folge für die Vorlagen 👉',
    hashtags: ['#Funnel', '#OnlineMarketing', '#DigitaleProdukte', '#Leadgenerierung'],
    weekday: 4,
    time: '17:30',
    dateLabel: 'Fr, 17:30',
    aiGenerated: true,
  },
  {
    id: 'c5',
    title: 'Mein komplettes KI-Setup 2026 (Full Walkthrough)',
    platform: 'YouTube',
    format: 'Video',
    status: 'Idee',
    tone: 'Experte',
    body: 'Idee: 12-Minuten-Walkthrough durch mein komplettes KI-Business-Setup. Vom Lead bis zur Rechnung – jedes Tool, jede Automation, live gezeigt.',
    hashtags: [],
    weekday: 1,
    time: '16:00',
    dateLabel: 'Di, 16:00',
    aiGenerated: false,
  },
  {
    id: 'c6',
    title: 'Der eine Fehler, der dich täglich Kunden kostet',
    platform: 'TikTok',
    format: 'Reel',
    status: 'Veröffentlicht',
    tone: 'Direkt',
    body: 'Du antwortest zu langsam.\n\nEin heißer Lead, der 24 Stunden wartet, ist ein kalter Lead. Lass eine Automation sofort reagieren – und du gewinnst Deals, die andere verlieren.',
    hashtags: ['#Sales', '#KI', '#Business'],
    weekday: 5,
    time: '19:00',
    dateLabel: 'Sa, 19:00',
    aiGenerated: true,
    metrics: { reach: 41200, likes: 3120, comments: 158, shares: 892 },
  },
  {
    id: 'c7',
    title: 'Case Study: Von 5k auf 20k MRR in 60 Tagen',
    platform: 'LinkedIn',
    format: 'Post',
    status: 'Veröffentlicht',
    tone: 'Storytelling',
    body: 'Vor 60 Tagen machte Sarah 5k im Monat – bei 60-Stunden-Wochen.\n\nHeute sind es 20k. Bei weniger Stunden.\n\nWas sich geändert hat? Nicht mehr Aufwand. Ein System, das Leads automatisch aufwärmt und nachfasst. Hier ist der Weg in 3 Schritten …',
    hashtags: ['#CaseStudy', '#Skalierung', '#Coaching'],
    weekday: 1,
    time: '09:00',
    dateLabel: 'Di, 09:00',
    aiGenerated: false,
    metrics: { reach: 18600, likes: 940, comments: 87, shares: 143 },
  },
];

export interface ContentIdea {
  title: string;
  platform: ContentPlatform;
  format: ContentFormat;
  angle: string;
}

/** KI-Themenvorschläge für den „Neuer Content"-Flow. */
export const contentIdeas: ContentIdea[] = [
  { title: '3 Denkfehler beim Preis für dein Angebot', platform: 'Instagram', format: 'Reel', angle: 'Aufklärung' },
  { title: 'Wie ich meine Woche in 30 Min. plane', platform: 'LinkedIn', format: 'Post', angle: 'Behind the Scenes' },
  { title: 'Der Onboarding-Ablauf, der Kunden begeistert', platform: 'Newsletter', format: 'E-Mail', angle: 'How-to' },
  { title: '5 Hooks, die auf jedem Kanal funktionieren', platform: 'TikTok', format: 'Reel', angle: 'Listicle' },
];

/* --- KI-Generierung (simuliert; später gegen echte Claude-API tauschbar) --- */

const hooksByTone: Record<ContentTone, string[]> = {
  Inspirierend: [
    'Stell dir vor, dein Business läuft – auch wenn du offline bist.',
    'Der eine Gedanke, der für mich alles verändert hat:',
    'Du bist näher an deinem Ziel, als du denkst. Hier ist der Beweis:',
  ],
  Direkt: [
    'Hör auf, {topic} dem Zufall zu überlassen.',
    'Die harte Wahrheit über {topic}:',
    '{topic} in 3 Schritten – ohne Bullshit:',
  ],
  Storytelling: [
    'Vor einem Jahr hätte ich bei {topic} fast aufgegeben.',
    'Letzte Woche passierte etwas, das meine Sicht auf {topic} verändert hat.',
    'Niemand hat mir das über {topic} gesagt – also sage ich es dir.',
  ],
  Experte: [
    'Die meisten verstehen {topic} falsch. Hier ist, was wirklich zählt:',
    'Was die Daten über {topic} zeigen, überrascht die meisten:',
    '{topic} ist kein Glück. Es ist ein System. So sieht es aus:',
  ],
  Locker: [
    'Okay, lass uns kurz über {topic} reden ☕',
    'Kleiner Realtalk zu {topic}:',
    'Ich wünschte, jemand hätte mir das über {topic} früher gesagt:',
  ],
};

const bodyTemplates = [
  'Die meisten machen {topic} viel zu kompliziert. Dabei brauchst du nur drei Dinge: Klarheit, ein System und Dranbleiben.\n\n→ Klarheit: Wisse genau, für wen du das tust.\n→ System: Baue es einmal, nutze es täglich.\n→ Dranbleiben: Kleine Schritte schlagen große Sprünge.',
  'Ich habe {topic} lange dem Zufall überlassen. Der Wendepunkt kam, als ich anfing, es zu systematisieren.\n\nHeute läuft vieles automatisch – und ich kann mich auf das konzentrieren, was nur ich tun kann.',
  'Kurz und ehrlich: {topic} entscheidet oft über Wachstum oder Stillstand.\n\nDer Hebel ist nicht mehr Aufwand, sondern bessere Systeme. Genau dafür ist ein Business OS gemacht.',
];

const ctasByPlatform: Record<ContentPlatform, string> = {
  Instagram: 'Speicher dir das 📌 und folge für mehr.',
  LinkedIn: 'Wie handhabst du das? Schreib es in die Kommentare.',
  YouTube: 'Das komplette Tutorial gibt es im Video – Link in der Beschreibung.',
  TikTok: 'Folge für Teil 2 👀',
  Newsletter: 'Antworte einfach auf diese Mail – ich lese jede persönlich.',
  Blog: 'Den vollständigen Guide findest du im Artikel.',
};

const hashtagPool = [
  '#Solopreneur',
  '#OnlineBusiness',
  '#KIBusiness',
  '#Automatisierung',
  '#Marketing',
  '#Produktivität',
  '#Coaching',
  '#Creator',
  '#DigitaleProdukte',
  '#Selbstständigkeit',
  '#Sales',
  '#ContentStrategie',
];

export interface GeneratedVariant {
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

/** Baut einen vollständigen Post-Text aus einer generierten Variante. */
export function variantToBody(v: GeneratedVariant): string {
  return `${v.hook}\n\n${v.body}\n\n${v.cta}`;
}

/**
 * Simulierte KI-Content-Generierung. Erzeugt aus Thema, Tonalität und Plattform
 * mehrere Varianten. Deterministisch pro Aufruf-Argumenten, damit Tests stabil sind.
 * Später 1:1 durch einen Claude-API-Aufruf ersetzbar.
 */
export function generateVariants(
  topic: string,
  tone: ContentTone,
  platform: ContentPlatform,
  count = 3,
): GeneratedVariant[] {
  const cleanTopic = topic.trim() || 'dein Angebot';
  const hooks = hooksByTone[tone];
  const cta = ctasByPlatform[platform];
  const variants: GeneratedVariant[] = [];
  for (let i = 0; i < count; i++) {
    const hook = hooks[i % hooks.length].replaceAll('{topic}', cleanTopic);
    const body = bodyTemplates[i % bodyTemplates.length].replaceAll('{topic}', cleanTopic);
    const tags = hashtagPool.slice(i * 2, i * 2 + 4);
    variants.push({ hook, body, cta, hashtags: tags });
  }
  return variants;
}

/** Kurze KI-Umschreibungen für den Editor (Aktion-Buttons). */
export function rewriteBody(body: string, mode: 'kürzer' | 'länger' | 'lockerer'): string {
  const trimmed = body.trim();
  if (mode === 'kürzer') {
    const firstBlock = trimmed.split('\n\n')[0];
    return `${firstBlock}\n\n(gekürzt von der KI – auf den Punkt gebracht)`;
  }
  if (mode === 'länger') {
    return `${trimmed}\n\nP.S.: Wenn du tiefer einsteigen willst – ich habe dazu eine komplette Vorlage vorbereitet, die dir den Start abnimmt.`;
  }
  return trimmed.replaceAll('.', ' 🙂').replace(/\s+🙂/g, ' 🙂');
}
