import { useEffect, useMemo, useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  BoltIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  FunnelIcon,
  GiftIcon,
  GlobeAltIcon,
  LanguageIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PencilSquareIcon,
  Squares2X2Icon,
  UserPlusIcon,
  UsersIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon } from '@heroicons/react/24/solid';
import { classNames } from '~/utils/classNames';
import { BrandMark, GhostButton, GradientButton, GlowOrb, os } from './Ui';
import { cities, creditPacks, expertPlans, expertRoles, experts, mapEvents, referralPrograms } from './mapData';
import type { Availability, Expert, ExpertRole, MapEvent, WorkMode } from './mapData';

type MapView = 'dach' | 'world';
type Perspective = 'expert' | 'company';

type ModalState =
  | { type: 'expert'; id: string }
  | { type: 'city'; cityKey: string }
  | { type: 'event'; id: string }
  | { type: 'signup' }
  | { type: 'plans' }
  | { type: 'credits' }
  | { type: 'referral' }
  | null;

const railItems = [
  { label: 'Dashboard', icon: Squares2X2Icon, href: '/os/dashboard', active: false },
  { label: 'CRM & Leads', icon: UsersIcon, href: '/os/crm', active: false },
  { label: 'Content-Engine', icon: PencilSquareIcon, href: '/os/content', active: false },
  { label: 'Funnels & Angebote', icon: FunnelIcon, href: '/os/funnels', active: false },
  { label: 'Automationen', icon: BoltIcon, href: '/os/automations', active: false },
  { label: 'Analytics', icon: ChartBarIcon, href: '/os/analytics', active: false },
  { label: 'Experten-Karte', icon: MapPinIcon, href: '/os/map', active: true },
];

const availabilityOptions: Availability[] = ['Sofort verfügbar', 'In 2 Wochen', 'Ausgebucht'];
const workModeOptions: WorkMode[] = ['Remote', 'Hybrid', 'Vor Ort'];
const languageOptions = ['Deutsch', 'Englisch', 'Französisch', 'Spanisch'];

const availabilityStyles: Record<Availability, string> = {
  'Sofort verfügbar': 'border-[#34D399]/40 bg-[#34D399]/10 text-[#6EE7B7]',
  'In 2 Wochen': 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D]',
  Ausgebucht: 'border-white/[0.14] bg-white/[0.06] text-[#A6ACC2]',
};

function formatRating(value: number) {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatPrice(expert: Expert) {
  return `${expert.priceMin}–${expert.priceMax} €/Std`;
}

/** Kleiner Sternebalken für Bewertungen. */
function RatingStars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <StarIcon className="size-3.5 text-[#FCD34D]" />
      <span className="text-xs font-semibold text-[#F4F5F9]" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatRating(value)}
      </span>
    </span>
  );
}

export function OsMap() {
  const [perspective, setPerspective] = useState<Perspective>('expert');
  const [mapView, setMapView] = useState<MapView>('dach');
  const [lang, setLang] = useState<'DE' | 'EN'>('DE');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<Set<ExpertRole>>(new Set());
  const [maxPrice, setMaxPrice] = useState(30);
  const [minRating, setMinRating] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState<Availability | 'Alle'>('Alle');
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | 'Alle'>('Alle');
  const [languageFilter, setLanguageFilter] = useState<string>('Alle');

  const [modal, setModal] = useState<ModalState>(null);
  const [hoveredExpert, setHoveredExpert] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [credits, setCredits] = useState(3);
  const [rsvped, setRsvped] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  // Esc schließt Modals.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModal(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleRole = (role: ExpertRole) => {
    setRoleFilter((prev) => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return experts.filter((e) => {
      if (roleFilter.size > 0 && !roleFilter.has(e.role)) {
        return false;
      }
      if (e.priceMin > maxPrice) {
        return false;
      }
      if (e.rating < minRating) {
        return false;
      }
      if (availabilityFilter !== 'Alle' && e.availability !== availabilityFilter) {
        return false;
      }
      if (workModeFilter !== 'Alle' && e.workMode !== workModeFilter) {
        return false;
      }
      if (languageFilter !== 'Alle' && !e.languages.includes(languageFilter)) {
        return false;
      }
      if (mapView === 'dach' && !['DE', 'AT', 'CH'].includes(cities[e.cityKey].country)) {
        return false;
      }
      if (term) {
        const haystack = `${e.name} ${e.role} ${e.region} ${e.headline} ${e.skills.join(' ')}`.toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [search, roleFilter, maxPrice, minRating, availabilityFilter, workModeFilter, languageFilter, mapView]);

  // Experten nach Stadt gruppieren → Cluster-Pins.
  const clusters = useMemo(() => {
    const byCity = new Map<string, Expert[]>();
    for (const e of filtered) {
      const list = byCity.get(e.cityKey) ?? [];
      list.push(e);
      byCity.set(e.cityKey, list);
    }
    return Array.from(byCity.entries()).map(([cityKey, list]) => ({
      cityKey,
      list,
      pos: cities[cityKey][mapView],
    }));
  }, [filtered, mapView]);

  const visibleEvents = useMemo(
    () => mapEvents.filter((ev) => mapView === 'world' || ['DE', 'AT', 'CH'].includes(cities[ev.cityKey].country)),
    [mapView],
  );

  const activeFilterCount =
    roleFilter.size +
    (maxPrice < 30 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (availabilityFilter !== 'Alle' ? 1 : 0) +
    (workModeFilter !== 'Alle' ? 1 : 0) +
    (languageFilter !== 'Alle' ? 1 : 0);

  const resetFilters = () => {
    setRoleFilter(new Set());
    setMaxPrice(30);
    setMinRating(0);
    setAvailabilityFilter('Alle');
    setWorkModeFilter('Alle');
    setLanguageFilter('Alle');
  };

  const isCompany = perspective === 'company';
  const isUnlocked = (id: string) => !isCompany || unlocked.has(id);

  const unlock = (id: string) => {
    if (unlocked.has(id) || credits <= 0) {
      return;
    }
    setUnlocked((prev) => new Set(prev).add(id));
    setCredits((c) => c - 1);
  };

  const copyCode = (code: string) => {
    const link = `https://revolutos.app/r/${code}`;
    void navigator.clipboard?.writeText(link).catch(() => undefined);
    setCopied(code);
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800);
  };

  const clusterForModal = modal?.type === 'city' ? filtered.filter((e) => e.cityKey === modal.cityKey) : [];
  const expertForModal = modal?.type === 'expert' ? (experts.find((e) => e.id === modal.id) ?? null) : null;
  const eventForModal = modal?.type === 'event' ? (mapEvents.find((e) => e.id === modal.id) ?? null) : null;

  return (
    <div className={classNames('relative flex h-screen w-full overflow-hidden', os.page)}>
      {/* Icon-Rail (Navigation) */}
      <nav className="z-30 hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-white/[0.07] bg-[#07080F] py-4 md:flex">
        <a href="/os" className="mb-4" aria-label="REVOLUTOS">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] shadow-[0_4px_16px_rgba(124,92,246,0.45)]">
            <svg viewBox="0 0 24 24" fill="none" className="size-4 text-white" aria-hidden="true">
              <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 8v8M8.5 10v4M15.5 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        </a>
        {railItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            title={item.label}
            className={classNames(
              'group relative flex size-11 items-center justify-center rounded-xl transition-colors',
              item.active
                ? 'bg-gradient-to-br from-[#8B5CF6]/25 to-[#5B7CFA]/10 text-[#A78BFA] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]'
                : 'text-[#6B7288] hover:bg-white/[0.05] hover:text-[#F4F5F9]',
            )}
          >
            <item.icon className="size-5" />
            <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded-lg border border-white/[0.1] bg-[#0B0D16] px-2.5 py-1 text-xs font-medium opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Karten-Canvas */}
      <div className="relative min-w-0 flex-1">
        <MapCanvas mapView={mapView} />

        {/* Cluster-Pins */}
        {clusters.map((cluster) => {
          const many = cluster.list.length > 1;
          const single = cluster.list[0];
          const isHot = cluster.list.some((e) => e.id === hoveredExpert);
          return (
            <button
              key={cluster.cityKey}
              onClick={() =>
                many
                  ? setModal({ type: 'city', cityKey: cluster.cityKey })
                  : setModal({ type: 'expert', id: single.id })
              }
              onMouseEnter={() => setHoveredExpert(single.id)}
              onMouseLeave={() => setHoveredExpert((h) => (h === single.id ? null : h))}
              style={{ left: `${cluster.pos.x}%`, top: `${cluster.pos.y}%` }}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              aria-label={`${cities[cluster.cityKey].city}: ${cluster.list.length} Experten`}
            >
              <span
                className={classNames(
                  'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md transition-all',
                  isHot
                    ? 'border-[#A78BFA] bg-[#8B5CF6]/40 text-white shadow-[0_0_24px_rgba(139,92,246,0.6)] scale-110'
                    : 'border-[#8B5CF6]/50 bg-[#8B5CF6]/20 text-[#E9D5FF] shadow-[0_4px_20px_rgba(124,92,246,0.35)] group-hover:scale-110',
                )}
              >
                <MapPinIcon className="size-3.5" />
                {many ? `${cities[cluster.cityKey].city} · ${cluster.list.length}` : single.name.split(' ')[0]}
              </span>
              <span className="mx-auto block size-2 -translate-y-0.5 rotate-45 border-b border-r border-[#8B5CF6]/50 bg-[#8B5CF6]/20" />
            </button>
          );
        })}

        {/* Event-Pins */}
        {visibleEvents.map((ev) => {
          const pos = cities[ev.cityKey][mapView];
          return (
            <button
              key={ev.id}
              onClick={() => setModal({ type: 'event', id: ev.id })}
              style={{ left: `${pos.x + 3}%`, top: `${pos.y - 4}%` }}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              aria-label={`Event: ${ev.title}`}
            >
              <span className="flex size-8 items-center justify-center rounded-full border border-[#5B7CFA]/50 bg-[#0B0D16]/80 text-[#A5B8FF] shadow-[0_4px_20px_rgba(91,124,250,0.35)] backdrop-blur-md transition-transform group-hover:scale-110">
                <CalendarDaysIcon className="size-4" />
              </span>
            </button>
          );
        })}

        {/* Widget: Suche (oben links) */}
        <div className="absolute left-4 top-4 z-20 w-[min(22rem,calc(100%-2rem))]">
          <div
            className={classNames(
              'flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-[#0B0D16]/80 px-3 py-2.5 backdrop-blur-xl',
            )}
          >
            <a href="/os" className="shrink-0 md:hidden">
              <BrandMark compact />
            </a>
            <MagnifyingGlassIcon className="size-4 shrink-0 text-[#6B7288]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Experten, Rolle, Skill, Stadt …"
              className="w-full bg-transparent text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:outline-none"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={classNames(
              'mt-2 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold backdrop-blur-xl transition-colors',
              filtersOpen || activeFilterCount > 0
                ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
                : 'border-white/[0.1] bg-[#0B0D16]/80 text-[#A6ACC2] hover:border-white/[0.2]',
            )}
          >
            <AdjustmentsHorizontalIcon className="size-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#8B5CF6] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter-Panel */}
          {filtersOpen && (
            <div className="mt-2 max-h-[calc(100vh-11rem)] w-full overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#0B0D16]/90 p-4 backdrop-blur-xl">
              <FilterGroup label="Rolle">
                <div className="flex flex-wrap gap-1.5">
                  {expertRoles.map((role) => (
                    <Chip key={role} active={roleFilter.has(role)} onClick={() => toggleRole(role)}>
                      {role}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label={`Max. Stundensatz · ${maxPrice} €`}>
                <input
                  type="range"
                  min={6}
                  max={30}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </FilterGroup>

              <FilterGroup label={`Mind. Bewertung · ${minRating > 0 ? `${formatRating(minRating)}★` : 'egal'}`}>
                <div className="flex flex-wrap gap-1.5">
                  {[0, 4.5, 4.7, 4.9].map((r) => (
                    <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>
                      {r === 0 ? 'Alle' : `${formatRating(r)}+`}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Verfügbarkeit">
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={availabilityFilter === 'Alle'} onClick={() => setAvailabilityFilter('Alle')}>
                    Alle
                  </Chip>
                  {availabilityOptions.map((a) => (
                    <Chip key={a} active={availabilityFilter === a} onClick={() => setAvailabilityFilter(a)}>
                      {a}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Arbeitsweise">
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={workModeFilter === 'Alle'} onClick={() => setWorkModeFilter('Alle')}>
                    Alle
                  </Chip>
                  {workModeOptions.map((w) => (
                    <Chip key={w} active={workModeFilter === w} onClick={() => setWorkModeFilter(w)}>
                      {w}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Sprache">
                <div className="flex flex-wrap gap-1.5">
                  <Chip active={languageFilter === 'Alle'} onClick={() => setLanguageFilter('Alle')}>
                    Alle
                  </Chip>
                  {languageOptions.map((l) => (
                    <Chip key={l} active={languageFilter === l} onClick={() => setLanguageFilter(l)}>
                      {l}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <button
                onClick={resetFilters}
                className="mt-1 w-full rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-semibold text-[#A6ACC2] transition-colors hover:border-white/[0.2] hover:text-[#F4F5F9]"
              >
                Filter zurücksetzen
              </button>
            </div>
          )}
        </div>

        {/* Widget: Konto / Sprache / Perspektive (oben rechts) */}
        <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {/* Perspektive umschalten (Demo): Experte vs. Unternehmen */}
            <div className="flex rounded-xl border border-white/[0.1] bg-[#0B0D16]/80 p-0.5 backdrop-blur-xl">
              {(['expert', 'company'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPerspective(p)}
                  className={classNames(
                    'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                    perspective === p ? 'bg-[#8B5CF6]/25 text-[#C4B5FD]' : 'text-[#6B7288] hover:text-[#F4F5F9]',
                  )}
                >
                  {p === 'expert' ? 'Als Experte' : 'Als Unternehmen'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLang((l) => (l === 'DE' ? 'EN' : 'DE'))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#0B0D16]/80 px-2.5 py-2 text-xs font-semibold text-[#A6ACC2] backdrop-blur-xl transition-colors hover:text-[#F4F5F9]"
            >
              <LanguageIcon className="size-4" />
              {lang}
            </button>
            <button
              onClick={() => setModal({ type: 'signup' })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#0B0D16]/80 px-3 py-2 text-xs font-semibold text-[#F4F5F9] backdrop-blur-xl transition-colors hover:border-white/[0.2]"
            >
              Login
            </button>
          </div>

          {/* Credits (nur Unternehmen) / Referral */}
          <div className="flex items-center gap-2">
            {isCompany && (
              <button
                onClick={() => setModal({ type: 'credits' })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#34D399]/40 bg-[#34D399]/10 px-3 py-2 text-xs font-semibold text-[#6EE7B7] backdrop-blur-xl transition-colors hover:border-[#34D399]/70"
              >
                <BoltIcon className="size-4" />
                {credits} Credits
              </button>
            )}
            <button
              onClick={() => setModal({ type: 'referral' })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#0B0D16]/80 px-3 py-2 text-xs font-semibold text-[#A6ACC2] backdrop-blur-xl transition-colors hover:text-[#F4F5F9]"
            >
              <GiftIcon className="size-4" />
              Empfehlen
            </button>
          </div>
        </div>

        {/* Widget: Ansicht (Nähe / Weltweit) — unten Mitte */}
        <div className="bottom-four absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/[0.1] bg-[#0B0D16]/80 p-1 backdrop-blur-xl">
          <button
            onClick={() => setMapView('dach')}
            className={classNames(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors',
              mapView === 'dach' ? 'bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA] text-white' : 'text-[#A6ACC2]',
            )}
          >
            <MapPinIcon className="size-4" />
            In meiner Nähe
          </button>
          <button
            onClick={() => setMapView('world')}
            className={classNames(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors',
              mapView === 'world' ? 'bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA] text-white' : 'text-[#A6ACC2]',
            )}
          >
            <GlobeAltIcon className="size-4" />
            Weltweit
          </button>
        </div>

        {/* Widget: Ergebnis-Liste (rechts) */}
        <div className="bottom-four absolute right-4 top-[8.5rem] z-20 hidden w-80 flex-col rounded-2xl border border-white/[0.1] bg-[#0B0D16]/80 backdrop-blur-xl lg:flex">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
            <p className="text-sm font-semibold">
              {filtered.length} Experten
              <span className={classNames('ml-1.5 font-normal', os.textMuted)}>
                {mapView === 'dach' ? 'im DACH-Raum' : 'weltweit'}
              </span>
            </p>
            {isCompany && (
              <span className="rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FCD34D]">
                Daten geblurrt
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {filtered.length === 0 && (
              <p className={classNames('px-2 py-8 text-center text-sm', os.textMuted)}>
                Keine Experten für diese Filter. Setze die Filter zurück oder wechsle auf „Weltweit“.
              </p>
            )}
            {filtered.map((expert) => (
              <ExpertRow
                key={expert.id}
                expert={expert}
                blurred={isCompany && !unlocked.has(expert.id)}
                onOpen={() => setModal({ type: 'expert', id: expert.id })}
                onHover={(v) => setHoveredExpert(v ? expert.id : null)}
                highlighted={hoveredExpert === expert.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Modals ---------- */}
      {modal?.type === 'expert' && expertForModal && (
        <ExpertModal
          expert={expertForModal}
          isCompany={isCompany}
          unlocked={isUnlocked(expertForModal.id)}
          credits={credits}
          onUnlock={() => unlock(expertForModal.id)}
          onClose={() => setModal(null)}
          onBuyCredits={() => setModal({ type: 'credits' })}
        />
      )}

      {modal?.type === 'city' && (
        <Modal
          title={`${cities[modal.cityKey].city} · ${clusterForModal.length} Experten`}
          onClose={() => setModal(null)}
        >
          <div className="space-y-2">
            {clusterForModal.map((expert) => (
              <ExpertRow
                key={expert.id}
                expert={expert}
                blurred={isCompany && !unlocked.has(expert.id)}
                onOpen={() => setModal({ type: 'expert', id: expert.id })}
                onHover={() => undefined}
                highlighted={false}
              />
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === 'event' && eventForModal && (
        <EventModal
          event={eventForModal}
          rsvped={rsvped.has(eventForModal.id)}
          onRsvp={() =>
            setRsvped((prev) => {
              const next = new Set(prev);
              if (next.has(eventForModal.id)) {
                next.delete(eventForModal.id);
              } else {
                next.add(eventForModal.id);
              }
              return next;
            })
          }
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'signup' && (
        <SignupModal
          onClose={() => setModal(null)}
          onPlans={() => setModal({ type: 'plans' })}
          onCredits={() => setModal({ type: 'credits' })}
        />
      )}
      {modal?.type === 'plans' && <PlansModal onClose={() => setModal(null)} />}
      {modal?.type === 'credits' && (
        <CreditsModal
          credits={credits}
          onClose={() => setModal(null)}
          onBuy={(amount) => setCredits((c) => c + amount)}
        />
      )}
      {modal?.type === 'referral' && <ReferralModal onClose={() => setModal(null)} copied={copied} onCopy={copyCode} />}
    </div>
  );
}

/* ---------------- Karten-Hintergrund ---------------- */

function MapCanvas({ mapView }: { mapView: MapView }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05060B]">
      <GlowOrb className="left-1/4 top-1/4 h-96 w-[40rem] bg-[#8B5CF6]/10" />
      <GlowOrb className="bottom-0 right-1/4 h-80 w-[32rem] bg-[#5B7CFA]/10" />
      {/* Graticule / Raster */}
      <svg className="absolute inset-0 size-full opacity-60" aria-hidden="true">
        <defs>
          <pattern id="mapgrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>
      {/* Stilisierte Landmassen (dekorativ, keine exakte Geografie) */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        {mapView === 'dach' ? (
          <path
            d="M52 12 C60 14 66 20 63 30 C68 38 66 50 58 55 C60 66 52 74 46 72 C38 78 30 74 34 64 C24 58 24 46 30 42 C28 32 36 22 44 22 C46 16 48 12 52 12 Z"
            fill="rgba(139,92,246,0.05)"
            stroke="rgba(139,92,246,0.18)"
            strokeWidth="0.3"
          />
        ) : (
          <>
            <path
              d="M8 30 C18 24 30 26 34 34 C30 44 34 52 26 56 C16 54 10 46 12 40 C6 38 4 32 8 30 Z"
              fill="rgba(91,124,250,0.05)"
              stroke="rgba(91,124,250,0.16)"
              strokeWidth="0.3"
            />
            <path
              d="M46 26 C56 22 62 28 60 36 C66 44 60 54 52 54 C46 60 42 50 46 44 C42 38 42 30 46 26 Z"
              fill="rgba(139,92,246,0.05)"
              stroke="rgba(139,92,246,0.18)"
              strokeWidth="0.3"
            />
            <path
              d="M62 40 C72 36 82 40 84 48 C80 58 72 62 66 58 C60 54 58 46 62 40 Z"
              fill="rgba(91,124,250,0.05)"
              stroke="rgba(91,124,250,0.16)"
              strokeWidth="0.3"
            />
          </>
        )}
      </svg>
    </div>
  );
}

/* ---------------- Kleinteile ---------------- */

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className={classNames('mb-2 text-[11px] font-semibold uppercase tracking-wider', os.textMuted)}>{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
        active
          ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/20 text-[#C4B5FD]'
          : 'border-white/[0.1] bg-white/[0.03] text-[#A6ACC2] hover:border-white/[0.2]',
      )}
    >
      {children}
    </button>
  );
}

function ExpertRow({
  expert,
  blurred,
  onOpen,
  onHover,
  highlighted,
}: {
  expert: Expert;
  blurred: boolean;
  onOpen: () => void;
  onHover: (v: boolean) => void;
  highlighted: boolean;
}) {
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={classNames(
        'flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
        highlighted
          ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/10'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.05]',
      )}
    >
      <span
        className={classNames(
          'flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] text-xs font-bold text-white',
          { 'blur-[6px]': blurred },
        )}
      >
        {expert.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className={classNames('truncate text-sm font-semibold', { 'select-none blur-[5px]': blurred })}>
            {expert.name}
          </span>
          {expert.verified && !blurred && <CheckBadgeIcon className="size-4 shrink-0 text-[#60A5FA]" />}
        </span>
        <span className={classNames('mt-0.5 block truncate text-xs', os.textMuted)}>
          {expert.role} · {expert.region}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <RatingStars value={expert.rating} />
        <span className={classNames('mt-0.5 block text-[11px]', os.textMuted)}>{formatPrice(expert)}</span>
      </span>
    </button>
  );
}

/* ---------------- Modal-Grundgerüst ---------------- */

function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={classNames(
          'relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B0D16] shadow-[0_30px_120px_rgba(0,0,0,0.6)]',
          wide ? 'max-w-3xl' : 'max-w-lg',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="rounded-lg border border-white/[0.1] p-1.5 text-[#A6ACC2] transition-colors hover:border-white/[0.2] hover:text-[#F4F5F9]"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-white/[0.07] px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Experten-Modal ---------------- */

function ExpertModal({
  expert,
  isCompany,
  unlocked,
  credits,
  onUnlock,
  onClose,
  onBuyCredits,
}: {
  expert: Expert;
  isCompany: boolean;
  unlocked: boolean;
  credits: number;
  onUnlock: () => void;
  onClose: () => void;
  onBuyCredits: () => void;
}) {
  const locked = isCompany && !unlocked;
  return (
    <Modal
      title="Experten-Profil"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={classNames('text-xs', os.textMuted)}>
            {locked ? 'Kontaktdaten sind für Unternehmen kostenpflichtig.' : 'Kontaktdaten freigeschaltet.'}
          </span>
          {locked ? (
            credits > 0 ? (
              <GradientButton className="!px-4 !py-2.5" onClick={onUnlock}>
                <LockClosedIcon className="size-4" />1 Credit einlösen & freischalten
              </GradientButton>
            ) : (
              <GradientButton className="!px-4 !py-2.5" onClick={onBuyCredits}>
                Credits kaufen
              </GradientButton>
            )
          ) : (
            <GradientButton className="!px-4 !py-2.5">
              <VideoCameraIcon className="size-4" />
              Zoom-Call anfragen
            </GradientButton>
          )}
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <span
          className={classNames(
            'flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] text-lg font-bold text-white',
            { 'blur-[8px]': locked },
          )}
        >
          {expert.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={classNames('text-lg font-bold', { 'select-none blur-[6px]': locked })}>{expert.name}</h3>
            {expert.verified && <CheckBadgeIcon className="size-5 text-[#60A5FA]" />}
            <span
              className={classNames(
                'rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                availabilityStyles[expert.availability],
              )}
            >
              {expert.availability}
            </span>
          </div>
          <p className={classNames('mt-1 text-sm', os.textSecondary)}>{expert.headline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#A6ACC2]">
            <RatingStars value={expert.rating} />
            <span>({expert.reviews} Bewertungen)</span>
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-3.5" />
              {expert.region}
            </span>
          </div>
        </div>
      </div>

      {/* Immer sichtbar: Rolle, Region, Rating, Preis */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Rolle" value={expert.role} />
        <MiniStat label="Stundensatz" value={formatPrice(expert)} />
        <MiniStat label="Arbeitsweise" value={expert.workMode} />
        <MiniStat label="Sprachen" value={expert.languages.join(', ')} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniStat label="Abschlüsse" value={expert.stats.deals} accent />
        <MiniStat label="Quote" value={expert.stats.closeRate} accent />
        <MiniStat label="Volumen" value={expert.stats.volume} accent />
      </div>

      {/* Bio + Kontakt: bei Unternehmen geblurrt bis Freischaltung */}
      <div className="mt-5">
        <p className={classNames('text-xs font-semibold uppercase tracking-wider', os.textMuted)}>Über</p>
        <p
          className={classNames('mt-1.5 text-sm leading-relaxed', os.textSecondary, {
            'select-none blur-[4px]': locked,
          })}
        >
          {expert.bio}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {expert.skills.map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-1 text-xs text-[#A6ACC2]"
          >
            {s}
          </span>
        ))}
      </div>

      <div
        className={classNames(
          'mt-5 rounded-2xl border p-4',
          locked ? 'border-[#F59E0B]/30 bg-[#F59E0B]/[0.06]' : 'border-white/[0.08] bg-white/[0.02]',
        )}
      >
        <p className={classNames('text-xs font-semibold uppercase tracking-wider', os.textMuted)}>Kontakt</p>
        {locked ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-[#FCD34D]">
            <LockClosedIcon className="size-4" />
            <span className="select-none blur-[5px]">
              {expert.contact.email} · {expert.contact.phone}
            </span>
          </div>
        ) : (
          <div className="mt-2 space-y-1 text-sm text-[#F4F5F9]">
            <p>{expert.contact.email}</p>
            <p>{expert.contact.phone}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
      <p className={classNames('text-[10px] font-semibold uppercase tracking-wider', os.textMuted)}>{label}</p>
      <p className={classNames('mt-1 text-sm font-semibold', accent ? 'text-[#C4B5FD]' : 'text-[#F4F5F9]')}>{value}</p>
    </div>
  );
}

/* ---------------- Event-Modal ---------------- */

const eventFormatIcon = {
  'Live vor Ort': MapPinIcon,
  'Zoom-Call': VideoCameraIcon,
  Hybrid: GlobeAltIcon,
};

function EventModal({
  event,
  rsvped,
  onRsvp,
  onClose,
}: {
  event: MapEvent;
  rsvped: boolean;
  onRsvp: () => void;
  onClose: () => void;
}) {
  const Icon = eventFormatIcon[event.format];
  const spots = event.capacity - event.attendees;
  return (
    <Modal
      title="Event"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className={classNames('text-xs', os.textMuted)}>
            {event.price === 0 ? 'Kostenlos' : `${event.price} €`} · noch {spots} Plätze
          </span>
          <GradientButton className={classNames('!px-4 !py-2.5', { 'opacity-90': rsvped })} onClick={onRsvp}>
            {rsvped ? (
              <>
                <CheckIcon className="size-4" />
                Angemeldet
              </>
            ) : (
              'Jetzt teilnehmen'
            )}
          </GradientButton>
        </div>
      }
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5B7CFA]/40 bg-[#5B7CFA]/10 px-2.5 py-1 font-semibold text-[#A5B8FF]">
          <Icon className="size-3.5" />
          {event.format}
        </span>
        <span className={os.textMuted}>{event.region}</span>
      </div>
      <h3 className="mt-3 text-xl font-bold">{event.title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <MiniStat label="Datum" value={event.date} />
        <MiniStat label="Uhrzeit" value={event.time} />
        <MiniStat label="Host" value={event.host} />
        <MiniStat label="Teilnehmer" value={`${event.attendees} / ${event.capacity}`} accent />
      </div>
      <p className={classNames('mt-4 text-sm leading-relaxed', os.textSecondary)}>{event.description}</p>
    </Modal>
  );
}

/* ---------------- Signup-Modal ---------------- */

function SignupModal({
  onClose,
  onPlans,
  onCredits,
}: {
  onClose: () => void;
  onPlans: () => void;
  onCredits: () => void;
}) {
  return (
    <Modal title="Registrieren" onClose={onClose} wide>
      <p className={classNames('text-sm', os.textSecondary)}>
        Wähle, wie du das Portal nutzen möchtest. Du kannst später jederzeit wechseln.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className={classNames(os.card, 'flex flex-col p-5')}>
          <span className="flex size-11 items-center justify-center rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
            <UserPlusIcon className="size-5 text-[#A78BFA]" />
          </span>
          <h3 className="mt-3 text-base font-bold">Ich bin Experte</h3>
          <p className={classNames('mt-1 flex-1 text-sm leading-relaxed', os.textSecondary)}>
            Setter, Closer, Terminierer oder Opener. Werde sichtbar, erhalte Anfragen und finde neue Projekte.
          </p>
          <p className={classNames('mt-3 text-xs', os.textMuted)}>Monatliches Abo · Free zum Start</p>
          <GradientButton className="mt-3 w-full !py-2.5" onClick={onPlans}>
            Als Experte starten
          </GradientButton>
        </div>
        <div className={classNames(os.card, 'flex flex-col p-5')}>
          <span className="flex size-11 items-center justify-center rounded-xl border border-[#5B7CFA]/30 bg-[#5B7CFA]/10">
            <BuildingOffice2Icon className="size-5 text-[#A5B8FF]" />
          </span>
          <h3 className="mt-3 text-base font-bold">Ich bin Unternehmen</h3>
          <p className={classNames('mt-1 flex-1 text-sm leading-relaxed', os.textSecondary)}>
            Kostenlos browsen & filtern. Zahle nur pro Experten-Freischaltung — genau für die Leads, die du brauchst.
          </p>
          <p className={classNames('mt-3 text-xs', os.textMuted)}>Kostenloser Eintritt · Credits pro Unlock</p>
          <GhostButton className="mt-3 w-full !py-2.5" onClick={onCredits}>
            Als Unternehmen starten
          </GhostButton>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Abo-Modal (Experten) ---------------- */

function PlansModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Experten-Abo" onClose={onClose} wide>
      <p className={classNames('text-sm', os.textSecondary)}>
        Werde sichtbar und erhalte Anfragen. Jederzeit monatlich kündbar.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {expertPlans.map((plan) => (
          <div
            key={plan.tier}
            className={classNames(
              'flex flex-col rounded-2xl border p-5',
              plan.highlighted
                ? 'border-[#8B5CF6]/50 bg-gradient-to-b from-[#8B5CF6]/15 to-transparent shadow-[0_0_40px_rgba(124,92,246,0.2)]'
                : 'border-white/[0.08] bg-white/[0.02]',
            )}
          >
            {plan.highlighted && (
              <span className="mb-2 inline-flex w-fit rounded-full bg-[#8B5CF6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Beliebt
              </span>
            )}
            <p className="text-sm font-bold">{plan.tier}</p>
            <p className="mt-2 text-2xl font-bold">
              {plan.price}
              <span className={classNames('ml-1 text-xs font-medium', os.textMuted)}>{plan.cadence}</span>
            </p>
            <p className={classNames('mt-1 text-xs', os.textSecondary)}>{plan.tagline}</p>
            <ul className="mt-4 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-[#A6ACC2]">
                  <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-[#6EE7B7]" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.highlighted ? (
              <GradientButton className="mt-4 w-full !py-2.5">Plan wählen</GradientButton>
            ) : (
              <GhostButton className="mt-4 w-full !py-2.5">Plan wählen</GhostButton>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ---------------- Credits-Modal (Unternehmen) ---------------- */

function CreditsModal({
  credits,
  onClose,
  onBuy,
}: {
  credits: number;
  onClose: () => void;
  onBuy: (amount: number) => void;
}) {
  return (
    <Modal title="Credits kaufen" onClose={onClose} wide>
      <div className="flex items-center justify-between">
        <p className={classNames('text-sm', os.textSecondary)}>
          1 Credit = 1 Experten-Freischaltung (Name, Kontakt & Portfolio).
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#34D399]/40 bg-[#34D399]/10 px-3 py-1 text-xs font-semibold text-[#6EE7B7]">
          <BoltIcon className="size-4" />
          {credits} verfügbar
        </span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {creditPacks.map((pack) => (
          <div
            key={pack.id}
            className={classNames(
              'flex flex-col rounded-2xl border p-5',
              pack.highlighted
                ? 'border-[#8B5CF6]/50 bg-gradient-to-b from-[#8B5CF6]/15 to-transparent'
                : 'border-white/[0.08] bg-white/[0.02]',
            )}
          >
            {pack.highlighted && (
              <span className="mb-2 inline-flex w-fit rounded-full bg-[#8B5CF6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {pack.tagline}
              </span>
            )}
            <p className="text-2xl font-bold">{pack.credits} Credits</p>
            <p className="mt-1 text-lg font-semibold text-[#C4B5FD]">{pack.price}</p>
            <p className={classNames('mt-1 flex-1 text-xs', os.textMuted)}>{pack.perUnlock}</p>
            {pack.highlighted ? (
              <GradientButton className="mt-4 w-full !py-2.5" onClick={() => onBuy(pack.credits)}>
                Kaufen
              </GradientButton>
            ) : (
              <GhostButton className="mt-4 w-full !py-2.5" onClick={() => onBuy(pack.credits)}>
                Kaufen
              </GhostButton>
            )}
          </div>
        ))}
      </div>
      <p className={classNames('mt-4 text-xs', os.textMuted)}>
        Tipp: Über das Empfehlungsprogramm bekommst du Gratis-Credits, wenn du andere Unternehmen einlädst.
      </p>
    </Modal>
  );
}

/* ---------------- Referral-Modal (zwei Programme) ---------------- */

function ReferralModal({
  onClose,
  copied,
  onCopy,
}: {
  onClose: () => void;
  copied: string | null;
  onCopy: (code: string) => void;
}) {
  return (
    <Modal title="Empfehlungsprogramm" onClose={onClose} wide>
      <p className={classNames('text-sm', os.textSecondary)}>
        Zwei getrennte Programme — teile deinen Link und werde belohnt, sobald die geworbene Seite aktiv wird.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {referralPrograms.map((prog) => (
          <div key={prog.id} className={classNames(os.card, 'flex flex-col p-5')}>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                {prog.id === 'expert' ? (
                  <UserPlusIcon className="size-4 text-[#A78BFA]" />
                ) : (
                  <BuildingOffice2Icon className="size-4 text-[#A5B8FF]" />
                )}
              </span>
              <div>
                <p className="text-sm font-bold">{prog.audience}</p>
                <p className={classNames('text-xs', os.textMuted)}>{prog.motive}</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/[0.08] p-3">
              <p className="text-xs font-semibold text-[#C4B5FD]">Belohnung</p>
              <p className={classNames('mt-0.5 text-xs', os.textSecondary)}>{prog.reward}</p>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <MiniStat label="Eingeladen" value={String(prog.invited)} />
              <MiniStat label="Qualifiziert" value={String(prog.qualified)} accent />
              <MiniStat label="Verdient" value={prog.earned} />
            </div>

            <ol className="mt-3 flex-1 space-y-1.5">
              {prog.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-[#A6ACC2]">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold text-[#C4B5FD]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-xs text-[#A6ACC2]">revolutos.app/r/{prog.code}</span>
              <button
                onClick={() => onCopy(prog.code)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#8B5CF6]/20 px-2.5 py-1 text-xs font-semibold text-[#C4B5FD] transition-colors hover:bg-[#8B5CF6]/30"
              >
                {copied === prog.code ? (
                  <>
                    <CheckIcon className="size-3.5" />
                    Kopiert
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="size-3.5" />
                    Kopieren
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
