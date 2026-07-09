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
