# KI Business OS (REVOLUTOS)

Premium-UI-Modul für das KI Business OS — Zielgruppen: Selbständige, KI-Dienstleister,
Coaches, Consultants, Creator, digitale Produktverkäufer, Affiliates, Influencer und Marketer.

## Routen

| Route             | Datei                           | Inhalt                                                                                                                                    |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/os`             | `app/routes/os._index.tsx`      | Landingpage (Hero, Module, Prozess, Preise, FAQ)                                                                                          |
| `/os/dashboard`   | `app/routes/os.dashboard.tsx`   | Admin-Dashboard (KPIs, Umsatz-Chart, Pipeline)                                                                                            |
| `/os/crm`         | `app/routes/os.crm.tsx`         | CRM & Leads (Liste, Board, interaktives Lead-Panel: Notizen/Aktion editieren, Aktivitäten protokollieren, E-Mail verfassen)               |
| `/os/automations` | `app/routes/os.automations.tsx` | Automationen (Liste + Detailansicht: Workflow-Schritte, Nachrichteninhalte, Verlauf, Einstellungen)                                       |
| `/os/analytics`   | `app/routes/os.analytics.tsx`   | Analytics (Lead-Trend, Funnel, Kanäle, Heatmap)                                                                                           |
| `/os/content`     | `app/routes/os.content.tsx`     | Content-Engine (Kalender/Liste + Editor: KI-Generierung, Plattform-Vorschau, Hashtags, Status-Workflow, Planung)                          |
| `/os/funnels`     | `app/routes/os.funnels.tsx`     | Funnels & Angebote (Karten + Detailansicht: Schritt-Conversion, Abbruch-Analyse, A/B-Test, Umsatz, Einstellungen)                         |
| `/os/map`         | `app/routes/os.map.tsx`         | Experten-Karten-Portal (Vollbild-Karte ohne Scroll, Filter-Widget, Ergebnis-Liste, Experten-/Event-/Signup-/Abo-/Credit-/Referral-Modals) |

Gemeinsame Shell (Sidebar + Topbar) für alle Module: `OsShell.tsx`. Noch nicht gebaute
Module sind in der Navigation mit „Bald" markiert.

### Experten-Karte (`/os/map`)

Eigene App-Shell (Icon-Rail statt Topbar) für ein echtes App-Feeling ohne Seiten-Scroll:
die stilisierte Karte füllt den Viewport, alle Bedienelemente sind schwebende Glas-Widgets,
jede Detailansicht öffnet als Modal. Zwei Perspektiven per Umschalter demonstrierbar:

- **Als Experte**: alle Profile voll sichtbar.
- **Als Unternehmen**: Name, Kontakt & Portfolio sind geblurrt; sichtbar bleiben Rolle,
  Region, Rating und Preis. Freischalten kostet 1 Credit (Pay-per-Unlock, Credit-Pakete).

Monetarisierung im UI angelegt: Experten-Abo (Free/Pro/Elite), Unternehmens-Credits und
zwei getrennte Referral-Programme (Experten → Jobs, Unternehmen → Gratis-Credits).
Karten-Pins clustern pro Stadt; Event-Pins öffnen RSVP-Modals. Karte ist bewusst
abstrakt/dekorativ (keine externe Karten-Library, kein API-Key) — später gegen eine echte
Karten-Engine austauschbar. Daten: `mapData.ts`.

Die KI-Content-Generierung (`generateVariants`, `rewriteBody` in `demoData.ts`) ist
aktuell simuliert und an einer Stelle gekapselt — später 1:1 durch einen Claude-API-Aufruf
ersetzbar.

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
