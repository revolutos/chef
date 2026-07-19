/**
 * config.ts
 * ---------
 * Zentrale Stellschrauben des Spiels. Hier – und nur hier – passt du
 * Balancing, Geschwindigkeit und Farben an. Alle Module lesen aus
 * diesem Objekt, damit Änderungen an genau einer Stelle wirken.
 */

export const CONFIG = {
  /** House-Edge für die Provably-Fair-Formel (0.03 = 3 %). */
  houseEdge: 0.03,

  /** Start-Guthaben in Demo-Punkten. */
  startBalance: 1000,

  /** Standard-Einsatz beim Laden. */
  defaultBet: 10,

  /**
   * Wachstumsgeschwindigkeit des Multiplikators.
   * Der Multiplikator wächst exponentiell: m(t) = e^(growthRate * t).
   * Größerer Wert = schnelleres Steigen (spannender, aber kürzer).
   */
  growthRate: 0.11,

  /** Dauer der Betting-Phase in Millisekunden (Countdown bis Start). */
  bettingDurationMs: 4000,

  /** Wie lange der Crash-Zustand sichtbar bleibt, bevor "Nächste Runde" möglich ist. */
  crashHoldMs: 900,

  /** Anzahl der in der Verlaufsleiste angezeigten Runden. */
  historyLength: 18,

  /**
   * Farbpalette (Dark-Theme). Wird sowohl im Canvas-Rendering als auch
   * – über CSS-Variablen in style.css – im UI verwendet.
   */
  colors: {
    background: '#0b1020',
    grid: 'rgba(120, 140, 200, 0.10)',
    curveStart: '#38bdf8', // Himmelblau (unten)
    curveEnd: '#a855f7', // Violett (oben)
    curveGlow: 'rgba(168, 85, 247, 0.35)',
    rocket: '#fbbf24', // Bernstein/Gold
    rocketTrail: 'rgba(251, 191, 36, 0.45)',
    crash: '#ef4444', // Rot beim Crash
    text: '#e6ebff',
    textDim: '#8b93b8',
    win: '#34d399',
  },

  /** Sound-Einstellungen (rein synthetisch via WebAudio, keine Asset-Dateien). */
  sound: {
    tickBaseFreq: 220, // Grundfrequenz des Steig-Ticks (Hz)
    crashFreq: 90, // Frequenz des Crash-Geräuschs (Hz)
    masterVolume: 0.25,
  },
} as const;

export type GameConfig = typeof CONFIG;
