import { useState } from 'react';
import type { BoltIcon } from '@heroicons/react/24/outline';
import {
  ArrowLeftIcon,
  ArrowTrendingDownIcon,
  BeakerIcon,
  CheckCircleIcon,
  CreditCardIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  GiftIcon,
  PencilSquareIcon,
  PlayIcon,
  PresentationChartLineIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import type { Funnel, FunnelStepKind } from './demoData';
import { GhostButton, GradientButton, os } from './Ui';

const stepIcons: Record<FunnelStepKind, typeof BoltIcon> = {
  landing: RectangleGroupIcon,
  optin: CursorArrowRaysIcon,
  sales: DocumentTextIcon,
  checkout: CreditCardIcon,
  upsell: GiftIcon,
  thankyou: CheckCircleIcon,
  webinar: PresentationChartLineIcon,
  email: EnvelopeIcon,
};

function formatEuro(value: number) {
  return `${value.toLocaleString('de-DE')} €`;
}

export function OsFunnelDetail({
  funnel,
  onBack,
  onToggle,
}: {
  funnel: Funnel;
  onBack: () => void;
  onToggle: () => void;
}) {
  const [settings, setSettings] = useState(funnel.settings);
  const isLive = funnel.status === 'Live';
  const topVisitors = funnel.steps[0]?.visitors || 1;

  const metrics = [
    { label: 'Besucher', value: funnel.visitors30d.toLocaleString('de-DE'), hint: 'letzte 30 Tage' },
    { label: 'Conversion', value: `${funnel.conversion.toLocaleString('de-DE')} %`, hint: 'Besucher → Kunde' },
    { label: 'Umsatz', value: formatEuro(funnel.revenue30d), hint: 'letzte 30 Tage' },
    {
      label: 'Umsatz / Besucher',
      value: funnel.visitors30d > 0 ? formatEuro(Math.round(funnel.revenue30d / funnel.visitors30d)) : '—',
      hint: 'EPC',
    },
  ];

  return (
    <div>
      <button
        onClick={onBack}
        className={classNames(
          'inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#F4F5F9]',
          os.textSecondary,
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Zurück zu Funnels
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
            <RectangleGroupIcon className="size-6 text-[#A78BFA]" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{funnel.name}</h1>
              <span
                className={classNames(
                  'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                  isLive
                    ? 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]'
                    : funnel.status === 'Pausiert'
                      ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]'
                      : 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
                )}
              >
                {funnel.status}
              </span>
            </div>
            <p className={classNames('mt-1 text-sm', os.textSecondary)}>
              {funnel.offer} · {formatEuro(funnel.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GhostButton className="!px-4 !py-2.5 text-xs">
            <PencilSquareIcon className="size-4" />
            Bearbeiten
          </GhostButton>
          {funnel.status === 'Entwurf' ? (
            <GradientButton className="!px-4 !py-2.5 text-xs" onClick={onToggle}>
              <PlayIcon className="size-4" />
              Live schalten
            </GradientButton>
          ) : (
            <GhostButton className="!px-4 !py-2.5 text-xs" onClick={onToggle}>
              {isLive ? 'Pausieren' : 'Fortsetzen'}
            </GhostButton>
          )}
        </div>
      </div>

      {/* Metriken */}
      <section aria-label="Kennzahlen" className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className={classNames(os.card, 'p-5')}>
            <p className={classNames('text-xs font-medium uppercase tracking-wider', os.textMuted)}>{metric.label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {metric.value}
            </p>
            <p className={classNames('mt-1 text-xs', os.textMuted)}>{metric.hint}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Funnel-Fluss */}
        <section className={classNames(os.card, 'p-6 xl:col-span-2')}>
          <div className="flex items-center gap-2">
            <ArrowTrendingDownIcon className="size-5 text-[#A78BFA]" />
            <h2 className="text-base font-semibold">Funnel-Verlauf</h2>
          </div>
          <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Besucher und Abbruch pro Schritt</p>

          <ol className="mt-6 space-y-3">
            {funnel.steps.map((step, i) => {
              const Icon = stepIcons[step.kind];
              const widthPct = Math.max((step.visitors / topVisitors) * 100, 6);
              const prev = i > 0 ? funnel.steps[i - 1].visitors : null;
              const stepConv = prev && prev > 0 ? (step.visitors / prev) * 100 : null;
              const dropOff = prev && prev > 0 ? prev - step.visitors : null;
              return (
                <li key={i}>
                  {stepConv !== null && (
                    <div className="flex items-center gap-2 py-1 pl-2 text-xs">
                      <ArrowTrendingDownIcon className="size-3.5 text-[#6B7288]" />
                      <span className={os.textMuted} style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {stepConv.toLocaleString('de-DE', { maximumFractionDigits: 1 })} % weiter
                        {dropOff ? ` · ${dropOff.toLocaleString('de-DE')} Abbrecher` : ''}
                      </span>
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8B5CF6]/25 to-[#5B7CFA]/10"
                      style={{ width: `${widthPct}%` }}
                    />
                    <div className="relative flex items-center gap-3 p-3.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                        <Icon className="size-5 text-[#A78BFA]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className={classNames('truncate text-xs', os.textMuted)}>{step.detail}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {step.visitors.toLocaleString('de-DE')}
                        </p>
                        {step.revenue ? (
                          <p className="text-xs font-semibold text-[#6EE7B7]">+{formatEuro(step.revenue)}</p>
                        ) : (
                          <p className={classNames('text-xs', os.textMuted)}>Besucher</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Rechte Spalte */}
        <div className="space-y-4">
          {funnel.abTest && (
            <section className={classNames(os.card, 'p-6')}>
              <div className="flex items-center gap-2">
                <BeakerIcon className="size-5 text-[#A78BFA]" />
                <h2 className="text-base font-semibold">A/B-Test läuft</h2>
              </div>
              <p className={classNames('mt-0.5 text-xs', os.textMuted)}>{funnel.abTest.name}</p>
              <div className="mt-4 space-y-3">
                {(['A', 'B'] as const).map((variant) => {
                  const pct =
                    variant === funnel.abTest!.leader ? funnel.abTest!.leaderPct : 100 - funnel.abTest!.leaderPct;
                  const isLeader = variant === funnel.abTest!.leader;
                  const text = variant === 'A' ? funnel.abTest!.variantA : funnel.abTest!.variantB;
                  return (
                    <div key={variant}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-medium">
                          Variante {variant}
                          {isLeader && <span className="ml-2 text-xs font-semibold text-[#6EE7B7]">führt</span>}
                        </span>
                        <span className="font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {pct} %
                        </span>
                      </div>
                      <p className={classNames('mt-0.5 truncate text-xs', os.textMuted)}>{text}</p>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={classNames('h-full rounded-full', isLeader ? 'bg-[#34D399]' : 'bg-[#6B7288]')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className={classNames(os.card, 'p-6')}>
            <h2 className="text-base font-semibold">Einstellungen</h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Traffic, Zielgruppe & Follow-up</p>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className={classNames('text-xs font-medium', os.textMuted)}>Traffic-Quelle</p>
                <p className="mt-1 font-medium">{settings.traffic}</p>
              </div>
              <div>
                <p className={classNames('text-xs font-medium', os.textMuted)}>Zielgruppe</p>
                <p className="mt-1 font-medium">{settings.audience}</p>
              </div>
              <div>
                <p className={classNames('text-xs font-medium', os.textMuted)}>Follow-up</p>
                <input
                  value={settings.followUp}
                  onChange={(e) => setSettings((s) => ({ ...s, followUp: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-[#F4F5F9] focus:border-[#8B5CF6]/60 focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
