import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { isVariantB, type Experiment } from './ab';
import { AssistantFlow } from './AssistantFlow';
import { BuyingProfileFunnel, type SubmittedLead } from './BuyingProfileFunnel';
import { company, DEMO_MODE, exampleProperties, heroImage, showOffMarketNote, team, type Region } from './config';
import { faqs } from './faq';
import { applyConsent, captureAttribution, readConsent, track, type ConsentChoice } from './tracking';
import type { CITY_POINTS } from './ui';
import {
  ArrowIcon,
  CheckIcon,
  CyprusMap,
  Eyebrow,
  Logo,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
  z,
} from './ui';

const FUNNEL_ID = 'kaufprofil';

export function ZypernLanding({
  experiment,
  turnstileSiteKey,
}: {
  experiment: Experiment;
  turnstileSiteKey: string | null;
}) {
  const [regionRequest, setRegionRequest] = useState<{ region: Region; nonce: number } | null>(null);
  const [lead, setLead] = useState<SubmittedLead | null>(null);
  const heroInlineForm = isVariantB(experiment, 'hero_form');
  const examplesFirst = isVariantB(experiment, 'examples_position');
  const trustEarly = isVariantB(experiment, 'trust_position');

  useEffect(() => {
    captureAttribution();
    track('landing_page_view', { page_path: '/zypern-immobilien-kaufen' });
    if (experiment.test) {
      track('ab_exposure', { ab_test: experiment.test, ab_variant: experiment.variant });
    }
  }, [experiment]);

  const goToFunnel = useCallback((source: string, region?: Region) => {
    if (region) {
      setRegionRequest({ region, nonce: Date.now() });
    }
    track('cta_click', { cta_source: source });
    document.getElementById(FUNNEL_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const funnel = (
    <BuyingProfileFunnel
      experiment={experiment}
      turnstileSiteKey={turnstileSiteKey}
      regionRequest={regionRequest}
      onSubmitted={setLead}
      compact={heroInlineForm}
    />
  );

  return (
    <div className={classNames(z.page, 'min-h-full')}>
      <a
        href={`#${FUNNEL_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Direkt zum Kaufprofil
      </a>
      <Header onCta={() => goToFunnel('header')} />
      <main>
        <Hero experiment={experiment} onCta={goToFunnel} inlineFunnel={heroInlineForm ? funnel : null} />
        {examplesFirst && <Examples onCta={goToFunnel} />}
        {!heroInlineForm && (
          <section aria-labelledby="zy-funnel-title" className="border-t border-[#E3DBCE] bg-[#FCFAF6] py-16 sm:py-24">
            <div
              className={classNames(z.container, 'grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16')}
            >
              <div className="lg:pt-4">
                <SectionHeading
                  id="zy-funnel-title"
                  eyebrow="Ihr Kaufprofil"
                  title="Welche Immobilie suchen Sie auf Zypern?"
                  intro="Beantworten Sie einige kurze Fragen. So können wir einschätzen, welche Immobilien überhaupt für Sie infrage kommen."
                />
                <ul className="mt-8 hidden space-y-3 text-[15px] text-[#1E2226] lg:block">
                  {[
                    'Kaufziel, Region, Objektart, Budget und Zeitplan',
                    'Kontaktdaten erst ganz am Ende',
                    'Persönliche Auswertung statt automatischer Exposé-Flut',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon className="mt-1 text-[#9A4B2A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div id={FUNNEL_ID} className="scroll-mt-24">
                {funnel}
              </div>
            </div>
          </section>
        )}
        {trustEarly && <Trust onCta={() => goToFunnel('vertrauen')} />}
        <Problem onCta={() => goToFunnel('problem')} />
        <HowItWorks onCta={() => goToFunnel('ablauf')} />
        <Regions onCta={goToFunnel} />
        {!examplesFirst && <Examples onCta={goToFunnel} />}
        {!trustEarly && <Trust onCta={() => goToFunnel('vertrauen')} />}
        <PurchaseProcess onCta={() => goToFunnel('kaufkosten')} />
        <Faq />
        <FinalCta onCta={() => goToFunnel('final')} />
      </main>
      <Footer />
      <StickyMobileCta onCta={() => goToFunnel('sticky_mobile')} hidden={Boolean(lead)} />
      <ConsentBar />
      {lead && (
        <AssistantFlow
          lead={lead}
          experiment={experiment}
          onClose={() => {
            setLead(null);
            requestAnimationFrame(() => document.getElementById('faq')?.scrollIntoView());
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function Header({ onCta }: { onCta: () => void }) {
  const links = [
    { href: '#ablauf', label: 'So funktioniert es' },
    { href: '#regionen', label: 'Regionen' },
    { href: '#kaufablauf', label: 'Kaufablauf' },
    { href: '#faq', label: 'FAQ' },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-[#E3DBCE] bg-[#F6F2EB]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F6F2EB]/85">
      <div className={classNames(z.container, 'flex h-16 items-center justify-between gap-6')}>
        <a href="#top" aria-label={`${company.brand} – zum Seitenanfang`} className={z.focus}>
          <Logo />
        </a>
        <nav aria-label="Seitennavigation" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={classNames('text-[14px] font-medium text-[#555B62] hover:text-[#1E2226]', z.focus)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={onCta}
          className={classNames(
            'inline-flex h-10 items-center whitespace-nowrap rounded-md bg-[#13243A] px-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0C1828] sm:px-4',
            z.focus,
          )}
        >
          Kaufprofil starten
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({
  experiment,
  onCta,
  inlineFunnel,
}: {
  experiment: Experiment;
  onCta: (source: string) => void;
  inlineFunnel: React.ReactNode;
}) {
  const headlineB = isVariantB(experiment, 'hero_headline');
  const ctaB = isVariantB(experiment, 'hero_cta');

  return (
    <section id="top" aria-labelledby="zy-h1" className="relative overflow-hidden">
      <div
        className={classNames(
          z.container,
          'grid items-center gap-10 pb-14 pt-10 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 lg:pb-24',
        )}
      >
        <div className="flex flex-col">
          <Eyebrow>Für deutschsprachige Käufer · Republik Zypern</Eyebrow>
          <h1
            id="zy-h1"
            className={classNames(
              z.serif,
              'mt-4 text-[32px] font-medium leading-[1.1] tracking-[-0.015em] text-[#1E2226] sm:text-[48px] lg:text-[54px]',
            )}
          >
            {headlineB ? (
              <>Sie möchten eine Immobilie auf Zypern kaufen? Wir finden die, die wirklich zu Ihnen passt.</>
            ) : (
              <>
                Zypern Immobilien kaufen{' '}
                <span className="text-[#555B62]">– ohne sich durch hunderte Angebote zu kämpfen.</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-[#3F454B] sm:mt-6 sm:text-[18px]">
            Nennen Sie uns Budget, Region und Kaufziel. Wir gleichen Ihre Anforderungen mit passenden Immobilien und
            Projekten auf Zypern ab und begleiten Sie auf Wunsch vom ersten Gespräch bis zur Besichtigung und
            Kaufabwicklung.
          </p>
          <ul className="order-2 mt-8 space-y-2.5 lg:order-none lg:mt-7">
            {[
              'Deutschsprachiger Ansprechpartner',
              'Persönliche Vorauswahl statt beliebiger Massenangebote',
              'Betreuung digital und vor Ort auf Zypern',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] font-medium text-[#1E2226]">
                <CheckIcon className="mt-[3px] text-[#9A4B2A]" />
                {item}
              </li>
            ))}
          </ul>

          {!inlineFunnel && (
            <div className="order-1 lg:order-none">
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-9 sm:[&>button]:whitespace-nowrap">
                <PrimaryButton onClick={() => onCta('hero_primary')}>
                  {ctaB ? 'Kaufprofil starten' : 'Passende Immobilien anfragen'} <ArrowIcon />
                </PrimaryButton>
                {ctaB ? (
                  <SecondaryButton
                    onClick={() => document.getElementById('ablauf')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    So gehen wir vor
                  </SecondaryButton>
                ) : (
                  <SecondaryButton onClick={() => onCta('hero_secondary')}>
                    Kaufprofil in 2 Minuten erstellen
                  </SecondaryButton>
                )}
              </div>
              <p className="mt-4 text-[13px] text-[#7A7F85]">
                Unverbindliche Anfrage · Persönliche Auswertung · Keine Massen-E-Mails
              </p>
              <p className="mt-5 text-[15px] text-[#555B62]">
                Sie wissen noch nicht, welche Region zu Ihnen passt? Das klären wir gemeinsam.
              </p>
            </div>
          )}
        </div>

        {inlineFunnel ? (
          <div id={FUNNEL_ID} className="scroll-mt-24">
            {inlineFunnel}
          </div>
        ) : (
          <HeroVisual />
        )}
      </div>
    </section>
  );
}

function HeroVisual() {
  if (heroImage) {
    return (
      <picture>
        <source srcSet={heroImage.avif} type="image/avif" />
        <source srcSet={heroImage.webp} type="image/webp" />
        <img
          src={heroImage.webp}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          fetchPriority="high"
          decoding="async"
          className="aspect-[4/5] w-full rounded-lg object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
        />
      </picture>
    );
  }
  return (
    <figure className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="relative overflow-hidden rounded-lg border border-[#E3DBCE] bg-[#E6EEEF]">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.7),transparent_60%)]"
          aria-hidden="true"
        />
        <CyprusMap className="relative w-full px-5 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-12" />
      </div>
      <div className="relative mx-4 -mt-10 rounded-md border border-[#E3DBCE] bg-white p-4 shadow-[0_12px_32px_-12px_rgba(19,36,58,0.25)] sm:mx-8 sm:-mt-12 sm:p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#7A7F85]">
          Beispiel eines Kaufprofils
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] sm:grid-cols-4">
          {[
            ['Ziel', 'Eigennutzung'],
            ['Region', 'Paphos'],
            ['Budget', '250–400 T€'],
            ['Zeitraum', '3–6 Monate'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[#7A7F85]">{label}</dt>
              <dd className="font-medium text-[#1E2226]">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex items-center gap-2 border-t border-[#EFE9DF] pt-3 text-[14px] font-medium text-[#9A4B2A]">
          <ArrowIcon /> Vorauswahl passender Objekte
        </p>
      </div>
      <figcaption className="sr-only">
        Karte der Republik Zypern mit den Regionen Paphos, Limassol, Larnaca und Nikosia sowie ein Beispiel für ein
        Kaufprofil.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Problem                                                             */
/* ------------------------------------------------------------------ */

function Problem({ onCta }: { onCta: () => void }) {
  const questions = [
    'Ist der Preis realistisch?',
    'Welche Region passt zu meinem Ziel?',
    'Neubau oder Bestand?',
    'Welche Nebenkosten kommen hinzu?',
    'Was muss beim Kauf geprüft werden?',
    'Welche Partner brauche ich vor Ort?',
    'Wie funktioniert die Abwicklung?',
    'Ist das Objekt für Eigennutzung oder Vermietung geeignet?',
  ];
  return (
    <section aria-labelledby="zy-problem" className="py-16 sm:py-24">
      <div className={classNames(z.container, 'grid gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0')}>
        <SectionHeading
          id="zy-problem"
          title="Eine Immobilie auf Zypern zu finden ist nicht das Problem. Die richtige zu kaufen schon."
          intro="Online finden Interessenten schnell hunderte Angebote. Schwieriger wird es bei diesen Fragen:"
        />
        <ul className="divide-y divide-[#E3DBCE] border-y border-[#E3DBCE] lg:row-span-2">
          {questions.map((question, index) => (
            <li key={question} className="flex items-baseline gap-5 py-4 text-[17px] text-[#1E2226]">
              <span className={classNames(z.serif, 'w-6 shrink-0 text-[15px] text-[#9A4B2A]')}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {question}
            </li>
          ))}
        </ul>
        <div className="lg:pt-8">
          <p className="border-l-2 border-[#A4532F] pl-5 text-[18px] font-medium leading-relaxed text-[#1E2226]">
            Genau deshalb beginnen wir nicht mit einer Immobilie, sondern mit Ihren Anforderungen.
          </p>
          <PrimaryButton className="mt-8" onClick={onCta}>
            Kaufprofil starten <ArrowIcon />
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* So funktioniert es                                                  */
/* ------------------------------------------------------------------ */

function HowItWorks({ onCta }: { onCta: () => void }) {
  const steps = [
    { title: 'Anforderungen definieren', text: 'Budget, Region, Nutzung, Zeitplan und Wünsche erfassen.' },
    { title: 'Vorauswahl', text: 'Passende Immobilien und Projekte anhand Ihrer Anforderungen auswählen.' },
    {
      title: 'Beratung & Besichtigung',
      text: 'Fragen klären, Objekte vergleichen und bei Bedarf Besichtigungen auf Zypern organisieren.',
    },
    {
      title: 'Kauf begleiten',
      text: 'Die nächsten Schritte mit den jeweils erforderlichen lokalen Partnern koordinieren, bis zum Abschluss.',
    },
  ];
  return (
    <section id="ablauf" aria-labelledby="zy-how" className="scroll-mt-16 bg-[#FCFAF6] py-16 sm:py-24">
      <div className={z.container}>
        <SectionHeading
          id="zy-how"
          eyebrow="So funktioniert es"
          title="Von Ihrer Anfrage bis zur passenden Immobilie"
        />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-[#1E2226] pt-5">
              <span className={classNames(z.serif, 'text-[40px] leading-none text-[#9A4B2A]')}>{index + 1}</span>
              <h3 className="mt-4 text-[19px] font-semibold text-[#1E2226]">{step.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-[#555B62]">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-[720px] text-[14px] leading-relaxed text-[#7A7F85]">
          Rechts- und Steuerberatung leisten wir nicht selbst. Dafür arbeiten Sie mit unabhängigen, zugelassenen
          Anwälten und Steuerberatern, auf Wunsch aus unserem Partnernetzwerk.
        </p>
        <PrimaryButton className="mt-8" onClick={onCta}>
          Passende Immobilien finden <ArrowIcon />
        </PrimaryButton>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Regionen                                                            */
/* ------------------------------------------------------------------ */

function Regions({ onCta }: { onCta: (source: string, region?: Region) => void }) {
  const regions: { id: keyof typeof CITY_POINTS; name: string; text: string }[] = [
    {
      id: 'paphos',
      name: 'Paphos',
      text: 'Mediterranes Umfeld, internationale Community, Küste, viele Wohn- und Ferienimmobilien.',
    },
    {
      id: 'limassol',
      name: 'Limassol',
      text: 'Internationales Business-Zentrum der Insel, urbaner Immobilienmarkt und gehobenes Segment.',
    },
    {
      id: 'larnaca',
      name: 'Larnaca',
      text: 'Küstenstadt mit Flughafenanbindung, Neubauentwicklung und urbanem Wachstum.',
    },
    {
      id: 'nicosia',
      name: 'Nikosia',
      text: 'Hauptstadt und stärker lokal geprägter Markt, interessant vor allem für langfristiges Wohnen und Vermietung.',
    },
  ];
  return (
    <section id="regionen" aria-labelledby="zy-regions" className="scroll-mt-16 py-16 sm:py-24">
      <div className={z.container}>
        <SectionHeading
          id="zy-regions"
          eyebrow="Regionen"
          title="Wo möchten Sie auf Zypern kaufen?"
          intro="Jede Region hat einen eigenen Markt. Welche zu Ihnen passt, hängt vor allem davon ab, wie Sie die Immobilie nutzen wollen."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {regions.map((region) => (
            <article key={region.id} className="flex flex-col rounded-lg border border-[#E3DBCE] bg-white p-6 sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <h3 className={classNames(z.serif, 'text-[28px] font-medium text-[#1E2226]')}>{region.name}</h3>
                <CyprusMap
                  highlight={region.id}
                  showLabels={false}
                  className="w-[132px] shrink-0"
                  title={`Lage von ${region.name} auf Zypern`}
                />
              </div>
              <p className="mt-3 flex-1 text-[16px] leading-relaxed text-[#555B62]">{region.text}</p>
              <button
                type="button"
                onClick={() => onCta(`region_${region.id}`, region.id)}
                className={classNames(
                  'mt-6 inline-flex items-center gap-2 self-start text-[15px] font-semibold text-[#9A4B2A] underline-offset-4 hover:underline',
                  z.focus,
                )}
              >
                Immobilien in {region.name} anfragen <ArrowIcon />
              </button>
            </article>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-[#555B62]">
          Andere Region, zum Beispiel Ayia Napa oder Protaras? Oder noch unsicher?{' '}
          <button
            type="button"
            onClick={() => onCta('region_advice', 'advice')}
            className={classNames('font-semibold text-[#1E2226] underline underline-offset-4', z.focus)}
          >
            Beratung zur Region anfragen
          </button>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Beispielobjekte                                                     */
/* ------------------------------------------------------------------ */

function Examples({ onCta }: { onCta: (source: string) => void }) {
  const items = exampleProperties.filter((p) => DEMO_MODE || !p.placeholder).slice(0, 6);
  if (items.length === 0) {
    return null;
  }
  const hasPlaceholders = items.some((p) => p.placeholder);
  return (
    <section aria-labelledby="zy-examples" className="bg-[#FCFAF6] py-16 sm:py-24">
      <div className={z.container}>
        <SectionHeading
          id="zy-examples"
          eyebrow="Beispiele"
          title="So kann eine Vorauswahl aussehen"
          intro="Einige Beispiele aus dem aktuellen Angebot. Ihre Auswahl stellen wir nach Ihrem Kaufprofil zusammen."
        />
        {hasPlaceholders && (
          <p className="mt-4 inline-block rounded border border-dashed border-[#B9AB95] px-3 py-1.5 text-[13px] text-[#7A7F85]">
            Beispielhafte Darstellung – Objektdaten werden durch aktuelle Angebote ersetzt.
          </p>
        )}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-lg border border-[#E3DBCE] bg-white"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={560}
                  className="aspect-[10/7] w-full object-cover"
                />
              ) : (
                <div
                  className="flex aspect-[10/7] w-full items-center justify-center bg-[#EFE7DA] text-[13px] text-[#7A7F85]"
                  role="img"
                  aria-label={item.imageAlt}
                >
                  [Objektfoto]
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9A4B2A]">{item.region}</p>
                <h3 className="mt-1.5 text-[18px] font-semibold text-[#1E2226]">{item.type}</h3>
                <dl className="mt-4 grid grid-cols-3 gap-3 border-y border-[#EFE9DF] py-3 text-[14px]">
                  <div>
                    <dt className="text-[#7A7F85]">Schlafzimmer</dt>
                    <dd className="font-medium">{item.bedrooms}</dd>
                  </div>
                  <div>
                    <dt className="text-[#7A7F85]">Wohnfläche</dt>
                    <dd className="font-medium">{item.livingArea}</dd>
                  </div>
                  <div>
                    <dt className="text-[#7A7F85]">Status</dt>
                    <dd className="font-medium">{item.status}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[18px] font-semibold text-[#1E2226]">{item.price}</p>
                <button
                  type="button"
                  onClick={() => onCta(`example_${item.id}`)}
                  className={classNames(
                    'mt-5 inline-flex items-center gap-2 self-start text-[15px] font-semibold text-[#9A4B2A] hover:underline',
                    z.focus,
                  )}
                >
                  Ähnliche Immobilien anfragen <ArrowIcon />
                </button>
              </div>
            </article>
          ))}
        </div>
        {showOffMarketNote && (
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-lg border border-[#E3DBCE] bg-white p-6 sm:flex-row sm:items-center">
            <p className="text-[16px] text-[#1E2226]">Nicht jedes verfügbare Objekt wird öffentlich veröffentlicht.</p>
            <PrimaryButton onClick={() => onCta('off_market')}>
              Aktuelle Auswahl erhalten <ArrowIcon />
            </PrimaryButton>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Vertrauen                                                           */
/* ------------------------------------------------------------------ */

function Trust({ onCta }: { onCta: () => void }) {
  const items = [
    {
      title: 'Deutschsprachige Kommunikation',
      text: 'Gespräche und Abstimmungen auf Deutsch, auch wenn Unterlagen auf Englisch oder Griechisch sind.',
    },
    { title: 'Ansprechpartner auf Zypern', text: 'Jemand vor Ort, der Besichtigungen und Termine koordiniert.' },
    {
      title: 'Transparente Abläufe',
      text: 'Sie wissen bei jedem Schritt, was als Nächstes passiert und wer beteiligt ist.',
    },
    {
      title: 'Klare Kostenkommunikation',
      text: 'Kaufnebenkosten und mögliche Vermittlungskosten besprechen wir, bevor Sie sich festlegen.',
    },
    {
      title: 'Netzwerk lokaler Fachpartner',
      text: 'Anwälte, Steuerberater, Finanzierungs- und Verwaltungspartner. Unabhängig und nur, wenn Sie es wünschen.',
    },
    {
      title: 'Individuelle Objektauswahl',
      text: 'Sie sehen Objekte, die zu Budget, Ziel und Zeitplan passen. Keine Massen-Exposés.',
    },
  ];
  return (
    <section aria-labelledby="zy-trust" className={classNames(z.navy, 'py-16 text-white sm:py-24')}>
      <div className={z.container}>
        <SectionHeading
          id="zy-trust"
          tone="dark"
          eyebrow="Vertrauen"
          title="Ein Immobilienkauf im Ausland braucht mehr als schöne Bilder."
        />
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="border-t border-white/15 pt-5">
              <h3 className="text-[18px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-white/70">{item.text}</p>
            </div>
          ))}
        </div>

        {team.length > 0 && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <figure key={person.name}>
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-lg object-cover"
                />
                <figcaption className="mt-3">
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-[14px] text-white/65">{person.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-14 rounded-lg border border-white/15 p-6 sm:p-8">
          <h3 className="text-[18px] font-semibold">Wer wir sind und welche Rolle wir übernehmen</h3>
          <p className="mt-3 max-w-[820px] text-[16px] leading-relaxed text-white/75">
            {company.name} ist ein Unternehmen mit Sitz auf Zypern. Wir erfassen Ihre Anforderungen, treffen eine
            Vorauswahl, organisieren Besichtigungen und koordinieren den Kaufprozess.{' '}
            {company.brokerLicense
              ? `Die Immobilienvermittlung erfolgt durch ${company.name} (${company.brokerLicense}).`
              : `Die Immobilienvermittlung im Sinne des zypriotischen Maklerrechts erfolgt über unseren lizenzierten Partner ${company.brokerPartner}.`}{' '}
            Rechts- und Steuerberatung erbringen ausschließlich zugelassene Anwälte und Steuerberater.
          </p>
        </div>
        <PrimaryButton className="mt-10" onClick={onCta}>
          Immobilienauswahl anfragen <ArrowIcon />
        </PrimaryButton>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Kaufablauf & Kaufkosten                                             */
/* ------------------------------------------------------------------ */

function PurchaseProcess({ onCta }: { onCta: () => void }) {
  const process = [
    { title: 'Auswahl und Besichtigung', text: 'Objekte vergleichen, vor Ort oder per Video besichtigen.' },
    { title: 'Reservierung', text: 'Das Objekt wird gegen eine Reservierungszahlung vorgemerkt.' },
    {
      title: 'Rechtliche Prüfung',
      text: 'Ein unabhängiger Anwalt prüft Eigentum, Belastungen, Genehmigungen und Vertrag.',
    },
    { title: 'Kaufvertrag', text: 'Unterzeichnung, Stempelung und Hinterlegung beim Grundbuchamt (Land Registry).' },
    { title: 'Zahlung', text: 'Nach Vertrag; bei Neubauten meist in Raten nach Baufortschritt.' },
    { title: 'Eigentumsübertragung', text: 'Übertragung der Eigentumsurkunde (Title Deed) auf Sie.' },
  ];
  const costs = [
    'Rechtsberatung',
    'Due Diligence',
    'Registrierung / Eigentumsübertragung',
    'gegebenenfalls Mehrwertsteuer (VAT)',
    'gegebenenfalls Stempelsteuer (Stamp Duty)',
    'Finanzierungskosten',
    'Makler- bzw. Vermittlungskosten',
    'laufende Gemeinschafts- und Betriebskosten',
  ];
  return (
    <section id="kaufablauf" aria-labelledby="zy-process" className="scroll-mt-16 py-16 sm:py-24">
      <div className={classNames(z.container, 'grid gap-14 lg:grid-cols-2 lg:gap-16')}>
        <div>
          <SectionHeading id="zy-process" eyebrow="Kaufablauf" title="Zypern Immobilien kaufen: So läuft der Kauf ab" />
          <ol className="mt-10 space-y-0">
            {process.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-7 last:pb-0">
                {index < process.length - 1 && (
                  <span
                    className="absolute left-[15px] top-9 h-[calc(100%-36px)] w-px bg-[#D6CCBC]"
                    aria-hidden="true"
                  />
                )}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#1E2226] text-[14px] font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1E2226]">{step.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#555B62]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-[#E3DBCE] bg-white p-6 sm:p-10">
          <h2
            id="zy-costs"
            className={classNames(z.serif, 'text-[26px] font-medium leading-tight text-[#1E2226] sm:text-[32px]')}
          >
            Was kostet der Kauf einer Immobilie auf Zypern wirklich?
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#555B62]">
            Neben dem Kaufpreis können je nach Objekt und Transaktion weitere Kosten anfallen, zum Beispiel:
          </p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {costs.map((cost) => (
              <li key={cost} className="flex items-start gap-2.5 text-[15px] text-[#1E2226]">
                <CheckIcon className="mt-[3px] text-[#9A4B2A]" />
                {cost}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed text-[#1E2226]">
            Welche Kosten in welcher Höhe anfallen, hängt von Kaufpreis, Objektart, Neubau oder Bestand und Ihrer
            persönlichen Situation ab. Pauschale Prozentsätze helfen hier nicht weiter. Wir gehen die Kosten für Ihren
            konkreten Fall durch, bevor Sie etwas reservieren.
          </p>
          <PrimaryButton className="mt-7 w-full sm:w-auto" onClick={onCta}>
            Kaufkosten für meine Situation besprechen <ArrowIcon />
          </PrimaryButton>
          <p className="mt-6 border-t border-[#EFE9DF] pt-5 text-[13px] leading-relaxed text-[#7A7F85]">
            Die konkrete steuerliche und rechtliche Behandlung hängt vom Einzelfall ab und sollte mit entsprechend
            qualifizierten zypriotischen bzw. deutschen Fachberatern geprüft werden.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function Faq() {
  return (
    <section id="faq" aria-labelledby="zy-faq" className="scroll-mt-16 bg-[#FCFAF6] py-16 sm:py-24">
      <div className={classNames(z.container, 'grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16')}>
        <SectionHeading
          id="zy-faq"
          eyebrow="FAQ"
          title="Häufige Fragen zum Immobilienkauf auf Zypern"
          intro="Kurz und sachlich. Für Ihren konkreten Fall ersetzen die Antworten keine Rechts- oder Steuerberatung."
        />
        <div className="divide-y divide-[#E3DBCE] border-y border-[#E3DBCE]">
          {faqs.map((faq) => (
            <details key={faq.q} className="group">
              <summary
                className={classNames(
                  'flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-semibold text-[#1E2226] [&::-webkit-details-marker]:hidden',
                  z.focus,
                )}
              >
                {faq.q}
                <span
                  aria-hidden="true"
                  className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-[#CFC6B8] text-[16px] leading-none text-[#555B62] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 pr-10 text-[16px] leading-relaxed text-[#555B62]">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Abschluss-CTA                                                       */
/* ------------------------------------------------------------------ */

function FinalCta({ onCta }: { onCta: () => void }) {
  return (
    <section aria-labelledby="zy-final" className={classNames(z.navy, 'py-20 text-white sm:py-28')}>
      <div className={classNames(z.container, 'max-w-[900px] text-center')}>
        <h2 id="zy-final" className={classNames(z.serif, 'text-[32px] font-medium leading-[1.12] sm:text-[46px]')}>
          Welche Immobilie passt zu Ihrem Budget und Ihren Plänen auf Zypern?
        </h2>
        <p className="mx-auto mt-5 max-w-[620px] text-[18px] leading-relaxed text-white/75">
          Erstellen Sie Ihr Kaufprofil. Anschließend können wir Ihre Anfrage konkret einordnen und Ihnen passende
          Möglichkeiten zeigen.
        </p>
        <PrimaryButton className="mt-9 w-full sm:w-auto" onClick={onCta}>
          Kaufprofil jetzt starten <ArrowIcon />
        </PrimaryButton>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-white/70">
          {['ca. 2 Minuten', 'unverbindlich', 'deutschsprachige Betreuung'].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckIcon className="text-[#E6B79E]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-[#E3DBCE] bg-[#F6F2EB] pb-28 pt-14 lg:pb-14">
      <div className={classNames(z.container, 'grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]')}>
        <div className="text-[14px] leading-relaxed text-[#555B62]">
          <Logo />
          <p className="mt-5 font-semibold text-[#1E2226]">{company.name}</p>
          <p>{company.positioning}</p>
          <p className="mt-3">
            {company.street}
            <br />
            {company.postalCode} {company.city}, {company.country}
          </p>
          <p className="mt-3">
            E-Mail: {company.email}
            <br />
            Telefon: {company.phone}
            <br />
            {company.registerNumber}
          </p>
          <p className="mt-3">
            <a href={company.websiteUrl} className="underline underline-offset-2">
              {company.website}
            </a>
          </p>
        </div>
        <div className="text-[13px] leading-relaxed text-[#7A7F85]">
          <p className="font-semibold uppercase tracking-[0.12em] text-[#555B62]">Hinweise</p>
          <p className="mt-3">
            {company.name} erfasst Kaufanforderungen, trifft eine Vorauswahl von Immobilien, organisiert Besichtigungen
            und koordiniert den Kaufprozess mit lokalen Partnern.{' '}
            {company.brokerLicense
              ? `Immobilienvermittlung durch ${company.name}, ${company.brokerLicense}.`
              : `${company.name} verfügt über keine eigene zypriotische Maklerlizenz; die Immobilienvermittlung erfolgt über ${company.brokerPartner}.`}
          </p>
          <p className="mt-3">
            {company.name} erbringt keine Rechts-, Steuer- oder Finanzierungsberatung. Diese Leistungen erbringen
            unabhängige, zugelassene Fachberater ({company.legalPartner}; {company.taxPartner}). Alle Angaben auf dieser
            Seite dienen der allgemeinen Information und ersetzen keine Beratung im Einzelfall.
          </p>
          <p className="mt-3">Wir begleiten Immobilienkäufe ausschließlich in der Republik Zypern.</p>
          <nav aria-label="Rechtliches" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-[#555B62]">
            <a href={company.impressumUrl} className="hover:text-[#1E2226]">
              Impressum
            </a>
            <a href={company.privacyUrl} className="hover:text-[#1E2226]">
              Datenschutz
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('zy:open-consent'))}
              className="hover:text-[#1E2226]"
            >
              Cookie-Einstellungen
            </button>
            {company.termsUrl && (
              <a href={company.termsUrl} className="hover:text-[#1E2226]">
                AGB
              </a>
            )}
          </nav>
          <p className="mt-6">
            © {new Date().getFullYear()} {company.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile Sticky CTA                                                   */
/* ------------------------------------------------------------------ */

function StickyMobileCta({ onCta, hidden }: { onCta: () => void; hidden: boolean }) {
  const [visible, setVisible] = useState(false);
  const state = useRef({ heroVisible: true, funnelVisible: false });

  useEffect(() => {
    const hero = document.getElementById('top');
    const funnel = document.getElementById(FUNNEL_ID);
    if (!hero || !funnel || !('IntersectionObserver' in window)) {
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) {
          state.current.heroVisible = entry.isIntersecting;
        }
        if (entry.target === funnel) {
          state.current.funnelVisible = entry.isIntersecting;
        }
      }
      setVisible(!state.current.heroVisible && !state.current.funnelVisible);
    });
    observer.observe(hero);
    observer.observe(funnel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={classNames(
        'fixed inset-x-0 bottom-0 z-40 border-t border-[#E3DBCE] bg-[#F6F2EB]/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 lg:hidden',
        visible && !hidden ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
      aria-hidden={!visible || hidden}
    >
      <PrimaryButton className="w-full" onClick={onCta} tabIndex={visible && !hidden ? 0 : -1}>
        Passende Immobilien finden <ArrowIcon />
      </PrimaryButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Consent-Leiste (nicht blockierend)                                  */
/* ------------------------------------------------------------------ */

function ConsentBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      setOpen(true);
    }
    const reopen = () => setOpen(true);
    window.addEventListener('zy:open-consent', reopen);
    return () => window.removeEventListener('zy:open-consent', reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    applyConsent(choice);
    setOpen(false);
  };

  if (!open) {
    return null;
  }
  return (
    <div
      role="region"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-2 bottom-2 z-[60] mx-auto max-w-[760px] rounded-lg border border-[#E3DBCE] bg-white p-3 shadow-[0_16px_40px_-12px_rgba(19,36,58,0.3)] sm:inset-x-3 sm:bottom-3 sm:p-5"
    >
      <p className="text-[13px] leading-snug text-[#3F454B] sm:text-[14px] sm:leading-relaxed">
        Mit Ihrer Einwilligung nutzen wir Google Analytics und Google Ads, um zu messen, welche Anzeigen zu Anfragen
        führen. Notwendige Cookies sind immer aktiv.{' '}
        <a href={company.privacyUrl} className="underline underline-offset-2">
          Datenschutzerklärung
        </a>
        .
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <button
          type="button"
          onClick={() => choose('necessary')}
          className={classNames(
            'h-11 rounded-md border border-[#1E2226]/25 px-4 text-[14px] font-semibold text-[#1E2226]',
            z.focus,
          )}
        >
          Nur notwendige
        </button>
        <button
          type="button"
          onClick={() => choose('all')}
          className={classNames('h-11 rounded-md bg-[#13243A] px-4 text-[14px] font-semibold text-white', z.focus)}
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  );
}
