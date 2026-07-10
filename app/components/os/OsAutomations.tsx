import { useMemo, useState } from 'react';
import {
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentChartBarIcon,
  DocumentCurrencyEuroIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PlayIcon,
  PlusIcon,
  SparklesIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { automations as automationSeed, automationTemplates } from './demoData';
import type { Automation, AutomationIcon, AutomationStatus } from './demoData';
import { GradientButton, os } from './Ui';
import { OsShell } from './OsShell';

const icons: Record<AutomationIcon, typeof EnvelopeIcon> = {
  mail: EnvelopeIcon,
  lead: UserPlusIcon,
  content: PencilSquareIcon,
  invoice: DocumentCurrencyEuroIcon,
  chat: ChatBubbleLeftRightIcon,
  report: DocumentChartBarIcon,
};

const statusStyles: Record<AutomationStatus, string> = {
  Aktiv: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
  Pausiert: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]',
  Entwurf: 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
};

const filterOptions = ['Alle', 'Aktiv', 'Pausiert', 'Entwurf'] as const;
type FilterOption = (typeof filterOptions)[number];

function FlowChip({ label, kind }: { label: string; kind: 'trigger' | 'condition' | 'action' }) {
  const kindStyles = {
    trigger: 'border-[#5B7CFA]/40 bg-[#5B7CFA]/10 text-[#A5B8FF]',
    condition: 'border-white/[0.12] bg-white/[0.04] text-[#A6ACC2]',
    action: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#C4B5FD]',
  };
  const kindLabels = { trigger: 'Wenn', condition: 'Falls', action: 'Dann' };
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium',
        kindStyles[kind],
      )}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{kindLabels[kind]}</span>
      {label}
    </span>
  );
}

/** Schalter zum Aktivieren/Pausieren einer Automation. */
function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={classNames(
        'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
        on ? 'border-[#8B5CF6]/60 bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA]' : 'border-white/[0.15] bg-white/[0.08]',
      )}
    >
      <span
        className={classNames(
          'absolute top-0.5 size-[18px] rounded-full bg-white shadow transition-all',
          on ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  );
}

export function OsAutomations() {
  const [items, setItems] = useState<Automation[]>(automationSeed);
  const [filter, setFilter] = useState<FilterOption>('Alle');

  const filtered = useMemo(
    () => (filter === 'Alle' ? items : items.filter((a) => a.status === filter)),
    [items, filter],
  );

  const active = items.filter((a) => a.status === 'Aktiv');
  const totalRuns = active.reduce((sum, a) => sum + a.runs30d, 0);
  const totalSaved = items.reduce((sum, a) => sum + a.timeSavedHours, 0);

  const kpis = [
    { label: 'Aktive Automationen', value: String(active.length), hint: `von ${items.length} gesamt` },
    { label: 'Ausführungen', value: totalRuns.toLocaleString('de-DE'), hint: 'letzte 30 Tage' },
    { label: 'Zeit gespart', value: `${totalSaved.toLocaleString('de-DE')} Std.`, hint: 'letzte 30 Tage' },
    { label: 'Erfolgsrate', value: '98,7 %', hint: 'fehlerfreie Läufe' },
  ];

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((a) => {
        if (a.id !== id) {
          return a;
        }
        const status: AutomationStatus = a.status === 'Aktiv' ? 'Pausiert' : 'Aktiv';
        return { ...a, status };
      }),
    );
  };

  const applyTemplate = (name: string) => {
    const template = automationTemplates.find((t) => t.name === name);
    if (!template) {
      return;
    }
    setItems((prev) => [
      {
        id: `a${Date.now()}`,
        name: template.name,
        description: template.description,
        trigger: template.trigger,
        condition: template.condition,
        action: template.action,
        status: 'Entwurf',
        runs30d: 0,
        timeSavedHours: 0,
        lastRun: '—',
        icon: template.icon,
      },
      ...prev,
    ]);
  };

  return (
    <OsShell active="automations" searchPlaceholder="Suche in Automationen …">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automationen</h1>
          <p className={classNames('mt-1 text-sm', os.textSecondary)}>
            Dein KI-Team arbeitet rund um die Uhr — jede Automation spart dir echte Stunden.
          </p>
        </div>
        <GradientButton className="!px-4 !py-2.5">
          <PlusIcon className="size-4" />
          Neue Automation
        </GradientButton>
      </div>

      {/* KPIs */}
      <section aria-label="Automation-Kennzahlen" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Automation-Liste */}
      <section className="mt-4 space-y-4">
        {filtered.map((automation) => {
          const Icon = icons[automation.icon];
          const isOn = automation.status === 'Aktiv';
          return (
            <div key={automation.id} className={classNames(os.card, os.cardHover, 'p-5')}>
              <div className="flex flex-wrap items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                  <Icon className="size-5 text-[#A78BFA]" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-base font-semibold">{automation.name}</h2>
                    <span
                      className={classNames(
                        'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
                        statusStyles[automation.status],
                      )}
                    >
                      {automation.status}
                    </span>
                  </div>
                  <p className={classNames('mt-1 text-sm', os.textSecondary)}>{automation.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <FlowChip label={automation.trigger} kind="trigger" />
                    <ArrowRightIcon className="size-3.5 shrink-0 text-[#6B7288]" />
                    <FlowChip label={automation.condition} kind="condition" />
                    <ArrowRightIcon className="size-3.5 shrink-0 text-[#6B7288]" />
                    <FlowChip label={automation.action} kind="action" />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3">
                  {automation.status === 'Entwurf' ? (
                    <button
                      onClick={() => toggleStatus(automation.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-3 py-1.5 text-xs font-semibold text-[#C4B5FD] transition-colors hover:bg-[#8B5CF6]/20"
                    >
                      <PlayIcon className="size-3.5" />
                      Aktivieren
                    </button>
                  ) : (
                    <Toggle on={isOn} onChange={() => toggleStatus(automation.id)} label={automation.name} />
                  )}
                  <div className={classNames('flex items-center gap-4 text-xs', os.textMuted)}>
                    <span className="inline-flex items-center gap-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      <CheckCircleIcon className="size-3.5" />
                      {automation.runs30d}× / 30 T.
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="size-3.5" />
                      {automation.lastRun}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className={classNames(os.card, 'p-10 text-center text-sm', os.textMuted)}>
            Keine Automationen mit diesem Status.
          </p>
        )}
      </section>

      {/* Vorlagen */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-5 text-[#A78BFA]" />
          <h2 className="text-base font-semibold">Beliebte Vorlagen</h2>
        </div>
        <p className={classNames('mt-1 text-sm', os.textSecondary)}>
          Mit einem Klick übernehmen — die KI passt Texte und Timing an dein Business an.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {automationTemplates.map((template) => {
            const Icon = icons[template.icon];
            return (
              <div key={template.name} className={classNames(os.card, os.cardHover, 'flex flex-col p-5')}>
                <span className="flex size-10 items-center justify-center rounded-xl border border-[#5B7CFA]/30 bg-[#5B7CFA]/10">
                  <Icon className="size-5 text-[#A5B8FF]" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{template.name}</h3>
                <p className={classNames('mt-1 flex-1 text-xs leading-relaxed', os.textSecondary)}>
                  {template.description}
                </p>
                <button
                  onClick={() => applyTemplate(template.name)}
                  className="mt-4 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-semibold transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]"
                >
                  Vorlage verwenden
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </OsShell>
  );
}
