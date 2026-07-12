import { useEffect, useRef, useState } from 'react';
import {
  ArrowPathIcon,
  BoltIcon,
  ChartBarIcon,
  CpuChipIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '~/utils/classNames';
import { assistantAnswer, assistantSeed, assistantSuggestions } from './demoData';
import type { AssistantMessage } from './demoData';
import { GradientButton, os } from './Ui';
import { OsShell } from './OsShell';

const capabilities = [
  { icon: UsersIcon, text: 'Leads priorisieren & Follow-ups schreiben' },
  { icon: PencilSquareIcon, text: 'Content planen & Texte generieren' },
  { icon: ChartBarIcon, text: 'Zahlen erklären & Trends aufdecken' },
  { icon: BoltIcon, text: 'Automationen vorschlagen & starten' },
];

const context = [
  { label: 'Offene Leads', value: '9' },
  { label: 'Monatsumsatz', value: '24.860 €' },
  { label: 'Aktive Automationen', value: '4' },
  { label: 'Live-Funnels', value: '2' },
];

function AssistantBubble({ message }: { message: AssistantMessage }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] shadow-[0_4px_16px_rgba(124,92,246,0.45)]">
        <SparklesIcon className="size-4 text-white" />
      </span>
      <div className="min-w-0 max-w-2xl">
        <div className={classNames(os.card, 'p-4')}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          {message.bullets && (
            <ul className="mt-3 space-y-1.5">
              {message.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#A78BFA]" />
                  <span className={os.textSecondary}>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {message.actions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.actions.map((a) => (
              <span
                key={a}
                data-action={a}
                className="cursor-pointer rounded-lg border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-3 py-1.5 text-xs font-semibold text-[#C4B5FD] transition-colors hover:bg-[#8B5CF6]/20"
              >
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-xl rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA] px-4 py-2.5 text-sm text-white shadow-[0_8px_30px_rgba(124,92,246,0.35)]">
        {text}
      </div>
    </div>
  );
}

export function OsAssistant() {
  const [messages, setMessages] = useState<AssistantMessage[]>(assistantSeed);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) {
      return;
    }
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setThinking(true);
    const t = setTimeout(() => {
      setMessages((prev) => [...prev, assistantAnswer(trimmed)]);
      setThinking(false);
    }, 650);
    timers.current.push(t);
  };

  const runAction = (label: string) => {
    if (thinking) {
      return;
    }
    setMessages((prev) => [...prev, { role: 'user', text: label }]);
    setThinking(true);
    const t = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Erledigt — „${label}" ist angestoßen. Ich halte dich über den Fortschritt auf dem Laufenden und melde mich, sobald es etwas zu entscheiden gibt.`,
        },
      ]);
      setThinking(false);
    }, 650);
    timers.current.push(t);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('[data-action]');
    if (target) {
      runAction(target.getAttribute('data-action') as string);
    }
  };

  return (
    <OsShell active="assistant" searchPlaceholder="Frag dein Business OS …">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chat */}
        <div className="flex h-[calc(100vh-11rem)] flex-col xl:col-span-2">
          <div className="flex items-center gap-2">
            <CpuChipIcon className="size-5 text-[#A78BFA]" />
            <h1 className="text-xl font-bold tracking-tight">KI-Assistent</h1>
          </div>
          <p className={classNames('mt-0.5 text-sm', os.textSecondary)}>
            Der Assistent, der dein ganzes Business kennt — nicht nur den Chat.
          </p>

          <div
            ref={scrollRef}
            onClick={handleClick}
            className="mt-4 flex-1 space-y-5 overflow-y-auto rounded-2xl border border-white/[0.06] bg-white/[0.01] p-5"
          >
            {messages.map((m, i) =>
              m.role === 'assistant' ? <AssistantBubble key={i} message={m} /> : <UserBubble key={i} text={m.text} />,
            )}
            {thinking && (
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA]">
                  <SparklesIcon className="size-4 text-white" />
                </span>
                <div className={classNames(os.card, 'flex items-center gap-1.5 px-4 py-3')}>
                  <span className="size-2 animate-bounce rounded-full bg-[#A78BFA] [animation-delay:-0.3s]" />
                  <span className="size-2 animate-bounce rounded-full bg-[#A78BFA] [animation-delay:-0.15s]" />
                  <span className="size-2 animate-bounce rounded-full bg-[#A78BFA]" />
                </div>
              </div>
            )}
          </div>

          {/* Vorschläge */}
          <div className="mt-3 flex flex-wrap gap-2">
            {assistantSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className={classNames(
                  'rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-[#8B5CF6]/50 hover:text-[#C4B5FD]',
                  os.textSecondary,
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Eingabe */}
          <div className="mt-3 flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Frag alles zu deinem Business …"
              className="max-h-32 flex-1 resize-none rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-[#F4F5F9] placeholder:text-[#6B7288] focus:border-[#8B5CF6]/60 focus:outline-none"
            />
            <GradientButton onClick={() => send(input)} className="!px-4 !py-3">
              <PaperAirplaneIcon className="size-4" />
            </GradientButton>
          </div>
        </div>

        {/* Rechte Spalte */}
        <div className="space-y-4">
          <section className={classNames(os.card, 'p-6')}>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <SparklesIcon className="size-4 text-[#A78BFA]" />
              Kontext, den ich sehe
            </h2>
            <p className={classNames('mt-0.5 text-xs', os.textMuted)}>Live aus deinem OS</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {context.map((c) => (
                <div key={c.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className={classNames('text-[11px] uppercase tracking-wider', os.textMuted)}>{c.label}</p>
                  <p className="mt-1 text-lg font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className={classNames(os.card, 'p-6')}>
            <h2 className="text-base font-semibold">Was ich für dich tun kann</h2>
            <ul className="mt-4 space-y-3">
              {capabilities.map((cap) => (
                <li key={cap.text} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10">
                    <cap.icon className="size-4 text-[#A78BFA]" />
                  </span>
                  <span className={classNames('text-sm', os.textSecondary)}>{cap.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <button
            onClick={() => setMessages(assistantSeed)}
            className={classNames(
              'inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[#F4F5F9]',
              os.textMuted,
            )}
          >
            <ArrowPathIcon className="size-3.5" />
            Neues Gespräch
          </button>
        </div>
      </div>
    </OsShell>
  );
}
