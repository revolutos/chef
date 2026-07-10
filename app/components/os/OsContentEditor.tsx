import { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CameraIcon,
  ChatBubbleOvalLeftIcon,
  CheckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HeartIcon,
  MusicalNoteIcon,
  PaperAirplaneIcon,
  ShareIcon,
  SparklesIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { contentStatuses, contentTones, generateVariants, rewriteBody, variantToBody, weekdayLabels } from './demoData';
import type { ContentItem, ContentPlatform, ContentStatus, ContentTone, GeneratedVariant } from './demoData';
import { GhostButton, GradientButton, os } from './Ui';

export const platformMeta: Record<
  ContentPlatform,
  { icon: typeof CameraIcon; tint: string; ring: string; handle: string }
> = {
  Instagram: {
    icon: CameraIcon,
    tint: 'text-[#E1A0FF]',
    ring: 'border-[#C13584]/40 bg-[#C13584]/10',
    handle: '@viktor.os',
  },
  LinkedIn: {
    icon: BriefcaseIcon,
    tint: 'text-[#7CB3FF]',
    ring: 'border-[#0A66C2]/40 bg-[#0A66C2]/10',
    handle: 'Viktor S.',
  },
  YouTube: {
    icon: VideoCameraIcon,
    tint: 'text-[#FF9B9B]',
    ring: 'border-[#FF0000]/30 bg-[#FF0000]/10',
    handle: 'REVOLUTOS',
  },
  TikTok: {
    icon: MusicalNoteIcon,
    tint: 'text-[#6EE7E7]',
    ring: 'border-[#25F4EE]/30 bg-[#25F4EE]/10',
    handle: '@viktor.os',
  },
  Newsletter: {
    icon: EnvelopeIcon,
    tint: 'text-[#A78BFA]',
    ring: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10',
    handle: 'REVOLUTOS Weekly',
  },
  Blog: {
    icon: DocumentTextIcon,
    tint: 'text-[#A6ACC2]',
    ring: 'border-white/[0.14] bg-white/[0.05]',
    handle: 'revolutos.de/blog',
  },
};

export const statusStyles: Record<ContentStatus, string> = {
  Idee: 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
  Entwurf: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]',
  Geplant: 'border-[#5B7CFA]/40 bg-[#5B7CFA]/10 text-[#A5B8FF]',
  Veröffentlicht: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
};

function formatCompact(n: number) {
  return n >= 1000 ? `${(n / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })}k` : String(n);
}

/** Plattform-getreue Vorschau des Posts. */
function PlatformPreview({ item, body }: { item: ContentItem; body: string }) {
  const meta = platformMeta[item.platform];
  const Icon = meta.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0E0F17]">
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] text-[11px] font-bold text-white">
          VS
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">{meta.handle}</p>
          <p className={classNames('flex items-center gap-1 text-[11px]', os.textMuted)}>
            <Icon className={classNames('size-3', meta.tint)} />
            {item.platform} · {item.format}
          </p>
        </div>
      </div>

      {(item.platform === 'Instagram' || item.platform === 'TikTok' || item.platform === 'YouTube') && (
        <div className="flex aspect-video items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-[#8B5CF6]/20 to-[#5B7CFA]/10">
          <Icon className={classNames('size-10', meta.tint)} />
        </div>
      )}

      <div className="px-4 py-3">
        {item.platform === 'Newsletter' && <p className="mb-2 text-sm font-semibold">Betreff: {item.title}</p>}
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#D3D7E4]">{body || 'Noch kein Text …'}</p>
        {item.hashtags.length > 0 && <p className="mt-2 text-sm text-[#7CB3FF]">{item.hashtags.join(' ')}</p>}
      </div>

      {item.metrics && (
        <div
          className={classNames(
            'flex items-center gap-4 border-t border-white/[0.06] px-4 py-2.5 text-xs',
            os.textMuted,
          )}
        >
          <span className="inline-flex items-center gap-1">
            <HeartIcon className="size-3.5" />
            {formatCompact(item.metrics.likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <ChatBubbleOvalLeftIcon className="size-3.5" />
            {formatCompact(item.metrics.comments)}
          </span>
          <span className="inline-flex items-center gap-1">
            <ShareIcon className="size-3.5" />
            {formatCompact(item.metrics.shares)}
          </span>
          <span className="ml-auto">{formatCompact(item.metrics.reach)} Reichweite</span>
        </div>
      )}
    </div>
  );
}

const inputClasses =
  'w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:border-[#8B5CF6]/60 focus:outline-none';

export function OsContentEditor({
  item,
  onBack,
  onUpdate,
}: {
  item: ContentItem;
  onBack: () => void;
  onUpdate: (patch: Partial<ContentItem>) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);
  const [hashtags, setHashtags] = useState<string[]>(item.hashtags);
  const [tagDraft, setTagDraft] = useState('');

  // KI-Generierung
  const [topic, setTopic] = useState(item.title);
  const [tone, setTone] = useState<ContentTone>(item.tone);
  const [generating, setGenerating] = useState(false);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);

  const dirty = title !== item.title || body !== item.body || hashtags.join(' ') !== item.hashtags.join(' ');

  const runGenerate = () => {
    setGenerating(true);
    setVariants([]);
    // Simulierte Generierung; später Claude-API-Aufruf an dieser Stelle.
    window.setTimeout(() => {
      setVariants(generateVariants(topic, tone, item.platform));
      setGenerating(false);
    }, 1100);
  };

  const applyVariant = (v: GeneratedVariant) => {
    setBody(variantToBody(v));
    setHashtags(v.hashtags);
    setVariants([]);
  };

  const addTag = () => {
    const t = tagDraft.trim().replace(/^#?/, '#');
    if (t.length > 1 && !hashtags.includes(t)) {
      setHashtags((prev) => [...prev, t]);
    }
    setTagDraft('');
  };

  const save = () => onUpdate({ title, body, hashtags });

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
        Zurück zur Content-Engine
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span
            className={classNames(
              'flex size-12 shrink-0 items-center justify-center rounded-2xl border',
              platformMeta[item.platform].ring,
            )}
          >
            {(() => {
              const Icon = platformMeta[item.platform].icon;
              return <Icon className={classNames('size-6', platformMeta[item.platform].tint)} />;
            })()}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight">{item.platform}</h1>
              <span
                className={classNames(
                  'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                  statusStyles[item.status],
                )}
              >
                {item.status}
              </span>
              {item.aiGenerated && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#C4B5FD]">
                  <SparklesIcon className="size-3" />
                  KI
                </span>
              )}
            </div>
            <p className={classNames('mt-1 text-sm', os.textMuted)}>
              {item.format} · geplant für {item.dateLabel}
            </p>
          </div>
        </div>

        {dirty && (
          <GradientButton className="!px-4 !py-2.5 text-xs" onClick={save}>
            <CheckIcon className="size-4" />
            Speichern
          </GradientButton>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Editor */}
        <div className="space-y-4 xl:col-span-2">
          {/* KI-Generator */}
          <section className={classNames(os.card, 'p-6')}>
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-[#A78BFA]" />
              <h2 className="text-base font-semibold">KI-Content-Generator</h2>
            </div>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>
              Thema eingeben, Tonalität wählen — die KI schreibt {item.format}-Varianten für {item.platform}.
            </p>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Worüber soll der Post gehen?"
              className={classNames(inputClasses, 'mt-4')}
            />

            <div className="mt-3 flex flex-wrap gap-1.5">
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

            <GradientButton className="mt-4 w-full !py-2.5 text-sm" onClick={runGenerate} disabled={generating}>
              {generating ? (
                <>
                  <ArrowPathIcon className="size-4 animate-spin" />
                  KI schreibt …
                </>
              ) : (
                <>
                  <SparklesIcon className="size-4" />
                  {variants.length > 0 ? 'Neu generieren' : 'Varianten generieren'}
                </>
              )}
            </GradientButton>

            {variants.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className={classNames('text-xs font-semibold uppercase tracking-wider', os.textMuted)}>
                  {variants.length} Varianten · klicke zum Übernehmen
                </p>
                {variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => applyVariant(v)}
                    className={classNames(
                      os.card,
                      'block w-full p-4 text-left transition-colors hover:border-[#8B5CF6]/50',
                    )}
                  >
                    <p className="text-sm font-semibold text-[#F4F5F9]">{v.hook}</p>
                    <p className={classNames('mt-1 line-clamp-2 text-xs', os.textSecondary)}>{v.body}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#A78BFA]">
                      <CheckIcon className="size-3.5" />
                      Diese Variante übernehmen
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Text-Editor */}
          <section className={classNames(os.card, 'p-6')}>
            <label className={classNames('text-xs font-semibold uppercase tracking-wider', os.textMuted)}>
              Titel / interne Bezeichnung
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={classNames(inputClasses, 'mt-2')}
            />

            <label className={classNames('mt-4 block text-xs font-semibold uppercase tracking-wider', os.textMuted)}>
              {item.platform === 'Newsletter' ? 'E-Mail-Text' : 'Caption / Text'}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className={classNames(inputClasses, 'mt-2 resize-none leading-relaxed')}
            />

            {/* KI-Aktionen */}
            <div className="mt-3 flex flex-wrap gap-2">
              {(['kürzer', 'länger', 'lockerer'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBody((b) => rewriteBody(b, mode))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]"
                >
                  <SparklesIcon className="size-3.5 text-[#A78BFA]" />
                  {mode === 'kürzer' ? 'Kürzer' : mode === 'länger' ? 'Ausführlicher' : 'Lockerer'}
                </button>
              ))}
            </div>

            {/* Hashtags */}
            <label className={classNames('mt-5 block text-xs font-semibold uppercase tracking-wider', os.textMuted)}>
              Hashtags
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.04] py-1 pl-2.5 pr-1 text-xs font-medium text-[#A5B8FF]"
                >
                  {tag}
                  <button
                    onClick={() => setHashtags((prev) => prev.filter((t) => t !== tag))}
                    aria-label={`${tag} entfernen`}
                    className="rounded-full p-0.5 text-[#6B7288] transition-colors hover:text-[#F4F5F9]"
                  >
                    <XMarkIcon className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Hashtag hinzufügen …"
                className={classNames(inputClasses, 'flex-1')}
              />
              <button
                onClick={addTag}
                className="shrink-0 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 text-xs font-semibold transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]"
              >
                Hinzufügen
              </button>
            </div>
          </section>
        </div>

        {/* Rechte Spalte */}
        <div className="space-y-4">
          {/* Status-Workflow */}
          <section className={classNames(os.card, 'p-6')}>
            <h2 className="text-base font-semibold">Status</h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Von der Idee zur Veröffentlichung</p>
            <div className="mt-4 space-y-2">
              {contentStatuses.map((status, i) => {
                const currentIdx = contentStatuses.indexOf(item.status);
                const done = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={status}
                    onClick={() => onUpdate({ status })}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                      isCurrent
                        ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/15 text-[#C4B5FD]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A6ACC2] hover:border-white/[0.2]',
                    )}
                  >
                    <span
                      className={classNames(
                        'flex size-5 items-center justify-center rounded-full border text-[10px] font-bold',
                        done ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/30 text-white' : 'border-white/[0.15] text-[#6B7288]',
                      )}
                    >
                      {done ? <CheckIcon className="size-3" /> : i + 1}
                    </span>
                    {status}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Planung */}
          <section className={classNames(os.card, 'p-6')}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <CalendarDaysIcon className="size-5 text-[#A78BFA]" />
              Planung
            </h2>
            <label className={classNames('mt-4 block text-xs font-medium', os.textMuted)}>Wochentag</label>
            <div className="mt-1.5 grid grid-cols-7 gap-1">
              {weekdayLabels.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => onUpdate({ weekday: idx, dateLabel: `${day}, ${item.time}` })}
                  className={classNames(
                    'rounded-lg border py-2 text-xs font-semibold transition-colors',
                    item.weekday === idx
                      ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
                      : 'border-white/[0.08] bg-white/[0.02] text-[#A6ACC2] hover:border-white/[0.2]',
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            <label className={classNames('mt-4 block text-xs font-medium', os.textMuted)}>Uhrzeit</label>
            <input
              type="time"
              value={item.time}
              onChange={(e) =>
                onUpdate({ time: e.target.value, dateLabel: `${weekdayLabels[item.weekday]}, ${e.target.value}` })
              }
              className={classNames(inputClasses, 'mt-1.5')}
            />
          </section>

          {/* Vorschau */}
          <section className={classNames(os.card, 'p-6')}>
            <h2 className="text-base font-semibold">Vorschau</h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>So sieht dein Post aus</p>
            <div className="mt-4">
              <PlatformPreview item={{ ...item, hashtags }} body={body} />
            </div>
          </section>

          {/* Assistent */}
          <section className={classNames(os.card, 'relative overflow-hidden p-6')}>
            <div className="flex items-center gap-2">
              <PaperAirplaneIcon className="size-5 text-[#A78BFA]" />
              <h2 className="text-base font-semibold">Direkt teilen</h2>
            </div>
            <p className={classNames('mt-1 text-xs', os.textSecondary)}>
              Verbinde deine Kanäle, um mit einem Klick zu veröffentlichen oder zu planen.
            </p>
            <GhostButton className="mt-3 w-full !py-2.5 text-xs">Kanäle verbinden</GhostButton>
          </section>
        </div>
      </div>
    </div>
  );
}
