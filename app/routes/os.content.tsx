import type { MetaFunction } from '@vercel/remix';
import { OsContent } from '~/components/os/OsContent';

export const meta: MetaFunction = () => {
  return [
    { title: 'Content-Engine — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content: 'Content-Kalender, KI-Generierung, Plattform-Vorschau und Veröffentlichungs-Workflow für alle Kanäle.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsContentRoute() {
  return <OsContent />;
}
