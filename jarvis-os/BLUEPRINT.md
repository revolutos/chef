# JARVIS OS — Blueprint

> Dein eigenes, vollständiges Agenten-Betriebssystem. Selbst gebaut aus Bausteinen,
> die du bereits besitzt — statt sie als Kurs zu kaufen.

Dieses Dokument ist der Architektur-Plan. Es beschreibt **was** JARVIS OS ist, **woraus**
es besteht und in **welcher Reihenfolge** wir es bauen. Code kommt danach, Schicht für Schicht.

---

## 0. Die Grundidee

Der Kurs verkauft fünf „Produkte": JARVIS, TARS, SPARK, AI 2nd Brain und eine Claude-Code-Masterclass.
Technisch sind das keine fünf Produkte, sondern **eine Architektur mit fünf Rollen**. Ein „AI Employee"
ist nie mehr als:

```
feste Aufgabe  +  Zugriff auf die richtigen Tools  +  ein Auslöser (Zeitplan oder Event)
```

Alles, was du dafür brauchst, ist in dieser Umgebung schon vorhanden:

- **Claude Code** als Agenten-Kern (die „Masterclass" ist genau diese CLI)
- **MCP-Connectors** — Gmail, Google Calendar, Slack, Airtable, Todoist, Supabase, Vercel,
  Lovable, Higgsfield, Apollo, Clay (die „AI Employees" bekommen hierüber Hände)
- **Custom Skills** — `landingpage-builder`, `seo-artikel-generator`, `werbetext-generator`,
  `ci-generator`, `higgsfield-video-workflow`, `morning` (die „ready-to-sell client skills")
- **Routines / Cron-Trigger** — feuern Agenten autonom nach Zeitplan (macht aus einem
  Assistenten einen „Employee")

Du baust also kein System von null — du **verdrahtest und benennst**, was schon da ist.

---

## 1. Architektur

```
                          ┌──────────────────────────────┐
                          │          JARVIS OS           │
                          └──────────────────────────────┘

  Schicht 1  KERN          JARVIS.md  — Persona, Regeln, Business-Kontext
                           (Wer ist JARVIS, für wen, was darf er, Tonalität)
                                        │
  Schicht 2  GEDÄCHTNIS    2nd Brain  — Airtable/Supabase
                           (Leads, Kunden, Content-Ideen, offene Tasks, Entscheidungen)
                                        │
  Schicht 3  FÄHIGKEITEN   /skills     — deine verkaufbaren Automationen
                           (Landingpage, SEO, Werbetext, CI, Video …)
                                        │
  Schicht 4  MITARBEITER   MCP         — Gmail · Slack · Higgsfield · Apollo · Clay · …
                           (die Hände: senden, posten, anreichern, veröffentlichen)
                                        │
  Schicht 5  AUTONOMIE     Routines    — Cron/Event-Trigger feuern Agenten von selbst
                                        │
  Schicht 6  AUSLIEFERUNG  Lovable/Vercel — Kunden-Apps, Landingpages, Deployments
```

Jede Schicht ist einzeln nützlich. Du musst nicht alles auf einmal bauen —
aber die Reihenfolge zählt: Kern zuerst, dann Gedächtnis, dann Employees.

---

## 2. Kurs → Realität (das Mapping)

| Kurs-Name | Was es wirklich ist | Baustein in JARVIS OS |
|---|---|---|
| JARVIS AI Assistant V6 | Agent mit Persona + Tool-Zugriff | `JARVIS.md` (Schicht 1) |
| TARS AI Employee | Ops-/Admin-Agent, autonom | Skill + Routine (Ops) |
| SPARK – Social Media Employee | Content-Pipeline | `higgsfield-video-workflow` + `werbetext-generator` + Post-Routine |
| AI 2nd Brain (Claude Agentic OS) | Wissensspeicher + autonome Loops | Airtable/Supabase + Routines (Schicht 2 + 5) |
| Claude Code Masterclass | Diese CLI | Bereits vorhanden |
| 11 ready-to-sell client skills | Verkaufbare Automationen | Deine Skills = dein Produkt (MR. LOVABLE) |
| Unlimited Tech Support | — | Ersetzt durch: du fragst hier |

---

## 3. Die drei Kern-Employees (Spezifikation)

### JARVIS — der Assistent (immer verfügbar)
- **Aufgabe:** Zentrale Anlaufstelle. Beantwortet, koordiniert, delegiert an andere Employees.
- **Tools:** alle (er ist der Dirigent).
- **Auslöser:** du (interaktiv).
- **Artefakt:** `jarvis-os/JARVIS.md`

### SPARK — Social Media Employee
- **Aufgabe:** Aus einer Idee → Werbetext + Higgsfield-Video/-Bild → Ablage in Slack/Todoist zur Freigabe.
- **Tools:** `werbetext-generator`, `higgsfield-video-workflow`, Slack, Todoist.
- **Auslöser:** Routine (z. B. werktags 08:00) oder auf Zuruf.
- **Artefakt:** `jarvis-os/employees/spark.md`

### TARS — Operations Employee
- **Aufgabe:** Posteingang triagieren, Kalender aufräumen, Tages-Briefing erstellen, offene Tasks nachfassen.
- **Tools:** Gmail, Google Calendar, Todoist, `morning`.
- **Auslöser:** Routine (täglich 07:00).
- **Artefakt:** `jarvis-os/employees/tars.md`

### (Optional) SALES — Lead Employee
- **Aufgabe:** Neue Leads finden/anreichern, in 2nd Brain schreiben, erste Ansprache entwerfen.
- **Tools:** Apollo, Clay, Airtable, Gmail.
- **Auslöser:** Routine (wöchentlich) oder Event.

---

## 4. Das 2nd Brain (Gedächtnis-Modell)

Ein zentraler Speicher, den alle Employees teilen. Empfehlung: **Airtable** (schnell, visuell) oder
**Supabase** (wenn Apps direkt darauf zugreifen sollen). Minimales Schema:

| Tabelle | Zweck | Wer schreibt |
|---|---|---|
| `Leads` | Kontakte, Status, Quelle | SALES |
| `Kunden` | aktive Projekte, MR. LOVABLE / Smilosolar … | JARVIS, TARS |
| `Content` | Ideen, Entwürfe, geplante Posts, Status | SPARK |
| `Tasks` | offene To-dos quer über Employees | alle |
| `Log` | Entscheidungen & Ergebnisse (Langzeitgedächtnis) | alle |

Regel: Jeder Employee **liest zuerst** das relevante Gedächtnis und **schreibt** sein Ergebnis zurück.
So wird das System über Zeit klüger, statt jede Session bei null zu starten.

---

## 5. Bauplan (Phasen)

1. **Phase 1 — Kern.** `JARVIS.md` schreiben: Persona, Business-Kontext (MR. LOVABLE, DACH),
   erlaubte Tools, Tonalität, Regeln. → *Fundament, ohne das nichts anderes zusammenhält.*
2. **Phase 2 — Gedächtnis.** Airtable/Supabase-Struktur nach dem Schema oben anlegen.
3. **Phase 3 — Erster Employee (SPARK).** Als Skill bauen, manuell testen: Idee rein, Video + Text raus.
4. **Phase 4 — Autonomie.** Routine anlegen, die SPARK nach Zeitplan feuert.
5. **Phase 5 — Zweiter Employee (TARS).** Ops-Automation + Routine.
6. **Phase 6 — Skalieren.** SALES-Employee, weitere Skills, Kunden-Deployments über Lovable/Vercel.

Jede Phase liefert etwas Nutzbares. Nach Phase 3 hast du bereits einen echten „AI Employee" laufen.

---

## 6. Verzeichnis-Struktur (Ziel)

```
jarvis-os/
├─ BLUEPRINT.md          ← dieses Dokument
├─ JARVIS.md             ← Kern-Persona & Regeln (Phase 1)
├─ brain/
│  └─ schema.md          ← 2nd-Brain-Schema & Zugriffsregeln (Phase 2)
├─ employees/
│  ├─ spark.md           ← Social Media Employee (Phase 3)
│  ├─ tars.md            ← Operations Employee (Phase 5)
│  └─ sales.md           ← Lead Employee (optional)
└─ routines/
   └─ README.md          ← welche Routine welchen Employee wann feuert (Phase 4)
```

---

## 7. Was du dir sparst

Der Kurs kostet 499 $/Jahr für Anleitungen zu Werkzeugen, die du bereits bedienst.
Dieser Blueprint ersetzt die Anleitung; die Werkzeuge hast du. Der einzige echte
Aufwand ist das Zusammensetzen — und genau das bauen wir hier Schritt für Schritt.
