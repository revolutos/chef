import type { MetaFunction } from '@vercel/remix';
import { OsAnalytics } from '~/components/os/OsAnalytics';

export const meta: MetaFunction = () => {
  return [
    { title: 'Analytics — REVOLUTOS KI Business OS' },
    {
      name: 'description',
      content: 'Lead-Trend, Conversion-Funnel, Kanal-Performance und beste Posting-Zeiten auf einen Blick.',
    },
    { name: 'robots', content: 'noindex' },
  ];
};

export default function OsAnalyticsRoute() {
  return <OsAnalytics />;
}
