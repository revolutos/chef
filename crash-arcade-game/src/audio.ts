/**
 * audio.ts
 * --------
 * Optionale Sound-Hooks. Alle Klänge werden synthetisch über die
 * WebAudio-API erzeugt (Oszillatoren) – es werden keine Audio-Dateien
 * geladen. Standardmäßig ist der Ton aus; er lässt sich per Umschalter
 * aktivieren.
 *
 * Wichtig: Ein AudioContext darf in Browsern erst nach einer
 * Nutzerinteraktion starten. Daher wird er erst beim ersten Einschalten
 * (per Klick) erzeugt/fortgesetzt.
 */

import { CONFIG } from './config';

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private lastTickAt = 0;

  /** Aktiviert/deaktiviert den Ton. Beim Aktivieren wird der Context geweckt. */
  setEnabled(on: boolean): void {
    this.enabled = on;
    if (on) {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      void this.ctx.resume();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Kurzer "Tick" beim Steigen. Die Tonhöhe wächst mit dem Multiplikator,
   * damit es beim Steigen spannender klingt. Wird bewusst gedrosselt,
   * damit es bei 60 FPS nicht schnarrt.
   */
  tick(multiplier: number, now: number): void {
    if (!this.enabled || !this.ctx) return;
    if (now - this.lastTickAt < 110) return; // max ~9 Ticks/Sekunde
    this.lastTickAt = now;

    const freq = CONFIG.sound.tickBaseFreq * (1 + Math.log(Math.max(1, multiplier)) * 0.6);
    this.blip(freq, 0.05, 'square', 0.12);
  }

  /** Aufsteigender kleiner Jingle bei erfolgreicher Auszahlung. */
  cashout(): void {
    if (!this.enabled || !this.ctx) return;
    this.blip(523, 0.09, 'triangle', 0.2); // C5
    setTimeout(() => this.blip(784, 0.12, 'triangle', 0.2), 90); // G5
  }

  /** Tiefes, verrauschtes "Crash"-Geräusch. */
  crash(): void {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Abfallender Sägezahn für den "Absturz".
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(CONFIG.sound.crashFreq * 3, now);
    osc.frequency.exponentialRampToValueAtTime(CONFIG.sound.crashFreq, now + 0.4);
    gain.gain.setValueAtTime(CONFIG.sound.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  /** Hilfsfunktion: kurzer Ton mit weichem Ausklang. */
  private blip(freq: number, duration: number, type: OscillatorType, volume: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume * CONFIG.sound.masterVolume * 4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
}
