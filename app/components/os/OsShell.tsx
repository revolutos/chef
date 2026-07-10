import {
  BellIcon,
  BoltIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  Squares2X2Icon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { BrandMark, GlowOrb, GradientButton, os } from './Ui';

export type OsNavKey =
  | 'dashboard'
  | 'assistant'
  | 'crm'
  | 'content'
  | 'funnels'
  | 'automations'
  | 'analytics'
  | 'reports';

interface NavItem {
  key: OsNavKey;
  label: string;
  icon: typeof Squares2X2Icon;
  href?: string;
}

const navSections: { section: string; items: NavItem[] }[] = [
  {
    section: 'Übersicht',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon, href: '/os/dashboard' },
      { key: 'assistant', label: 'KI-Assistent', icon: CpuChipIcon },
    ],
  },
  {
    section: 'Business',
    items: [
      { key: 'crm', label: 'CRM & Leads', icon: UsersIcon, href: '/os/crm' },
      { key: 'content', label: 'Content-Engine', icon: PencilSquareIcon },
      { key: 'funnels', label: 'Funnels & Angebote', icon: FunnelIcon },
      { key: 'automations', label: 'Automationen', icon: BoltIcon },
    ],
  },
  {
    section: 'Insights',
    items: [
      { key: 'analytics', label: 'Analytics', icon: ChartBarIcon },
      { key: 'reports', label: 'Berichte', icon: DocumentChartBarIcon },
    ],
  },
];

/**
 * Gemeinsame App-Shell für alle OS-Module: Sidebar mit Navigation,
 * Topbar mit Suche + Benachrichtigungen. Module rendern ihren Inhalt als children.
 */
export function OsShell({
  active,
  searchPlaceholder = 'Suche in Leads, Content, Automationen …',
  children,
}: {
  active: OsNavKey;
  searchPlaceholder?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={classNames('flex min-h-screen', os.page)}>
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#07080F] px-4 py-6 lg:flex">
        <a href="/os" className="px-2">
          <BrandMark />
        </a>

        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
          {navSections.map((group) => (
            <div key={group.section}>
              <p className={classNames('px-3 text-[10px] font-semibold uppercase tracking-[0.2em]', os.textMuted)}>
                {group.section}
              </p>
              <ul className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.key === active;
                  const inner = (
                    <>
                      <item.icon className={classNames('size-5', isActive ? 'text-[#A78BFA]' : 'text-[#6B7288]')} />
                      <span className="flex-1">{item.label}</span>
                      {!item.href && (
                        <span className="rounded-full border border-white/[0.1] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#6B7288]">
                          Bald
                        </span>
                      )}
                    </>
                  );
                  const itemClasses = classNames(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#5B7CFA]/10 text-[#F4F5F9] shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]'
                      : 'text-[#A6ACC2] hover:bg-white/[0.05] hover:text-[#F4F5F9]',
                  );
                  return (
                    <li key={item.key}>
                      {item.href ? (
                        <a href={item.href} className={itemClasses}>
                          {inner}
                        </a>
                      ) : (
                        <span className={classNames(itemClasses, 'cursor-default opacity-60')}>{inner}</span>
                      )}
                    </li>
                  );
                })}
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
              placeholder={searchPlaceholder}
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

        <main className="relative px-6 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
