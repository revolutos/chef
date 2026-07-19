/**
 * renderer.ts
 * -----------
 * Alles, was auf das <canvas> gezeichnet wird:
 *   - Parallax-Sternenhintergrund
 *   - animierte, steigende Multiplikator-Kurve mit Farbverlauf
 *   - ein selbst gezeichnetes Raketen-Sprite entlang der Kurve
 *   - Crash-Explosion und Rot-Blinken
 *   - großer, zentraler Multiplikator-Text
 *
 * Der Renderer ist zustandsarm: Er zeichnet allein anhand des übergebenen
 * GameSnapshots. Die verstrichene Flugzeit wird aus dem Multiplikator
 * zurückgerechnet (t = ln(m) / growthRate), sodass keine zusätzliche
 * Zeitinformation nötig ist.
 *
 * Alle Grafiken sind eigens per Canvas-Pfaden erzeugt – es werden keine
 * externen oder kopierten Bild-Assets verwendet.
 */

import { CONFIG } from './config';
import type { GameSnapshot } from './types';

interface Star {
  x: number; // 0..1 relative Position
  y: number; // 0..1
  r: number; // Radius in px
  layer: number; // Parallax-Tiefe (0..1), kleiner = weiter weg = langsamer
  twinkle: number; // Phasenverschiebung fürs Funkeln
}

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private dpr = Math.min(window.devicePixelRatio || 1, 2);
  private stars: Star[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D-Kontext nicht verfügbar');
    this.ctx = ctx;
    this.initStars(140);
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /** Erzeugt einmalig ein zufälliges, aber deterministisch wirkendes Sternenfeld. */
  private initStars(count: number): void {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      const layer = Math.random();
      this.stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + layer * 1.6,
        layer,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  /** Passt die Canvas-Auflösung an Anzeigegröße und Pixeldichte an. */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** Haupt-Zeichenroutine – pro Frame vom Loop aufgerufen. */
  render(snap: GameSnapshot, now: number): void {
    const { width: w, height: h } = this;

    const crashing = snap.phase === 'crashed';
    // Blink-Faktor beim Crash (0..1), pulsiert rötlich.
    const blink = crashing ? 0.5 + 0.5 * Math.sin(now / 60) : 0;

    this.drawBackground(now, snap.multiplier, crashing, blink);
    this.drawGrid();

    // Plot-Bereich (etwas Rand lassen).
    const originX = w * 0.1;
    const originY = h * 0.9;
    const plotW = w * 0.82;
    const plotH = h * 0.82;

    // Zielposition des aktuellen Punkts im Plot.
    const curXFrac = 0.72;
    const curYFrac = 0.72;

    const m = snap.multiplier;
    const growth = CONFIG.growthRate;
    const totalT = m > 1 ? Math.log(m) / growth : 0;

    // Aktuelle Bildschirmposition der Raketenspitze.
    const curX = originX + curXFrac * plotW;
    const curYRange = curYFrac * plotH;
    const denom = m - 1 || 1;
    const curY = originY - ((m - 1) / denom) * curYRange; // = originY - curYRange, wenn m>1

    if (snap.phase === 'flying' || crashing) {
      this.drawCurve(originX, originY, curX, curYRange, denom, totalT, growth, crashing, blink);
      this.drawRocket(curX, curY, totalT, growth, m, crashing, now, blink);
    } else {
      // Betting-Phase: ruhende Rakete auf der Startrampe.
      this.drawRocket(originX, originY, 0.0001, growth, 1, false, now, 0);
    }

    this.drawMultiplierText(snap, crashing, blink);
  }

  // ---------------------------------------------------------------------------
  // Hintergrund
  // ---------------------------------------------------------------------------

  private drawBackground(now: number, multiplier: number, crashing: boolean, blink: number): void {
    const { ctx, width: w, height: h } = this;

    // Vertikaler Grundverlauf (Nachthimmel).
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0d1430');
    grad.addColorStop(1, CONFIG.colors.background);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Beim Crash den Hintergrund leicht rötlich überlagern.
    if (crashing) {
      ctx.fillStyle = `rgba(239, 68, 68, ${0.06 + blink * 0.08})`;
      ctx.fillRect(0, 0, w, h);
    }

    // "Aufstieg": je höher der Multiplikator, desto mehr scrollt das
    // Sternenfeld nach unten (Gefühl von Steigflug). Zusätzlich langsame
    // horizontale Zeitdrift für lebendige Parallaxe.
    const climb = Math.log(Math.max(1, multiplier)) * 60;
    const drift = now / 1000;

    for (const s of this.stars) {
      const speed = 0.2 + s.layer; // tiefere Sterne bewegen sich schneller
      let sy = (s.y + ((climb * speed) / h) * 0.15 + drift * 0.01 * speed) % 1;
      let sx = (s.x + drift * 0.004 * speed) % 1;
      if (sy < 0) sy += 1;
      if (sx < 0) sx += 1;

      const tw = 0.6 + 0.4 * Math.sin(now / 500 + s.twinkle);
      ctx.globalAlpha = (0.3 + s.layer * 0.6) * tw;
      ctx.fillStyle = '#cdd6ff';
      ctx.beginPath();
      ctx.arc(sx * w, sy * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /** Dezentes Koordinatengitter für Tiefe. */
  private drawGrid(): void {
    const { ctx, width: w, height: h } = this;
    ctx.strokeStyle = CONFIG.colors.grid;
    ctx.lineWidth = 1;
    const step = 60;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  // ---------------------------------------------------------------------------
  // Kurve
  // ---------------------------------------------------------------------------

  private drawCurve(
    originX: number,
    originY: number,
    curX: number,
    curYRange: number,
    denom: number,
    totalT: number,
    growth: number,
    crashing: boolean,
    blink: number,
  ): void {
    const { ctx } = this;
    const steps = 64;

    // Verlauf entlang der Kurve (unten blau → oben violett).
    const grad = ctx.createLinearGradient(originX, originY, curX, originY - curYRange);
    if (crashing) {
      grad.addColorStop(0, CONFIG.colors.crash);
      grad.addColorStop(1, `rgba(239, 68, 68, ${0.7 + blink * 0.3})`);
    } else {
      grad.addColorStop(0, CONFIG.colors.curveStart);
      grad.addColorStop(1, CONFIG.colors.curveEnd);
    }

    // Pfad einmal erzeugen und für Füllung + Linie wiederverwenden.
    const points: Array<[number, number]> = [];
    for (let i = 0; i <= steps; i++) {
      const f = i / steps; // Fortschritt 0..1
      const t = f * totalT;
      const mAt = Math.exp(growth * t);
      const x = originX + f * (curX - originX);
      const y = originY - ((mAt - 1) / denom) * curYRange;
      points.push([x, y]);
    }

    // Weiche Fläche unter der Kurve.
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    for (const [x, y] of points) ctx.lineTo(x, y);
    ctx.lineTo(curX, originY);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, originY - curYRange, 0, originY);
    fillGrad.addColorStop(0, crashing ? 'rgba(239,68,68,0.28)' : 'rgba(129, 140, 248, 0.28)');
    fillGrad.addColorStop(1, 'rgba(129, 140, 248, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Leuchtende, weiche Linie.
    ctx.save();
    ctx.shadowColor = crashing ? CONFIG.colors.crash : CONFIG.colors.curveGlow;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points) ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // Rakete (eigenes Sprite, komplett per Pfad gezeichnet)
  // ---------------------------------------------------------------------------

  private drawRocket(
    x: number,
    y: number,
    totalT: number,
    growth: number,
    m: number,
    crashing: boolean,
    now: number,
    blink: number,
  ): void {
    const { ctx } = this;

    // Flugwinkel: Die Rakete zeigt nach oben-rechts. Je höher der
    // Multiplikator (steilerer Anstieg), desto aufrechter wird sie.
    // Beim Crash zusätzlich ein leichtes Taumeln.
    const tilt = Math.PI / 4 - Math.min(Math.PI / 6, Math.log(Math.max(1, m)) * 0.15);
    const angle = crashing ? tilt + Math.sin(now / 40) * 0.3 : tilt;
    void totalT;
    void growth;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (crashing) {
      this.drawExplosion(now, blink);
      ctx.restore();
      return;
    }

    // Antriebsflamme (flackernd).
    const flame = 10 + Math.sin(now / 40) * 4;
    const flameGrad = ctx.createLinearGradient(0, 8, 0, 8 + flame + 12);
    flameGrad.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
    flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-5, 8);
    ctx.lineTo(5, 8);
    ctx.lineTo(0, 8 + flame + 12);
    ctx.closePath();
    ctx.fill();

    // Heckflossen.
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-5, 4);
    ctx.lineTo(-11, 12);
    ctx.lineTo(-5, 10);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(5, 4);
    ctx.lineTo(11, 12);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.fill();

    // Rumpf (abgerundete Kapsel) mit Verlauf.
    const bodyGrad = ctx.createLinearGradient(-6, 0, 6, 0);
    bodyGrad.addColorStop(0, '#fcd34d');
    bodyGrad.addColorStop(0.5, CONFIG.colors.rocket);
    bodyGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(0, -16); // Nasenspitze
    ctx.quadraticCurveTo(7, -8, 6, 4);
    ctx.quadraticCurveTo(6, 9, 0, 10);
    ctx.quadraticCurveTo(-6, 9, -6, 4);
    ctx.quadraticCurveTo(-7, -8, 0, -16);
    ctx.closePath();
    ctx.fill();

    // Bullauge.
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(0, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  /** Kurze Explosions-Optik am Crash-Punkt (Partikel-Sternform). */
  private drawExplosion(now: number, blink: number): void {
    const { ctx } = this;
    const t = (now % 600) / 600;
    const radius = 8 + t * 34;

    ctx.globalAlpha = 1 - t * 0.7;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    g.addColorStop(0, `rgba(255, 240, 180, ${0.9})`);
    g.addColorStop(0.4, `rgba(251, 146, 60, ${0.8})`);
    g.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Splitter.
    ctx.strokeStyle = `rgba(255, 200, 120, ${0.6 + blink * 0.4})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r1 = radius * 0.5;
      const r2 = radius * 1.1;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------------------
  // Zentraler Multiplikator-Text
  // ---------------------------------------------------------------------------

  private drawMultiplierText(snap: GameSnapshot, crashing: boolean, blink: number): void {
    const { ctx, width: w, height: h } = this;

    let text: string;
    let color: string;

    if (snap.phase === 'betting') {
      const secs = (snap.countdownMs / 1000).toFixed(1);
      text = `Start in ${secs}s`;
      color = CONFIG.colors.textDim;
    } else if (crashing) {
      text = `${snap.crashPoint.toFixed(2)}×`;
      color = `rgb(239, ${Math.round(68 + blink * 60)}, ${Math.round(68 + blink * 60)})`;
    } else {
      text = `${snap.multiplier.toFixed(2)}×`;
      color = CONFIG.colors.text;
    }

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const big = snap.phase === 'betting' ? 30 : Math.min(96, 54 + Math.min(40, snap.multiplier * 2));
    ctx.font = `700 ${big}px system-ui, -apple-system, "Segoe UI", sans-serif`;

    ctx.shadowColor = crashing ? 'rgba(239,68,68,0.7)' : 'rgba(56,189,248,0.5)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = color;
    ctx.fillText(text, w / 2, h * 0.42);

    if (crashing) {
      ctx.shadowBlur = 0;
      ctx.font = `600 22px system-ui, sans-serif`;
      ctx.fillStyle = CONFIG.colors.crash;
      ctx.fillText('ABGESTÜRZT', w / 2, h * 0.42 + big * 0.75);
    }
    ctx.restore();
  }
}
