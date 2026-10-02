# Routine: SPARK Daily

> Feuert den Employee **SPARK** jeden Werktag und lässt ihn die nächste offene
> Content-Idee zu einem freigabefertigen Text-Entwurf verarbeiten — kostenneutral.

---

## Eckdaten

| Feld | Wert |
|---|---|
| Employee | SPARK (`../employees/spark.md`) |
| Zeitplan | werktags ~08:07 Europe/Berlin (Sommer = 06:07 UTC → `7 6 * * 1-5`) |
| Mechanismus | Durable Routine, frische Session je Lauf (`create_trigger`) |
| Trigger-ID | `trig_015suWYrRBcA9ACSypwBozc6` |
| Angelegt | 2026-10-02 · erster Lauf Mo 2026-10-05, 06:07 UTC |
| Connectors | **keine** (Fallback-Ablage aktiv — siehe `README.md`) |

> Zeitzone: angenommen **Europe/Berlin**. In der Winterzeit (CET = UTC+1) läge der
> Lauf eine Stunde später (07:07 lokal). Falls das stört, Cron auf `7 7 * * 1-5`
> umstellen (`update_trigger`).

---

## Was der Lauf tut (Prompt-Logik, Safe Mode)

1. In den Ordner `jarvis-os/` wechseln und `CLAUDE.md` + `JARVIS.md` + `employees/spark.md` beachten.
2. `brain/content.md` lesen.
3. **Keine Zeile mit Status `Idee`** → nichts tun, Session beenden (keine Meldung, kein Spam).
4. **Idee vorhanden** → die oberste nehmen und mit Skill `werbetext-generator`
   einen Entwurf (Hook/Caption/CTA, Deutsch, MR.-LOVABLE-Tonalität) erstellen. **Keine Video-Generierung.**
5. Entwurf zur Freigabe ablegen. Mit Connectors: Slack-Draft / Todoist-Task „Freigabe: <Idee>".
   **Ohne Connectors (aktuell):** Entwurf direkt in `brain/content.md` schreiben.
6. In `brain/content.md` den Eintrag auf Status `Entwurf` setzen; Zeile in `brain/log.md` ergänzen;
   Änderungen auf `claude/jarvis-os-build-41ldz6` committen und pushen.
7. Kurzbericht: welche Idee, wo der Entwurf liegt, wartet auf Viktors Go fürs Video.

Das Video (Credits) generiert SPARK erst, wenn Viktor im Anschluss „Go" gibt —
dann läuft der volle SPARK-Ablauf aus `employees/spark.md`.

---

## Erste Kontrolle

Nach dem ersten Feuern (Mo 2026-10-05) prüfen: Steht in `brain/content.md` ein neuer
Entwurf mit Status `Entwurf`? Gibt es eine neue Zeile in `brain/log.md`? Wenn ja,
läuft die Autonomie. Zum Steuern: `list_triggers` → `update_trigger`/`delete_trigger`.
