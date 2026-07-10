import type { MetaFunction } from '@vercel/remix';
import { OsCrm } from '~/components/os/OsCrm';

export const meta: MetaFunction = () => {
  return [
    { title: 'CRM & Leads — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content: 'Alle Leads im Blick: KI-Score, Pipeline-Phasen, Kanban-Board und automatische Priorisierung.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsCrmRoute() {
  return <OsCrm />;
}
