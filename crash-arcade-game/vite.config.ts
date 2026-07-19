import { defineConfig } from 'vite';

// Minimale Vite-Konfiguration.
// Das Projekt läuft komplett im Browser – es gibt kein Backend.
// `base: './'` sorgt dafür, dass der Produktions-Build auch aus einem
// Unterordner (z. B. GitHub Pages) heraus funktioniert.
export default defineConfig({
  base: './',
  // Eigene (leere) PostCSS-Konfiguration inline setzen, damit Vite nicht in
  // übergeordnete Ordner nach einer postcss.config.js sucht. So bleibt das
  // Projekt eigenständig und startet unabhängig vom umgebenden Repository.
  css: {
    postcss: {},
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'es2021',
    outDir: 'dist',
  },
});
