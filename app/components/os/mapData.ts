/**
 * Statische Demo-Daten für das Experten-Karten-Portal (REVOLUTOS KI Business OS).
 * Kein Backend nötig — Positionen, Experten, Events und Referral-Werte sind
 * bewusst simuliert und in einer späteren Ausbaustufe durch echte Daten ersetzbar.
 */

export const expertRoles = ['Setter', 'Closer', 'Terminierer', 'Opener'] as const;
export type ExpertRole = (typeof expertRoles)[number];

export type Availability = 'Sofort verfügbar' | 'In 2 Wochen' | 'Ausgebucht';
export type WorkMode = 'Remote' | 'Vor Ort' | 'Hybrid';
export type PlanTier = 'Free' | 'Pro' | 'Elite';

/**
 * Städte mit Positionen auf den beiden stilisierten Karten-Ansichten.
 * `dach` = DACH-Nahansicht, `world` = Weltweit-Ansicht (Prozent-Koordinaten 0–100).
 */
export interface MapCity {
  city: string;
  country: 'DE' | 'AT' | 'CH' | 'AE' | 'ES';
  dach: { x: number; y: number };
  world: { x: number; y: number };
}

export const cities: Record<string, MapCity> = {
  Berlin: { city: 'Berlin', country: 'DE', dach: { x: 63, y: 30 }, world: { x: 52.5, y: 33 } },
  Hamburg: { city: 'Hamburg', country: 'DE', dach: { x: 48, y: 20 }, world: { x: 51.5, y: 31 } },
  München: { city: 'München', country: 'DE', dach: { x: 52, y: 72 }, world: { x: 52, y: 36 } },
  Köln: { city: 'Köln', country: 'DE', dach: { x: 26, y: 46 }, world: { x: 50.8, y: 33.5 } },
  Frankfurt: { city: 'Frankfurt', country: 'DE', dach: { x: 36, y: 52 }, world: { x: 51.3, y: 34.5 } },
  Stuttgart: { city: 'Stuttgart', country: 'DE', dach: { x: 38, y: 66 }, world: { x: 51.4, y: 35.5 } },
  Wien: { city: 'Wien', country: 'AT', dach: { x: 78, y: 74 }, world: { x: 54, y: 36 } },
  Zürich: { city: 'Zürich', country: 'CH', dach: { x: 34, y: 80 }, world: { x: 51, y: 37 } },
  Dubai: { city: 'Dubai', country: 'AE', dach: { x: 92, y: 92 }, world: { x: 64, y: 46 } },
  Mallorca: { city: 'Palma', country: 'ES', dach: { x: 8, y: 92 }, world: { x: 48.5, y: 41 } },
};

export interface Expert {
  id: string;
  name: string;
  initials: string;
  role: ExpertRole;
  cityKey: keyof typeof cities;
  region: string;
  rating: number;
  reviews: number;
  priceMin: number;
  priceMax: number;
  availability: Availability;
  workMode: WorkMode;
  languages: string[];
  plan: PlanTier;
  verified: boolean;
  headline: string;
  bio: string;
  skills: string[];
  stats: { deals: string; closeRate: string; volume: string };
  /** Kontakt ist für Unternehmen erst nach Freischaltung sichtbar. */
  contact: { email: string; phone: string };
}

export const experts: Expert[] = [
  {
    id: 'e1',
    name: 'Jonas Weber',
    initials: 'JW',
    role: 'Closer',
    cityKey: 'Berlin',
    region: 'Berlin',
    rating: 4.9,
    reviews: 127,
    priceMin: 15,
    priceMax: 20,
    availability: 'Sofort verfügbar',
    workMode: 'Remote',
    languages: ['Deutsch', 'Englisch'],
    plan: 'Elite',
    verified: true,
    headline: 'High-Ticket Closer für Coaching & Agenturen',
    bio: 'Über 4 Jahre Erfahrung im High-Ticket-Vertrieb. Spezialisiert auf 5.000–25.000 € Angebote im Coaching- und Agentur-Umfeld. Provisionsbasiert oder Fixum + Provision.',
    skills: ['High-Ticket', 'Zoom-Closing', 'Einwandbehandlung', 'Coaching-Nische'],
    stats: { deals: '340+', closeRate: '38 %', volume: '2,4 Mio €' },
    contact: { email: 'jonas.weber@example.com', phone: '+49 151 2345678' },
  },
  {
    id: 'e2',
    name: 'Lea Hoffmann',
    initials: 'LH',
    role: 'Setter',
    cityKey: 'München',
    region: 'München',
    rating: 4.8,
    reviews: 94,
    priceMin: 8,
    priceMax: 12,
    availability: 'Sofort verfügbar',
    workMode: 'Remote',
    languages: ['Deutsch'],
    plan: 'Pro',
    verified: true,
    headline: 'Appointment Setter — volle Kalender in 30 Tagen',
    bio: 'DM- und E-Mail-Setting für Info-Produkte und SaaS. Ich fülle Kalender mit qualifizierten Terminen, damit deine Closer nur noch abschließen.',
    skills: ['DM-Setting', 'Instagram', 'CRM-Pflege', 'Qualifizierung'],
    stats: { deals: '1.200+ Termine', closeRate: '22 % Show', volume: '—' },
    contact: { email: 'lea.hoffmann@example.com', phone: '+49 160 9876543' },
  },
  {
    id: 'e3',
    name: 'Marco Bauer',
    initials: 'MB',
    role: 'Terminierer',
    cityKey: 'Hamburg',
    region: 'Hamburg',
    rating: 4.7,
    reviews: 61,
    priceMin: 6,
    priceMax: 10,
    availability: 'In 2 Wochen',
    workMode: 'Hybrid',
    languages: ['Deutsch', 'Englisch'],
    plan: 'Pro',
    verified: false,
    headline: 'B2B-Terminierung für Vertriebsteams',
    bio: 'Kalt-Akquise am Telefon und per LinkedIn für erklärungsbedürftige B2B-Produkte. Termine mit Entscheidern, nicht mit Gatekeepern.',
    skills: ['Kaltakquise', 'LinkedIn', 'B2B', 'Telefon'],
    stats: { deals: '800+ Termine', closeRate: '31 % Show', volume: '—' },
    contact: { email: 'marco.bauer@example.com', phone: '+49 170 1112233' },
  },
  {
    id: 'e4',
    name: 'Sophie Klein',
    initials: 'SK',
    role: 'Closer',
    cityKey: 'Wien',
    region: 'Wien',
    rating: 5.0,
    reviews: 152,
    priceMin: 18,
    priceMax: 25,
    availability: 'Ausgebucht',
    workMode: 'Remote',
    languages: ['Deutsch', 'Englisch'],
    plan: 'Elite',
    verified: true,
    headline: 'Premium-Closerin für Finanz- & Immobilien-Angebote',
    bio: 'Abschlüsse im gehobenen Preissegment. Ruhige, beratende Gesprächsführung mit hoher Abschlussquote bei anspruchsvollen Zielgruppen.',
    skills: ['Finanzvertrieb', 'Immobilien', 'Consultative Selling', 'Follow-up'],
    stats: { deals: '410+', closeRate: '41 %', volume: '5,1 Mio €' },
    contact: { email: 'sophie.klein@example.com', phone: '+43 660 4455667' },
  },
  {
    id: 'e5',
    name: 'David Richter',
    initials: 'DR',
    role: 'Opener',
    cityKey: 'Frankfurt',
    region: 'Frankfurt',
    rating: 4.6,
    reviews: 48,
    priceMin: 7,
    priceMax: 11,
    availability: 'Sofort verfügbar',
    workMode: 'Remote',
    languages: ['Deutsch'],
    plan: 'Pro',
    verified: false,
    headline: 'Opener & Erstkontakt-Spezialist',
    bio: 'Ich eröffne Gespräche, die andere nicht führen. Erstansprache über Cold-DM und Voice-Notes mit hoher Antwortrate.',
    skills: ['Cold-DM', 'Voice-Notes', 'Copywriting', 'Nische Fitness'],
    stats: { deals: '600+ Erstkontakte', closeRate: '18 % Reply', volume: '—' },
    contact: { email: 'david.richter@example.com', phone: '+49 152 7788990' },
  },
  {
    id: 'e6',
    name: 'Nina Schulz',
    initials: 'NS',
    role: 'Setter',
    cityKey: 'Köln',
    region: 'Köln',
    rating: 4.8,
    reviews: 73,
    priceMin: 9,
    priceMax: 13,
    availability: 'Sofort verfügbar',
    workMode: 'Remote',
    languages: ['Deutsch', 'Englisch'],
    plan: 'Elite',
    verified: true,
    headline: 'Setterin für Agenturen & Dienstleister',
    bio: 'Struktur, Skripte und CRM-Disziplin. Ich baue Setting-Prozesse auf, die auch nach mir weiterlaufen.',
    skills: ['Prozessaufbau', 'Skripting', 'HubSpot', 'Team-Onboarding'],
    stats: { deals: '900+ Termine', closeRate: '26 % Show', volume: '—' },
    contact: { email: 'nina.schulz@example.com', phone: '+49 151 3344556' },
  },
  {
    id: 'e7',
    name: 'Tobias Wolf',
    initials: 'TW',
    role: 'Closer',
    cityKey: 'Stuttgart',
    region: 'Stuttgart',
    rating: 4.5,
    reviews: 39,
    priceMin: 12,
    priceMax: 16,
    availability: 'In 2 Wochen',
    workMode: 'Vor Ort',
    languages: ['Deutsch'],
    plan: 'Free',
    verified: false,
    headline: 'Closer für Solar & Handwerk (Vor-Ort)',
    bio: 'Abschlüsse im Direktvertrieb — Solar, Wärmepumpe, Sanierung. Vor-Ort-Termine mit klarer Bedarfsanalyse.',
    skills: ['Solar', 'D2D', 'Bedarfsanalyse', 'Finanzierung'],
    stats: { deals: '250+', closeRate: '29 %', volume: '1,1 Mio €' },
    contact: { email: 'tobias.wolf@example.com', phone: '+49 176 2233445' },
  },
  {
    id: 'e8',
    name: 'Elena Fischer',
    initials: 'EF',
    role: 'Closer',
    cityKey: 'Dubai',
    region: 'Dubai (DE-sprachig)',
    rating: 4.9,
    reviews: 88,
    priceMin: 20,
    priceMax: 30,
    availability: 'Sofort verfügbar',
    workMode: 'Remote',
    languages: ['Deutsch', 'Englisch'],
    plan: 'Elite',
    verified: true,
    headline: 'Remote-Closerin für DACH-Kunden aus Dubai',
    bio: 'Deutschsprachige Closerin mit Fokus auf Online-Business und Mentoring-Programme. Zeitzonen-flexibel für DACH.',
    skills: ['Online-Business', 'Mentoring', 'High-Ticket', 'Remote'],
    stats: { deals: '300+', closeRate: '36 %', volume: '3,2 Mio €' },
    contact: { email: 'elena.fischer@example.com', phone: '+971 50 1234567' },
  },
  {
    id: 'e9',
    name: 'Paul Meyer',
    initials: 'PM',
    role: 'Terminierer',
    cityKey: 'Zürich',
    region: 'Zürich',
    rating: 4.7,
    reviews: 55,
    priceMin: 10,
    priceMax: 15,
    availability: 'Sofort verfügbar',
    workMode: 'Hybrid',
    languages: ['Deutsch', 'Englisch', 'Französisch'],
    plan: 'Pro',
    verified: true,
    headline: 'Terminierer für Schweizer KMU',
    bio: 'Terminierung für erklärungsbedürftige Dienstleistungen im DACH-Raum mit Fokus Schweiz. Sauberes Reporting inklusive.',
    skills: ['KMU', 'Reporting', 'Telefon', 'LinkedIn'],
    stats: { deals: '500+ Termine', closeRate: '33 % Show', volume: '—' },
    contact: { email: 'paul.meyer@example.com', phone: '+41 79 5566778' },
  },
  {
    id: 'e10',
    name: 'Carla Vogt',
    initials: 'CV',
    role: 'Setter',
    cityKey: 'Berlin',
    region: 'Berlin',
    rating: 4.6,
    reviews: 42,
    priceMin: 8,
    priceMax: 11,
    availability: 'Sofort verfügbar',
    workMode: 'Remote',
    languages: ['Deutsch'],
    plan: 'Pro',
    verified: false,
    headline: 'Setterin für Info-Produkte & Kurse',
    bio: 'DM-Setting für digitale Produkte. Ich qualifiziere hart, damit Closer keine Zeit verlieren.',
    skills: ['DM-Setting', 'Info-Produkte', 'Qualifizierung', 'Instagram'],
    stats: { deals: '700+ Termine', closeRate: '24 % Show', volume: '—' },
    contact: { email: 'carla.vogt@example.com', phone: '+49 157 8899001' },
  },
  {
    id: 'e11',
    name: 'Felix Braun',
    initials: 'FB',
    role: 'Opener',
    cityKey: 'München',
    region: 'München',
    rating: 4.4,
    reviews: 27,
    priceMin: 6,
    priceMax: 9,
    availability: 'Ausgebucht',
    workMode: 'Remote',
    languages: ['Deutsch', 'Englisch'],
    plan: 'Free',
    verified: false,
    headline: 'Opener für SaaS & Tech',
    bio: 'Erstansprache für Tech-Zielgruppen. Datengetrieben, mit A/B-getesteten Openern.',
    skills: ['SaaS', 'Cold-Email', 'A/B-Tests', 'Tech'],
    stats: { deals: '450+ Erstkontakte', closeRate: '15 % Reply', volume: '—' },
    contact: { email: 'felix.braun@example.com', phone: '+49 151 6677889' },
  },
  {
    id: 'e12',
    name: 'Mara König',
    initials: 'MK',
    role: 'Closer',
    cityKey: 'Mallorca',
    region: 'Mallorca (DE-sprachig)',
    rating: 4.8,
    reviews: 64,
    priceMin: 16,
    priceMax: 22,
    availability: 'In 2 Wochen',
    workMode: 'Remote',
    languages: ['Deutsch', 'Englisch', 'Spanisch'],
    plan: 'Elite',
    verified: true,
    headline: 'Remote-Closerin für Coaching-Programme',
    bio: 'Deutschsprachige Closerin für hochpreisige Coaching- und Mastermind-Angebote. Empathisch, strukturiert, abschlussstark.',
    skills: ['Coaching', 'Mastermind', 'High-Ticket', 'Remote'],
    stats: { deals: '360+', closeRate: '39 %', volume: '2,8 Mio €' },
    contact: { email: 'mara.koenig@example.com', phone: '+34 600 112233' },
  },
];

export type EventFormat = 'Live vor Ort' | 'Zoom-Call' | 'Hybrid';

export interface MapEvent {
  id: string;
  title: string;
  format: EventFormat;
  cityKey: keyof typeof cities;
  region: string;
  date: string;
  time: string;
  host: string;
  attendees: number;
  capacity: number;
  price: number;
  description: string;
}

export const mapEvents: MapEvent[] = [
  {
    id: 'ev1',
    title: 'Closer-Networking Berlin',
    format: 'Live vor Ort',
    cityKey: 'Berlin',
    region: 'Berlin · Mitte',
    date: 'Do, 28. Aug 2026',
    time: '19:00 Uhr',
    host: 'REVOLUTOS Community',
    attendees: 42,
    capacity: 60,
    price: 0,
    description:
      'Offline-Meetup für Setter, Closer und Unternehmer. Locker vernetzen, echte Cases teilen, neue Projekte finden.',
  },
  {
    id: 'ev2',
    title: 'High-Ticket Closing Masterclass',
    format: 'Zoom-Call',
    cityKey: 'München',
    region: 'Online · DACH',
    date: 'Di, 2. Sep 2026',
    time: '18:30 Uhr',
    host: 'Jonas Weber',
    attendees: 118,
    capacity: 200,
    price: 0,
    description:
      'Live-Zoom mit Einwandbehandlung, Preisverankerung und Follow-up-Sequenzen. Aufzeichnung für Teilnehmer inklusive.',
  },
  {
    id: 'ev3',
    title: 'Vertriebs-Stammtisch Wien',
    format: 'Hybrid',
    cityKey: 'Wien',
    region: 'Wien · 1. Bezirk + Online',
    date: 'Fr, 5. Sep 2026',
    time: '17:00 Uhr',
    host: 'Sophie Klein',
    attendees: 28,
    capacity: 45,
    price: 15,
    description:
      'Hybrid-Event für den österreichischen Sales-Markt. Vor Ort oder per Stream dabei — Q&A für beide Gruppen.',
  },
];

export interface PlanOption {
  tier: PlanTier;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

export const expertPlans: PlanOption[] = [
  {
    tier: 'Free',
    price: '0 €',
    cadence: 'für immer',
    tagline: 'Profil anlegen & ausprobieren',
    features: [
      'Profil erstellen',
      'Auf der Karte unsichtbar',
      'Keine Anfragen empfangbar',
      'Community-Events sichtbar',
    ],
  },
  {
    tier: 'Pro',
    price: '39 €',
    cadence: 'pro Monat',
    tagline: 'Sichtbar werden & Anfragen erhalten',
    features: ['Sichtbar auf der Karte', 'Anfragen von Unternehmen', 'Bis 6 Portfolio-Slots', 'Event-Zugang'],
    highlighted: true,
  },
  {
    tier: 'Elite',
    price: '99 €',
    cadence: 'pro Monat',
    tagline: 'Top-Platzierung & Verifizierung',
    features: ['Top-Placement im Filter', '„Verifiziert"-Badge', 'Unbegrenztes Portfolio', 'Priorisierter Support'],
  },
];

export interface CreditPack {
  id: string;
  credits: number;
  price: string;
  perUnlock: string;
  tagline: string;
  highlighted?: boolean;
}

export const creditPacks: CreditPack[] = [
  { id: 'c1', credits: 5, price: '49 €', perUnlock: '9,80 € / Freischaltung', tagline: 'Zum Testen' },
  {
    id: 'c2',
    credits: 20,
    price: '149 €',
    perUnlock: '7,45 € / Freischaltung',
    tagline: 'Beliebt bei Agenturen',
    highlighted: true,
  },
  { id: 'c3', credits: 50, price: '299 €', perUnlock: '5,98 € / Freischaltung', tagline: 'Für aktive Teams' },
];

export interface ReferralProgram {
  id: 'expert' | 'company';
  audience: string;
  motive: string;
  reward: string;
  code: string;
  invited: number;
  qualified: number;
  earned: string;
  steps: string[];
}

export const referralPrograms: ReferralProgram[] = [
  {
    id: 'expert',
    audience: 'Für Experten',
    motive: 'Mehr Jobs, Projekte & Umsatz',
    reward: '1 Monat Pro gratis + Ranking-Boost pro geworbenem Experten',
    code: 'JONAS-EXPERT',
    invited: 8,
    qualified: 3,
    earned: '3 Gratis-Monate',
    steps: [
      'Teile deinen Einladungslink mit anderen Settern & Closern.',
      'Sie registrieren sich und buchen einen Pro-Plan.',
      'Ihr bekommt beide 1 Gratis-Monat + Ranking-Boost.',
    ],
  },
  {
    id: 'company',
    audience: 'Für Unternehmen',
    motive: 'Bessere Experten schneller finden',
    reward: '5 Gratis-Unlock-Credits pro geworbenem Unternehmen',
    code: 'ACME-VENDOR',
    invited: 4,
    qualified: 2,
    earned: '10 Gratis-Credits',
    steps: [
      'Teile deinen Einladungslink mit anderen Unternehmen.',
      'Sie registrieren sich und schalten den ersten Experten frei.',
      'Ihr bekommt beide 5 Freischalt-Credits gutgeschrieben.',
    ],
  },
];
