import { abTests, activeAbTest, type AbTestId } from './config';

export type Experiment = { test: AbTestId | null; variant: 'A' | 'B' };

export const AB_COOKIE = 'zy_ab';

/**
 * Bestimmt die Testvariante serverseitig (kein Flackern, kein Layout-Shift).
 * Reihenfolge: ?variant=B (QA-Override) → bestehendes Cookie → gewichtete Zufallszuweisung.
 */
export function resolveExperiment(
  cookieHeader: string | null,
  url: URL,
): { experiment: Experiment; setCookie: string | null } {
  if (!activeAbTest) {
    return { experiment: { test: null, variant: 'A' }, setCookie: null };
  }
  const test = abTests[activeAbTest];

  const override = url.searchParams.get('variant');
  if (override === 'A' || override === 'B') {
    return { experiment: { test: test.id, variant: override }, setCookie: null };
  }

  const existing = readExperimentCookie(cookieHeader);
  if (existing && existing.test === test.id) {
    return { experiment: existing, setCookie: null };
  }

  const total = test.variants.reduce((sum, v) => sum + v.weight, 0);
  let roll = Math.random() * total;
  const picked = test.variants.find((v) => (roll -= v.weight) < 0) ?? test.variants[0];
  const experiment: Experiment = { test: test.id, variant: picked.id };
  return {
    experiment,
    setCookie: `${AB_COOKIE}=${test.id}:${picked.id}; Path=/; Max-Age=${60 * 60 * 24 * 60}; SameSite=Lax; Secure`,
  };
}

export function readExperimentCookie(cookieHeader: string | null): Experiment | null {
  const match = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${AB_COOKIE}=([a-z_]+):(A|B)`));
  if (!match || !(match[1] in abTests)) {
    return null;
  }
  return { test: match[1] as AbTestId, variant: match[2] as 'A' | 'B' };
}

/** true, wenn der Besucher im laufenden Test `test` die Variante B sieht. */
export function isVariantB(experiment: Experiment, test: AbTestId) {
  return experiment.test === test && experiment.variant === 'B';
}
