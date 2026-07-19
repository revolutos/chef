/**
 * ui.ts
 * -----
 * Bindeglied zwischen DOM-Oberfläche und Spiel-Logik. Diese Klasse:
 *   - verdrahtet alle Buttons/Eingabefelder mit den Game-Methoden,
 *   - aktualisiert Anzeigen (Guthaben, Multiplikator, Fairness, History),
 *   - steuert die kontextabhängige Hauptschaltfläche,
 *   - stellt die Verify-Funktion bereit.
 *
 * Die UI verändert den Spielzustand nur über die öffentliche API von
 * `Game` und liest ihn über Snapshots.
 */

import { CONFIG } from './config';
import type { Game } from './game';
import { generateClientSeed, verifyRound } from './fairness';
import type { SoundEngine } from './audio';
import type { GameSnapshot } from './types';

/** Typsichere Kurzform für document.getElementById mit Existenzprüfung. */
function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Element #${id} nicht gefunden`);
  return node as T;
}

export class UI {
  private balanceValue = el<HTMLSpanElement>('balance-value');
  private historyBar = el<HTMLDivElement>('history');
  private phaseHint = el<HTMLDivElement>('phase-hint');

  private betInput = el<HTMLInputElement>('bet-input');
  private autoInput = el<HTMLInputElement>('autocashout-input');
  private autoToggle = el<HTMLInputElement>('autocashout-toggle');
  private primaryBtn = el<HTMLButtonElement>('primary-btn');
  private roundResult = el<HTMLDivElement>('round-result');

  private clientSeedInput = el<HTMLInputElement>('client-seed-input');
  private serverHash = el<HTMLElement>('server-hash');
  private serverSeed = el<HTMLElement>('server-seed');
  private verifyBtn = el<HTMLButtonElement>('verify-btn');
  private verifyOutput = el<HTMLDivElement>('verify-output');
  private soundToggle = el<HTMLInputElement>('sound-toggle');

  constructor(
    private game: Game,
    private sound: SoundEngine,
  ) {
    this.injectThemeColors();
    this.wireControls();
    this.wireGameEvents();

    // Initiale Werte übernehmen.
    this.clientSeedInput.value = game.snapshot().clientSeed;
    this.betInput.value = String(game.getBet());
    this.refresh(game.snapshot());
  }

  // ---------------------------------------------------------------------------
  // Einrichtung
  // ---------------------------------------------------------------------------

  /** Überträgt die Farbpalette aus config.ts als CSS-Variablen ins :root. */
  private injectThemeColors(): void {
    const root = document.documentElement;
    const c = CONFIG.colors;
    root.style.setProperty('--c-bg', c.background);
    root.style.setProperty('--c-accent', c.curveStart);
    root.style.setProperty('--c-accent2', c.curveEnd);
    root.style.setProperty('--c-win', c.win);
    root.style.setProperty('--c-crash', c.crash);
    root.style.setProperty('--c-text', c.text);
    root.style.setProperty('--c-text-dim', c.textDim);
  }

  private wireControls(): void {
    // --- Einsatzfeld & Schnellwahl ---
    this.betInput.addEventListener('change', () => {
      this.game.setBet(Number(this.betInput.value));
      this.betInput.value = String(this.game.getBet());
    });
    el<HTMLButtonElement>('bet-half').addEventListener('click', () => this.adjustBet(0.5));
    el<HTMLButtonElement>('bet-double').addEventListener('click', () => this.adjustBet(2));
    el<HTMLButtonElement>('bet-max').addEventListener('click', () => {
      this.game.setBet(this.game.getBalance());
      this.betInput.value = String(this.game.getBet());
    });

    // --- Auto-Cashout ---
    const applyAuto = () => {
      const on = this.autoToggle.checked;
      const target = on ? Number(this.autoInput.value) : null;
      this.game.setAutoCashout(target);
    };
    this.autoToggle.addEventListener('change', applyAuto);
    this.autoInput.addEventListener('change', applyAuto);

    // --- Hauptschaltfläche (kontextabhängig) ---
    this.primaryBtn.addEventListener('click', () => this.handlePrimary());

    // --- Client-Seed ---
    this.clientSeedInput.addEventListener('change', () => {
      this.game.setClientSeed(this.clientSeedInput.value);
    });
    el<HTMLButtonElement>('client-seed-random').addEventListener('click', () => {
      const seed = generateClientSeed();
      this.clientSeedInput.value = seed;
      this.game.setClientSeed(seed);
    });

    // --- Sound ---
    this.soundToggle.addEventListener('change', () => {
      this.sound.setEnabled(this.soundToggle.checked);
    });

    // --- Verify ---
    this.verifyBtn.addEventListener('click', () => void this.runVerify());

    // Tastatur-Komfort: Leertaste = Hauptaktion.
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        this.handlePrimary();
      }
    });
  }

  private wireGameEvents(): void {
    // Ergebnis- und Sound-Rückmeldungen.
    this.game.on('cashout', ({ amount, multiplier, auto }) => {
      this.sound.cashout();
      this.roundResult.className = 'round-result round-result--win';
      this.roundResult.textContent = `${auto ? 'Auto-' : ''}Auszahlung bei ${multiplier.toFixed(
        2,
      )}× → +${amount.toFixed(2)} Punkte`;
    });

    this.game.on('crash', ({ crashPoint, lost }) => {
      this.sound.crash();
      if (lost) {
        this.roundResult.className = 'round-result round-result--loss';
        this.roundResult.textContent = `Absturz bei ${crashPoint.toFixed(2)}× – Einsatz verloren.`;
      } else if (!this.roundResult.textContent) {
        this.roundResult.className = 'round-result';
        this.roundResult.textContent = `Runde beendet bei ${crashPoint.toFixed(2)}×.`;
      }
      this.renderHistory();
    });

    this.game.on('roundStart', () => {
      this.roundResult.className = 'round-result';
      this.roundResult.textContent = '';
      this.verifyOutput.textContent = '';
      this.verifyOutput.className = 'verify-output';
    });
  }

  // ---------------------------------------------------------------------------
  // Aktionen
  // ---------------------------------------------------------------------------

  private adjustBet(factor: number): void {
    this.game.setBet(Math.max(1, Math.floor(this.game.getBet() * factor)));
    this.betInput.value = String(this.game.getBet());
  }

  /** Kontextabhängige Hauptaktion je nach Phase. */
  private handlePrimary(): void {
    const snap = this.game.snapshot();
    if (snap.phase === 'betting' && !snap.hasActiveBet) {
      this.game.placeBet();
    } else if (snap.phase === 'flying' && snap.hasActiveBet && snap.cashedOutAt === null) {
      this.game.cashout(false);
    } else if (snap.phase === 'crashed') {
      void this.game.newRound();
    }
  }

  // ---------------------------------------------------------------------------
  // Anzeige-Aktualisierung (pro Frame vom Loop aufgerufen)
  // ---------------------------------------------------------------------------

  refresh(snap: GameSnapshot): void {
    // Guthaben.
    this.balanceValue.textContent = this.formatPoints(snap.balance);

    // Fairness-Anzeigen.
    this.serverHash.textContent = snap.serverSeedHash;
    this.serverSeed.textContent = snap.serverSeedRevealed ?? '– (erst nach dem Crash)';
    this.verifyBtn.disabled = snap.serverSeedRevealed === null;

    // Hauptschaltfläche.
    this.updatePrimaryButton(snap);

    // Phasen-Hinweis über dem Canvas.
    this.updatePhaseHint(snap);
  }

  private updatePrimaryButton(snap: GameSnapshot): void {
    const btn = this.primaryBtn;
    btn.classList.remove('btn--primary', 'btn--cashout', 'btn--next', 'is-disabled');

    if (snap.phase === 'betting') {
      if (snap.hasActiveBet) {
        btn.textContent = 'Einsatz platziert ✓ – warte auf Start';
        btn.classList.add('is-disabled');
        btn.disabled = true;
      } else {
        btn.textContent = `Einsatz platzieren (${this.formatPoints(snap.bet)})`;
        btn.classList.add('btn--primary');
        btn.disabled = snap.bet > snap.balance || snap.bet < 1;
      }
    } else if (snap.phase === 'flying') {
      if (snap.hasActiveBet && snap.cashedOutAt === null) {
        const cashValue = snap.bet * snap.multiplier;
        btn.textContent = `Auszahlen · ${snap.multiplier.toFixed(2)}× → +${this.formatPoints(cashValue)}`;
        btn.classList.add('btn--cashout');
        btn.disabled = false;
      } else if (snap.cashedOutAt !== null) {
        btn.textContent = `Ausgezahlt bei ${snap.cashedOutAt.toFixed(2)}×`;
        btn.classList.add('is-disabled');
        btn.disabled = true;
      } else {
        btn.textContent = 'Runde läuft … (kein Einsatz)';
        btn.classList.add('is-disabled');
        btn.disabled = true;
      }
    } else {
      // crashed
      btn.textContent = 'Nächste Runde ▸';
      btn.classList.add('btn--next');
      btn.disabled = false;
    }
  }

  private updatePhaseHint(snap: GameSnapshot): void {
    let text = '';
    if (snap.phase === 'betting') {
      text = snap.hasActiveBet ? 'Einsatz läuft – bereit zum Abheben' : 'Einsatz platzieren!';
    } else if (snap.phase === 'flying') {
      text = snap.autoCashoutTarget ? `Auto-Auszahlung bei ${snap.autoCashoutTarget.toFixed(2)}×` : 'Steigt …';
    } else {
      text = 'Runde vorbei';
    }
    this.phaseHint.textContent = text;
  }

  // ---------------------------------------------------------------------------
  // Verlaufsleiste
  // ---------------------------------------------------------------------------

  renderHistory(): void {
    const entries = this.game.getHistory();
    this.historyBar.innerHTML = '';
    for (const e of entries) {
      const chip = document.createElement('span');
      chip.className = 'chip ' + this.chipClass(e.crashPoint);
      if (e.cashedOut) chip.classList.add('chip--cashed');
      chip.textContent = `${e.crashPoint.toFixed(2)}×`;
      this.historyBar.appendChild(chip);
    }
  }

  /** Farbabstufung der History-Chips nach Höhe des Crash-Werts. */
  private chipClass(crash: number): string {
    if (crash < 1.5) return 'chip--low';
    if (crash < 3) return 'chip--mid';
    if (crash < 10) return 'chip--high';
    return 'chip--huge';
  }

  // ---------------------------------------------------------------------------
  // Verify-Funktion
  // ---------------------------------------------------------------------------

  private async runVerify(): Promise<void> {
    const round = this.game.getLastRevealedRound();
    if (!round) return;

    this.verifyOutput.textContent = 'Prüfe …';
    this.verifyOutput.className = 'verify-output';

    const result = await verifyRound({
      serverSeed: round.serverSeed,
      serverSeedHash: round.serverSeedHash,
      clientSeed: round.clientSeed,
      crashPoint: round.crashPoint,
    });

    const ok = result.hashOk && result.crashOk;
    this.verifyOutput.className = 'verify-output ' + (ok ? 'verify-output--ok' : 'verify-output--fail');
    this.verifyOutput.innerHTML = [
      `<div>${result.hashOk ? '✅' : '❌'} SHA-256(Server-Seed) stimmt mit dem Commitment überein</div>`,
      `<div>${result.crashOk ? '✅' : '❌'} Crash-Punkt reproduzierbar: ${result.recomputedCrash.toFixed(2)}×</div>`,
      `<div class="verify-output__hint">house edge: ${(CONFIG.houseEdge * 100).toFixed(1)} % · `,
      `Formel: floor((1 − edge) / (1 − r) · 100) / 100</div>`,
    ].join('');
  }

  // ---------------------------------------------------------------------------
  // Helfer
  // ---------------------------------------------------------------------------

  private formatPoints(value: number): string {
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value);
  }
}
