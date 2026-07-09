import { useMemo, useRef, useState } from 'react';
import type { RevenuePoint } from './demoData';

const SERIES = '#9085E9'; // validierte Serienfarbe auf dunkler Fläche (≥3:1, OKLCH-Band)
const GRID = 'rgba(255,255,255,0.07)';
const MUTED = '#6B7288';

const W = 720;
const H = 240;
const PAD = { top: 16, right: 12, bottom: 28, left: 52 };

function formatEuro(value: number) {
  return `${value.toLocaleString('de-DE')} €`;
}

/**
 * Flächen-Chart für die Umsatzentwicklung: eine Serie, Hairline-Grid,
 * Crosshair + Tooltip beim Hover. Reines SVG, keine Chart-Bibliothek.
 */
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { points, ticks, xFor, yFor } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value));
    const yMax = Math.ceil(max / 5000) * 5000;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const xForFn = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
    const yForFn = (v: number) => PAD.top + innerH - (v / yMax) * innerH;
    return {
      points: data.map((d, i) => ({ x: xForFn(i), y: yForFn(d.value) })),
      ticks: [0, yMax / 2, yMax],
      xFor: xForFn,
      yFor: yForFn,
    };
  }, [data]);

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${H - PAD.bottom} L${PAD.left},${H - PAD.bottom} Z`;

  const handleMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((x - PAD.left) / (W - PAD.left - PAD.right)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const active = hover !== null ? data[hover] : null;

  return (
    <div ref={wrapRef} className="relative" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label="Umsatzentwicklung der letzten 30 Tage"
      >
        <defs>
          <linearGradient id="os-rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity="0.28" />
            <stop offset="100%" stopColor={SERIES} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yFor(t)} y2={yFor(t)} stroke={GRID} strokeWidth="1" />
            <text
              x={PAD.left - 8}
              y={yFor(t) + 4}
              textAnchor="end"
              fontSize="11"
              fill={MUTED}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t >= 1000 ? `${t / 1000}k` : t}
            </text>
          </g>
        ))}

        {[0, 9, 19, 29].map((i) => (
          <text
            key={i}
            x={xFor(i)}
            y={H - 8}
            textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
            fontSize="11"
            fill={MUTED}
          >
            {data[i].label}
          </text>
        ))}

        <path d={areaPath} fill="url(#os-rev-fill)" />
        <path d={linePath} fill="none" stroke={SERIES} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {hover !== null ? (
          <g>
            <line
              x1={points[hover].x}
              x2={points[hover].x}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
            />
            <circle cx={points[hover].x} cy={points[hover].y} r="4.5" fill={SERIES} stroke="#0B0C14" strokeWidth="2" />
          </g>
        ) : (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="4.5"
            fill={SERIES}
            stroke="#0B0C14"
            strokeWidth="2"
          />
        )}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 rounded-lg border border-white/[0.12] bg-[#12141F] px-3 py-2 shadow-xl"
          style={{ left: `${(points[hover].x / W) * 100}%` }}
        >
          <p className="whitespace-nowrap text-[11px] font-medium text-[#6B7288]">{active.label}</p>
          <p
            className="whitespace-nowrap text-sm font-semibold text-[#F4F5F9]"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatEuro(active.value)}
          </p>
        </div>
      )}
    </div>
  );
}
