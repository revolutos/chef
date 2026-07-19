/**
 * game.ts
 * -------
 * Spiel-State-Machine. Kapselt den kompletten Spielzustand und die
 * Übergänge zwischen den Phasen `betting` → `flying` → `crashed`.
 *
 * Das Rendering (renderer.ts) und die Bedienoberfläche (ui.ts) lesen den
 * Zustand nur über Snapshots und reagieren auf Events – sie verändern den
 * Zustand ausschließlich über die öffentlichen Methoden dieser Klasse.
 *
 * Der Multiplikator wächst zeitbasiert (nicht framebasiert), damit die
 * Kurve unabhängig von der tatsächlichen Framerate immer gleich schnell
 * steigt. `update(now)` wird vom Haupt-Loop pro Frame aufgerufen.
 */

import { CONFIG } from './config';
import { computeCrashPoint, generateServerSeed, sha256Hex } from './fairness';
import type { GameSnapshot, HistoryEntry, Phase, RoundFairness } from './types';

/** Signaturen der Ereignisse, die das Spiel nach außen meldet. */
interface GameEventMap {
  change: GameSnapshot; // Zustand hat sich geändert (für UI-Refresh)
  roundStart: RoundFairness; // Neue Runde vorbereitet (Betting beginnt)
  flyStart: void; // Übergang betting -> flying
  tick: number; // Pro Flug-Frame; Wert = aktueller Multiplikator
  cashout: { amount: number; multiplier: number; auto: boolean };
  crash: { crashPoint: number; lost: boolean };
}

type Listener<K extends keyof GameEventMap> = (payload: GameEventMap[K]) => void;

export class Game {
  private phase: Phase = 'betting';
  private balance: number;
  private bet: number;

  private multiplier = 1.0;
  private crashPoint = 1.0;

  private hasActiveBet = false;
  private cashedOutAt: number | null = null;
  private autoCashoutTarget: number | null = null;

  private clientSeed: string;
  private fairness: RoundFairness | null = null;
  private serverSeedRevealed: string | null = null;

  private flyStartTime = 0; // Zeitstempel des Flugstarts (ms)
  private bettingEndsAt = 0; // Zeitpunkt, an dem die Betting-Phase endet
  private crashedAt = 0; // Zeitstempel des Crashs
  private roundReady = false; // Ist die (asynchron vorbereitete) Runde startklar?

  private history: HistoryEntry[] = [];
  // Intern lose typisiert; die öffentliche on()-Signatur bleibt streng typsicher.
  private listeners: Partial<Record<keyof GameEventMap, Array<(payload: unknown) => void>>> = {};

  constructor() {
    this.balance = CONFIG.startBalance;
    this.bet = CONFIG.defaultBet;
    this.clientSeed = 'spieler-seed';
  }

  // ---------------------------------------------------------------------------
  // Event-System (minimaler, typisierter Emitter)
  // ---------------------------------------------------------------------------

  on<K extends keyof GameEventMap>(event: K, listener: Listener<K>): void {
    const store = this.listeners as Record<string, Array<(payload: unknown) => void>>;
    (store[event] ??= []).push(listener as (payload: unknown) => void);
  }

  private emit<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]): void {
    const store = this.listeners as Record<string, Array<(payload: unknown) => void>>;
    store[event]?.forEach((l) => l(payload));
  }

  private emitChange(): void {
    this.emit('change', this.snapshot());
  }

  // ---------------------------------------------------------------------------
  // Öffentlicher Lesezugriff
  // ---------------------------------------------------------------------------

  /** Liefert eine unveränderliche Momentaufnahme des Zustands. */
  snapshot(): GameSnapshot {
    const countdownMs =
      this.phase === 'betting' && this.roundReady ? Math.max(0, this.bettingEndsAt - performance.now()) : 0;

    return {
      phase: this.phase,
      balance: this.balance,
      bet: this.bet,
      multiplier: this.multiplier,
      crashPoint: this.crashPoint,
      hasActiveBet: this.hasActiveBet,
      cashedOutAt: this.cashedOutAt,
      autoCashoutTarget: this.autoCashoutTarget,
      serverSeedHash: this.fairness?.serverSeedHash ?? '–',
      serverSeedRevealed: this.serverSeedRevealed,
      clientSeed: this.clientSeed,
      countdownMs,
    };
  }

  getHistory(): readonly HistoryEntry[] {
    return this.history;
  }

  /** Zuletzt vollständig aufgedeckte Runde (für die Verify-Funktion). */
  getLastRevealedRound(): RoundFairness | null {
    if (!this.fairness || !this.serverSeedRevealed) return null;
    return { ...this.fairness };
  }

  // ---------------------------------------------------------------------------
  // Eingaben / Steuerung
  // ---------------------------------------------------------------------------

  setBet(value: number): void {
    // Einsatz nur außerhalb eines laufenden Fluges bzw. vor dem Platzieren ändern.
    const clamped = Math.max(1, Math.floor(value || 0));
    this.bet = Math.min(clamped, this.balance > 0 ? this.balance : clamped);
    this.emitChange();
  }

  getBet(): number {
    return this.bet;
  }

  getBalance(): number {
    return this.balance;
  }

  setClientSeed(seed: string): void {
    const trimmed = seed.trim();
    if (trimmed.length === 0) return;
    this.clientSeed = trimmed;
    this.emitChange();
  }

  setAutoCashout(target: number | null): void {
    // Sinnvoll sind Ziele > 1.00; alles andere schaltet die Automatik aus.
    if (target === null || !isFinite(target) || target <= 1.0) {
      this.autoCashoutTarget = null;
    } else {
      this.autoCashoutTarget = Math.round(target * 100) / 100;
    }
    this.emitChange();
  }

  /** Platziert den aktuellen Einsatz – nur in der Betting-Phase erlaubt. */
  placeBet(): void {
    if (this.phase !== 'betting' || !this.roundReady) return;
    if (this.hasActiveBet) return;
    if (this.bet > this.balance || this.bet < 1) return;

    this.balance -= this.bet;
    this.hasActiveBet = true;
    this.cashedOutAt = null;
    this.emitChange();
  }

  /**
   * Zahlt einen laufenden Einsatz aus. `auto` markiert eine automatische
   * Auszahlung (Auto-Cashout). Bei manuellem Klick wird zum aktuellen
   * Multiplikator ausgezahlt, bei Automatik exakt zum Ziel-Multiplikator.
   */
  cashout(auto = false, atMultiplier?: number): void {
    if (this.phase !== 'flying' || !this.hasActiveBet || this.cashedOutAt !== null) return;

    const mult = atMultiplier ?? this.multiplier;
    const payout = Math.round(this.bet * mult * 100) / 100;
    this.balance += payout;
    this.cashedOutAt = mult;

    this.emit('cashout', { amount: payout, multiplier: mult, auto });
    this.emitChange();
  }

  // ---------------------------------------------------------------------------
  // Rundensteuerung
  // ---------------------------------------------------------------------------

  /**
   * Bereitet asynchron eine neue Runde vor: erzeugt Server-Seed, dessen
   * Hash (Commitment) und den deterministischen Crash-Punkt. Danach
   * startet die Betting-Phase mit Countdown.
   */
  async newRound(): Promise<void> {
    // Zustand für neue Runde zurücksetzen.
    this.phase = 'betting';
    this.roundReady = false;
    this.multiplier = 1.0;
    this.hasActiveBet = false;
    this.cashedOutAt = null;
    this.serverSeedRevealed = null;
    this.emitChange();

    const serverSeed = generateServerSeed();
    const serverSeedHash = await sha256Hex(serverSeed);
    const crashPoint = await computeCrashPoint(serverSeed, this.clientSeed);

    this.fairness = { serverSeed, serverSeedHash, clientSeed: this.clientSeed, crashPoint };
    this.crashPoint = crashPoint;

    this.bettingEndsAt = performance.now() + CONFIG.bettingDurationMs;
    this.roundReady = true;

    this.emit('roundStart', this.fairness);
    this.emitChange();
  }

  /**
   * Muss vom Haupt-Loop pro Frame aufgerufen werden. Steuert Countdown,
   * Multiplikator-Wachstum, Auto-Cashout und Crash.
   */
  update(now: number): void {
    if (this.phase === 'betting') {
      if (this.roundReady && now >= this.bettingEndsAt) {
        this.startFlying(now);
      }
      return;
    }

    if (this.phase === 'flying') {
      const elapsedSec = (now - this.flyStartTime) / 1000;
      // Exponentielles Wachstum: m = e^(growthRate * t)
      const rawMult = Math.exp(CONFIG.growthRate * elapsedSec);

      // Auto-Cashout: nur wenn das Ziel vor dem Crash liegt.
      if (
        this.hasActiveBet &&
        this.cashedOutAt === null &&
        this.autoCashoutTarget !== null &&
        this.autoCashoutTarget <= this.crashPoint &&
        rawMult >= this.autoCashoutTarget
      ) {
        this.cashout(true, this.autoCashoutTarget);
      }

      // Crash-Prüfung.
      if (rawMult >= this.crashPoint) {
        this.multiplier = this.crashPoint;
        this.triggerCrash(now);
        return;
      }

      this.multiplier = Math.round(rawMult * 100) / 100;
      this.emit('tick', this.multiplier);
      this.emitChange();
      return;
    }

    // phase === 'crashed' – nichts zu tun; auf "Nächste Runde" wird gewartet.
  }

  /** Ist der Crash-Zustand lang genug sichtbar gewesen, um weiterzugehen? */
  canStartNextRound(now: number): boolean {
    return this.phase === 'crashed' && now - this.crashedAt >= CONFIG.crashHoldMs;
  }

  // ---------------------------------------------------------------------------
  // Interne Übergänge
  // ---------------------------------------------------------------------------

  private startFlying(now: number): void {
    this.phase = 'flying';
    this.flyStartTime = now;
    this.multiplier = 1.0;
    this.emit('flyStart', undefined);
    this.emitChange();
  }

  private triggerCrash(now: number): void {
    this.phase = 'crashed';
    this.crashedAt = now;

    // Server-Seed offenlegen, damit die Runde verifizierbar ist.
    this.serverSeedRevealed = this.fairness?.serverSeed ?? null;

    const lost = this.hasActiveBet && this.cashedOutAt === null;

    // Verlaufsleiste aktualisieren.
    this.history.unshift({
      crashPoint: this.crashPoint,
      cashedOut: this.hasActiveBet && this.cashedOutAt !== null,
    });
    if (this.history.length > CONFIG.historyLength) {
      this.history.length = CONFIG.historyLength;
    }

    this.emit('crash', { crashPoint: this.crashPoint, lost });
    this.emitChange();
  }
}
