import { useMemo, useState } from 'react';
import { CalendarDaysIcon, SparklesIcon, TableCellsIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import {
  contentFormats,
  contentIdeas,
  contentItems,
  contentPlatforms,
  contentStatuses,
  contentTones,
  generateVariants,
  variantToBody,
  weekdayLabels,
} from './demoData';
import type { ContentFormat, ContentItem, ContentPlatform, ContentStatus, ContentTone } from './demoData';
import { GhostButton, GradientButton, os } from './Ui';
import { OsShell } from './OsShell';
import { OsContentEditor, platformMeta, statusStyles } from './OsContentEditor';

const inputClasses =
  'w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:border-[#8B5CF6]/60 focus:outline-none';

function PlatformIcon({ platform, className }: { platform: ContentPlatform; className?: string }) {
  const meta = platformMeta[platform];
  const Icon = meta.icon;
  return (
    <span className={classNames('flex items-center justify-center rounded-lg border', meta.ring, className)}>
      <Icon className={classNames('size-4', meta.tint)} />
    </span>
  );
}

function ContentCard({ item, onClick, compact }: { item: ContentItem; onClick: () => void; compact?: boolean }) {
  return (
    <button onClick={onClick} className={classNames(os.card, os.cardHover, 'block w-full p-3 text-left')}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform={item.platform} className="size-7" />
        <span
          className={classNames(
            'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold',
            statusStyles[item.status],
          )}
        >
          {item.status}
        </span>
        {item.aiGenerated && <SparklesIcon className="ml-auto size-3.5 text-[#A78BFA]" />}
      </div>
      <p className={classNames('mt-2 font-medium leading-snug', compact ? 'line-clamp-2 text-xs' : 'text-sm')}>
        {item.title}
      </p>
      {!compact && (
        <p className={classNames('mt-1 text-xs', os.textMuted)}>
          {item.format} · {item.dateLabel}
        </p>
      )}
      {compact && <p className={classNames('mt-1 text-[10px]', os.textMuted)}>{item.time}</p>}
    </button>
  );
}

/** KI-gestützter Flow zum Anlegen neuer Inhalte. */
function NewContentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (item: ContentItem) => void }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<ContentPlatform>('Instagram');
  const [format, setFormat] = useState<ContentFormat>('Reel');
  const [tone, setTone] = useState<ContentTone>('Direkt');

  const create = (withAi: boolean) => {
    const cleanTopic = topic.trim() || 'Neuer Content';
    const variant = withAi ? generateVariants(cleanTopic, tone, platform, 1)[0] : null;
    onCreate({
      id: `c${Date.now()}`,
      title: cleanTopic,
      platform,
      format,
      status: 'Entwurf',
      tone,
      body: variant ? variantToBody(variant) : '',
      hashtags: variant ? variant.hashtags : [],
      weekday: 0,
      time: '18:00',
      dateLabel: 'Mo, 18:00',
      aiGenerated: withAi,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="Schließen" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0A0B13] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Neuer Content</h2>
          <button
            aria-label="Modal schließen"
            onClick={onClose}
            className="rounded-lg border border-white/[0.1] p-2 text-[#A6ACC2] transition-colors hover:text-[#F4F5F9]"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <label className={classNames('mt-5 block text-xs font-semibold uppercase tracking-wider', os.textMuted)}>
          Thema / Idee
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="z. B. 3 Fehler beim Preis für dein Angebot"
          className={classNames(inputClasses, 'mt-2')}
          autoFocus
        />

        {/* KI-Ideen */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {contentIdeas.map((idea) => (
            <button
              key={idea.title}
              onClick={() => {
                setTopic(idea.title);
                setPlatform(idea.platform);
                setFormat(idea.format);
              }}
              className="rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[#A6ACC2] transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]"
            >
              <SparklesIcon className="mr-1 inline size-3 text-[#A78BFA]" />
              {idea.title}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <label className="text-xs font-medium text-[#A6ACC2]">
            Plattform
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as ContentPlatform)}
              className={classNames(inputClasses, 'mt-1.5')}
            >
              {contentPlatforms.map((p) => (
                <option key={p} value={p} className="bg-[#0A0B13]">
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-[#A6ACC2]">
            Format
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ContentFormat)}
              className={classNames(inputClasses, 'mt-1.5')}
            >
              {contentFormats.map((f) => (
                <option key={f} value={f} className="bg-[#0A0B13]">
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={classNames('mt-4 block text-xs font-medium', os.textMuted)}>Tonalität</label>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {contentTones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={classNames(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                tone === t
                  ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
                  : 'border-white/[0.1] bg-white/[0.03] text-[#A6ACC2] hover:border-white/[0.2]',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <GhostButton onClick={() => create(false)} className="!px-4 !py-2.5 text-xs">
            Leer starten
          </GhostButton>
          <GradientButton onClick={() => create(true)} className="!px-4 !py-2.5 text-xs">
            <SparklesIcon className="size-4" />
            Mit KI erstellen
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

export function OsContent() {
  const [items, setItems] = useState<ContentItem[]>(contentItems);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [platformFilter, setPlatformFilter] = useState<ContentPlatform | 'Alle'>('Alle');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'Alle'>('Alle');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (platformFilter !== 'Alle' && item.platform !== platformFilter) {
          return false;
        }
        if (statusFilter !== 'Alle' && item.status !== statusFilter) {
          return false;
        }
        return true;
      }),
    [items, platformFilter, statusFilter],
  );

  const selected = items.find((item) => item.id === selectedId) ?? null;

  const published = items.filter((item) => item.status === 'Veröffentlicht');
  const planned = items.filter((item) => item.status === 'Geplant');
  const totalReach = published.reduce((sum, item) => sum + (item.metrics?.reach ?? 0), 0);
  const avgEngagement =
    published.length > 0
      ? (published.reduce((sum, item) => {
          const m = item.metrics;
          return sum + (m ? (m.likes + m.comments + m.shares) / m.reach : 0);
        }, 0) /
          published.length) *
        100
      : 0;

  const kpis = [
    { label: 'Geplant', value: String(planned.length), hint: 'in der Pipeline' },
    { label: 'Veröffentlicht', value: String(published.length), hint: 'diesen Monat' },
    {
      label: 'Ø Engagement',
      value: `${avgEngagement.toLocaleString('de-DE', { maximumFractionDigits: 1 })} %`,
      hint: 'über alle Posts',
    },
    {
      label: 'Reichweite',
      value:
        totalReach >= 1000
          ? `${(totalReach / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })}k`
          : String(totalReach),
      hint: 'letzte 30 Tage',
    },
  ];

  const updateItem = (id: string, patch: Partial<ContentItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  if (selected) {
    return (
      <OsShell active="content" searchPlaceholder="Suche in Content …">
        <OsContentEditor
          key={selected.id}
          item={selected}
          onBack={() => setSelectedId(null)}
          onUpdate={(patch) => updateItem(selected.id, patch)}
        />
      </OsShell>
    );
  }

  return (
    <OsShell active="content" searchPlaceholder="Suche in Content …">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content-Engine</h1>
          <p className={classNames('mt-1 text-sm', os.textSecondary)}>
            Plane, generiere und veröffentliche Inhalte für all deine Kanäle — in deiner Stimme.
          </p>
        </div>
        <GradientButton className="!px-4 !py-2.5" onClick={() => setShowNew(true)}>
          <SparklesIcon className="size-4" />
          Neuer Content
        </GradientButton>
      </div>

      {/* KPIs */}
      <section aria-label="Content-Kennzahlen" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['Alle', ...contentPlatforms] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={classNames(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                platformFilter === p
                  ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
                  : 'border-white/[0.1] bg-white/[0.03] text-[#A6ACC2] hover:border-white/[0.2]',
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'Alle')}
            className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-[#A6ACC2] focus:border-[#8B5CF6]/60 focus:outline-none"
          >
            <option value="Alle" className="bg-[#0A0B13]">
              Alle Status
            </option>
            {contentStatuses.map((s) => (
              <option key={s} value={s} className="bg-[#0A0B13]">
                {s}
              </option>
            ))}
          </select>

          <div className="flex rounded-xl border border-white/[0.1] bg-white/[0.03] p-1">
            <button
              onClick={() => setView('calendar')}
              aria-pressed={view === 'calendar'}
              className={classNames(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                view === 'calendar' ? 'bg-[#8B5CF6]/25 text-[#C4B5FD]' : 'text-[#A6ACC2] hover:text-[#F4F5F9]',
              )}
            >
              <CalendarDaysIcon className="size-4" />
              Kalender
            </button>
            <button
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              className={classNames(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                view === 'list' ? 'bg-[#8B5CF6]/25 text-[#C4B5FD]' : 'text-[#A6ACC2] hover:text-[#F4F5F9]',
              )}
            >
              <TableCellsIcon className="size-4" />
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Kalender */}
      {view === 'calendar' && (
        <section className="mt-4 overflow-x-auto pb-2">
          <div className="grid min-w-[980px] grid-cols-7 gap-3">
            {weekdayLabels.map((day, idx) => {
              const dayItems = filtered
                .filter((item) => item.weekday === idx)
                .sort((a, b) => a.time.localeCompare(b.time));
              return (
                <div key={day} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center justify-between px-1 pb-2">
                    <span className="text-xs font-semibold">{day}</span>
                    <span className={classNames('text-[10px]', os.textMuted)}>{dayItems.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dayItems.map((item) => (
                      <ContentCard key={item.id} item={item} onClick={() => setSelectedId(item.id)} compact />
                    ))}
                    {dayItems.length === 0 && (
                      <button
                        onClick={() => setShowNew(true)}
                        className="rounded-xl border border-dashed border-white/[0.08] py-6 text-center text-[10px] text-[#6B7288] transition-colors hover:border-[#8B5CF6]/40 hover:text-[#C4B5FD]"
                      >
                        + Content
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Liste */}
      {view === 'list' && (
        <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} onClick={() => setSelectedId(item.id)} />
          ))}
          {filtered.length === 0 && (
            <p className={classNames(os.card, 'col-span-full p-10 text-center text-sm', os.textMuted)}>
              Kein Content mit diesen Filtern. Erstelle neuen Content oder passe die Filter an.
            </p>
          )}
        </section>
      )}

      {showNew && (
        <NewContentModal
          onClose={() => setShowNew(false)}
          onCreate={(item) => {
            setItems((prev) => [item, ...prev]);
            setShowNew(false);
            setSelectedId(item.id);
          }}
        />
      )}
    </OsShell>
  );
}
