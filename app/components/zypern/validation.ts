import {
  budgetOptions,
  contactPreferenceOptions,
  financingOptions,
  propertyTypeOptions,
  purposeOptions,
  regionOptions,
  timelineOptions,
  visitedOptions,
} from './config';
import type { BuyingProfile, ContactData } from './scoring';

/** Häufige Wegwerf-Domains. Erweiterbar; serverseitig zusätzlich MX-Prüfung. */
const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.de',
  '10minutemail.com',
  'trashmail.com',
  'trashmail.de',
  'wegwerfmail.de',
  'temp-mail.org',
  'yopmail.com',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'spambog.com',
  'einrot.com',
  'muellmail.com',
];

const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function validateEmail(raw: string): string | null {
  const email = raw.trim();
  if (!email) {
    return 'Bitte geben Sie Ihre E-Mail-Adresse an.';
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return 'Bitte prüfen Sie die E-Mail-Adresse.';
  }
  const domain = email.split('@')[1].toLowerCase();
  if (!/\.[a-z]{2,}$/.test(domain)) {
    return 'Bitte prüfen Sie die E-Mail-Adresse.';
  }
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return 'Bitte verwenden Sie eine dauerhaft erreichbare E-Mail-Adresse.';
  }
  return null;
}

/**
 * Normalisiert eine Telefonnummer auf +<Ländervorwahl><Nummer>.
 * `countryCode` ist z. B. '+49' oder 'other' (dann muss die Nummer mit + oder 00 beginnen).
 */
export function normalizePhone(countryCode: string, raw: string): string {
  let digits = raw.trim().replace(/[\s()./-]/g, '');
  if (digits.startsWith('00')) {
    digits = `+${digits.slice(2)}`;
  }
  if (digits.startsWith('+')) {
    return `+${digits.slice(1).replace(/\D/g, '')}`;
  }
  if (countryCode === 'other') {
    return digits.replace(/\D/g, '');
  }
  // Führende 0 der nationalen Vorwahl entfällt (0170… → +49170…)
  return `${countryCode}${digits.replace(/\D/g, '').replace(/^0+/, '')}`;
}

export function validatePhone(normalized: string, required: boolean): string | null {
  if (!normalized || normalized === '+') {
    return required ? 'Bitte geben Sie eine Mobilnummer an, unter der wir Sie erreichen.' : null;
  }
  if (!normalized.startsWith('+')) {
    return 'Bitte geben Sie die Nummer mit Ländervorwahl an, z. B. +49 170 1234567.';
  }
  const digits = normalized.slice(1);
  if (!/^\d{8,15}$/.test(digits)) {
    return 'Bitte prüfen Sie die Telefonnummer.';
  }
  const national = digits.replace(/^(49|43|41|357|352|423)/, '');
  if (/^(\d)\1+$/.test(national) || '1234567890123'.includes(national) || '9876543210'.includes(national)) {
    return 'Bitte prüfen Sie die Telefonnummer.';
  }
  const minNational: Record<string, number> = { '49': 7, '43': 6, '41': 9, '357': 8 };
  for (const [code, min] of Object.entries(minNational)) {
    if (digits.startsWith(code) && digits.length - code.length < min) {
      return 'Die Telefonnummer ist zu kurz.';
    }
  }
  return null;
}

export function validateName(raw: string, label: string): string | null {
  const name = raw.trim();
  if (name.length < 2) {
    return `Bitte geben Sie Ihren ${label} an.`;
  }
  if (name.length > 60 || /[0-9@<>{}[\]\\/]|https?:/i.test(name)) {
    return `Bitte prüfen Sie Ihren ${label}.`;
  }
  return null;
}

export type ContactErrors = Partial<Record<keyof ContactData | 'privacy', string>>;

export function validateContact(contact: ContactData, opts: { phoneRequired: boolean; privacy: boolean }) {
  const errors: ContactErrors = {};
  const first = validateName(contact.firstName, 'Vornamen');
  const last = validateName(contact.lastName, 'Nachnamen');
  const email = validateEmail(contact.email);
  const phone = validatePhone(contact.phone, opts.phoneRequired);
  if (first) {
    errors.firstName = first;
  }
  if (last) {
    errors.lastName = last;
  }
  if (email) {
    errors.email = email;
  }
  if (phone) {
    errors.phone = phone;
  }
  if (!contactPreferenceOptions.some((o) => o.value === contact.contactPreference)) {
    errors.contactPreference = 'Bitte wählen Sie eine Kontaktart.';
  }
  if (!opts.privacy) {
    errors.privacy = 'Bitte bestätigen Sie die Datenschutzhinweise.';
  }
  if (!errors.phone && !contact.phone && contact.contactPreference !== 'email') {
    errors.phone = 'Für Telefon, WhatsApp oder Video-Call benötigen wir Ihre Nummer.';
  }
  return errors;
}

function isOneOf(options: readonly { value: string }[], value: unknown) {
  return typeof value === 'string' && options.some((o) => o.value === value);
}

/** Prüft ein Kaufprofil aus einem nicht vertrauenswürdigen Request. */
export function parseProfile(input: unknown): BuyingProfile | null {
  if (!input || typeof input !== 'object') {
    return null;
  }
  const p = input as Record<string, unknown>;
  const required =
    isOneOf(purposeOptions, p.purpose) &&
    isOneOf(regionOptions, p.region) &&
    isOneOf(propertyTypeOptions, p.propertyType) &&
    isOneOf(budgetOptions, p.budget) &&
    isOneOf(timelineOptions, p.timeline);
  if (!required) {
    return null;
  }
  if (p.financing !== undefined && !isOneOf(financingOptions, p.financing)) {
    return null;
  }
  if (p.visited !== undefined && !isOneOf(visitedOptions, p.visited)) {
    return null;
  }
  return {
    purpose: p.purpose,
    region: p.region,
    propertyType: p.propertyType,
    budget: p.budget,
    timeline: p.timeline,
    financing: p.financing,
    visited: p.visited,
  } as BuyingProfile;
}
