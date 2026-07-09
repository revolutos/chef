import type { MetaFunction } from '@vercel/remix';
import { OsLanding } from '~/components/os/OsLanding';

export const meta: MetaFunction = () => {
  return [
    { title: 'REVOLUTOS — Das KI Business OS für Selbständige, Coaches & Creator' },
    {
      name: 'description',
      content:
        'CRM, Content, Funnels, Automationen und Analytics in einem KI-gesteuerten Cockpit. Das Operating System für Coaches, Consultants, Creator, Affiliates und digitale Unternehmer.',
    },
  ];
};

export default function OsIndexRoute() {
  return <OsLanding />;
}
