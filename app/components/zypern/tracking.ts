import { conversionValues } from './config';

/**
 * Tracking-Schicht der Landingpage. Alle Events laufen über `window.dataLayer`
 * und werden in Google Tag Manager an GA4, Google Ads und optional Meta verteilt.
 * Ohne Einwilligung greifen die Consent-Mode-Defaults (denied).
 */

export type ConversionEvent =
  | 'landing_page_view'
  | 'buying_profile_started'
  | 'budget_selected'
  | 'qualification_completed'
  | 'lead_submitted'
  | 'qualified_lead'
  | 'high_quality_lead'
  | 'calendar_opened'
  | 'appointment_booked'
  | 'viewing_requested'
  // Nur serverseitig/CRM (Offline-Conversion-Import):
  | 'sales_accepted_lead'
  | 'property_purchase';

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function track(
  event: ConversionEvent | 'virtual_page_view' | 'ab_exposure' | 'cta_click',
  params: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') {
    return;
  }
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  const value = conversionValues[event as keyof typeof conversionValues];
  w.dataLayer.push({
    event,
    ...(typeof value === 'number' ? { value, currency: conversionValues.currency } : {}),
    ...params,
  });
}

/** Enhanced Conversions: nutzerbezogene Daten für die GTM-Variable „User-Provided Data“. */
export function setUserData(data: { email: string; phone: string; firstName: string; lastName: string }) {
  if (typeof window === 'undefined') {
    return;
  }
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    user_data: {
      email: data.email.trim().toLowerCase(),
      phone_number: data.phone || undefined,
      address: { first_name: data.firstName.trim(), last_name: data.lastName.trim() },
    },
  });
}

/* ------------------------------------------------------------------ */
/* Attribution: UTM + Klick-IDs werden mit dem Lead ans CRM übergeben  */
/* ------------------------------------------------------------------ */

const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  // ValueTrack-Parameter aus der Tracking-Vorlage
  'campaignid',
  'adgroupid',
  'keyword',
  'matchtype',
  'device',
  'network',
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>> & {
  landing_url?: string;
  referrer?: string;
  first_seen_at?: string;
};

const STORAGE_KEY = 'zy_attribution';

/** Liest Parameter aus der URL und hält sie für die Sitzung vor (erste Berührung gewinnt). */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') {
    return {};
  }
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) {
      fresh[key] = value.slice(0, 200);
    }
  }
  const hasNewClick = Boolean(fresh.gclid || fresh.gbraid || fresh.wbraid || fresh.utm_source);
  const result: Attribution =
    hasNewClick || !stored.first_seen_at
      ? {
          ...fresh,
          landing_url: window.location.href.slice(0, 500),
          referrer: document.referrer.slice(0, 300),
          first_seen_at: new Date().toISOString(),
        }
      : stored;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Speicher blockiert (privater Modus) – Attribution gilt dann nur für diesen Seitenaufruf.
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* Consent Mode v2                                                     */
/* ------------------------------------------------------------------ */

export type ConsentChoice = 'all' | 'necessary';
const CONSENT_KEY = 'zy_consent';

export function readConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'all' || value === 'necessary' ? value : null;
  } catch {
    return null;
  }
}

export function applyConsent(choice: ConsentChoice, persist = true) {
  if (typeof window === 'undefined') {
    return;
  }
  const granted = choice === 'all' ? 'granted' : 'denied';
  const w = window as DataLayerWindow & { gtag?: (...args: unknown[]) => void };
  w.gtag?.('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted,
  });
  w.dataLayer?.push({ event: 'consent_update', consent_choice: choice });
  if (persist) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // ignorieren
    }
  }
}

/**
 * Inline-Script für den <head>: Consent-Defaults setzen, bevor GTM lädt.
 * Gespeicherte Einwilligungen werden sofort angewendet, damit Rückkehrer korrekt erfasst werden.
 */
export function consentBootstrapScript(gtmId: string | null) {
  const gtm = gtmId
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`
    : '';
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
try{var c=localStorage.getItem('${CONSENT_KEY}');if(c==='all'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}
${gtm}`;
}
