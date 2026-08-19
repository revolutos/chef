import type { MetaFunction } from '@vercel/remix';
import { OsMap } from '~/components/os/OsMap';

export const meta: MetaFunction = () => {
  return [
    { title: 'Experten-Karte — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content:
        'Finde deutschsprachige Sales-Experten (Setter, Closer, Terminierer, Opener) auf der Karte — in deiner Nähe oder weltweit. Filtern, connecten, Events & Zoom-Calls organisieren.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsMapRoute() {
  return <OsMap />;
}
