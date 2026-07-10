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
