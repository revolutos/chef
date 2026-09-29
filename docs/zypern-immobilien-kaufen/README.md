# Landingpage „Zypern Immobilien kaufen“

Google-Ads-Landingpage für deutschsprachige Kaufinteressenten (DE/AT/CH). Ziel ist nicht die Zahl der Leads, sondern **Kosten pro qualifiziertem Kaufinteressenten** und daraus resultierende Käufe.

Route: `/zypern-immobilien-kaufen` · Marke: REVOLUTOS LTD (Demo, alle Unternehmensdaten sind Platzhalter)

## Inhalt

| Bereich                              | Datei                                                              |
| ------------------------------------ | ------------------------------------------------------------------ |
| Route, Meta, Schema, Loader          | `app/routes/zypern-immobilien-kaufen.tsx`                          |
| Lead-API (Validierung, Scoring, CRM) | `app/routes/api.zypern-lead.ts`, `app/lib/.server/zypern-leads.ts` |
| Seite (alle Sektionen, Texte)        | `app/components/zypern/ZypernLanding.tsx`                          |
| Multi-Step-Kaufprofil + Kontakt      | `app/components/zypern/BuyingProfileFunnel.tsx`                    |
| Assistent, Termin- und Danke-Seite   | `app/components/zypern/AssistantFlow.tsx`, `assistant.ts`          |
| Lead-Scoring                         | `app/components/zypern/scoring.ts` (+ `scoring.test.ts`)           |
| Konfiguration (CMS-Ersatz)           | `app/components/zypern/config.ts`                                  |
| FAQ + JSON-LD                        | `app/components/zypern/faq.ts`                                     |
| Tracking, Consent, Attribution       | `app/components/zypern/tracking.ts`                                |
| A/B-Zuweisung                        | `app/components/zypern/ab.ts`                                      |
| CRM-Datensatz                        | `app/components/zypern/crm.ts`                                     |

Weitere Dokumente: [Google Ads & Negative Keywords](./google-ads.md) · [Tracking & Conversions](./tracking-und-conversions.md) · [Lead-Scoring & CRM](./crm-und-lead-scoring.md) · [A/B-Tests](./ab-tests.md)

## Seitenaufbau

1. Header (Logo, 4 Ankerlinks, CTA „Kaufprofil starten“), auf Mobile Sticky-CTA „Passende Immobilien finden“
2. Hero mit Keyword-H1, drei Nutzenpunkten, zwei CTAs, Microcopy
3. Kaufprofil (7 Fragen, Kontaktdaten erst am Ende)
4. Problem („… Die richtige zu kaufen schon.“)
5. So funktioniert es (4 Schritte)
6. Regionen (Paphos, Limassol, Larnaca, Nikosia – CTA wählt die Region im Kaufprofil vor)
7. Beispielobjekte (nur mit echten Objekten live schalten)
8. Vertrauen inkl. Rollenbeschreibung von REVOLUTOS LTD
9. Kaufablauf (H2 mit Keyword) und Kaufkosten mit Disclaimer
10. FAQ (13 Fragen, als FAQPage-Schema ausgezeichnet)
11. Abschluss-CTA, Footer mit Pflichtangaben und Hinweisen

Nach dem Absenden öffnet sich der Assistent (Nachqualifizierung, eine Frage pro Schritt, kennt das Profil). Danach folgt je nach Einstufung: Terminbuchung (A), optionaler Termin (B) oder E-Mail-Übersicht (C). „Ich bin aktuell auf Zypern“ löst eine Besichtigungsanfrage mit höchster Priorität aus.

Der Assistent arbeitet regelbasiert (`assistant.ts`). Das ist vorhersagbar, schnell und ohne Laufzeitkosten. Wer die Fragen später per LLM formulieren lassen will, ersetzt `nextQuestion()` – Eingabe (Profil + Antworten) und Ausgabe (nächste Frage oder Ende) bleiben gleich. Die Seite bezeichnet den Assistenten bewusst nicht als „KI“.

## Umgebungsvariablen

| Variable                    | Pflicht      | Zweck                                                          |
| --------------------------- | ------------ | -------------------------------------------------------------- |
| `ZYPERN_CRM_WEBHOOK_URL`    | ja (live)    | Empfängt jedes Lead-Ereignis als JSON (CRM, n8n, Make, Zapier) |
| `ZYPERN_CRM_WEBHOOK_SECRET` | empfohlen    | Header `X-Webhook-Secret` zur Absicherung des Webhooks         |
| `ZYPERN_ALERT_WEBHOOK_URL`  | empfohlen    | Slack-Incoming-Webhook für A-Leads und Besichtigungen          |
| `ZYPERN_GTM_ID`             | für Tracking | Google Tag Manager Container-ID                                |
| `ZYPERN_TURNSTILE_SITE_KEY` | optional     | Cloudflare Turnstile (Spam-Schutz), öffentlicher Schlüssel     |
| `ZYPERN_TURNSTILE_SECRET`   | optional     | Cloudflare Turnstile, geheimer Schlüssel                       |

Ohne `ZYPERN_CRM_WEBHOOK_URL` werden Leads nur im Server-Log protokolliert.

## Checkliste vor Livegang

- [ ] Alle `[Platzhalter: …]` in `config.ts` ersetzen (Adresse, E-Mail, Telefon, Registernummer, Geschäftsführung, Antwortzeit).
- [ ] Rolle klären und eintragen: eigene zypriotische Maklerlizenz (`brokerLicense`) **oder** lizenzierter Partner (`brokerPartner`). Rechts-/Steuerpartner benennen oder Hinweis anpassen.
- [ ] Impressum, Datenschutzerklärung (inkl. GTM, GA4, Google Ads, Enhanced Conversions, Kalender, CRM, Turnstile) und ggf. AGB unter den konfigurierten URLs bereitstellen.
- [ ] Echtes Hero-Foto einer Immobilie auf Zypern als AVIF + WebP ablegen und `heroImage` setzen (ca. 1200 × 1500 px, < 200 KB).
- [ ] Beispielobjekte mit echten Daten füllen oder entfernen; danach `DEMO_MODE = false`.
- [ ] `showOffMarketNote` nur aktivieren, wenn die Aussage nachweislich stimmt.
- [ ] Kalender-Link (`booking.calendarUrl`) eintragen; Calendly/Cal.com-Webhook zusätzlich ans CRM anbinden.
- [ ] Umgebungsvariablen setzen, Test-Lead absenden, Eingang im CRM und Slack prüfen.
- [ ] GTM-Container einrichten (siehe Tracking-Dokument), Consent-Verhalten im Tag Assistant prüfen.
- [ ] Google Fonts selbst hosten (DSGVO) oder datenschutzrechtlich freigeben lassen.
- [ ] Conversion-Werte in `conversionValues` mit echten Provisionen/Quoten abstimmen.
- [ ] FAQ-Antworten von einem zypriotischen Anwalt gegenlesen lassen.

## Technik und Performance

- Die Route setzt `handle.standalone`: `root.tsx` rendert sie serverseitig ohne die App-Provider (Convex, Auth, Drag & Drop) und ohne PostHog. Der Inhalt steht damit sofort im HTML (Qualitätsfaktor, LCP, SEO); `<html lang="de">`.
- Keine zusätzlichen JS-Bibliotheken. Keine Animationen außer kurzen Übergängen.
- Hero ohne Foto: Inline-SVG, kein Bild-Request. Mit Foto: `<picture>` mit AVIF/WebP, feste Maße, `fetchpriority="high"`. Bilder unterhalb des sichtbaren Bereichs mit `loading="lazy"`.
- A/B-Variante wird serverseitig bestimmt (kein Flackern). Die Seite wird deshalb mit `Cache-Control: private` ausgeliefert.
- Bekannte Einschränkung: Das Root-Layout der App lädt global Stylesheets (u. a. Terminal-CSS) und Inter von Google Fonts. Für maximale Ladezeit kann die Landingpage später als eigenes, statisch ausgeliefertes Projekt betrieben werden; die Komponenten sind dafür bereits unabhängig.

## Tests

```bash
pnpm vitest run app/components/zypern
```
