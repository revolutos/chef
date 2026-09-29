import { describe, expect, test } from 'vitest';
import { nextQuestion, progress } from './assistant';
import { scoreLead, type BuyingProfile, type ContactData } from './scoring';
import { normalizePhone, parseProfile, validateEmail, validatePhone } from './validation';

const strongProfile: BuyingProfile = {
  purpose: 'self_use',
  region: 'paphos',
  propertyType: 'apartment',
  budget: 'b_250_400',
  timeline: 'm0_3',
  financing: 'equity',
  visited: 'yes',
};

const contact: ContactData = {
  firstName: 'Anna',
  lastName: 'Muster',
  email: 'anna@example.de',
  phone: '+491701234567',
  contactPreference: 'phone',
};

describe('scoreLead', () => {
  test('klare Kaufabsicht mit Budget, Zeitplan und Telefon ist ein A-Lead mit Terminangebot', () => {
    const result = scoreLead(strongProfile, contact);
    expect(result.tier).toBe('A');
    expect(result.nextStep).toBe('booking');
  });

  test('Kauf in 6–12 Monaten wird auf B begrenzt', () => {
    const result = scoreLead({ ...strongProfile, timeline: 'm6_12' }, contact);
    expect(result.tier).toBe('B');
    expect(result.nextStep).toBe('booking_optional');
  });

  test('„ich informiere mich zunächst“ ist immer C und bekommt keinen Termin', () => {
    const result = scoreLead({ ...strongProfile, timeline: 'info' }, contact);
    expect(result.tier).toBe('C');
    expect(result.nextStep).toBe('confirmation');
  });

  test('offene Finanzierung verhindert A', () => {
    expect(scoreLead({ ...strongProfile, financing: 'open' }, contact).tier).toBe('B');
  });

  test('nur E-Mail-Kontakt verhindert A', () => {
    expect(scoreLead(strongProfile, { ...contact, contactPreference: 'email' }).tier).toBe('B');
  });

  test('Besuch auf Zypern mit Besichtigungswunsch hat höchste Priorität', () => {
    const result = scoreLead({ ...strongProfile, timeline: 'm6_12' }, contact, { next_step: 'viewing_now' });
    expect(result.priority).toBe('highest');
    expect(result.nextStep).toBe('booking');
  });

  test('kurze Funnel-Variante ohne Finanzierung/Besichtigung kann A erreichen', () => {
    const { financing: _f, visited: _v, ...short } = strongProfile;
    expect(scoreLead(short, contact).tier).toBe('A');
  });

  test('Makler-Domains werden zur Prüfung markiert', () => {
    const result = scoreLead(strongProfile, { ...contact, email: 'info@zypern-immobilien-xy.de' });
    expect(result.flags).toContain('possible_agent_or_competitor');
  });
});

describe('Validierung', () => {
  test('Telefonnummern werden normalisiert', () => {
    expect(normalizePhone('+49', '0170 123 45 67')).toBe('+491701234567');
    expect(normalizePhone('+49', '0041 79 123 45 67')).toBe('+41791234567');
    expect(normalizePhone('other', '+44 7700 900123')).toBe('+447700900123');
  });

  test('offensichtliche Fake-Nummern werden abgelehnt', () => {
    expect(validatePhone('+491111111111', true)).not.toBeNull();
    expect(validatePhone('+49123456789', true)).not.toBeNull();
    expect(validatePhone('+491701234567', true)).toBeNull();
    expect(validatePhone('', false)).toBeNull();
    expect(validatePhone('', true)).not.toBeNull();
  });

  test('E-Mail-Adressen', () => {
    expect(validateEmail('anna@example.de')).toBeNull();
    expect(validateEmail('anna@mailinator.com')).not.toBeNull();
    expect(validateEmail('anna@localhost')).not.toBeNull();
  });

  test('manipulierte Profile werden abgewiesen', () => {
    expect(parseProfile({ ...strongProfile, budget: 'b_999' })).toBeNull();
    expect(parseProfile(strongProfile)).toEqual(strongProfile);
  });
});

describe('Assistent', () => {
  test('fragt bekannte Eckdaten nicht erneut und endet mit dem nächsten Schritt', () => {
    const asked: string[] = [];
    const answers: Record<string, string> = {};
    for (let q = nextQuestion(strongProfile, answers); q; q = nextQuestion(strongProfile, answers)) {
      asked.push(q.id);
      answers[q.id] = q.options[0].value;
    }
    expect(asked).not.toContain('budget');
    expect(asked).not.toContain('region');
    expect(asked.at(-1)).toBe('next_step');
    expect(progress(strongProfile, answers)).toEqual({ answered: asked.length, total: asked.length });
  });

  test('Investoren bekommen Investment-Fragen', () => {
    const first = nextQuestion({ ...strongProfile, purpose: 'investment' }, {});
    expect(first?.id).toBe('return_focus');
  });
});
