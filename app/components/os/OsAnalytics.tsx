import { useState } from 'react';
import { ArrowDownTrayIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { analyticsRanges, heatmapDays, heatmapSlots, leadHeatmap } from './demoData';
import type { AnalyticsRangeKey } from './demoData';
import { GhostButton, os } from './Ui';
import { OsShell } from './OsShell';
import { TrendChart } from './TrendChart';

const rangeKeys: AnalyticsRangeKey[] = ['7d', '30d', '90d'];
const rangeLabels: Record<AnalyticsRangeKey, string> = { '7d': '7 Tage', '30d': '30 Tage', '90d': '90 Tage' };

function formatEuro(value: number) {
  return `${value.toLocaleString('de-DE')} €`;
}

export function OsAnalytics() {
  const [range, setRange] = useState<AnalyticsRangeKey>('30d');
  const data = analyticsRanges[range];

  const maxChannelLeads = Math.max(...data.channels.map((c) => c.leads));

  return (
    <OsShell active="analytics" searchPlaceholder="Suche in Analytics …">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className={classNames('mt-1 text-sm', os.textSecondary)}>
            Alle Zahlen deines Business — von der KI analysiert und aufbereitet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-white/[0.1] bg-white/[0.03] p-1">
            {rangeKeys.map((key) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                aria-pressed={range === key}
                className={classNames(
                  'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  range === key ? 'bg-[#8B5CF6]/25 text-[#C4B5FD]' : 'text-[#A6ACC2] hover:text-[#F4F5F9]',
                )}
              >
                {rangeLabels[key]}
              </button>
            ))}
          </div>
          <GhostButton className="!px-4 !py-2.5 text-xs">
            <ArrowDownTrayIcon className="size-4" />
            Export
          </GhostButton>
        </div>
      </div>

      {/* KPIs */}
      <section aria-label="Analytics-Kennzahlen" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
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
              <span className={os.textMuted}>vs. Vorperiode</span>
            </p>
          </div>
        ))}
      </section>

      {/* Lead-Trend + Funnel */}
      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={classNames(os.card, 'p-6 xl:col-span-2')}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold">Lead-Trend</h2>
              <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Neue Leads pro Tag · {data.label}</p>
            </div>
          </div>
          <div className="mt-5">
            <TrendChart
              data={data.leadTrend}
              ariaLabel={`Neue Leads pro Tag, ${data.label}`}
              formatValue={(v) => `${v} Leads`}
            />
          </div>
        </div>

        <div className={classNames(os.card, 'p-6')}>
          <h2 className="text-base font-semibold">Conversion-Funnel</h2>
          <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Vom Besucher zum Kunden · {data.label}</p>
          <ul className="mt-6 space-y-5">
            {data.funnel.map((stage, i) => {
              const first = data.funnel[0].value;
              const prev = i > 0 ? data.funnel[i - 1].value : null;
              const width = Math.max((stage.value / first) ** 0.4 * 100, 8);
              return (
                <li key={stage.stage}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {stage.value.toLocaleString('de-DE')}
                      </span>
                      {prev !== null && (
                        <span
                          className={classNames('text-xs', os.textMuted)}
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {((stage.value / prev) * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 })} %
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Kanäle + Heatmap */}
      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={classNames(os.card, 'overflow-hidden xl:col-span-2')}>
          <div className="px-6 pt-6">
            <h2 className="text-base font-semibold">Kanal-Performance</h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Leads, Conversion und Umsatz · {data.label}</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr
                  className={classNames('border-b border-white/[0.07] text-xs uppercase tracking-wider', os.textMuted)}
                >
                  <th className="px-6 py-3 font-medium">Kanal</th>
                  <th className="px-4 py-3 font-medium">Leads</th>
                  <th className="px-4 py-3 text-right font-medium">Conversion</th>
                  <th className="px-4 py-3 text-right font-medium">Umsatz</th>
                  <th className="px-6 py-3 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.channels.map((channel) => (
                  <tr key={channel.name} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                    <td className="px-6 py-3.5 font-medium">{channel.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-[#9085E9]"
                            style={{ width: `${(channel.leads / maxChannelLeads) * 100}%` }}
                          />
                        </div>
                        <span
                          className={classNames('text-xs font-semibold', os.textSecondary)}
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {channel.leads}
                        </span>
                      </div>
                    </td>
                    <td
                      className={classNames('px-4 py-3.5 text-right', os.textSecondary)}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {channel.conversion.toLocaleString('de-DE')} %
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatEuro(channel.revenue)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span
                        className={classNames(
                          'inline-flex items-center gap-1 text-xs font-semibold',
                          channel.deltaPct >= 0 ? 'text-[#34D399]' : 'text-[#F87171]',
                        )}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {channel.deltaPct >= 0 ? (
                          <ArrowTrendingUpIcon className="size-3.5" />
                        ) : (
                          <ArrowTrendingDownIcon className="size-3.5" />
                        )}
                        {channel.deltaPct > 0 ? '+' : ''}
                        {channel.deltaPct} %
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={classNames(os.card, 'p-6')}>
          <h2 className="text-base font-semibold">Beste Zeiten für Leads</h2>
          <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Lead-Aufkommen nach Wochentag & Uhrzeit</p>
          <div className="mt-6">
            <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-1.5">
              <span />
              {heatmapSlots.map((slot) => (
                <span key={slot} className={classNames('text-center text-[10px] font-medium', os.textMuted)}>
                  {slot}
                </span>
              ))}
              {heatmapDays.map((day, dayIdx) => (
                <div key={day} className="contents">
                  <span className={classNames('flex items-center pr-1 text-[10px] font-medium', os.textMuted)}>
                    {day}
                  </span>
                  {leadHeatmap[dayIdx].map((intensity, slotIdx) => (
                    <div
                      key={slotIdx}
                      title={`${day} ${heatmapSlots[slotIdx]} Uhr`}
                      className="aspect-square rounded-md border border-white/[0.04]"
                      style={{ backgroundColor: `rgba(144, 133, 233, ${0.06 + intensity * 0.84})` }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className={classNames('mt-4 flex items-center justify-end gap-2 text-[10px]', os.textMuted)}>
              Wenig
              {[0.1, 0.35, 0.6, 0.85].map((intensity) => (
                <span
                  key={intensity}
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: `rgba(144, 133, 233, ${0.06 + intensity * 0.84})` }}
                />
              ))}
              Viel
            </div>
            <p className={classNames(os.card, 'mt-5 p-4 text-xs leading-relaxed', os.textSecondary)}>
              <span className="font-semibold text-[#C4B5FD]">KI-Insight:</span> Sonntagabend (18–24 Uhr) ist dein
              stärkstes Zeitfenster — plane deine wichtigsten Posts und Kampagnen dort ein.
            </p>
          </div>
        </div>
      </section>
    </OsShell>
  );
}
