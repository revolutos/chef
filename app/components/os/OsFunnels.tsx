import { useMemo, useState } from 'react';
import { ArrowRightIcon, PlusIcon, RectangleGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { funnels as funnelSeed, funnelTemplates } from './demoData';
import type { Funnel, FunnelStatus } from './demoData';
import { GradientButton, os } from './Ui';
import { OsShell } from './OsShell';
import { OsFunnelDetail } from './OsFunnelDetail';

const statusStyles: Record<FunnelStatus, string> = {
  Live: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
  Pausiert: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]',
  Entwurf: 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
};

const filterOptions = ['Alle', 'Live', 'Pausiert', 'Entwurf'] as const;
type FilterOption = (typeof filterOptions)[number];

function formatEuro(value: number) {
  return `${value.toLocaleString('de-DE')} €`;
}

export function OsFunnels() {
  const [items, setItems] = useState<Funnel[]>(funnelSeed);
  const [filter, setFilter] = useState<FilterOption>('Alle');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === 'Alle' ? items : items.filter((f) => f.status === filter)),
    [items, filter],
  );

  const live = items.filter((f) => f.status === 'Live');
  const totalRevenue = items.reduce((sum, f) => sum + f.revenue30d, 0);
  const totalVisitors = items.reduce((sum, f) => sum + f.visitors30d, 0);
  const avgConversion = live.length > 0 ? live.reduce((sum, f) => sum + f.conversion, 0) / live.length : 0;

  const kpis = [
    { label: 'Aktive Funnels', value: String(live.length), hint: `von ${items.length} gesamt` },
    { label: 'Umsatz', value: formatEuro(totalRevenue), hint: 'letzte 30 Tage' },
    { label: 'Besucher', value: totalVisitors.toLocaleString('de-DE'), hint: 'letzte 30 Tage' },
    {
      label: 'Ø Conversion',
      value: `${avgConversion.toLocaleString('de-DE', { maximumFractionDigits: 1 })} %`,
      hint: 'aktive Funnels',
    },
  ];

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((f) => {
        if (f.id !== id) {
          return f;
        }
        const status: FunnelStatus = f.status === 'Live' ? 'Pausiert' : 'Live';
        return { ...f, status };
      }),
    );
  };

  const selected = items.find((f) => f.id === selectedId) ?? null;

  return (
    <OsShell active="funnels" searchPlaceholder="Suche in Funnels …">
      {selected ? (
        <OsFunnelDetail
          funnel={selected}
          onBack={() => setSelectedId(null)}
          onToggle={() => toggleStatus(selected.id)}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Funnels & Angebote</h1>
              <p className={classNames('mt-1 text-sm', os.textSecondary)}>
                Baue Wege, die aus Besuchern Kunden machen — und sieh genau, wo sie abspringen.
              </p>
            </div>
            <GradientButton className="!px-4 !py-2.5">
              <PlusIcon className="size-4" />
              Neuer Funnel
            </GradientButton>
          </div>

          {/* KPIs */}
          <section aria-label="Funnel-Kennzahlen" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className={classNames(os.card, os.cardHover, 'p-5')}>
                <p className={classNames('text-xs font-medium uppercase tracking-wider', os.textMuted)}>{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {kpi.value}
                </p>
                <p className={classNames('mt-2 text-xs', os.textMuted)}>{kpi.hint}</p>
              </div>
            ))}
          </section>

          {/* Filter */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={classNames(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                  filter === option
                    ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
                    : 'border-white/[0.1] bg-white/[0.03] text-[#A6ACC2] hover:border-white/[0.2]',
                )}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Funnel-Karten */}
          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((funnel) => {
              const topVisitors = funnel.steps[0]?.visitors || 1;
              return (
                <div
                  key={funnel.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(funnel.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(funnel.id);
                    }
                  }}
                  className={classNames(os.card, os.cardHover, 'cursor-pointer p-5 text-left')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                        <RectangleGroupIcon className="size-5 text-[#A78BFA]" />
                      </span>
                      <div>
                        <h2 className="text-base font-semibold">{funnel.name}</h2>
                        <p className={classNames('text-xs', os.textMuted)}>
                          {funnel.offer} · {formatEuro(funnel.price)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={classNames(
                        'inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                        statusStyles[funnel.status],
                      )}
                    >
                      {funnel.status}
                    </span>
                  </div>

                  {/* Mini-Funnel */}
                  <div className="mt-4 flex items-end gap-1" aria-hidden="true">
                    {funnel.steps.map((step, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-[#8B5CF6]/60 to-[#5B7CFA]/40"
                        style={{ height: `${Math.max((step.visitors / topVisitors) * 40, 4)}px` }}
                        title={`${step.title}: ${step.visitors.toLocaleString('de-DE')}`}
                      />
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4">
                    <div>
                      <p className={classNames('text-[11px] uppercase tracking-wider', os.textMuted)}>Besucher</p>
                      <p className="mt-0.5 text-sm font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {funnel.visitors30d.toLocaleString('de-DE')}
                      </p>
                    </div>
                    <div>
                      <p className={classNames('text-[11px] uppercase tracking-wider', os.textMuted)}>Conversion</p>
                      <p
                        className="mt-0.5 text-sm font-bold text-[#C4B5FD]"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {funnel.conversion.toLocaleString('de-DE')} %
                      </p>
                    </div>
                    <div>
                      <p className={classNames('text-[11px] uppercase tracking-wider', os.textMuted)}>Umsatz</p>
                      <p
                        className="mt-0.5 text-sm font-bold text-[#6EE7B7]"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatEuro(funnel.revenue30d)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA]">
                    {funnel.steps.length} Schritte · Funnel öffnen
                    <ArrowRightIcon className="size-3.5" />
                  </p>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className={classNames(os.card, 'p-10 text-center text-sm lg:col-span-2', os.textMuted)}>
                Keine Funnels mit diesem Status.
              </p>
            )}
          </section>

          {/* Vorlagen */}
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-[#A78BFA]" />
              <h2 className="text-base font-semibold">Funnel-Vorlagen</h2>
            </div>
            <p className={classNames('mt-1 text-sm', os.textSecondary)}>
              Bewährte Strukturen — die KI baut Seiten und Texte für dein Angebot.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {funnelTemplates.map((template) => (
                <div key={template.name} className={classNames(os.card, os.cardHover, 'flex flex-col p-5')}>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-[#5B7CFA]/30 bg-[#5B7CFA]/10">
                    <RectangleGroupIcon className="size-5 text-[#A5B8FF]" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{template.name}</h3>
                  <p className={classNames('mt-1 flex-1 text-xs leading-relaxed', os.textSecondary)}>
                    {template.description}
                  </p>
                  <p className={classNames('mt-3 text-xs font-semibold', os.textMuted)}>{template.steps}</p>
                  <button className="mt-3 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-semibold transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]">
                    Vorlage verwenden
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </OsShell>
  );
}
