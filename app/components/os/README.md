# KI Business OS (REVOLUTOS)

Premium-UI-Modul für das KI Business OS — Zielgruppen: Selbständige, KI-Dienstleister,
Coaches, Consultants, Creator, digitale Produktverkäufer, Affiliates, Influencer und Marketer.

## Routen

| Route           | Datei                          | Inhalt                                          |
| --------------- | ------------------------------ | ----------------------------------------------- |
| `/os`           | `app/routes/os._index.tsx`     | Landingpage (Hero, Module, Prozess, Preise, FAQ) |
| `/os/dashboard` | `app/routes/os.dashboard.tsx`  | Admin-Dashboard (KPIs, Umsatz-Chart, Pipeline)   |

## Design-System

- Dunkles Premium-Theme (`#05060B`), Glas-Karten (`bg-white/[0.03]` + Hairline-Border),
  Violett/Blau-Verlauf (`#8B5CF6 → #5B7CFA`), weiche Glow-Orbs im Hintergrund.
- Zentrale Tokens und Primitives in `Ui.tsx` (`os`-Objekt, `GradientButton`, `GhostButton`,
  `SectionTag`, `BrandMark`, `GlowOrb`).
- Chart-Serienfarben (`#9085E9`, `#1BAF7A`) sind auf der dunklen Fläche validiert
  (Kontrast ≥ 3:1, CVD-sicher).

## Stand & nächste Schritte

Alle Daten sind statische Demo-Daten (`demoData.ts`). Die Seiten sind bewusst vom
restlichen Chef-Produkt entkoppelt und benötigen kein Backend. Nächste Ausbaustufen:
echte Auth, Convex-Datenmodell für Leads/Automationen, funktionaler KI-Assistent.
