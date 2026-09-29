# Tracking- und Conversion-Konzept

Ziel: Google Ads soll nicht lernen, **wer Formulare ausfüllt**, sondern **wer kauft**. Deshalb bekommt jede Stufe im Vertrieb einen eigenen Conversion-Wert, und die späten Stufen kommen aus dem CRM zurück zu Google Ads.

## Architektur

```
Browser ──dataLayer──▶ Google Tag Manager ──▶ GA4 · Google Ads · (Meta Pixel)
   │                         ▲
   │ Consent Mode v2 ────────┘  (Defaults „denied“, Update nach Einwilligung)
   │
   └─POST /api/zypern-lead──▶ Server: Validierung · Scoring · Spam-Schutz
                                  │
                                  ├──▶ CRM-Webhook (Lead inkl. GCLID/UTM)
                                  └──▶ Slack/WhatsApp-Alert (A-Leads, Besichtigung)

CRM-Statuswechsel ──Offline-Conversion-Import (GCLID / Enhanced Conversions for Leads)──▶ Google Ads
```

## Einbindung

| Baustein             | Umsetzung                                                                                                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GTM                  | `ZYPERN_GTM_ID` setzen (z. B. `GTM-XXXXXXX`). Das Snippet lädt erst nach den Consent-Defaults (`tracking.ts → consentBootstrapScript`).                                                                                                |
| Consent Mode v2      | Defaults: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` = `denied`; `url_passthrough` und `ads_data_redaction` aktiv.                                                                                        |
| Einwilligung         | Eingebaute, nicht blockierende Leiste („Alle akzeptieren“ / „Nur notwendige“, Footer-Link „Cookie-Einstellungen“). Bei Einsatz einer CMP (Usercentrics, Cookiebot) die Leiste entfernen und die CMP-Signale an Consent Mode übergeben. |
| UTM & Klick-IDs      | `captureAttribution()` liest `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid` und ValueTrack-Parameter, speichert sie für die Sitzung und sendet sie mit jedem Lead ans CRM.                                                  |
| Enhanced Conversions | Nach dem Absenden wird `user_data` (E-Mail, Telefon, Vor-/Nachname) in den dataLayer geschrieben. In GTM: Variable „Vom Nutzer bereitgestellte Daten“ → Google-Ads-Conversion-Tag. Google hasht die Daten vor dem Versand.             |
| A/B-Test             | `ab_exposure` mit `ab_test` und `ab_variant`; die Variante wird außerdem mit dem Lead im CRM gespeichert (`experiment`).                                                                                                               |

## Events

| Event                     | Auslöser                                                | Wert (Platzhalter)           | Google Ads                     | GA4       |
| ------------------------- | ------------------------------------------------------- | ---------------------------- | ------------------------------ | --------- |
| `landing_page_view`       | Seitenaufruf                                            | –                            | –                              | Event     |
| `cta_click`               | Klick auf einen CTA (Parameter `cta_source`)            | –                            | –                              | Event     |
| `buying_profile_started`  | erste Antwort im Kaufprofil                             | –                            | –                              | Event     |
| `budget_selected`         | Budgetfrage beantwortet (Parameter `budget`)            | –                            | –                              | Event     |
| `qualification_completed` | alle Profilfragen beantwortet, Kontaktformular sichtbar | –                            | –                              | Event     |
| `lead_submitted`          | Lead serverseitig angenommen                            | 1                            | **Sekundär** (nur Beobachtung) | Key Event |
| `qualified_lead`          | Einstufung A oder B                                     | 40                           | Primär                         | Key Event |
| `high_quality_lead`       | Einstufung A (auch nach Hochstufung im Assistenten)     | 120                          | Primär                         | Key Event |
| `calendar_opened`         | Kalender geöffnet                                       | –                            | –                              | Event     |
| `appointment_booked`      | Buchung im eingebetteten Calendly/Cal.com               | 250                          | Primär                         | Key Event |
| `viewing_requested`       | „Ich bin aktuell auf Zypern …“                          | 300                          | Primär                         | Key Event |
| `sales_accepted_lead`     | CRM: Setter bestätigt echte Kaufabsicht                 | 600                          | Primär (Offline-Import)        | Import    |
| `property_purchase`       | CRM: Kauf abgeschlossen                                 | tatsächliche Provision/Marge | Primär (Offline-Import)        | Import    |

Zusätzlich: `virtual_page_view` für die Ansichten `/zypern-immobilien-kaufen/assistent` und `/zypern-immobilien-kaufen/danke`.

Die Werte stehen in `app/components/zypern/config.ts → conversionValues`. Sie sind Startwerte und müssen nach 60–90 Tagen anhand echter Quoten kalibriert werden:
`Wert einer Stufe ≈ Wahrscheinlichkeit Kauf ab dieser Stufe × durchschnittliche Provision`.

Die Einstufung selbst (A/B/C, Score) wird dem Besucher nie angezeigt. Das Frontend erhält nur Signale (`qualified`, `highQuality`, `priority`) für das Tracking.

## Warum nicht auf Formular-Absendungen optimieren

1. `lead_submitted` ist in Google Ads **sekundär** (zählt nicht fürs Gebot).
2. Primäre Aktionen sind nur Stufen, die Kaufabsicht belegen (`qualified_lead` aufwärts).
3. Späte Stufen (`sales_accepted_lead`, `property_purchase`) kommen per Offline-Import mit echtem Wert.
4. Gebotsstrategie:
   - Start: **Conversions maximieren** auf `qualified_lead` + `high_quality_lead` + `appointment_booked`.
   - Ab ca. 30 Wert-Conversions in 30 Tagen: **Conversion-Wert maximieren**.
   - Ab stabilen Daten: Ziel-ROAS, abgeleitet aus Provision und akzeptablen Kosten pro Kauf.
5. Kennzahl im Reporting: **Kosten pro qualifiziertem Kaufinteressenten** und **Kosten pro Sales Accepted Lead**, nicht Kosten pro Lead.

## Offline-Conversion-Import aus dem CRM

- Jeder Lead enthält `attribution.gclid` / `gbraid` / `wbraid` sowie E-Mail und Telefon (für Enhanced Conversions for Leads, falls keine Klick-ID vorhanden ist).
- Bei Statuswechsel im CRM wird eine Conversion hochgeladen:
  - `sales_accepted` → `sales_accepted_lead`
  - `appointment_set` → `appointment_booked` (falls nicht bereits über den Kalender erfasst; Duplikate über Order-ID `lead_id` vermeiden)
  - `purchased` → `property_purchase` mit tatsächlichem Wert
- Wege: Google Ads API (Conversion Upload), native CRM-Integrationen (HubSpot, Salesforce, Pipedrive über Zapier/Make) oder geplanter CSV-Upload.
- Klick-IDs sind 90 Tage gültig. Kaufzyklen bei Immobilien sind oft länger – deshalb zusätzlich Enhanced Conversions for Leads aktivieren und die Zwischenstufen (SAL, Termin) konsequent importieren.
- Conversion-Zeitpunkt = Zeitpunkt des Statuswechsels, Zeitzone mit angeben.

## GA4

- Key Events: `qualified_lead`, `high_quality_lead`, `appointment_booked`, `viewing_requested`.
- Benutzerdefinierte Dimensionen: `budget`, `timeline`, `purpose`, `region`, `ab_test`, `ab_variant`, `cta_source`.
- Funnel-Exploration: `landing_page_view → buying_profile_started → budget_selected → qualification_completed → lead_submitted → qualified_lead → appointment_booked`.

## Meta Pixel (optional)

- Nur mit Einwilligung laden (GTM-Trigger auf `consent_update` mit `consent_choice = all`).
- `lead_submitted` → Standard-Event `Lead` (nicht darauf optimieren), `high_quality_lead` → Custom Conversion „QualifiedLead“ (darauf optimieren).
- Für belastbare Daten Conversions API serverseitig ergänzen.

## Datenschutz (vor Livegang mit Datenschutzberatung klären)

- Datenschutzerklärung muss GTM, GA4, Google Ads (inkl. Enhanced Conversions), Kalender-Anbieter, Turnstile und CRM nennen.
- Google Fonts werden derzeit von Google-Servern geladen. Für den DACH-Markt empfehlen wir, Inter und Source Serif 4 selbst zu hosten.
- Die Attribution liegt nur im `sessionStorage` des Besuchers und wird ausschließlich mit einer abgeschickten Anfrage übertragen.
