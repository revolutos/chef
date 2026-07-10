import { useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  EnvelopeIcon,
  FireIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  Squares2X2Icon,
  TableCellsIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { crmLeads, crmSources, crmStages } from './demoData';
import type { CrmLead, CrmSource, CrmStage } from './demoData';
import { GhostButton, GradientButton, os } from './Ui';
import { OsShell } from './OsShell';

const stageStyles: Record<CrmStage, string> = {
  Neu: 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
  Qualifiziert: 'border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-[#C4B5FD]',
  'Call gebucht': 'border-[#5B7CFA]/40 bg-[#5B7CFA]/15 text-[#A5B8FF]',
  Angebot: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]',
  Gewonnen: 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
  Verloren: 'border-white/[0.1] bg-white/[0.03] text-[#6B7288]',
};

const boardStages: CrmStage[] = ['Neu', 'Qualifiziert', 'Call gebucht', 'Angebot', 'Gewonnen'];

function formatEuro(value: number) {
  return `${value.toLocaleString('de-DE')} €`;
}

function scoreColor(score: number) {
  if (score >= 80) {
    return 'text-[#34D399]';
  }
  if (score >= 50) {
    return 'text-[#A78BFA]';
  }
  return 'text-[#6B7288]';
}

function scoreBarColor(score: number) {
  if (score >= 80) {
    return 'bg-[#34D399]';
  }
  if (score >= 50) {
    return 'bg-[#A78BFA]';
  }
  return 'bg-[#6B7288]';
}

function StageBadge({ stage }: { stage: CrmStage }) {
  return (
    <span
      className={classNames('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', stageStyles[stage])}
    >
      {stage}
    </span>
  );
}

function ScoreCell({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.08]">
        <div className={classNames('h-full rounded-full', scoreBarColor(score))} style={{ width: `${score}%` }} />
      </div>
      <span
        className={classNames('text-xs font-semibold', scoreColor(score))}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {score}
      </span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-gradient-to-br from-[#8B5CF6]/40 to-[#5B7CFA]/30 text-xs font-bold text-white">
      {initials}
    </span>
  );
}

const inputClasses =
  'w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:border-[#8B5CF6]/60 focus:outline-none';

/** Slide-over mit allen Details eines Leads inkl. Phase-Wechsel. */
function LeadDetail({
  lead,
  onClose,
  onStageChange,
}: {
  lead: CrmLead;
  onClose: () => void;
  onStageChange: (stage: CrmStage) => void;
}) {
  const timeline = [
    { text: 'KI-Score aktualisiert', detail: `Score ${lead.score}/100`, time: lead.lastActivity },
    { text: 'Follow-up-Mail geöffnet', detail: 'Betreff: „Dein nächster Schritt"', time: 'Gestern, 18:22' },
    { text: 'Lead erstellt', detail: `Quelle: ${lead.source}`, time: '24. Jun, 08:11' },
  ];

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={`Lead ${lead.name}`}>
      <button aria-label="Schließen" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-white/[0.1] bg-[#0A0B13] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={lead.name} />
            <div>
              <h2 className="text-lg font-bold">{lead.name}</h2>
              <p className={classNames('text-sm', os.textMuted)}>{lead.company}</p>
            </div>
          </div>
          <button
            aria-label="Panel schließen"
            onClick={onClose}
            className="rounded-lg border border-white/[0.1] p-2 text-[#A6ACC2] transition-colors hover:text-[#F4F5F9]"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className={classNames(os.card, 'p-4')}>
            <p className={classNames('text-xs uppercase tracking-wider', os.textMuted)}>Deal-Wert</p>
            <p className="mt-1 text-xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatEuro(lead.value)}
            </p>
          </div>
          <div className={classNames(os.card, 'p-4')}>
            <p className={classNames('text-xs uppercase tracking-wider', os.textMuted)}>KI-Score</p>
            <p className={classNames('mt-1 text-xl font-bold', scoreColor(lead.score))}>{lead.score}/100</p>
          </div>
        </div>

        <div className="mt-5">
          <label className={classNames('text-xs font-semibold uppercase tracking-wider', os.textMuted)}>
            Phase
            <select
              value={lead.stage}
              onChange={(e) => onStageChange(e.target.value as CrmStage)}
              className={classNames(inputClasses, 'mt-2 font-sans text-sm normal-case tracking-normal')}
            >
              {crmStages.map((stage) => (
                <option key={stage} value={stage} className="bg-[#0A0B13]">
                  {stage}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={classNames(os.card, 'mt-5 space-y-3 p-4 text-sm')}>
          <p className="flex items-center justify-between gap-3">
            <span className={os.textMuted}>E-Mail</span>
            <span className="truncate font-medium">{lead.email}</span>
          </p>
          <p className="flex items-center justify-between gap-3">
            <span className={os.textMuted}>Angebot</span>
            <span className="truncate font-medium">{lead.offer}</span>
          </p>
          <p className="flex items-center justify-between gap-3">
            <span className={os.textMuted}>Quelle</span>
            <span className="font-medium">{lead.source}</span>
          </p>
          <p className="flex items-center justify-between gap-3">
            <span className={os.textMuted}>Nächste Aktion</span>
            <span className="truncate font-medium text-[#C4B5FD]">{lead.nextAction}</span>
          </p>
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <SparklesIcon className="size-4 text-[#A78BFA]" />
            KI-Notiz
          </h3>
          <p className={classNames(os.card, 'mt-2 p-4 text-sm leading-relaxed', os.textSecondary)}>{lead.notes}</p>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold">Aktivitäten</h3>
          <ul className="mt-3 space-y-4 border-l border-white/[0.08] pl-4">
            {timeline.map((item) => (
              <li key={item.text} className="relative">
                <span className="absolute left-[-21px] top-1.5 size-2 rounded-full bg-[#8B5CF6]" />
                <p className="text-sm font-medium">{item.text}</p>
                <p className={classNames('text-xs', os.textMuted)}>
                  {item.detail} · {item.time}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex gap-3 pt-6">
          <GhostButton className="flex-1 !px-4 !py-2.5 text-xs">
            <EnvelopeIcon className="size-4" />
            E-Mail senden
          </GhostButton>
          <GradientButton className="flex-1 !px-4 !py-2.5 text-xs">
            <CalendarDaysIcon className="size-4" />
            Call planen
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

/** Modal zum Anlegen eines neuen Leads (nur lokaler State, kein Backend). */
function NewLeadModal({ onClose, onCreate }: { onClose: () => void; onCreate: (lead: CrmLead) => void }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [offer, setOffer] = useState('');
  const [value, setValue] = useState('');
  const [source, setSource] = useState<CrmSource>('Instagram');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    onCreate({
      id: `l${Date.now()}`,
      name: name.trim(),
      company: company.trim() || '—',
      email: email.trim() || '—',
      offer: offer.trim() || '—',
      source,
      stage: 'Neu',
      value: Number(value) || 0,
      score: 50,
      lastActivity: 'Gerade eben',
      nextAction: 'Lead qualifizieren',
      notes: 'Manuell angelegt. Die KI vervollständigt das Profil nach dem ersten Kontakt.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="Schließen" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0A0B13] p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Neuen Lead anlegen</h2>
          <button
            type="button"
            aria-label="Modal schließen"
            onClick={onClose}
            className="rounded-lg border border-white/[0.1] p-2 text-[#A6ACC2] transition-colors hover:text-[#F4F5F9]"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium text-[#A6ACC2]">
            Name *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Max Mustermann"
              className={classNames(inputClasses, 'mt-1.5')}
            />
          </label>
          <label className="text-xs font-medium text-[#A6ACC2]">
            Firma
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Mustermann GmbH"
              className={classNames(inputClasses, 'mt-1.5')}
            />
          </label>
          <label className="text-xs font-medium text-[#A6ACC2] sm:col-span-2">
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              className={classNames(inputClasses, 'mt-1.5')}
            />
          </label>
          <label className="text-xs font-medium text-[#A6ACC2]">
            Angebot
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="z. B. 1:1 Coaching"
              className={classNames(inputClasses, 'mt-1.5')}
            />
          </label>
          <label className="text-xs font-medium text-[#A6ACC2]">
            Deal-Wert (€)
            <input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="2400"
              className={classNames(inputClasses, 'mt-1.5')}
            />
          </label>
          <label className="text-xs font-medium text-[#A6ACC2] sm:col-span-2">
            Quelle
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as CrmSource)}
              className={classNames(inputClasses, 'mt-1.5')}
            >
              {crmSources.map((s) => (
                <option key={s} value={s} className="bg-[#0A0B13]">
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <GhostButton type="button" onClick={onClose} className="!px-4 !py-2.5 text-xs">
            Abbrechen
          </GhostButton>
          <GradientButton type="submit" className="!px-4 !py-2.5 text-xs">
            <PlusIcon className="size-4" />
            Lead anlegen
          </GradientButton>
        </div>
      </form>
    </div>
  );
}

export function OsCrm() {
  const [leads, setLeads] = useState<CrmLead[]>(crmLeads);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<CrmStage | 'Alle'>('Alle');
  const [view, setView] = useState<'list' | 'board'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (stageFilter !== 'Alle' && lead.stage !== stageFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return [lead.name, lead.company, lead.offer, lead.email].some((field) => field.toLowerCase().includes(q));
    });
  }, [leads, search, stageFilter]);

  const selected = leads.find((lead) => lead.id === selectedId) ?? null;

  const openLeads = leads.filter((lead) => lead.stage !== 'Gewonnen' && lead.stage !== 'Verloren');
  const pipelineValue = openLeads.reduce((sum, lead) => sum + lead.value, 0);
  const hotLeads = openLeads.filter((lead) => lead.score >= 80).length;
  const wonValue = leads.filter((lead) => lead.stage === 'Gewonnen').reduce((sum, lead) => sum + lead.value, 0);

  const kpis = [
    { label: 'Offene Leads', value: String(openLeads.length), hint: 'in der Pipeline' },
    { label: 'Pipeline-Wert', value: formatEuro(pipelineValue), hint: 'offene Deals' },
    { label: 'Heiße Leads', value: String(hotLeads), hint: 'KI-Score ≥ 80', icon: FireIcon },
    { label: 'Gewonnen (Monat)', value: formatEuro(wonValue), hint: 'abgeschlossene Deals' },
  ];

  const changeStage = (id: string, stage: CrmStage) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, stage } : lead)));
  };

  return (
    <OsShell active="crm" searchPlaceholder="Suche in Leads …">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM & Leads</h1>
          <p className={classNames('mt-1 text-sm', os.textSecondary)}>
            Deine KI priorisiert Leads automatisch nach Abschlusswahrscheinlichkeit.
          </p>
        </div>
        <GradientButton className="!px-4 !py-2.5" onClick={() => setShowNewLead(true)}>
          <PlusIcon className="size-4" />
          Neuer Lead
        </GradientButton>
      </div>

      {/* KPIs */}
      <section aria-label="CRM-Kennzahlen" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={classNames(os.card, os.cardHover, 'p-5')}>
            <p
              className={classNames(
                'flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider',
                os.textMuted,
              )}
            >
              {kpi.icon && <kpi.icon className="size-4 text-[#F59E0B]" />}
              {kpi.label}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {kpi.value}
            </p>
            <p className={classNames('mt-2 text-xs', os.textMuted)}>{kpi.hint}</p>
          </div>
        ))}
      </section>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6B7288]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lead, Firma oder Angebot …"
            className={classNames(inputClasses, '!pl-10')}
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {(['Alle', ...crmStages] as const).map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={classNames(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                stageFilter === stage
                  ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
                  : 'border-white/[0.1] bg-white/[0.03] text-[#A6ACC2] hover:border-white/[0.2]',
              )}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="ml-auto flex rounded-xl border border-white/[0.1] bg-white/[0.03] p-1">
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
          <button
            onClick={() => setView('board')}
            aria-pressed={view === 'board'}
            className={classNames(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              view === 'board' ? 'bg-[#8B5CF6]/25 text-[#C4B5FD]' : 'text-[#A6ACC2] hover:text-[#F4F5F9]',
            )}
          >
            <Squares2X2Icon className="size-4" />
            Board
          </button>
        </div>
      </div>

      {/* Liste */}
      {view === 'list' && (
        <section className={classNames(os.card, 'mt-4 overflow-hidden')}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr
                  className={classNames('border-b border-white/[0.07] text-xs uppercase tracking-wider', os.textMuted)}
                >
                  <th className="px-6 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Angebot</th>
                  <th className="px-4 py-3 font-medium">Quelle</th>
                  <th className="px-4 py-3 font-medium">KI-Score</th>
                  <th className="px-4 py-3 font-medium">Phase</th>
                  <th className="px-4 py-3 text-right font-medium">Wert</th>
                  <th className="px-6 py-3 text-right font-medium">Aktivität</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedId(lead.id)}
                    className="cursor-pointer border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.name} />
                        <div className="min-w-0 leading-tight">
                          <p className="truncate font-medium">{lead.name}</p>
                          <p className={classNames('truncate text-xs', os.textMuted)}>{lead.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classNames('px-4 py-3.5', os.textSecondary)}>{lead.offer}</td>
                    <td className={classNames('px-4 py-3.5', os.textMuted)}>{lead.source}</td>
                    <td className="px-4 py-3.5">
                      <ScoreCell score={lead.score} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StageBadge stage={lead.stage} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatEuro(lead.value)}
                    </td>
                    <td className={classNames('px-6 py-3.5 text-right text-xs', os.textMuted)}>{lead.lastActivity}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className={classNames('px-6 py-12 text-center text-sm', os.textMuted)}>
                      Keine Leads gefunden. Passe Suche oder Filter an.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Board */}
      {view === 'board' && (
        <section className="mt-4 overflow-x-auto pb-2">
          <div className="grid min-w-[1080px] grid-cols-5 gap-4">
            {boardStages.map((stage) => {
              const stageLeads = filtered.filter((lead) => lead.stage === stage);
              const stageValue = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
              return (
                <div key={stage} className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between px-1">
                    <StageBadge stage={stage} />
                    <span className={classNames('text-xs font-semibold', os.textMuted)}>
                      {stageLeads.length} · {formatEuro(stageValue)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-3">
                    {stageLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedId(lead.id)}
                        className={classNames(os.card, os.cardHover, 'p-4 text-left')}
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar name={lead.name} />
                          <div className="min-w-0 leading-tight">
                            <p className="truncate text-sm font-semibold">{lead.name}</p>
                            <p className={classNames('truncate text-xs', os.textMuted)}>{lead.company}</p>
                          </div>
                        </div>
                        <p className={classNames('mt-3 truncate text-xs', os.textSecondary)}>{lead.offer}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatEuro(lead.value)}
                          </span>
                          <ScoreCell score={lead.score} />
                        </div>
                      </button>
                    ))}
                    {stageLeads.length === 0 && (
                      <p
                        className={classNames(
                          'rounded-xl border border-dashed border-white/[0.08] p-4 text-center text-xs',
                          os.textMuted,
                        )}
                      >
                        Keine Leads
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selected && (
        <LeadDetail
          lead={selected}
          onClose={() => setSelectedId(null)}
          onStageChange={(stage) => changeStage(selected.id, stage)}
        />
      )}
      {showNewLead && (
        <NewLeadModal onClose={() => setShowNewLead(false)} onCreate={(lead) => setLeads((prev) => [lead, ...prev])} />
      )}
    </OsShell>
  );
}
