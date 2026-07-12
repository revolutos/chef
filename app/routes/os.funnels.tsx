import type { MetaFunction } from '@vercel/remix';
import { OsFunnels } from '~/components/os/OsFunnels';

export const meta: MetaFunction = () => {
  return [
    { title: 'Funnels & Angebote — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content: 'Funnels bauen und optimieren: Schritt-für-Schritt-Conversion, Abbruch-Analyse, A/B-Tests und Umsatz.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsFunnelsRoute() {
  return <OsFunnels />;
}
