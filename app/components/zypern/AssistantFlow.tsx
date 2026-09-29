import { useEffect, useRef, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { isVariantB, type Experiment } from './ab';
import { acknowledgement, nextQuestion, profileSummary, progress } from './assistant';
import type { SubmittedLead } from './BuyingProfileFunnel';
import { booking, company, contactPreferenceOptions } from './config';
import type { AssistantAnswers, NextStep } from './scoring';
import { readConsent, track } from './tracking';
import type { LeadResponse } from '~/routes/api.zypern-lead';
import { ArrowIcon, CheckIcon, Logo, PrimaryButton, SecondaryButton, z } from './ui';

type Message = { from: 'assistant' | 'user'; text: string };

/**
 * Nachqualifizierung nach dem Opt-in und anschließende Termin-/Dankesseite.
 * Wird als eigene Ansicht über der Landingpage geöffnet.
 */
export function AssistantFlow({
  lead,
  experiment,
  onClose,
}: {
  lead: SubmittedLead;
  experiment: Experiment;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<AssistantAnswers>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [note, setNote] = useState('');
  const [outcome, setOutcome] = useState<NextStep | null>(null);
  const [sending, setSending] = useState(false);
  const [viewingRequested, setViewingRequested] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const question = nextQuestion(lead.profile, answers);
  const { answered, total } = progress(lead.profile, answers);
  const offerBookingFirst = isVariantB(experiment, 'booking_timing') && lead.nextStep === 'booking' && !outcome;

  useEffect(() => {
    track('virtual_page_view', {
      page_path: '/zypern-immobilien-kaufen/assistent',
      page_title: 'Immobilien-Assistent',
    });
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, outcome]);

  const post = async (intent: 'qualify' | 'viewing', finalAnswers: AssistantAnswers) => {
    const response = await fetch('/api/zypern-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent,
        leadId: lead.leadId,
        profile: lead.profile,
        contact: lead.contact,
        answers: finalAnswers,
        note,
        privacy: true,
        attribution: lead.attribution,
        consent: readConsent(),
      }),
    });
    return (await response.json()) as LeadResponse;
  };

  const answer = async (value: string, labelText: string) => {
    if (!question || sending) {
      return;
    }
    const next = { ...answers, [question.id]: value };
    const isLast = nextQuestion(lead.profile, next) === null;
    setMessages((m) => [
      ...m,
      { from: 'assistant', text: question.text },
      { from: 'user', text: labelText },
      ...(isLast ? [] : [{ from: 'assistant' as const, text: acknowledgement(question.id, value) }]),
    ]);
    setAnswers(next);
    if (!isLast) {
      return;
    }

    setSending(true);
    try {
      const result = await post('qualify', next);
      if (!result.ok) {
        throw new Error(result.message);
      }
      if (result.signals.highQuality && lead.nextStep !== 'booking') {
        track('high_quality_lead', { lead_id: lead.leadId, stage: 'assistant' });
      }
      if (next.next_step === 'viewing_now') {
        setViewingRequested(true);
        track('viewing_requested', { lead_id: lead.leadId });
      }
      setOutcome(result.nextStep);
      track('virtual_page_view', {
        page_path: '/zypern-immobilien-kaufen/danke',
        page_title: 'Danke / Termin',
        outcome: result.nextStep,
      });
    } catch {
      // Die Kontaktdaten liegen bereits vor – Besucher nicht blockieren.
      setOutcome(lead.nextStep === 'booking' ? 'booking' : 'confirmation');
    } finally {
      setSending(false);
    }
  };

  const requestViewing = async () => {
    setSending(true);
    try {
      await post('viewing', { ...answers, next_step: 'viewing_now' });
    } finally {
      setSending(false);
      setViewingRequested(true);
      track('viewing_requested', { lead_id: lead.leadId });
    }
  };

  const summary = profileSummary(lead.profile);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="zy-assistant-title"
      className={classNames('fixed inset-0 z-[100] overflow-y-auto outline-none', z.page)}
    >
      <header className={classNames('sticky top-0 z-10 border-b bg-[#F6F2EB]/95 backdrop-blur', z.line)}>
        <div className={classNames(z.container, 'flex h-16 items-center justify-between')}>
          <Logo />
          <p className={classNames('hidden text-[13px] sm:block', z.textMuted)}>
            Ihr persönlicher Zypern Immobilien-Assistent
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[680px] px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        {!outcome ? (
          <>
            <p className={classNames('text-[13px] font-semibold uppercase tracking-[0.14em]', z.accentText)}>
              Ihr persönlicher Zypern Immobilien-Assistent
            </p>
            <h1
              id="zy-assistant-title"
              className={classNames(z.serif, 'mt-3 text-[28px] font-medium leading-tight sm:text-[34px]')}
            >
              Danke, {lead.contact.firstName}. Ich habe Ihre Eckdaten. Lassen Sie uns Ihre Suche noch etwas genauer
              eingrenzen.
            </h1>

            <dl className="mt-6 flex flex-wrap gap-2">
              {summary.map((item) => (
                <div
                  key={item.label}
                  className={classNames('rounded-full border bg-white px-3 py-1.5 text-[13px]', z.line)}
                >
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <span className={z.textMuted}>{item.label}:</span> <span className="font-medium">{item.value}</span>
                  </dd>
                </div>
              ))}
            </dl>

            {offerBookingFirst && (
              <div className={classNames('mt-8 rounded-lg border bg-white p-5 sm:p-6', z.line)}>
                <p className="text-[16px] font-medium">Ihre Angaben passen zu unserem Beratungsprozess.</p>
                <p className={classNames('mt-1 text-[15px]', z.textSecondary)}>
                  Sie können direkt einen Termin wählen oder zuerst die Fragen unten beantworten.
                </p>
                <BookingCalendar lead={lead} compact />
              </div>
            )}

            <div className="mt-8 space-y-3" aria-live="polite">
              {messages.map((message, index) => (
                <ChatBubble key={index} message={message} />
              ))}
              {question && (
                <div className="pt-2">
                  <ChatBubble message={{ from: 'assistant', text: question.text }} />
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        disabled={sending}
                        onClick={() => answer(option.value, option.label)}
                        className={classNames(
                          'min-h-[50px] rounded-md border border-[#DDD5C8] bg-white px-4 text-left text-[15px] font-medium transition-colors hover:border-[#1E2226]/50 disabled:opacity-60',
                          z.focus,
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {question.allowText && (
                    <div className="mt-4">
                      <label htmlFor="zy-note" className={classNames('text-[14px]', z.textSecondary)}>
                        Möchten Sie uns noch etwas mitteilen? (optional)
                      </label>
                      <textarea
                        id="zy-note"
                        rows={3}
                        maxLength={1000}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="z. B. Lage, Ausstattung, Reisedaten"
                        className="mt-1.5 block w-full rounded-md border border-[#DDD5C8] bg-white p-3 text-[16px] outline-none focus:border-[#1E2226] focus:ring-2 focus:ring-[#A4532F]/25"
                      />
                    </div>
                  )}
                  <p className={classNames('mt-4 text-[13px]', z.textMuted)}>
                    Frage {answered + 1} von {total}
                  </p>
                </div>
              )}
              {sending && <p className={classNames('text-[14px]', z.textMuted)}>Einen Moment …</p>}
            </div>
          </>
        ) : (
          <Outcome
            lead={lead}
            outcome={outcome}
            viewingRequested={viewingRequested}
            onRequestViewing={requestViewing}
            onClose={onClose}
            sending={sending}
          />
        )}
        <div ref={bottomRef} />
      </main>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const mine = message.from === 'user';
  return (
    <div className={classNames('flex', mine ? 'justify-end' : 'justify-start')}>
      <p
        className={classNames(
          'max-w-[85%] rounded-lg px-4 py-2.5 text-[15px] leading-relaxed',
          mine ? 'bg-[#13243A] text-white' : 'border border-[#E3DBCE] bg-white text-[#1E2226]',
        )}
      >
        {message.text}
      </p>
    </div>
  );
}

function channelLabel(lead: SubmittedLead) {
  const label = contactPreferenceOptions.find((o) => o.value === lead.contact.contactPreference)?.label ?? 'E-Mail';
  return label === 'Video-Call' ? 'Telefon' : label;
}

function Outcome({
  lead,
  outcome,
  viewingRequested,
  onRequestViewing,
  onClose,
  sending,
}: {
  lead: SubmittedLead;
  outcome: NextStep;
  viewingRequested: boolean;
  onRequestViewing: () => void;
  onClose: () => void;
  sending: boolean;
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  if (viewingRequested) {
    return (
      <section aria-labelledby="zy-assistant-title">
        <SuccessMark />
        <h1
          id="zy-assistant-title"
          className={classNames(z.serif, 'mt-5 text-[28px] font-medium leading-tight sm:text-[34px]')}
        >
          Ihre Besichtigungsanfrage ist bei uns.
        </h1>
        <p className={classNames('mt-4 text-[17px] leading-relaxed', z.textSecondary)}>
          Da Sie gerade auf Zypern sind, bearbeiten wir Ihre Anfrage vorrangig. Wir melden uns {company.responseTime}{' '}
          per {channelLabel(lead)} unter {lead.contact.phone || lead.contact.email}, um passende Objekte und Termine
          abzustimmen.
        </p>
        <div className={classNames('mt-8 rounded-lg border bg-white p-5 sm:p-6', z.line)}>
          <p className="text-[16px] font-medium">Lieber gleich einen festen Termin?</p>
          <BookingCalendar lead={lead} compact />
        </div>
      </section>
    );
  }

  if (outcome === 'booking') {
    return (
      <section aria-labelledby="zy-assistant-title">
        <SuccessMark />
        <h1
          id="zy-assistant-title"
          className={classNames(z.serif, 'mt-5 text-[28px] font-medium leading-tight sm:text-[34px]')}
        >
          Ihre Angaben passen zu unserem Beratungsprozess.
        </h1>
        <p className={classNames('mt-4 text-[17px] leading-relaxed', z.textSecondary)}>
          Im {booking.durationLabel}-Kaufgespräch klären wir Ihre Anforderungen, offene Fragen zum Ablauf und die
          nächsten Schritte. Danach erhalten Sie eine Vorauswahl passender Immobilien.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {!showCalendar && (
            <PrimaryButton
              onClick={() => {
                setShowCalendar(true);
                track('calendar_opened', { lead_id: lead.leadId });
              }}
            >
              15-Minuten-Kaufgespräch auswählen <ArrowIcon />
            </PrimaryButton>
          )}
          {showCalendar && <BookingCalendar lead={lead} opened />}
          <SecondaryButton onClick={onRequestViewing} disabled={sending}>
            Ich bin aktuell auf Zypern und möchte eine Besichtigung planen
          </SecondaryButton>
        </div>
        <NextSteps lead={lead} />
      </section>
    );
  }

  if (outcome === 'booking_optional') {
    return (
      <section aria-labelledby="zy-assistant-title">
        <SuccessMark />
        <h1
          id="zy-assistant-title"
          className={classNames(z.serif, 'mt-5 text-[28px] font-medium leading-tight sm:text-[34px]')}
        >
          Danke. Wir sehen uns Ihre Angaben jetzt genauer an.
        </h1>
        <p className={classNames('mt-4 text-[17px] leading-relaxed', z.textSecondary)}>
          Sie erhalten {company.responseTime} eine erste Einschätzung und passende Optionen per {channelLabel(lead)}.
          Wenn Sie vorab sprechen möchten, können Sie direkt einen Termin wählen.
        </p>
        <div className="mt-8">
          {showCalendar ? (
            <BookingCalendar lead={lead} opened />
          ) : (
            <SecondaryButton
              onClick={() => {
                setShowCalendar(true);
                track('calendar_opened', { lead_id: lead.leadId });
              }}
            >
              Beratungsgespräch vereinbaren
            </SecondaryButton>
          )}
        </div>
        <NextSteps lead={lead} />
      </section>
    );
  }

  return (
    <section aria-labelledby="zy-assistant-title">
      <SuccessMark />
      <h1
        id="zy-assistant-title"
        className={classNames(z.serif, 'mt-5 text-[28px] font-medium leading-tight sm:text-[34px]')}
      >
        Danke für Ihre Angaben.
      </h1>
      <p className={classNames('mt-4 text-[17px] leading-relaxed', z.textSecondary)}>
        Wir senden Ihnen eine erste Übersicht zu Ihrer Anfrage an {lead.contact.email}. Wenn sich Ihre Pläne
        konkretisieren, antworten Sie einfach auf diese E-Mail.
      </p>
      <button
        type="button"
        onClick={onClose}
        className={classNames(
          'mt-8 inline-flex items-center gap-2 text-[15px] font-semibold underline underline-offset-4',
          z.focus,
        )}
      >
        Zurück zu den häufigen Fragen
      </button>
    </section>
  );
}

function SuccessMark() {
  return (
    <span className="flex size-11 items-center justify-center rounded-full bg-[#E7EFE9] text-[#2F6B47]">
      <CheckIcon className="size-5" />
    </span>
  );
}

function NextSteps({ lead }: { lead: SubmittedLead }) {
  return (
    <div className={classNames('mt-10 border-t pt-6', z.line)}>
      <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[#555B62]">So geht es weiter</p>
      <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#1E2226]">
        <li className="flex gap-3">
          <span className={classNames(z.serif, 'text-[#9A4B2A]')}>1</span>
          Wir prüfen Ihr Kaufprofil und gleichen es mit verfügbaren Immobilien und Projekten ab.
        </li>
        <li className="flex gap-3">
          <span className={classNames(z.serif, 'text-[#9A4B2A]')}>2</span>
          Wir melden uns per {channelLabel(lead)} und besprechen Ihre Anforderungen.
        </li>
        <li className="flex gap-3">
          <span className={classNames(z.serif, 'text-[#9A4B2A]')}>3</span>
          Sie erhalten eine Vorauswahl und planen bei Bedarf Besichtigungen auf Zypern.
        </li>
      </ol>
    </div>
  );
}

function calendarSrc(lead: SubmittedLead) {
  const url = new URL(booking.calendarUrl);
  url.searchParams.set('name', `${lead.contact.firstName} ${lead.contact.lastName}`);
  url.searchParams.set('email', lead.contact.email);
  // Verknüpft die Buchung im CRM mit dem Lead
  url.searchParams.set('utm_content', lead.leadId);
  if (url.hostname.includes('calendly.com')) {
    url.searchParams.set('embed_type', 'Inline');
    url.searchParams.set('embed_domain', window.location.hostname);
    url.searchParams.set('hide_gdpr_banner', '1');
  } else {
    url.searchParams.set('embed', 'true');
  }
  return url.toString();
}

function BookingCalendar({
  lead,
  compact = false,
  opened = false,
}: {
  lead: SubmittedLead;
  compact?: boolean;
  opened?: boolean;
}) {
  const [visible, setVisible] = useState(opened);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { event?: string; type?: string } | undefined;
      if (
        data?.event === 'calendly.event_scheduled' ||
        data?.type === 'bookingSuccessful' ||
        data?.type === 'bookingSuccessfulV2'
      ) {
        track('appointment_booked', { lead_id: lead.leadId });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [lead.leadId]);

  if (!visible) {
    return (
      <PrimaryButton
        className={classNames(compact ? 'mt-4' : '')}
        onClick={() => {
          setVisible(true);
          track('calendar_opened', { lead_id: lead.leadId });
        }}
      >
        15-Minuten-Kaufgespräch auswählen <ArrowIcon />
      </PrimaryButton>
    );
  }

  if (!booking.calendarUrl) {
    return (
      <div
        className={classNames(
          'mt-4 rounded-md border border-dashed bg-[#FCFAF6] p-5 text-[14px]',
          z.line,
          z.textSecondary,
        )}
      >
        [Platzhalter: Kalender-Einbindung. Calendly- oder Cal.com-Link in <code>booking.calendarUrl</code> eintragen.]
      </div>
    );
  }

  return (
    <iframe
      title="Termin für das Kaufgespräch auswählen"
      src={calendarSrc(lead)}
      loading="lazy"
      className={classNames('mt-4 h-[720px] w-full rounded-md border bg-white', z.line)}
    />
  );
}
