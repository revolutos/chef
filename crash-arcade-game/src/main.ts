/**
 * main.ts
 * -------
 * Einstiegspunkt. Erzeugt Spiel, Renderer, Sound und UI, verdrahtet die
 * Sound-Hooks und startet die zentrale Render-/Update-Schleife
 * (requestAnimationFrame ≈ 60 FPS).
 */

import './style.css';
import { Game } from './game';
import { Renderer } from './renderer';
import { SoundEngine } from './audio';
import { UI } from './ui';

// --- Kern-Bausteine erzeugen ---
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const game = new Game();
const renderer = new Renderer(canvas);
const sound = new SoundEngine();
const ui = new UI(game, sound);

// --- Sound-Hooks an Spiel-Events hängen ---
game.on('tick', (multiplier) => sound.tick(multiplier, performance.now()));
// (cashout/crash-Sounds werden in ui.ts ausgelöst, damit Ton + Text zusammenpassen.)

// UI bei jeder Zustandsänderung aktualisieren.
game.on('change', (snap) => ui.refresh(snap));
ui.renderHistory();

// --- Hauptschleife ---
function loop(now: number): void {
  game.update(now); // Phasenlogik + Multiplikator-Wachstum
  renderer.render(game.snapshot(), now); // Zeichnen
  requestAnimationFrame(loop);
}

// Erste Runde vorbereiten und Schleife starten.
void game.newRound();
requestAnimationFrame(loop);
