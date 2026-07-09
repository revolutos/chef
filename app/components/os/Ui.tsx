import { classNames } from '~/utils/classNames';

/**
 * Design-Tokens für das KI Business OS.
 * Dunkles Premium-Theme mit Violett/Blau-Verlauf, unabhängig vom App-Theme.
 */
export const os = {
  page: 'bg-[#05060B] text-[#F4F5F9] antialiased selection:bg-[#8B5CF6]/30',
  card: 'rounded-2xl border border-white/[0.08] bg-white/[0.03]',
  cardHover: 'transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.05]',
  textSecondary: 'text-[#A6ACC2]',
  textMuted: 'text-[#6B7288]',
  gradientText: 'bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#60A5FA] bg-clip-text text-transparent',
} as const;

export function GradientButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA] px-5 py-3 text-sm font-semibold text-white',
        'shadow-[0_8px_30px_rgba(124,92,246,0.35)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(124,92,246,0.55)] hover:brightness-110',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-5 py-3 text-sm font-semibold text-[#F4F5F9]',
        'transition-colors duration-300 hover:border-white/[0.24] hover:bg-white/[0.07]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C4B5FD]">
      {children}
    </span>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] shadow-[0_4px_16px_rgba(124,92,246,0.45)]">
        <svg viewBox="0 0 24 24" fill="none" className="size-4 text-white" aria-hidden="true">
          <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 8v8M8.5 10v4M15.5 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-bold tracking-wide text-[#F4F5F9]">REVOLUTOS</span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-[#6B7288]">
            KI Business OS
          </span>
        </span>
      )}
    </span>
  );
}

/** Weiche Leucht-Fläche im Hintergrund (rein dekorativ). */
export function GlowOrb({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={classNames('pointer-events-none absolute rounded-full blur-[120px]', className)}
    />
  );
}
