import { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  BellAlertIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  DocumentChartBarIcon,
  DocumentCurrencyEuroIcon,
  EnvelopeIcon,
  FunnelIcon,
  PencilSquareIcon,
  PlayIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import type { Automation, AutomationRunResult, AutomationStep, AutomationStepKind } from './demoData';
import { GhostButton, GradientButton, os } from './Ui';

const stepMeta: Record<AutomationStepKind, { icon: typeof BoltIcon; tint: string; ring: string; label: string }> = {
  trigger: { icon: BoltIcon, tint: 'text-[#A5B8FF]', ring: 'border-[#5B7CFA]/40 bg-[#5B7CFA]/10', label: 'Auslöser' },
  condition: {
    icon: FunnelIcon,
    tint: 'text-[#A6ACC2]',
    ring: 'border-white/[0.14] bg-white/[0.05]',
    label: 'Bedingung',
  },
  delay: { icon: ClockIcon, tint: 'text-[#A6ACC2]', ring: 'border-white/[0.14] bg-white/[0.05]', label: 'Wartezeit' },
  email: { icon: EnvelopeIcon, tint: 'text-[#A78BFA]', ring: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10', label: 'E-Mail' },
  whatsapp: {
    icon: ChatBubbleLeftRightIcon,
    tint: 'text-[#6EE7B7]',
    ring: 'border-[#34D399]/40 bg-[#34D399]/10',
    label: 'WhatsApp',
  },
  push: { icon: BellAlertIcon, tint: 'text-[#FCD34D]', ring: 'border-[#F59E0B]/40 bg-[#F59E0B]/10', label: 'Push' },
  task: {
    icon: ClipboardDocumentCheckIcon,
    tint: 'text-[#A78BFA]',
    ring: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10',
    label: 'Aufgabe',
  },
  generate: {
    icon: SparklesIcon,
    tint: 'text-[#A78BFA]',
    ring: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10',
    label: 'KI-Generierung',
  },
  invoice: {
    icon: DocumentCurrencyEuroIcon,
    tint: 'text-[#A78BFA]',
    ring: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10',
    label: 'Rechnung',
  },
  report: {
    icon: DocumentChartBarIcon,
    tint: 'text-[#A78BFA]',
    ring: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10',
    label: 'Report',
  },
  branch: {
    icon: ArrowsRightLeftIcon,
    tint: 'text-[#A5B8FF]',
    ring: 'border-[#5B7CFA]/40 bg-[#5B7CFA]/10',
    label: 'Verzweigung',
  },
};

const runResultStyles: Record<AutomationRunResult, string> = {
  Erfolgreich: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
  Läuft: 'border-[#5B7CFA]/40 bg-[#5B7CFA]/10 text-[#A5B8FF]',
  Wartet: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]',
  Übersprungen: 'border-white/[0.14] bg-white/[0.05] text-[#A6ACC2]',
  Fehler: 'border-[#F87171]/40 bg-[#F87171]/10 text-[#FCA5A5]',
};

/** Ein Schritt im vertikalen Workflow. E-Mail-/Nachrichten-Schritte lassen sich aufklappen. */
function StepCard({ step, isLast }: { step: AutomationStep; isLast: boolean }) {
  const meta = stepMeta[step.kind];
  const Icon = meta.icon;
  const expandable = Boolean(step.body);
  const [open, setOpen] = useState(false);

  return (
    <li className="relative flex gap-4 pb-4 last:pb-0">
      {/* Verbindungslinie */}
      {!isLast && <span className="absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-px bg-white/[0.1]" />}

      <span className={classNames('flex size-11 shrink-0 items-center justify-center rounded-xl border', meta.ring)}>
        <Icon className={classNames('size-5', meta.tint)} />
      </span>

      <div className={classNames(os.card, 'min-w-0 flex-1 p-4')}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={classNames(
              'rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              meta.ring,
              meta.tint,
            )}
          >
            {meta.label}
          </span>
          <h3 className="text-sm font-semibold">{step.title}</h3>
        </div>
        <p className={classNames('mt-1.5 text-sm', os.textSecondary)}>{step.detail}</p>

        {step.subject && (
          <p className="mt-2 text-sm">
            <span className={os.textMuted}>Betreff: </span>
            <span className="font-medium">{step.subject}</span>
          </p>
        )}

        {expandable && (
          <>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#A78BFA] transition-colors hover:text-[#C4B5FD]"
            >
              <ChevronDownIcon className={classNames('size-4 transition-transform', open ? 'rotate-180' : '')} />
              {open ? 'Inhalt ausblenden' : 'Inhalt anzeigen'}
            </button>
            {open && (
              <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-[#07080F] p-4 font-sans text-sm leading-relaxed text-[#D3D7E4]">
                {step.body}
              </pre>
            )}
          </>
        )}

        {step.stats && (
          <p className={classNames('mt-3 inline-flex items-center gap-1.5 text-xs', os.textMuted)}>
            <CheckCircleIcon className="size-3.5" />
            {step.stats}
          </p>
        )}
      </div>
    </li>
  );
}

const priorities: Automation['settings']['priority'][] = ['Niedrig', 'Normal', 'Hoch'];

export function OsAutomationDetail({
  automation,
  onBack,
  onToggle,
}: {
  automation: Automation;
  onBack: () => void;
  onToggle: () => void;
}) {
  const [settings, setSettings] = useState(automation.settings);
  const isOn = automation.status === 'Aktiv';

  return (
    <div>
      {/* Zurück + Header */}
      <button
        onClick={onBack}
        className={classNames(
          'inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#F4F5F9]',
          os.textSecondary,
        )}
      >
        <ArrowLeftIcon className="size-4" />
        Zurück zu Automationen
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
            <BoltIcon className="size-6 text-[#A78BFA]" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{automation.name}</h1>
              <span
                className={classNames(
                  'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                  isOn
                    ? 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]'
                    : automation.status === 'Pausiert'
                      ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]'
                      : 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
                )}
              >
                {automation.status}
              </span>
            </div>
            <p className={classNames('mt-1 max-w-2xl text-sm', os.textSecondary)}>{automation.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GhostButton className="!px-4 !py-2.5 text-xs">
            <PencilSquareIcon className="size-4" />
            Bearbeiten
          </GhostButton>
          {automation.status === 'Entwurf' ? (
            <GradientButton className="!px-4 !py-2.5 text-xs" onClick={onToggle}>
              <PlayIcon className="size-4" />
              Aktivieren
            </GradientButton>
          ) : (
            <GhostButton className="!px-4 !py-2.5 text-xs" onClick={onToggle}>
              {isOn ? 'Pausieren' : 'Fortsetzen'}
            </GhostButton>
          )}
        </div>
      </div>

      {/* Metriken */}
      <section aria-label="Kennzahlen" className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {automation.metrics.map((metric) => (
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
        {/* Workflow */}
        <section className={classNames(os.card, 'p-6 xl:col-span-2')}>
          <div className="flex items-center gap-2">
            <ArrowsRightLeftIcon className="size-5 text-[#A78BFA]" />
            <h2 className="text-base font-semibold">Workflow</h2>
          </div>
          <p className={classNames('mt-0.5 text-xs', os.textMuted)}>
            {automation.steps.length} Schritte · klicke „Inhalt anzeigen&ldquo;, um Nachrichten zu sehen
          </p>
          <ol className="mt-6">
            {automation.steps.map((step, i) => (
              <StepCard key={i} step={step} isLast={i === automation.steps.length - 1} />
            ))}
          </ol>
        </section>

        {/* Rechte Spalte: Verlauf + Einstellungen */}
        <div className="space-y-4">
          <section className={classNames(os.card, 'p-6')}>
            <h2 className="text-base font-semibold">Letzte Ausführungen</h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Echtzeit-Protokoll</p>
            {automation.runs.length === 0 ? (
              <p
                className={classNames(
                  'mt-5 rounded-xl border border-dashed border-white/[0.1] p-5 text-center text-xs',
                  os.textMuted,
                )}
              >
                Noch keine Ausführungen. Aktiviere die Automation, um den Verlauf zu starten.
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {automation.runs.map((run, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className={classNames(
                        'mt-0.5 inline-flex h-fit shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                        runResultStyles[run.result],
                      )}
                    >
                      {run.result}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{run.lead}</p>
                      <p className={classNames('truncate text-xs', os.textMuted)}>
                        {run.step} · {run.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={classNames(os.card, 'p-6')}>
            <h2 className="text-base font-semibold">Einstellungen</h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Wirken sofort auf neue Läufe</p>

            <div className="mt-5 space-y-4">
              <div>
                <p className={classNames('text-xs font-medium', os.textMuted)}>Aktive Zeiten</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <ClockIcon className="size-4 text-[#A78BFA]" />
                  {settings.activeHours}
                </p>
              </div>

              <div>
                <p className={classNames('text-xs font-medium', os.textMuted)}>Kanal</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <EnvelopeIcon className="size-4 text-[#A78BFA]" />
                  {settings.channel}
                </p>
              </div>

              <div>
                <p className={classNames('text-xs font-medium', os.textMuted)}>Priorität</p>
                <div className="mt-1.5 flex rounded-lg border border-white/[0.1] bg-white/[0.03] p-1">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSettings((s) => ({ ...s, priority: p }))}
                      className={classNames(
                        'flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors',
                        settings.priority === p
                          ? 'bg-[#8B5CF6]/25 text-[#C4B5FD]'
                          : 'text-[#A6ACC2] hover:text-[#F4F5F9]',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Bei Antwort stoppen</span>
                <button
                  role="switch"
                  aria-checked={settings.stopOnReply}
                  aria-label="Bei Antwort stoppen"
                  onClick={() => setSettings((s) => ({ ...s, stopOnReply: !s.stopOnReply }))}
                  className={classNames(
                    'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
                    settings.stopOnReply
                      ? 'border-[#8B5CF6]/60 bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA]'
                      : 'border-white/[0.15] bg-white/[0.08]',
                  )}
                >
                  <span
                    className={classNames(
                      'absolute top-0.5 size-[18px] rounded-full bg-white shadow transition-all',
                      settings.stopOnReply ? 'left-[22px]' : 'left-0.5',
                    )}
                  />
                </button>
              </label>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-white/[0.07] pt-4">
              <ArrowRightIcon className="size-4 text-[#6B7288]" />
              <p className={classNames('text-xs', os.textMuted)}>
                Nächster Lauf: <span className="font-semibold text-[#C4B5FD]">{automation.settings.activeHours}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
