import { classNames } from '~/utils/classNames';

/**
 * Design-Tokens der Zypern-Landingpage: Sand/Off-White, Anthrazit, dunkles Navy,
 * Terrakotta als zurückhaltende mediterrane Akzentfarbe. Unabhängig vom App-Theme.
 */
export const z = {
  page: 'bg-[#F6F2EB] text-[#1E2226] antialiased selection:bg-[#A4532F]/20',
  serif: "font-['Source_Serif_4',Georgia,'Times_New_Roman',serif]",
  paper: 'bg-[#FCFAF6]',
  line: 'border-[#E3DBCE]',
  textSecondary: 'text-[#555B62]',
  textMuted: 'text-[#7A7F85]',
  navy: 'bg-[#13243A]',
  accentText: 'text-[#9A4B2A]',
  container: 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10',
  focus: 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A4532F]',
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-[#A4532F] px-6 py-3 text-center text-[15px] font-semibold text-white',
        'transition-colors duration-200 hover:bg-[#8B4424] disabled:cursor-not-allowed disabled:opacity-60',
        z.focus,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  tone = 'light',
  ...props
}: ButtonProps & { tone?: 'light' | 'dark' }) {
  return (
    <button
      type="button"
      className={classNames(
        'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md border px-6 py-3 text-center text-[15px] font-semibold transition-colors duration-200',
        tone === 'light'
          ? 'border-[#1E2226]/25 text-[#1E2226] hover:border-[#1E2226]/60'
          : 'border-white/30 text-white hover:border-white/70',
        z.focus,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Eyebrow({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <p
      className={classNames(
        'text-[12px] font-semibold uppercase tracking-[0.16em]',
        tone === 'light' ? 'text-[#9A4B2A]' : 'text-[#E6B79E]',
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'light',
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: 'light' | 'dark';
  id?: string;
}) {
  return (
    <div className="max-w-[720px]">
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={classNames(
          z.serif,
          'mt-3 text-[30px] font-medium leading-[1.15] tracking-[-0.01em] sm:text-[40px]',
          tone === 'dark' ? 'text-white' : 'text-[#1E2226]',
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={classNames(
            'mt-4 text-[17px] leading-relaxed',
            tone === 'dark' ? 'text-white/75' : z.textSecondary,
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={classNames('h-4 w-4', className)}>
      <path
        d="M4 10h11m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={classNames('h-4 w-4 shrink-0', className)}>
      <path
        d="m4.5 10.5 3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={classNames('h-4 w-4', className)}>
      <path
        d="M16 10H5m4-4-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 28 28" aria-hidden="true" className="size-7">
        <rect width="28" height="28" rx="4" fill={tone === 'light' ? '#13243A' : '#FFFFFF'} />
        <path
          d="M8 20V8h6.2a3.8 3.8 0 0 1 0 7.6H8m6.2 0L20 20"
          fill="none"
          stroke={tone === 'light' ? '#F6F2EB' : '#13243A'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={classNames(
          'text-[15px] font-semibold tracking-[0.18em]',
          tone === 'light' ? 'text-[#13243A]' : 'text-white',
        )}
      >
        REVOLUTOS
      </span>
    </span>
  );
}

/* Vereinfachter Umriss der Insel Zypern (Küstenlinie generalisiert). */
const CYPRUS_PATH =
  'M14 158.6 L26 168.4 L40 173.2 L54 168.4 L72 144 L100 139.1 L120 151.3 L140 141.5 L150 119.6 L144 87.8 L170 95.2 L224 100 L280 95.2 L340 83 L376 68.3 L420 46.4 L478 14.6 L450 36.6 L400 68.3 L360 90.3 L346 122 L350 153.7 L360 175.7 L376 190.3 L356 187.9 L330 192.8 L290 200.1 L282 226.9 L250 251.3 L220 256.2 L180 256.2 L166 290.4 L150 270.8 L120 268.4 L84 266 L50 246.4 L40 239.1 L30 212.3 L24 187.9 Z';

export const CITY_POINTS = {
  paphos: { x: 44, y: 239, label: 'Paphos', anchor: 'start' as const, dx: 10, dy: 22 },
  limassol: { x: 168, y: 261, label: 'Limassol', anchor: 'middle' as const, dx: 0, dy: 26 },
  larnaca: { x: 286, y: 202, label: 'Larnaca', anchor: 'start' as const, dx: 12, dy: 5 },
  nicosia: { x: 234, y: 141, label: 'Nikosia', anchor: 'middle' as const, dx: 0, dy: -14 },
};

export function CyprusMap({
  highlight,
  showLabels = true,
  className,
  title = 'Karte der Insel Zypern mit Paphos, Limassol, Larnaca und Nikosia',
}: {
  highlight?: keyof typeof CITY_POINTS;
  showLabels?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 490 300" role="img" aria-label={title} className={className}>
      <path d={CYPRUS_PATH} fill="#EFE7DA" stroke="#B9AB95" strokeWidth="1.5" strokeLinejoin="round" />
      {Object.entries(CITY_POINTS).map(([key, city]) => {
        const active = !highlight || highlight === key;
        return (
          <g key={key} opacity={active ? 1 : 0.35}>
            {highlight === key && <circle cx={city.x} cy={city.y} r="14" fill="#A4532F" opacity="0.15" />}
            <circle cx={city.x} cy={city.y} r={highlight === key ? 6 : 4.5} fill={active ? '#A4532F' : '#7A7F85'} />
            {showLabels && (
              <text
                x={city.x + city.dx}
                y={city.y + city.dy}
                textAnchor={city.anchor}
                className="fill-[#1E2226] text-[15px] font-medium"
              >
                {city.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
