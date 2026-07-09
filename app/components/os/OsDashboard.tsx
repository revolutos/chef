import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  BoltIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  PlusIcon,
  RocketLaunchIcon,
  Squares2X2Icon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { aiActivities, leadSources, pipelineLeads, quickPrompts, revenueSeries } from './demoData';
import type { PipelineStatus } from './demoData';
import { BrandMark, GlowOrb, GradientButton, os } from './Ui';
import { RevenueChart } from './RevenueChart';

const nav = [
  {
    section: 'Übersicht',
    items: [
      { label: 'Dashboard', icon: Squares2X2Icon, active: true },
      { label: 'KI-Assistent', icon: CpuChipIcon },
    ],
  },
  {
    section: 'Business',
    items: [
      { label: 'CRM & Leads', icon: UsersIcon },
      { label: 'Content-Engine', icon: PencilSquareIcon },
      { label: 'Funnels & Angebote', icon: FunnelIcon },
      { label: 'Automationen', icon: BoltIcon },
    ],
  },
  {
    section: 'Insights',
    items: [
      { label: 'Analytics', icon: ChartBarIcon },
      { label: 'Berichte', icon: DocumentChartBarIcon },
    ],
  },
];

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
    <div className={classNames('flex min-h-screen', os.page)}>
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#07080F] px-4 py-6 lg:flex">
        <a href="/os" className="px-2">
          <BrandMark />
        </a>

        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
          {nav.map((group) => (
            <div key={group.section}>
              <p className={classNames('px-3 text-[10px] font-semibold uppercase tracking-[0.2em]', os.textMuted)}>
                {group.section}
              </p>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className={classNames(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                        item.active
                          ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#5B7CFA]/10 text-[#F4F5F9] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]'
                          : 'text-[#A6ACC2] hover:bg-white/[0.05] hover:text-[#F4F5F9]',
                      )}
                    >
                      <item.icon className={classNames('size-5', item.active ? 'text-[#A78BFA]' : 'text-[#6B7288]')} />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/20 to-[#5B7CFA]/10 p-4">
          <RocketLaunchIcon className="size-6 text-[#A78BFA]" />
          <p className="mt-2 text-sm font-semibold">Scale-Plan freischalten</p>
          <p className={classNames('mt-1 text-xs leading-relaxed', os.textSecondary)}>
            KI-Agenten-Team, White-Label & unbegrenzte Kontakte.
          </p>
          <GradientButton className="mt-3 w-full !px-3 !py-2 text-xs">Jetzt upgraden</GradientButton>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] px-2 pt-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] text-xs font-bold text-white">
            VS
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">Viktor S.</p>
            <p className={classNames('truncate text-xs', os.textMuted)}>Pro-Plan</p>
          </div>
          <Cog6ToothIcon className="ml-auto size-5 shrink-0 text-[#6B7288]" />
        </div>
      </aside>

      {/* Main */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <GlowOrb className="-top-40 left-1/3 h-80 w-[36rem] bg-[#8B5CF6]/15" />

        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/[0.07] bg-[#05060B]/80 px-6 py-4 backdrop-blur-xl lg:px-10">
          <a href="/os" className="lg:hidden">
            <BrandMark compact />
          </a>
          <label className="relative hidden max-w-md flex-1 md:block">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7288]" />
            <input
              type="search"
              placeholder="Suche in Leads, Content, Automationen …"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:border-[#8B5CF6]/60 focus:outline-none"
            />
          </label>
          <div className="ml-auto flex items-center gap-3">
            <button className="rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[#A6ACC2] transition-colors hover:text-[#F4F5F9]">
              Letzte 30 Tage
            </button>
            <button
              aria-label="Benachrichtigungen"
              className="relative rounded-xl border border-white/[0.1] bg-white/[0.04] p-2.5 transition-colors hover:border-white/[0.2]"
            >
              <BellIcon className="size-5 text-[#A6ACC2]" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#8B5CF6]" />
            </button>
          </div>
        </header>

        <main className="relative px-6 py-8 lg:px-10">
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
                    {kpi.up ? (
                      <ArrowTrendingUpIcon className="size-3.5" />
                    ) : (
                      <ArrowTrendingDownIcon className="size-3.5" />
                    )}
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
                <RevenueChart data={revenueSeries} />
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
                <button className="text-sm font-semibold text-[#A78BFA] transition-colors hover:text-[#C4B5FD]">
                  Alle ansehen →
                </button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr
                      className={classNames(
                        'border-b border-white/[0.07] text-xs uppercase tracking-wider',
                        os.textMuted,
                      )}
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
                        <td
                          className="px-4 py-3.5 text-right font-semibold"
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
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
        </main>
      </div>
    </div>
  );
}
