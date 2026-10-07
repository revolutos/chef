# Routines — Autonomie (Schicht 5)

> Eine Routine ist der **Auslöser**, der einen Employee ohne Zutun feuert. Genau das
> macht aus einem Assistenten einen Mitarbeiter, der auch dann arbeitet, wenn Viktor schläft.

---

## Zwei Mechanismen — nicht verwechseln

| Mechanismus | Lebensdauer | Wofür |
|---|---|---|
| **Durable Routine** (`create_trigger`, Account-Ebene) | dauerhaft, überlebt Sessions | **echte Autonomie** — der richtige Weg für JARVIS OS |
| Session-Cron (`CronCreate`) | nur solange die Session läuft | Ad-hoc-Polling im Gespräch, **nicht** für Employees |

JARVIS-OS-Routinen werden immer als **Durable Routine** angelegt.

---

## Sicherheits-Grundsatz (Kosten & Außenwirkung)

Autonome Läufe folgen JARVIS-Regel 3: **nichts Kostspieliges oder Außenwirksames
ohne Freigabe.** Konkret:

- Der autonome Lauf erzeugt **nur Text-Entwürfe** (keine Credits).
- **Higgsfield-Video/-Bild** (Credits) wird **nicht** automatisch generiert, sondern
  erst nach Viktors ausdrücklichem „Go".
- Es wird **nichts** nach außen gepostet — nur zur Freigabe abgelegt.

So kann eine Routine niemals unbemerkt Credits verbrennen oder etwas veröffentlichen.

---

## Aktive Routinen

| Routine | Employee | Zeitplan | Trigger-ID | Datei |
|---|---|---|---|---|
| SPARK Daily | SPARK | werktags ~08:07 (Europe/Berlin) | `trig_015suWYrRBcA9ACSypwBozc6` | `spark-daily.md` |

---

## ⚠️ Wichtig: Connectors in autonomen Läufen

Die SPARK-Daily-Routine wurde ohne mitgespeicherte MCP-Connectors angelegt (die
erstellende Session hatte keine weiterreichbaren Connector-Rechte). **Folge:** Die
frischen Trigger-Sessions laufen **ohne** Slack/Todoist/Higgsfield-Tools.

- Der autonome Lauf greift daher auf die **Fallback-Ablage** zurück: Entwurf direkt
  in `../brain/content.md`, Status `Entwurf`.
- Damit die Routine Slack/Todoist/Higgsfield nutzen kann, muss sie **aus der
  claude.ai-Routines-UI** (oder aus einer Session mit diesen Connectors) neu
  angelegt werden — dort lassen sich die Connectors an die Routine binden.

---

## Eine Routine anlegen / ändern / löschen

Angelegt über `create_trigger` mit `create_new_session_on_fire: true` (jeder Lauf
startet eine frische Session im JARVIS-OS-Kontext). Zum Ändern/Löschen dienen
`update_trigger` / `delete_trigger` bzw. `list_triggers` (zeigt die `trig_…`-ID).
