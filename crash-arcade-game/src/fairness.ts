/**
 * fairness.ts
 * -----------
 * Provably-Fair-Logik.
 *
 * Ablauf pro Runde:
 *   1. Es wird ein zufälliger Server-Seed erzeugt.
 *   2. VOR der Runde wird nur der SHA-256-Hash des Server-Seeds
 *      veröffentlicht (das "Commitment"). So kann der Spieler später
 *      prüfen, dass der Server das Ergebnis nicht nachträglich geändert hat.
 *   3. Server-Seed + Client-Seed werden per SHA-256 zu einer Zahl r ∈ [0,1)
 *      kombiniert und daraus der Crash-Punkt berechnet.
 *   4. NACH dem Crash wird der Server-Seed offengelegt. Der Spieler kann
 *      nun Hash und Crash-Punkt selbst nachrechnen.
 *
 * Es kommt ausschließlich die native Web-Crypto-API zum Einsatz –
 * keine externen Krypto-Bibliotheken.
 */

import { CONFIG } from './config';

/** Wandelt einen ArrayBuffer in einen Hex-String um. */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Berechnet den SHA-256-Hash eines Strings und gibt ihn als Hex zurück. */
export async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

/** Erzeugt einen kryptografisch zufälligen Seed als Hex-String (32 Byte). */
export function generateServerSeed(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Kurzer, gut lesbarer Zufalls-Seed (z. B. als Vorschlag für den Client-Seed). */
export function generateClientSeed(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return (
    'seed-' +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Leitet aus Server- und Client-Seed deterministisch den Crash-Punkt ab.
 *
 * Vorgehen:
 *   - h        = SHA-256(serverSeed + ":" + clientSeed)
 *   - Die ersten 13 Hex-Stellen (= 52 Bit) ergeben eine Ganzzahl.
 *     52 Bit passen exakt in die Mantisse eines JS-Double, daher
 *     lässt sich daraus präzise ein r ∈ [0,1) bilden.
 *   - crash = floor((1 - houseEdge) / (1 - r) * 100) / 100
 *   - Ergebnis wird auf mindestens 1.00 begrenzt.
 *
 * @returns Der Crash-Multiplikator, gerundet auf 2 Nachkommastellen.
 */
export async function computeCrashPoint(
  serverSeed: string,
  clientSeed: string,
  houseEdge: number = CONFIG.houseEdge,
): Promise<number> {
  const hash = await sha256Hex(`${serverSeed}:${clientSeed}`);

  // 52 Bit aus den ersten 13 Hex-Zeichen -> r ∈ [0, 1)
  const intValue = parseInt(hash.slice(0, 13), 16);
  const r = intValue / 2 ** 52;

  // Randfall absichern: r darf nicht exakt 1 werden (Division durch 0).
  const safeR = Math.min(r, 0.9999999999);

  const raw = ((1 - houseEdge) / (1 - safeR)) * 100;
  const crash = Math.floor(raw) / 100;

  return Math.max(1.0, crash);
}

/**
 * Verifiziert eine abgeschlossene Runde vollständig.
 * Prüft, dass
 *   (a) SHA-256(serverSeed) === veröffentlichter Hash, und
 *   (b) der neu berechnete Crash-Punkt zum angezeigten passt.
 */
export async function verifyRound(params: {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  crashPoint: number;
  houseEdge?: number;
}): Promise<{
  hashOk: boolean;
  crashOk: boolean;
  recomputedHash: string;
  recomputedCrash: number;
}> {
  const recomputedHash = await sha256Hex(params.serverSeed);
  const recomputedCrash = await computeCrashPoint(
    params.serverSeed,
    params.clientSeed,
    params.houseEdge ?? CONFIG.houseEdge,
  );

  return {
    hashOk: recomputedHash === params.serverSeedHash,
    crashOk: Math.abs(recomputedCrash - params.crashPoint) < 1e-9,
    recomputedHash,
    recomputedCrash,
  };
}
