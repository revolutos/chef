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

export interface CrmLead {
  id: string;
  name: string;
  company: string;
  email: string;
  offer: string;
  source: CrmSource;
  stage: CrmStage;
  value: number;
  /** KI-Lead-Score 0–100 */
  score: number;
  lastActivity: string;
  nextAction: string;
  notes: string;
}

export const crmLeads: CrmLead[] = [
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

/* ------------------------------ Automationen ------------------------------ */

export type AutomationStatus = 'Aktiv' | 'Pausiert' | 'Entwurf';

export type AutomationIcon = 'mail' | 'lead' | 'content' | 'invoice' | 'chat' | 'report';

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
