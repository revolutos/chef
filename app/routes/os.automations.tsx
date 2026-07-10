import type { MetaFunction } from '@vercel/remix';
import { OsAutomations } from '~/components/os/OsAutomations';

export const meta: MetaFunction = () => {
  return [
    { title: 'Automationen — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content: 'KI-Automationen für Follow-ups, Content, Rechnungen und Reports — dein Team, das nie schläft.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsAutomationsRoute() {
  return <OsAutomations />;
}
