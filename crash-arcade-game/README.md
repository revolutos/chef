# ✦ STERNFLUG — Crash-Style-Arcade (Demo)

Ein kleines, komplett im Browser laufendes **Crash-Style-Arcade-Spiel**.
Eine Rakete steigt, ein Multiplikator wächst exponentiell – und du musst
**auszahlen, bevor sie abstürzt**. Reines Fun-/Lernprojekt.

> ⚠️ **Wichtig:** Es geht ausschließlich um **fiktive Demo-Punkte**.
> Kein echtes Geld, keine Ein-/Auszahlungen, kein Glücksspiel. Alle Namen,
> Grafiken und Sounds sind selbst erstellt – es werden **keine geschützten
> Marken, Logos oder Original-Assets** verwendet.

---

## 🚀 Schnellstart

Voraussetzung: **Node.js ≥ 18** (empfohlen: 20 oder neuer) und npm.

```bash
# 1. In den Projektordner wechseln
cd crash-arcade-game

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten (öffnet den Browser automatisch)
npm run dev
```

Danach läuft das Spiel unter der angezeigten Adresse (Standard:
`http://localhost:5173`).

### Weitere Befehle

```bash
npm run build      # Produktions-Build nach dist/
npm run preview    # gebaute Version lokal ansehen
npm run typecheck  # nur die TypeScript-Typen prüfen
```

---

## 🎮 So wird gespielt

1. **Betting-Phase:** Ein Countdown läuft. Trage deinen **Einsatz** ein und
   klicke **„Einsatz platzieren"** (oder drücke die **Leertaste**).
2. **Flying-Phase:** Die Rakete hebt ab, der Multiplikator steigt ab
   `1.00×`. Klicke jederzeit **„Auszahlen"** – dein Gewinn ist
   `Einsatz × aktueller Multiplikator`.
3. **Crash:** Zahlst du nicht rechtzeitig aus, ist der Einsatz weg.
   Danach startest du mit **„Nächste Runde"** die nächste Runde.

**Auto-Cashout:** Aktiviere den Schalter und trage einen Ziel-Multiplikator
ein (z. B. `2.00`). Es wird automatisch genau bei diesem Wert ausgezahlt –
sofern die Runde nicht vorher abstürzt.

---

## 🛡️ Provably Fair — nachprüfbare Fairness

Jede Runde ist mathematisch überprüfbar und kann **nicht nachträglich
manipuliert** werden:

1. **Commitment (vor der Runde):** Es wird ein zufälliger **Server-Seed**
   erzeugt und nur dessen **SHA-256-Hash** angezeigt.
2. **Ergebnis:** Server-Seed + dein **Client-Seed** werden per SHA-256 zu
   einer Zahl `r ∈ [0,1)` kombiniert. Daraus folgt der Crash-Punkt:

   ```
   crash = floor((1 − houseEdge) / (1 − r) · 100) / 100      (min. 1.00×)
   ```

3. **Offenlegung (nach dem Crash):** Der **Server-Seed** wird sichtbar. Über
   **„Letzte Runde verifizieren"** prüft die App selbst, dass
   - `SHA-256(Server-Seed)` = der vorab gezeigte Hash, und
   - der neu berechnete Crash-Punkt zum tatsächlichen passt.

Die letzten ~18 Crash-Werte erscheinen als **Verlaufsleiste** über dem Spielfeld.

Die gesamte Logik steckt in [`src/fairness.ts`](src/fairness.ts) und nutzt
ausschließlich die native Web-Crypto-API (keine externen Krypto-Libs).

---

## 🗂️ Projektstruktur

```
crash-arcade-game/
├── index.html          # HTML-Gerüst der Oberfläche
├── package.json        # Abhängigkeiten & Skripte
├── tsconfig.json       # TypeScript-Konfiguration
├── vite.config.ts      # Build-/Dev-Server (Vite)
└── src/
    ├── main.ts         # Einstiegspunkt: verdrahtet alles + Render-Loop
    ├── config.ts       # ⚙️ Alle Stellschrauben (houseEdge, Tempo, Farben)
    ├── types.ts        # Gemeinsame TypeScript-Typen
    ├── fairness.ts     # 🛡️ Provably-Fair-Logik (SHA-256, Crash-Formel, Verify)
    ├── game.ts         # 🎲 Spiel-State-Machine (betting → flying → crashed)
    ├── renderer.ts     # 🎨 Canvas-Rendering (Kurve, Rakete, Sterne, Crash)
    ├── audio.ts        # 🔊 Synthetische Sound-Hooks (WebAudio, optional)
    ├── ui.ts           # 🖱️ DOM-Steuerung (Buttons, Anzeigen, Verify)
    └── style.css       # 🌙 Dark-Theme, responsives Layout
```

Die Module sind klar getrennt: **Fairness**, **Spiel-State**, **Rendering**
und **UI** kennen einander nur über schmale Schnittstellen (Snapshots + Events).

---

## 🔧 Anpassen

Fast alles lässt sich zentral in **[`src/config.ts`](src/config.ts)** ändern:

| Ich möchte …                            | Stellschraube in `config.ts`                     |
| --------------------------------------- | ------------------------------------------------ |
| **House-Edge** ändern                   | `houseEdge` (z. B. `0.03` = 3 %)                 |
| **Schneller/langsamer steigen**         | `growthRate` (größer = schneller; Standard `0.11`) |
| **Farben** von Kurve/Rakete/UI ändern   | `colors.*` (wird als CSS-Variablen übernommen)   |
| **Start-Guthaben / Standard-Einsatz**   | `startBalance`, `defaultBet`                      |
| **Länge der Betting-Phase**             | `bettingDurationMs`                               |
| **Wie viele History-Einträge**          | `historyLength`                                   |
| **Lautstärke / Ton-Frequenzen**         | `sound.*`                                         |

### Beispiele

- **Spannenderes, schnelleres Spiel:**
  `growthRate: 0.18` (die Rakete steigt deutlich flotter).
- **Fairere Runden (weniger House-Edge):**
  `houseEdge: 0.01` → im Schnitt höhere Crash-Punkte.
- **Anderes Farbschema (z. B. Grün-Türkis):**
  ```ts
  colors: {
    curveStart: '#22d3ee',
    curveEnd:   '#4ade80',
    rocket:     '#facc15',
    // ...
  }
  ```
  Kurve, Leucht­effekte **und** die UI-Akzente übernehmen die neuen Werte
  automatisch (Canvas liest direkt, die UI über CSS-Variablen).

Das **Wachstumsmodell** selbst (exponentiell `m(t) = e^(growthRate · t)`)
sitzt in [`src/game.ts`](src/game.ts) → Methode `update()`, falls du eine
andere Kurvenform ausprobieren willst.

---

## 🧰 Technik

- **HTML5 + TypeScript + `<canvas>`** – kein Framework nötig.
- **Vite** als Build-/Dev-Setup (schneller Start, HMR).
- **Kein Backend:** Alles läuft rein im Browser; der Zufall kommt aus der
  Web-Crypto-API.
- **~60 FPS** über `requestAnimationFrame`; der Multiplikator wächst
  zeitbasiert und dadurch framerate-unabhängig gleichmäßig.

Viel Spaß beim Steigen – und rechtzeitig abheben! ✦
