import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CpuChipIcon,
  PaperAirplaneIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { aiActivities, leadSources, pipelineLeads, quickPrompts, revenueSeries } from './demoData';
import type { PipelineStatus } from './demoData';
import { GlowOrb, GradientButton, os } from './Ui';
import { OsShell } from './OsShell';
import { TrendChart } from './TrendChart';

function formatEuro(value: number) {
  return `${value.toLocaleString('de-DE')} €`;
}

const kpis = [
  { label: 'Monatsumsatz', value: '24.860 €', delta: '+18,2 %', up: true, hint: 'vs. Vormonat' },
  { label: 'Neue Leads', value: '342', delta: '+12,4 %', up: true, hint: 'letzte 30 Tage' },
  { label: 'Conversion-Rate', value: '4,8 %', delta: '+0,6 Pkt.', up: true, hint: 'Funnel gesamt' },
  { label: 'Zeit gespart', value: '38 Std.', delta: '−2,1 Std.', up: false, hint: 'durch Automationen' },
];

const statusStyles: Record<PipelineStatus, string> = {
  Neu: 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
  Qualifiziert: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-[#C4B5FD]',
  'Call gebucht': 'border-[#5B7CFA]/40 bg-[#5B7CFA]/15 text-[#A5B8FF]',
  Gewonnen: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
};

export function OsDashboard() {
  return (
    <OsShell active="dashboard">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guten Morgen, Viktor 👋</h1>
          <p className={classNames('mt-1 text-sm', os.textSecondary)}>
            Dein OS hat heute Nacht <span className="font-semibold text-[#C4B5FD]">14 Aufgaben</span> automatisch
            erledigt.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/[0.07]">
            Bericht exportieren
          </button>
          <GradientButton className="!px-4 !py-2.5">
            <PlusIcon className="size-4" />
            Neue Automation
          </GradientButton>
        </div>
      </div>

      {/* KPIs */}
      <section aria-label="Kennzahlen" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={classNames(os.card, os.cardHover, 'p-5')}>
            <p className={classNames('text-xs font-medium uppercase tracking-wider', os.textMuted)}>{kpi.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {kpi.value}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs">
              <span
                className={classNames(
                  'inline-flex items-center gap-1 font-semibold',
                  kpi.up ? 'text-[#34D399]' : 'text-[#F87171]',
                )}
              >
                {kpi.up ? <ArrowTrendingUpIcon className="size-3.5" /> : <ArrowTrendingDownIcon className="size-3.5" />}
                {kpi.delta}
              </span>
              <span className={os.textMuted}>{kpi.hint}</span>
            </p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={classNames(os.card, 'p-6 xl:col-span-2')}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold">Umsatzentwicklung</h2>
              <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Juni · alle Einnahmequellen</p>
            </div>
            <p className="text-sm font-semibold text-[#C4B5FD]">Prognose Juli: 29.400 €</p>
          </div>
          <div className="mt-5">
            <TrendChart
              data={revenueSeries}
              ariaLabel="Umsatzentwicklung der letzten 30 Tage"
              formatValue={formatEuro}
            />
          </div>
        </div>

        <div className={classNames(os.card, 'p-6')}>
          <h2 className="text-base font-semibold">Lead-Quellen</h2>
          <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Neue Leads · letzte 30 Tage</p>
          <ul className="mt-6 space-y-5">
            {leadSources.map((source) => {
              const max = leadSources[0].value;
              return (
                <li key={source.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{source.name}</span>
                    <span
                      className={classNames('font-semibold', os.textSecondary)}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {source.value}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-[#9085E9]"
                      style={{ width: `${(source.value / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Pipeline + Aktivitäten */}
      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={classNames(os.card, 'overflow-hidden xl:col-span-2')}>
          <div className="flex items-center justify-between px-6 pt-6">
            <div>
              <h2 className="text-base font-semibold">Lead-Pipeline</h2>
              <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Automatisch priorisiert durch dein OS</p>
            </div>
            <a href="/os/crm" className="text-sm font-semibold text-[#A78BFA] transition-colors hover:text-[#C4B5FD]">
              Alle ansehen →
            </a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr
                  className={classNames('border-b border-white/[0.07] text-xs uppercase tracking-wider', os.textMuted)}
                >
                  <th className="px-6 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Angebot</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Wert</th>
                  <th className="px-6 py-3 text-right font-medium">Datum</th>
                </tr>
              </thead>
              <tbody>
                {pipelineLeads.map((lead) => (
                  <tr key={lead.name} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                    <td className="px-6 py-3.5 font-medium">{lead.name}</td>
                    <td className={classNames('px-4 py-3.5', os.textSecondary)}>{lead.offer}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={classNames(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
                          statusStyles[lead.status],
                        )}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {lead.value}
                    </td>
                    <td className={classNames('px-6 py-3.5 text-right', os.textMuted)}>{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={classNames(os.card, 'p-6')}>
          <h2 className="text-base font-semibold">KI-Aktivitäten</h2>
          <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Was dein OS zuletzt erledigt hat</p>
          <ul className="mt-5 space-y-4">
            {aiActivities.map((activity) => (
              <li key={activity.text} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                  <BoltIcon className="size-4 text-[#A78BFA]" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{activity.text}</p>
                  <p className={classNames('mt-0.5 text-xs', os.textMuted)}>
                    {activity.detail} · {activity.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* KI-Assistent */}
      <section className={classNames(os.card, 'relative mt-6 overflow-hidden p-6')}>
        <GlowOrb className="-right-20 -top-24 size-64 bg-[#5B7CFA]/20" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <CpuChipIcon className="size-5 text-[#A78BFA]" />
            <h2 className="text-base font-semibold">Frag dein Business OS</h2>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder={'z. B. „Welche Leads sollte ich heute anrufen?"'}
              className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:border-[#8B5CF6]/60 focus:outline-none"
            />
            <GradientButton>
              <PaperAirplaneIcon className="size-4" />
              Senden
            </GradientButton>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                className={classNames(
                  'rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]',
                  os.textSecondary,
                )}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>
    </OsShell>
  );
}
