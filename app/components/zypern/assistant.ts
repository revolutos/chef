import { budgetOptions, propertyTypeOptions, purposeOptions, regionOptions, timelineOptions } from './config';
import type { AssistantAnswers, BuyingProfile } from './scoring';

/**
 * Nachqualifizierung nach dem Opt-in.
 *
 * Der Assistent kennt das Kaufprofil und stellt nur Folgefragen, die daraus noch
 * nicht hervorgehen – eine Frage pro Schritt. Die Fragenlogik ist hier gekapselt:
 * `nextQuestion()` kann später durch einen LLM-Aufruf ersetzt werden, der dieselbe
 * Signatur (Profil + bisherige Antworten → nächste Frage oder Ende) erfüllt.
 */

export type AssistantQuestion = {
  id: string;
  text: string;
  options: { value: string; label: string }[];
  /** Optionales Freitextfeld zusätzlich zu den Antwortoptionen. */
  allowText?: boolean;
};

const q = (id: string, text: string, options: [string, string][], allowText = false): AssistantQuestion => ({
  id,
  text,
  options: options.map(([value, label]) => ({ value, label })),
  allowText,
});

const Q = {
  permanent: q('permanent', 'Möchten Sie dauerhaft auf Zypern leben?', [
    ['yes', 'Ja, dauerhaft'],
    ['part', 'Einen Teil des Jahres'],
    ['open', 'Noch offen'],
  ]),
  move_date: q('move_date', 'Wann planen Sie den Umzug?', [
    ['m0_6', 'In den nächsten 6 Monaten'],
    ['m6_12', 'In 6–12 Monaten'],
    ['later', 'Später'],
    ['open', 'Steht noch nicht fest'],
  ]),
  family: q('family', 'Spielen Schule oder Familie bei der Standortwahl eine Rolle?', [
    ['school', 'Ja, Schule ist wichtig'],
    ['family', 'Partner/Familie zieht mit'],
    ['no', 'Nein'],
  ]),
  infrastructure: q('infrastructure', 'Was muss in der Nähe sein?', [
    ['city', 'Stadt, Einkauf, Ärzte'],
    ['airport', 'Flughafen'],
    ['quiet', 'Ruhige Lage wichtiger als Infrastruktur'],
    ['community', 'Deutschsprachige/internationale Nachbarschaft'],
  ]),
  sea: q('sea', 'Wie wichtig ist Ihnen die Nähe zum Meer?', [
    ['front', 'Direkt am Meer'],
    ['walk', 'Wenige Minuten entfernt'],
    ['any', 'Nicht entscheidend'],
  ]),
  bedrooms: q('bedrooms', 'Wie viele Schlafzimmer benötigen Sie?', [
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4+', '4 oder mehr'],
  ]),
  readiness: q('readiness', 'Soll die Immobilie sofort bezugsfertig sein, oder kommt auch ein Neubauprojekt infrage?', [
    ['ready', 'Bezugsfertig'],
    ['offplan', 'Neubauprojekt ist in Ordnung'],
    ['both', 'Beides möglich'],
  ]),
  own_use_weeks: q('own_use_weeks', 'Wie viel Zeit im Jahr möchten Sie selbst dort verbringen?', [
    ['weeks', 'Einige Wochen'],
    ['months', 'Mehrere Monate'],
    ['varies', 'Unterschiedlich'],
  ]),
  rent_rest: q('rent_rest', 'Soll die Immobilie in der übrigen Zeit vermietet werden?', [
    ['yes', 'Ja'],
    ['no', 'Nein'],
    ['maybe', 'Vielleicht'],
  ]),
  return_focus: q('return_focus', 'Was ist Ihnen wichtiger: laufender Mietertrag oder langfristige Wertentwicklung?', [
    ['cashflow', 'Laufender Ertrag'],
    ['appreciation', 'Wertentwicklung'],
    ['both', 'Beides gleichermaßen'],
  ]),
  rental_type: q('rental_type', 'Planen Sie eher Langzeit- oder Ferienvermietung?', [
    ['long', 'Langzeitvermietung'],
    ['short', 'Ferienvermietung'],
    ['open', 'Noch offen'],
  ]),
  management: q('management', 'Soll die Verwaltung und Vermietung übernommen werden?', [
    ['full', 'Ja, vollständig'],
    ['partial', 'Teilweise'],
    ['self', 'Nein, das mache ich selbst'],
  ]),
  priority: q('priority', 'Was steht für Sie beim Kauf im Vordergrund?', [
    ['use', 'Eigene Nutzung'],
    ['income', 'Mieteinnahmen'],
    ['security', 'Vermögen sicher anlegen'],
  ]),
  surroundings: q('surroundings', 'Welches Umfeld passt eher zu Ihnen?', [
    ['urban', 'Stadt mit Infrastruktur'],
    ['coast', 'Küstenort, eher ruhig'],
    ['village', 'Dorf / ländlich'],
    ['open', 'Das möchte ich im Gespräch klären'],
  ]),
  next_step: q(
    'next_step',
    'Wie möchten Sie weitermachen?',
    [
      ['call', 'Kurzes Telefonat mit einem Berater'],
      ['viewing_now', 'Ich bin aktuell auf Zypern und möchte besichtigen'],
      ['written', 'Erst eine schriftliche Vorauswahl erhalten'],
    ],
    true,
  ),
};

function plan(profile: BuyingProfile, answers: AssistantAnswers): AssistantQuestion[] {
  const list: AssistantQuestion[] = [];
  const typeKnown = profile.propertyType === 'new_build' || profile.propertyType === 'resale';
  const isLand = profile.propertyType === 'land';

  switch (profile.purpose) {
    case 'self_use':
      list.push(Q.permanent);
      if (answers.permanent === 'yes') {
        list.push(Q.move_date, Q.family, Q.infrastructure);
      }
      list.push(Q.sea);
      if (!isLand) {
        list.push(Q.bedrooms);
      }
      if (!typeKnown && !isLand) {
        list.push(Q.readiness);
      }
      break;
    case 'holiday':
      list.push(Q.own_use_weeks, Q.rent_rest);
      if (answers.rent_rest === 'yes') {
        list.push(Q.management);
      }
      list.push(Q.sea);
      if (!isLand) {
        list.push(Q.bedrooms);
      }
      break;
    case 'investment':
      list.push(Q.return_focus, Q.rental_type, Q.management);
      if (!typeKnown && !isLand) {
        list.push(Q.readiness);
      }
      break;
    case 'mixed':
      list.push(Q.own_use_weeks, Q.rental_type, Q.management, Q.sea);
      if (!isLand) {
        list.push(Q.bedrooms);
      }
      break;
    case 'undecided':
      list.push(Q.priority);
      if (answers.priority === 'income') {
        list.push(Q.rental_type);
      }
      list.push(Q.sea);
      if (!isLand) {
        list.push(Q.bedrooms);
      }
      break;
  }
  if (profile.region === 'advice' || profile.region === 'other') {
    list.push(Q.surroundings);
  }
  list.push(Q.next_step);
  return list;
}

/** Gibt die nächste offene Frage zurück oder `null`, wenn alle beantwortet sind. */
export function nextQuestion(profile: BuyingProfile, answers: AssistantAnswers): AssistantQuestion | null {
  return plan(profile, answers).find((question) => !(question.id in answers)) ?? null;
}

export function progress(profile: BuyingProfile, answers: AssistantAnswers) {
  const all = plan(profile, answers);
  return { answered: all.filter((question) => question.id in answers).length, total: all.length };
}

const label = (options: readonly { value: string; label: string }[], value: string | undefined) =>
  options.find((o) => o.value === value)?.label ?? '';

/** Kurze Zusammenfassung der bekannten Eckdaten – der Assistent fragt diese nicht erneut ab. */
export function profileSummary(profile: BuyingProfile) {
  const region = profile.region === 'advice' ? 'Region offen' : label(regionOptions, profile.region);
  const type = profile.propertyType === 'open' ? 'Objektart offen' : label(propertyTypeOptions, profile.propertyType);
  return [
    { label: 'Ziel', value: label(purposeOptions, profile.purpose) },
    { label: 'Region', value: region },
    { label: 'Objekt', value: type },
    { label: 'Budget', value: label(budgetOptions, profile.budget) },
    { label: 'Zeitraum', value: label(timelineOptions, profile.timeline) },
  ];
}

/** Kurze, natürliche Überleitung zur nächsten Frage – ohne Floskeln. */
export function acknowledgement(questionId: string, value: string): string {
  const map: Record<string, Record<string, string>> = {
    permanent: { yes: 'Verstanden, dann geht es um Ihren künftigen Lebensmittelpunkt.' },
    sea: { front: 'Direkte Meerlage schränkt die Auswahl stark ein – gut, das früh zu wissen.' },
    rental_type: {
      short: 'Bei Ferienvermietung spielen Lage und Genehmigungen eine größere Rolle. Wir berücksichtigen das.',
    },
    management: { full: 'Notiert. Wir planen die Verwaltung dann von Anfang an mit ein.' },
    family: { school: 'Dann schauen wir besonders auf die Nähe zu internationalen Schulen.' },
  };
  return map[questionId]?.[value] ?? 'Danke, notiert.';
}
