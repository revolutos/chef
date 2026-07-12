import type { MetaFunction } from '@vercel/remix';
import { OsAssistant } from '~/components/os/OsAssistant';

export const meta: MetaFunction = () => {
  return [
    { title: 'KI-Assistent — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content:
        'Frag dein Business OS: Der Assistent kennt Leads, Umsatz, Content und Funnels und schlägt konkrete Schritte vor.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsAssistantRoute() {
  return <OsAssistant />;
}
