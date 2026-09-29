import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { isVariantB, type Experiment } from './ab';
import {
  budgetOptions,
  company,
  contactPreferenceOptions,
  financingOptions,
  phoneCountryCodes,
  propertyTypeOptions,
  purposeOptions,
  regionOptions,
  timelineOptions,
  visitedOptions,
  type ContactPreference,
  type Region,
} from './config';
import type { BuyingProfile, ContactData, NextStep } from './scoring';
import { captureAttribution, readConsent, setUserData, track } from './tracking';
import { normalizePhone, validateContact, type ContactErrors } from './validation';
import type { LeadResponse } from '~/routes/api.zypern-lead';
import { ArrowIcon, BackIcon, CheckIcon, PrimaryButton, z } from './ui';

type StepId = keyof BuyingProfile;

type Step = {
  id: StepId;
  question: string;
  hint?: string;
  options: readonly { value: string; label: string }[];
};

const ALL_STEPS: Record<StepId, Step> = {
  purpose: { id: 'purpose', question: 'Wofür möchten Sie die Immobilie nutzen?', options: purposeOptions },
  region: {
    id: 'region',
    question: 'Welche Region interessiert Sie?',
    hint: 'Sie wissen noch nicht, welche Region zu Ihnen passt? Das klären wir gemeinsam.',
    options: regionOptions,
  },
  propertyType: { id: 'propertyType', question: 'Was möchten Sie kaufen?', options: propertyTypeOptions },
  budget: {
    id: 'budget',
    question: 'Welches Kaufbudget planen Sie?',
    hint: 'Eine grobe Einordnung genügt. So schlagen wir nur Objekte vor, die für Sie realistisch infrage kommen.',
    options: budgetOptions,
  },
  timeline: { id: 'timeline', question: 'Wann möchten Sie kaufen?', options: timelineOptions },
  financing: {
    id: 'financing',
    question: 'Wie soll der Kauf voraussichtlich finanziert werden?',
    options: financingOptions,
  },
  visited: {
    id: 'visited',
    question: 'Waren Sie bereits auf Zypern bzw. haben Sie Immobilien besichtigt?',
    options: visitedOptions,
  },
};

export function buildSteps(experiment: Experiment): Step[] {
  let order: StepId[] = ['purpose', 'region', 'propertyType', 'budget', 'timeline', 'financing', 'visited'];
  if (isVariantB(experiment, 'budget_position')) {
    order = ['budget', ...order.filter((s) => s !== 'budget')];
  }
  if (isVariantB(experiment, 'funnel_length')) {
    order = order.filter((s) => s !== 'financing' && s !== 'visited');
  }
  return order.map((id) => ALL_STEPS[id]);
}

export type SubmittedLead = {
  leadId: string;
  profile: BuyingProfile;
  contact: ContactData;
  nextStep: NextStep;
  attribution: ReturnType<typeof captureAttribution>;
};

export function BuyingProfileFunnel({
  experiment,
  turnstileSiteKey,
  regionRequest,
  onSubmitted,
  compact = false,
}: {
  experiment: Experiment;
  turnstileSiteKey: string | null;
  regionRequest: { region: Region; nonce: number } | null;
  onSubmitted: (lead: SubmittedLead) => void;
  compact?: boolean;
}) {
  const steps = useMemo(() => buildSteps(experiment), [experiment]);
  const [answers, setAnswers] = useState<Partial<BuyingProfile>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<'questions' | 'contact'>('questions');
  const started = useRef(false);
  const mountedAt = useRef(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!regionRequest) {
      return;
    }
    setAnswers((a) => ({ ...a, region: regionRequest.region }));
  }, [regionRequest]);

  const step = steps[stepIndex];
  const total = steps.length + 1;
  const current = phase === 'contact' ? total : stepIndex + 1;

  const focusCard = () => {
    // Nach jedem Schritt Fokus an den Kartenanfang (Screenreader, Tastatur) ohne Sprung auf Desktop.
    requestAnimationFrame(() => containerRef.current?.focus({ preventScroll: true }));
    const top = containerRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const choose = (value: string) => {
    if (!started.current) {
      started.current = true;
      track('buying_profile_started', { first_step: step.id });
    }
    if (step.id === 'budget') {
      track('budget_selected', { budget: value });
    }
    const next = { ...answers, [step.id]: value };
    setAnswers(next);
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setPhase('contact');
      track('qualification_completed', {
        purpose: next.purpose,
        region: next.region,
        budget: next.budget,
        timeline: next.timeline,
      });
    }
    focusCard();
  };

  const back = () => {
    if (phase === 'contact') {
      setPhase('questions');
    } else {
      setStepIndex(Math.max(0, stepIndex - 1));
    }
    focusCard();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={classNames(
        'scroll-mt-24 rounded-lg border bg-white shadow-[0_1px_2px_rgba(30,34,38,0.04),0_12px_40px_-12px_rgba(30,34,38,0.12)] outline-none',
        z.line,
        compact ? 'p-5 sm:p-7' : 'p-5 sm:p-8 lg:p-10',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <p className={classNames('text-[13px] font-medium', z.textMuted)}>
          Schritt {current} von {total}
        </p>
        {(stepIndex > 0 || phase === 'contact') && (
          <button
            type="button"
            onClick={back}
            className={classNames(
              'inline-flex items-center gap-1.5 text-[13px] font-medium text-[#555B62] hover:text-[#1E2226]',
              z.focus,
            )}
          >
            <BackIcon /> Zurück
          </button>
        )}
      </div>
      <div
        className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[#EFE9DF]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Fortschritt Kaufprofil"
      >
        <div
          className="h-full rounded-full bg-[#A4532F] transition-[width] duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>

      {phase === 'questions' ? (
        <fieldset className="mt-6" key={step.id}>
          <legend className={classNames(z.serif, 'text-[22px] font-medium leading-snug text-[#1E2226] sm:text-[26px]')}>
            {step.question}
          </legend>
          {step.hint && <p className={classNames('mt-2 text-[15px] leading-relaxed', z.textSecondary)}>{step.hint}</p>}
          <div className={classNames('mt-5 grid gap-2.5', step.options.length > 4 && !compact ? 'sm:grid-cols-2' : '')}>
            {step.options.map((option) => {
              const selected = answers[step.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(option.value)}
                  className={classNames(
                    'group flex min-h-[54px] w-full items-center justify-between gap-3 rounded-md border px-4 text-left text-[16px] font-medium transition-colors duration-150',
                    selected
                      ? 'border-[#A4532F] bg-[#FBF1EB] text-[#1E2226]'
                      : 'border-[#DDD5C8] bg-white text-[#1E2226] hover:border-[#1E2226]/50',
                    z.focus,
                  )}
                >
                  {option.label}
                  <span
                    className={classNames(
                      'flex h-6 w-6 items-center justify-center rounded-full border',
                      selected
                        ? 'border-[#A4532F] bg-[#A4532F] text-white'
                        : 'border-[#CFC6B8] text-transparent group-hover:border-[#1E2226]/50',
                    )}
                  >
                    <CheckIcon className="size-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
          {stepIndex === 0 && (
            <p className={classNames('mt-5 text-[13px]', z.textMuted)}>
              Unverbindlich · ca. 2 Minuten · Ihre Kontaktdaten fragen wir erst am Ende ab
            </p>
          )}
        </fieldset>
      ) : (
        <ContactStep
          experiment={experiment}
          profile={answers as BuyingProfile}
          turnstileSiteKey={turnstileSiteKey}
          mountedAt={mountedAt.current}
          onSubmitted={onSubmitted}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[14px] font-medium text-[#1E2226]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[13px] text-[#A3261B]">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (invalid: boolean) =>
  classNames(
    'block h-[52px] w-full min-w-0 rounded-md border bg-white px-3.5 text-[16px] text-[#1E2226] placeholder:text-[#9EA2A6]',
    invalid ? 'border-[#A3261B]' : 'border-[#DDD5C8] focus:border-[#1E2226]',
    'outline-none focus:ring-2 focus:ring-[#A4532F]/25',
  );

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};

function ContactStep({
  experiment,
  profile,
  turnstileSiteKey,
  mountedAt,
  onSubmitted,
}: {
  experiment: Experiment;
  profile: BuyingProfile;
  turnstileSiteKey: string | null;
  mountedAt: number;
  onSubmitted: (lead: SubmittedLead) => void;
}) {
  const phoneRequired = !isVariantB(experiment, 'phone_required');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+49');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [preference, setPreference] = useState<ContactPreference>('phone');
  const [privacy, setPrivacy] = useState(false);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) {
      return;
    }
    const el = turnstileRef.current;
    const render = () => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      api?.render(el, {
        sitekey: turnstileSiteKey,
        language: 'de',
        callback: (token: string) => setTurnstileToken(token),
      });
    };
    if ((window as unknown as { turnstile?: TurnstileApi }).turnstile) {
      render();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const contact: ContactData = {
      firstName,
      lastName,
      email: email.trim(),
      phone: phoneRaw.trim() ? normalizePhone(countryCode, phoneRaw) : '',
      contactPreference: preference,
    };
    const clientErrors = validateContact(contact, { phoneRequired, privacy });
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      const first = Object.keys(clientErrors)[0];
      document.getElementById(`zy-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    const attribution = captureAttribution();
    try {
      const response = await fetch('/api/zypern-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'create',
          profile,
          contact,
          privacy,
          attribution,
          consent: readConsent(),
          elapsedMs: Date.now() - mountedAt,
          website,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as LeadResponse;
      if (!result.ok) {
        setErrors((result.errors ?? {}) as ContactErrors);
        setFormError(result.message);
        return;
      }
      setUserData({ email: contact.email, phone: contact.phone, firstName, lastName });
      track('lead_submitted', { lead_id: result.leadId, budget: profile.budget, timeline: profile.timeline });
      if (result.signals.qualified) {
        track('qualified_lead', { lead_id: result.leadId });
      }
      if (result.signals.highQuality) {
        track('high_quality_lead', { lead_id: result.leadId });
      }
      onSubmitted({ leadId: result.leadId, profile, contact, nextStep: result.nextStep, attribution });
    } catch {
      setFormError(
        `Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns an ${company.email}.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const describedBy = (key: keyof ContactErrors) => (errors[key] ? `zy-${key}-error` : undefined);

  return (
    <form className="mt-6" onSubmit={submit} noValidate>
      <h3 className={classNames(z.serif, 'text-[22px] font-medium leading-snug text-[#1E2226] sm:text-[26px]')}>
        Wir können Ihre Anfrage jetzt einordnen. Wohin dürfen wir die passenden Optionen senden?
      </h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Vorname" htmlFor="zy-firstName" error={errors.firstName}>
          <input
            id="zy-firstName"
            autoComplete="given-name"
            className={inputClass(Boolean(errors.firstName))}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy('firstName')}
          />
        </Field>
        <Field label="Nachname" htmlFor="zy-lastName" error={errors.lastName}>
          <input
            id="zy-lastName"
            autoComplete="family-name"
            className={inputClass(Boolean(errors.lastName))}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy('lastName')}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="E-Mail" htmlFor="zy-email" error={errors.email}>
            <input
              id="zy-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={inputClass(Boolean(errors.email))}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describedBy('email')}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            label={phoneRequired ? 'Mobilnummer / WhatsApp' : 'Mobilnummer / WhatsApp (optional)'}
            htmlFor="zy-phone"
            error={errors.phone}
          >
            <div className="flex gap-2">
              <select
                aria-label="Ländervorwahl"
                className="block h-[52px] w-[108px] shrink-0 rounded-md border border-[#DDD5C8] bg-white px-2.5 text-[16px] text-[#1E2226] outline-none focus:border-[#1E2226] focus:ring-2 focus:ring-[#A4532F]/25"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {phoneCountryCodes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                id="zy-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder={countryCode === 'other' ? '+44 7700 900123' : '170 1234567'}
                className={inputClass(Boolean(errors.phone))}
                value={phoneRaw}
                onChange={(e) => setPhoneRaw(e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy('phone')}
              />
            </div>
          </Field>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-[14px] font-medium text-[#1E2226]">Bevorzugte Kontaktart</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {contactPreferenceOptions.map((option) => (
            <label
              key={option.value}
              className={classNames(
                'flex min-h-[46px] cursor-pointer items-center justify-center rounded-md border px-3 text-[15px] font-medium transition-colors',
                preference === option.value
                  ? 'border-[#A4532F] bg-[#FBF1EB] text-[#1E2226]'
                  : 'border-[#DDD5C8] bg-white text-[#1E2226] hover:border-[#1E2226]/50',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#A4532F]',
              )}
            >
              <input
                type="radio"
                name="zy-preference"
                value={option.value}
                checked={preference === option.value}
                onChange={() => setPreference(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot – für Menschen unsichtbar */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto size-px overflow-hidden">
        <label htmlFor="zy-website">Website</label>
        <input
          id="zy-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-[#555B62]">
          <input
            id="zy-privacy"
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            className="mt-1 size-[18px] shrink-0 accent-[#A4532F]"
            aria-invalid={Boolean(errors.privacy)}
            aria-describedby={describedBy('privacy')}
          />
          <span>
            Ich habe die{' '}
            <a
              href={company.privacyUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-[#1E2226]"
            >
              Datenschutzhinweise
            </a>{' '}
            gelesen und bin einverstanden, dass {company.name} mich zu meiner Anfrage kontaktiert.
          </span>
        </label>
        {errors.privacy && (
          <p id="zy-privacy-error" className="mt-1.5 text-[13px] text-[#A3261B]">
            {errors.privacy}
          </p>
        )}
      </div>

      {turnstileSiteKey && <div ref={turnstileRef} className="mt-5 min-h-[65px]" />}

      {formError && (
        <p
          role="alert"
          className="mt-5 rounded-md border border-[#A3261B]/30 bg-[#FBEDEB] px-4 py-3 text-[14px] text-[#7E1E15]"
        >
          {formError}
        </p>
      )}

      <PrimaryButton type="submit" disabled={submitting} className="mt-6 w-full">
        {submitting ? 'Wird gesendet …' : 'Meine Immobilienanfrage absenden'}
        {!submitting && <ArrowIcon />}
      </PrimaryButton>
      <p className={classNames('mt-4 text-[13px] leading-relaxed', z.textMuted)}>
        Wir verkaufen Ihre Daten nicht und senden keine täglichen Immobilien-Spam-Mails. Ihre Angaben werden
        ausschließlich für Ihre Anfrage verwendet.
      </p>
    </form>
  );
}
