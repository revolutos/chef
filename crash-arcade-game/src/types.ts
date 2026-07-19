/**
 * types.ts
 * --------
 * Gemeinsame Typdefinitionen, die von mehreren Modulen genutzt werden.
 */

/** Die drei Phasen einer Spielrunde. */
export type Phase = 'betting' | 'flying' | 'crashed';

/**
 * Alle Daten, die eine Runde "provably fair" nachprüfbar machen.
 * Der Server-Seed wird VOR der Runde nur als Hash veröffentlicht
 * (Commitment) und erst NACH dem Crash im Klartext offengelegt.
 */
export interface RoundFairness {
  serverSeed: string; // Zufälliger Server-Seed (Geheimnis bis zum Crash)
  serverSeedHash: string; // SHA-256(serverSeed) – vorab veröffentlicht
  clientSeed: string; // Vom Spieler wählbarer Seed
  crashPoint: number; // Deterministisch berechneter Crash-Multiplikator
}

/** Ein Eintrag in der Verlaufsleiste. */
export interface HistoryEntry {
  crashPoint: number;
  cashedOut: boolean; // Hat der Spieler in dieser Runde rechtzeitig ausgezahlt?
}

/** Der komplette, zu einem Zeitpunkt gültige Spielzustand (read-only nach außen). */
export interface GameSnapshot {
  phase: Phase;
  balance: number;
  bet: number;
  multiplier: number; // Aktueller Multiplikator (1.00 in betting)
  crashPoint: number; // Crash-Punkt der aktuellen Runde
  hasActiveBet: boolean; // Läuft ein Einsatz in dieser Runde?
  cashedOutAt: number | null; // Multiplikator, bei dem ausgezahlt wurde (oder null)
  autoCashoutTarget: number | null; // Ziel-Multiplikator für Auto-Cashout (oder null)
  serverSeedHash: string;
  serverSeedRevealed: string | null; // Server-Seed nach dem Crash
  clientSeed: string;
  countdownMs: number; // Verbleibende Zeit in der Betting-Phase
}
