import {
  json,
  type HeadersFunction,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { resolveExperiment } from '~/components/zypern/ab';
import { PAGE_URL } from '~/components/zypern/config';
import { structuredData } from '~/components/zypern/faq';
import { consentBootstrapScript } from '~/components/zypern/tracking';
import { ZypernLanding } from '~/components/zypern/ZypernLanding';
import { getEnv } from '~/lib/.server/env';

/** Serverseitig gerendert, ohne App-Provider (siehe root.tsx). */
export const handle = { standalone: true };

const TITLE = 'Zypern Immobilien kaufen | Deutsche Beratung vor Ort';
const DESCRIPTION =
  'Immobilie auf Zypern kaufen? Teilen Sie uns Budget, Region und Kaufziel mit. Wir finden passende Immobilien und begleiten Sie deutschsprachig vor Ort.';

export const meta: MetaFunction = () => [
  { title: TITLE },
  { name: 'description', content: DESCRIPTION },
  { tagName: 'link', rel: 'canonical', href: PAGE_URL },
  { name: 'robots', content: 'index, follow, max-image-preview:large' },
  { name: 'theme-color', content: '#F6F2EB' },
  { property: 'og:type', content: 'website' },
  { property: 'og:locale', content: 'de_DE' },
  { property: 'og:title', content: TITLE },
  { property: 'og:description', content: DESCRIPTION },
  { property: 'og:url', content: PAGE_URL },
  { property: 'og:site_name', content: 'REVOLUTOS' },
  { 'script:ld+json': structuredData() },
];

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { experiment, setCookie } = resolveExperiment(request.headers.get('cookie'), new URL(request.url));
  const headers = new Headers({ 'Cache-Control': 'private, no-store', Vary: 'Cookie' });
  if (setCookie) {
    headers.append('Set-Cookie', setCookie);
  }
  return json(
    {
      experiment,
      gtmId: getEnv('ZYPERN_GTM_ID') ?? null,
      turnstileSiteKey: getEnv('ZYPERN_TURNSTILE_SITE_KEY') ?? null,
    },
    { headers },
  );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => ({
  'Cache-Control': loaderHeaders.get('Cache-Control') ?? 'private, no-store',
  Vary: 'Cookie',
});

export default function ZypernImmobilienKaufenRoute() {
  const { experiment, gtmId, turnstileSiteKey } = useLoaderData<typeof loader>();
  return (
    <>
      {/* Consent-Mode-Defaults und GTM vor jedem Tag laden */}
      <script dangerouslySetInnerHTML={{ __html: consentBootstrapScript(gtmId) }} />
      {gtmId && (
        <noscript>
          <iframe
            title="Google Tag Manager"
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
      <ZypernLanding experiment={experiment} turnstileSiteKey={turnstileSiteKey} />
    </>
  );
}
