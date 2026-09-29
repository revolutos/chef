# Lead-Scoring und CRM

## Ablauf

```
Google-Ads-Klick → Kaufprofil (5–7 Fragen) → Kontaktdaten → Server: Validierung + Scoring
  → CRM (lead.created) → Assistent (Nachqualifizierung) → Re-Scoring → CRM (lead.qualified)
  → A: Setter sofort · B: Follow-up · C: Nurturing
  → Termin → Closer → Besichtigung → Angebot/Reservierung → Kauf
```

Alle Schwellen, Punkte, Obergrenzen und Boni stehen in `app/components/zypern/config.ts → scoring` und den `*Options`-Listen. Die Logik liegt in `scoring.ts` und ist durch Tests abgedeckt (`scoring.test.ts`).

## Punkte (Standardwerte)

| Merkmal          | Optionen → Punkte                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Kaufzweck        | konkretes Ziel 5 · noch nicht entschieden 0                                                 |
| Region           | konkrete Stadt 5 · andere Region 4 · Beratung gewünscht 3                                   |
| Objektart        | konkret 3 · noch offen 0                                                                    |
| Budget           | < 150 T€ 0 · 150–250 T€ 12 · 250–400 T€ 22 · ab 400 T€ 25                                   |
| Kaufzeitpunkt    | sofort / < 3 Monate 25 · 3–6 Monate 20 · 6–12 Monate 10 · > 12 Monate 3 · nur informieren 0 |
| Finanzierung     | Eigenkapital 15 · Kombination 12 · Finanzierung 7 · offen 0                                 |
| Zypern-Erfahrung | Besichtigung geplant 10 · war schon dort 6 · nein 2                                         |
| Kontaktart       | Telefon / WhatsApp / Video 5 · nur E-Mail 0                                                 |
| Telefonnummer    | gültig vorhanden 5                                                                          |

**Basis-Score** = erreichte Punkte ÷ maximal mögliche Punkte der gestellten Fragen × 100. So bleiben die kurze (5 Fragen) und die lange Funnel-Variante (7 Fragen) vergleichbar.

**Boni aus dem Assistenten** (absolut): Gespräch gewünscht +10 · aktuell auf Zypern und Besichtigung gewünscht +30 · nur schriftliche Vorauswahl −5.

## Einstufung

| Stufe | Bedingung                                                                                                                                                          | Routing                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **A** | Score ≥ 70 **und** Budget ≥ 150 T€ **und** Kauf in 0–6 Monaten **und** Finanzierung nicht „offen“ **und** Telefonnummer **und** Kontakt per Telefon/WhatsApp/Video | sofort ins Sales-CRM, Setter-Alert (Slack/WhatsApp), Terminbuchung prominent angeboten |
| **B** | Score ≥ 40 (oder A-Kriterien knapp verfehlt)                                                                                                                       | CRM, Follow-up durch Setter, Beratung optional angeboten                               |
| **C** | Score < 40, oder Kauf „später als 12 Monate“ / „ich informiere mich zunächst“                                                                                      | nicht an Closer; automatisierte E-Mail-/Content-Strecke                                |

Obergrenzen: „6–12 Monate“ und Budget „unter 150.000 €“ sind höchstens B. Ausnahme: Wer aktuell auf Zypern ist und besichtigen möchte, wird nie C und erhält **höchste Priorität**.

Hinweise zur manuellen Prüfung (`flags`): `possible_agent_or_competitor` (E-Mail-Domain enthält z. B. „immobilien“, „realestate“, „makler“), `no_phone`.

Der Besucher sieht weder Score noch Stufe. Die Formulierungen auf der Danke-Seite sind für alle Stufen wertschätzend; nur das Angebot (Termin sofort / optional / E-Mail-Übersicht) unterscheidet sich.

## Spam- und Qualitätsschutz

- Server-Validierung von Namen, E-Mail (Syntax, Wegwerf-Domains, MX-Eintrag) und Telefonnummer (Länge, Ländervorwahl, Fake-Muster wie 111111 oder 123456).
- Honeypot-Feld und Mindest-Ausfüllzeit (4 s): verdächtige Anfragen werden still verworfen.
- Optional Cloudflare Turnstile (`ZYPERN_TURNSTILE_SITE_KEY`, `ZYPERN_TURNSTILE_SECRET`).
- Rate-Limit pro IP (6 Anfragen / 10 Minuten, pro Server-Instanz; für mehrere Instanzen Redis/Upstash).

## CRM-Datenstruktur

Das CRM erhält pro Ereignis ein JSON nach `CrmLeadEvent` (`app/components/zypern/crm.ts`). Beispiel:

```json
{
  "schema_version": 1,
  "event": "lead.qualified",
  "lead_id": "3f0c…",
  "occurred_at": "2026-10-01T09:12:44.120Z",
  "source": "landingpage_zypern_immobilien_kaufen",
  "pipeline": "zypern_immobilienkauf",
  "contact": { "firstName": "…", "lastName": "…", "email": "…", "phone": "+49…", "contactPreference": "whatsapp" },
  "profile": {
    "purpose": "self_use",
    "region": "paphos",
    "propertyType": "apartment",
    "budget": "b_250_400",
    "timeline": "m0_3",
    "financing": "equity",
    "visited": "yes"
  },
  "assistant_answers": { "permanent": "yes", "move_date": "m0_6", "sea": "walk", "bedrooms": "2", "next_step": "call" },
  "assistant_note": "Reise vom 12.–19. November geplant",
  "scoring": {
    "tier": "A",
    "score": 103,
    "reasons": ["möchte Gespräch"],
    "flags": [],
    "priority": "high",
    "next_step": "booking",
    "scoring_version": "2026-09-v1"
  },
  "sales_status": "ai_qualified",
  "routing": "setter_immediate",
  "attribution": {
    "gclid": "…",
    "utm_source": "google",
    "utm_campaign": "…",
    "keyword": "zypern immobilien kaufen",
    "landing_url": "…",
    "first_seen_at": "…"
  },
  "experiment": { "test": "hero_headline", "variant": "B" },
  "consent": { "privacy_accepted_at": "…", "tracking": "all" },
  "meta": { "user_agent": "…", "page_path": "/zypern-immobilien-kaufen" }
}
```

Ereignisse: `lead.created` (nach dem Kontaktformular), `lead.qualified` (nach dem Assistenten), `lead.viewing_requested` (Besichtigungswunsch vor Ort). Das CRM führt sie über `lead_id` zusammen (Upsert).

### Tabellen (PostgreSQL / Supabase, falls kein Standard-CRM genutzt wird)

```sql
create type lead_tier as enum ('A', 'B', 'C');
create type sales_stage as enum (
  'new', 'ai_qualified', 'setter_contacted', 'sales_accepted', 'appointment_set',
  'closer_call_done', 'viewing_scheduled', 'viewing_done', 'offer', 'purchased', 'nurture', 'lost'
);

create table leads (
  id uuid primary key,                         -- lead_id aus der Landingpage
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  contact_preference text not null,
  purpose text not null,
  region text not null,
  property_type text not null,
  budget text not null,
  timeline text not null,
  financing text,
  visited text,
  assistant_answers jsonb not null default '{}',
  assistant_note text,
  tier lead_tier not null,
  score int not null,
  score_reasons text[] not null default '{}',
  flags text[] not null default '{}',
  priority text not null,
  scoring_version text not null,
  stage sales_stage not null default 'new',
  owner_setter text,
  owner_closer text,
  lost_reason text,
  -- Attribution
  gclid text, gbraid text, wbraid text, fbclid text,
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  campaign_id text, adgroup_id text, keyword text, matchtype text, device text,
  landing_url text, referrer text, first_seen_at timestamptz,
  ab_test text, ab_variant text,
  tracking_consent text,
  privacy_accepted_at timestamptz not null,
  purchase_value_eur numeric,                  -- tatsächlicher Wert für property_purchase
  updated_at timestamptz not null default now()
);

-- Jede Statusänderung nachvollziehbar (wer, wann, von → nach, warum)
create table lead_stage_history (
  id bigserial primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  changed_at timestamptz not null default now(),
  changed_by text not null,                    -- Nutzer oder 'system'
  from_stage sales_stage,
  to_stage sales_stage not null,
  note text
);

create table lead_events (                     -- Rohdaten der Webhook-Ereignisse
  id bigserial primary key,
  lead_id uuid not null references leads(id) on delete cascade,
  received_at timestamptz not null default now(),
  event text not null,
  payload jsonb not null
);

create table offline_conversion_uploads (
  id bigserial primary key,
  lead_id uuid not null references leads(id),
  conversion_action text not null,             -- sales_accepted_lead, property_purchase …
  conversion_time timestamptz not null,
  value_eur numeric,
  uploaded_at timestamptz,
  status text not null default 'pending',      -- pending | uploaded | failed
  error text,
  unique (lead_id, conversion_action)
);
```

Statuswechsel nur über eine Funktion/API, die gleichzeitig `leads.stage` setzt und eine Zeile in `lead_stage_history` schreibt. Ein Trigger legt bei `sales_accepted` und `purchased` einen Eintrag in `offline_conversion_uploads` an.

## Vertriebsprozess (Stufen)

| Stufe                        | Verantwortlich | Übergang / Pflichtangaben                                                            |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------ |
| Neu / Nachqualifiziert       | System         | automatisch                                                                          |
| Setter: Kontakt              | Setter         | Erstkontakt; A-Leads: Ziel [Platzhalter: z. B. < 15 Min. zu Geschäftszeiten]         |
| Sales Accepted Lead          | Setter         | Kaufabsicht, Budget und Zeitraum bestätigt → Offline-Conversion                      |
| Termin vereinbart            | Setter         | Datum, Closer                                                                        |
| Beratungsgespräch            | Closer         | Ergebnis, nächste Schritte                                                           |
| Besichtigung geplant/erfolgt | Closer         | Reisedaten, Objekte                                                                  |
| Angebot / Reservierung       | Closer         | Objekt, Preis                                                                        |
| Kauf abgeschlossen           | Closer         | tatsächlicher Wert → Offline-Conversion `property_purchase`                          |
| Nurturing                    | Marketing      | C-Leads und pausierte B-Leads                                                        |
| Verloren                     | Setter/Closer  | Pflichtfeld Grund (Budget, Zeitpunkt, nicht erreichbar, Makler/Wettbewerber, Fake …) |

## Benachrichtigungen

- `ZYPERN_ALERT_WEBHOOK_URL` (Slack-kompatibel): A-Leads beim Absenden, Hochstufungen auf A nach dem Assistenten und jeder Besichtigungswunsch vor Ort. Ist kein CRM erreichbar, geht jeder neue Lead an den Alert-Kanal.
- WhatsApp-Benachrichtigung: über das CRM oder n8n/Make (WhatsApp Business API) an denselben Webhook hängen.
