# A/B-Tests

Es läuft immer **genau ein** Test. Gesteuert über `app/components/zypern/config.ts`:

```ts
export const activeAbTest: AbTestId | null = 'hero_headline';
```

- Zuweisung serverseitig im Loader (Cookie `zy_ab`, 60 Tage) – kein Flackern, kein Layout-Shift.
- QA: `?variant=A` oder `?variant=B` an die URL hängen (setzt kein Cookie).
- Die Variante wird als `ab_exposure` getrackt und mit jedem Lead im CRM gespeichert (`experiment`).
- Auswertung nicht über Formular-Conversion-Rate, sondern über die jeweils genannte Primärmetrik pro Klick (Google-Ads-Klicks aus GA4/GCLID).
- Laufzeit: mindestens 2 volle Wochen und so lange, bis pro Variante eine belastbare Zahl qualifizierter Leads vorliegt (Richtwert ≥ 50 `qualified_lead` je Variante). Kein vorzeitiges Abbrechen nach wenigen Tagen.
- Nach dem Test: Gewinner als Standard übernehmen (Variante-B-Code zu A machen), Ergebnis unten dokumentieren, nächsten Test aktivieren.

## Test-Roadmap (Reihenfolge nach erwartetem Hebel)

| #   | ID                  | Variante A (Kontrolle)                                                     | Variante B                                                                                   | Hypothese                                                                                   | Primärmetrik                                 |
| --- | ------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 1   | `hero_headline`     | „Zypern Immobilien kaufen – ohne sich durch hunderte Angebote zu kämpfen.“ | „Sie möchten eine Immobilie auf Zypern kaufen? Wir finden die, die wirklich zu Ihnen passt.“ | Die Frage-Headline erhöht den Anteil gestarteter Kaufprofile, ohne die Qualität zu senken.  | `qualified_lead` / Klick                     |
| 2   | `hero_form`         | CTA im Hero, Kaufprofil darunter                                           | erste Frage direkt im Hero                                                                   | Weniger Scrollen senkt die Einstiegshürde.                                                  | `qualified_lead` / Klick                     |
| 3   | `booking_timing`    | Termin nach dem Assistenten                                                | Termin direkt nach dem Absenden (nur A-Leads)                                                | A-Leads buchen häufiger, wenn der Kalender sofort erscheint.                                | `appointment_booked` / A-Lead                |
| 4   | `budget_position`   | Budget an Position 4                                                       | Budget als erste Frage                                                                       | Frühe Budgetfrage filtert Informationssammler; Netto-Effekt auf qualifizierte Leads prüfen. | `qualified_lead` / Klick                     |
| 5   | `phone_required`    | Telefonnummer Pflicht                                                      | Telefonnummer optional                                                                       | Mehr Leads, aber weniger erreichbare A-Leads – lohnt sich das?                              | `sales_accepted_lead` / Klick                |
| 6   | `funnel_length`     | 7 Fragen                                                                   | 5 Fragen (ohne Finanzierung, Besichtigung)                                                   | Kürzerer Funnel erhöht Abschlüsse; Scoring ist auf beide Längen normiert.                   | `high_quality_lead` / Klick                  |
| 7   | `examples_position` | Beispielobjekte nach Qualifizierung                                        | Beispielobjekte vor dem Kaufprofil                                                           | Konkrete Objekte motivieren zum Ausfüllen. (Erst mit echten Objekten testen.)               | `qualification_completed` / Klick            |
| 8   | `hero_cta`          | „Passende Immobilien anfragen“                                             | „Kaufprofil starten“                                                                         | „Kaufprofil“ signalisiert Aufwand und filtert besser.                                       | `high_quality_lead` / Klick                  |
| 9   | `trust_position`    | Vertrauen nach Beispielobjekten                                            | Vertrauen direkt nach dem Kaufprofil                                                         | Früheres Vertrauen senkt Abbrüche vor den Kontaktdaten.                                     | `lead_submitted` / `qualification_completed` |

Weitere Ideen für später (erst implementieren, wenn die obigen entschieden sind): echte Teamfotos vs. ohne, Kaufablauf-Section vor vs. nach FAQ, Hero-Foto vs. Karten-Grafik.

## Ergebnisprotokoll

| Test | Zeitraum | Klicks A/B | qualifizierte Leads A/B | Ergebnis | Entscheidung |
| ---- | -------- | ---------- | ----------------------- | -------- | ------------ |
|      |          |            |                         |          |              |
