import type { MetaFunction } from '@vercel/remix';
import { OsDashboard } from '~/components/os/OsDashboard';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content: 'Dein Business-Cockpit: Umsatz, Leads, Automationen und KI-Aktivitäten auf einen Blick.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsDashboardRoute() {
  return <OsDashboard />;
}
