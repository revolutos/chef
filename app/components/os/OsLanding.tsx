import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  CpuChipIcon,
  CursorArrowRaysIcon,
  FunnelIcon,
  GlobeAltIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  PlayCircleIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
  ShoppingBagIcon,
  SparklesIcon,
  UserGroupIcon,
  UsersIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { classNames } from '~/utils/classNames';
import { revenueSeries } from './demoData';
import { BrandMark, GhostButton, GlowOrb, GradientButton, SectionTag, os } from './Ui';
import { RevenueChart } from './RevenueChart';

const navLinks = [
  { label: 'Module', href: '#module' },
  { label: 'Prozess', href: '#prozess' },
  { label: 'Preise', href: '#preise' },
  { label: 'FAQ', href: '#faq' },
];

const stats = [
  { value: '12.500+', label: 'aktive Nutzer' },
  { value: '2,4 Mio.', label: 'Automationen ausgeführt' },
  { value: '38 Std.', label: 'gespart pro Monat' },
  { value: '4,9/5', label: 'Bewertung' },
];

const audiences = [
  { label: 'Coaches', icon: ChatBubbleLeftRightIcon },
  { label: 'Consultants', icon: PresentationChartLineIcon },
  { label: 'KI-Dienstleister', icon: CpuChipIcon },
  { label: 'Creator', icon: VideoCameraIcon },
  { label: 'Digitale Produktverkäufer', icon: ShoppingBagIcon },
  { label: 'Affiliates', icon: CursorArrowRaysIcon },
  { label: 'Influencer', icon: UserGroupIcon },
  { label: 'Marketer', icon: MegaphoneIcon },
];

const modules = [
  {
    icon: UsersIcon,
    title: 'KI-CRM & Pipeline',
    text: 'Leads werden automatisch erfasst, angereichert und nach Abschlusswahrscheinlichkeit priorisiert — du sprichst nur noch mit den richtigen.',
  },
  {
    icon: PencilSquareIcon,
    title: 'Content-Engine',
    text: 'Posts, Reels-Skripte und Newsletter in deiner Tonalität. Geplant, veröffentlicht und auf Performance optimiert.',
  },
  {
    icon: FunnelIcon,
    title: 'Funnel-Builder',
    text: 'Landingpages und Angebote, die konvertieren — inklusive A/B-Tests und automatischer Auswertung.',
  },
  {
    icon: BoltIcon,
    title: 'KI-Automationen',
    text: 'Follow-ups, Onboarding, Rechnungen, Termin-Erinnerungen: Workflows, die nachts arbeiten, während du schläfst.',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics & Forecast',
    text: 'Umsatz, Conversion und Trends in Echtzeit — mit KI-Prognosen, damit du vor der Kurve bleibst.',
  },
  {
    icon: CpuChipIcon,
    title: 'KI-Assistent',
    text: 'Frag dein Business alles: „Welche Leads rufe ich heute an?" Antworten mit Kontext und konkreten nächsten Schritten.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Analyse',
    text: 'Du verbindest deine Tools und Datenquellen. Das OS versteht dein Business, deine Angebote und deine Zielgruppe in Minuten.',
  },
  {
    number: '02',
    title: 'Setup',
    text: 'CRM, Funnels und Content-Engine werden automatisch für dein Geschäftsmodell konfiguriert — kein leeres Blatt, kein Tool-Chaos.',
  },
  {
    number: '03',
    title: 'Automatisierung',
    text: 'KI-Agenten übernehmen Follow-ups, Content-Produktion, Rechnungen und Reporting. Du gibst nur noch frei.',
  },
  {
    number: '04',
    title: 'Skalierung',
    text: 'Du triffst Entscheidungen im Cockpit — dein OS setzt sie um. 24/7, ohne zusätzliches Team.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '29 €',
    tagline: 'Für den Einstieg ins systematische Business.',
    features: ['KI-CRM mit 500 Kontakten', '3 aktive Automationen', 'Basis-Analytics', '1 Nutzer', 'Community-Support'],
    highlighted: false,
    cta: 'Kostenlos testen',
  },
  {
    name: 'Pro',
    price: '79 €',
    tagline: 'Das komplette OS für Solo-Unternehmer.',
    features: [
      'Alles aus Starter',
      'Content-Engine & Funnel-Builder',
      'Unbegrenzte Automationen',
      '10.000 Kontakte',
      'KI-Assistent mit Business-Kontext',
      'Priority-Support',
    ],
    highlighted: true,
    cta: 'Pro starten',
  },
  {
    name: 'Scale',
    price: '199 €',
    tagline: 'Für Teams und Agenturen, die skalieren.',
    features: [
      'Alles aus Pro',
      'KI-Agenten-Team (Multi-Agent)',
      'White-Label & eigene Domain',
      'API-Zugang',
      'Unbegrenzte Kontakte & Nutzer',
      'Dediziertes Onboarding',
    ],
    highlighted: false,
    cta: 'Scale anfragen',
  },
];

const testimonials = [
  {
    quote:
      'Ich habe fünf Tools gekündigt und trotzdem mehr Überblick als je zuvor. Die Follow-up-Automationen allein haben meinen Umsatz um 30 % erhöht.',
    name: 'Katharina M.',
    role: 'Business-Coach',
  },
  {
    quote:
      'Als Affiliate lebe ich von Geschwindigkeit. Das OS erstellt Content, trackt Conversions und schlägt mir die profitabelsten Kampagnen vor — täglich.',
    name: 'Daniel R.',
    role: 'Affiliate-Marketer',
  },
  {
    quote:
      'Die Content-Engine trifft meine Tonalität erschreckend gut. Ich plane sonntags 30 Minuten und die Woche läuft von allein.',
    name: 'Aylin T.',
    role: 'Creatorin, 240k Follower',
  },
];

const faqs = [
  {
    q: 'Brauche ich technisches Vorwissen?',
    a: 'Nein. Das OS wird in einem geführten Setup für dein Geschäftsmodell konfiguriert. Wenn du eine E-Mail schreiben kannst, kannst du damit arbeiten.',
  },
  {
    q: 'Kann ich meine bestehenden Tools verbinden?',
    a: 'Ja. Kalender, E-Mail, Zahlungsanbieter, Social-Media-Konten und gängige CRM-Daten lassen sich importieren und synchronisieren.',
  },
  {
    q: 'Was macht das OS anders als einzelne KI-Tools?',
    a: 'Einzelne Tools kennen nur ihren Ausschnitt. Dein Business OS kennt deine Leads, deinen Content, deine Zahlen — und handelt über alle Bereiche hinweg konsistent.',
  },
  {
    q: 'Wem gehören meine Daten?',
    a: 'Dir. Deine Daten werden DSGVO-konform in der EU verarbeitet, nicht für fremdes Training verwendet und sind jederzeit exportierbar.',
  },
  {
    q: 'Kann ich jederzeit kündigen?',
    a: 'Ja, monatlich kündbar. Kein Jahresvertrag, keine Setup-Gebühr, keine versteckten Kosten.',
  },
];

export function OsLanding() {
  return (
    <div className={classNames('relative min-h-screen overflow-x-clip', os.page)}>
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05060B]/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          <a href="/os" aria-label="REVOLUTOS KI Business OS">
            <BrandMark />
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={classNames('text-sm font-medium transition-colors hover:text-[#F4F5F9]', os.textSecondary)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <GhostButton className="hidden !px-4 !py-2.5 sm:inline-flex">Login</GhostButton>
            <GradientButton className="!px-4 !py-2.5">Kostenlos starten</GradientButton>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-[72px]">
        <GlowOrb className="-top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 bg-[#8B5CF6]/20" />
        <GlowOrb className="-right-40 top-64 size-72 bg-[#5B7CFA]/15" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 text-center lg:pt-28">
          <SectionTag>
            <SparklesIcon className="size-3.5" />
            Das KI Operating System für dein Business
          </SectionTag>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Dein gesamtes Business.
            <br />
            <span className={os.gradientText}>Ein OS. Auf Autopilot.</span>
          </h1>

          <p className={classNames('mx-auto mt-6 max-w-2xl text-lg leading-relaxed', os.textSecondary)}>
            REVOLUTOS vereint CRM, Content, Funnels, Automationen und Analytics in einem KI-gesteuerten Cockpit — gebaut
            für Coaches, Consultants, Creator, Affiliates und digitale Unternehmer.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GradientButton className="!px-7 !py-3.5 !text-base">
              Kostenlos starten
              <ArrowRightIcon className="size-4" />
            </GradientButton>
            <a href="/os/dashboard">
              <GhostButton className="!px-7 !py-3.5 !text-base">
                <PlayCircleIcon className="size-5" />
                Dashboard-Demo ansehen
              </GhostButton>
            </a>
          </div>

          <p className={classNames('mt-5 text-xs', os.textMuted)}>
            14 Tage kostenlos · Keine Kreditkarte nötig · Monatlich kündbar
          </p>

          {/* Dashboard-Preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div
              aria-hidden="true"
              className="absolute -inset-x-8 -top-8 bottom-1/3 rounded-[2rem] bg-gradient-to-b from-[#8B5CF6]/20 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0A0C14] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
                <span className="size-3 rounded-full bg-[#F87171]/80" />
                <span className="size-3 rounded-full bg-[#FBBF24]/80" />
                <span className="size-3 rounded-full bg-[#34D399]/80" />
                <span className={classNames('ml-4 rounded-md bg-white/[0.05] px-3 py-1 text-xs', os.textMuted)}>
                  app.revolutos.de/dashboard
                </span>
              </div>
              <div className="grid gap-4 p-6 text-left sm:grid-cols-3">
                {[
                  { label: 'Monatsumsatz', value: '24.860 €', delta: '+18,2 %' },
                  { label: 'Neue Leads', value: '342', delta: '+12,4 %' },
                  { label: 'Conversion-Rate', value: '4,8 %', delta: '+0,6 Pkt.' },
                ].map((kpi) => (
                  <div key={kpi.label} className={classNames(os.card, 'p-4')}>
                    <p className={classNames('text-[11px] font-medium uppercase tracking-wider', os.textMuted)}>
                      {kpi.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {kpi.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#34D399]">{kpi.delta}</p>
                  </div>
                ))}
                <div className={classNames(os.card, 'p-4 sm:col-span-3')}>
                  <p className={classNames('mb-3 text-[11px] font-medium uppercase tracking-wider', os.textMuted)}>
                    Umsatzentwicklung · Juni
                  </p>
                  <RevenueChart data={revenueSeries} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {stat.value}
                </dd>
                <p className={classNames('mt-1 text-sm', os.textMuted)}>{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Zielgruppen */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <SectionTag>Für wen</SectionTag>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Gebaut für Menschen, die <span className={os.gradientText}>digital verkaufen</span>
          </h2>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {audiences.map((audience) => (
            <li key={audience.label} className={classNames(os.card, os.cardHover, 'flex items-center gap-3 px-5 py-4')}>
              <audience.icon className="size-5 shrink-0 text-[#A78BFA]" />
              <span className="text-sm font-medium">{audience.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Module */}
      <section id="module" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <GlowOrb className="-left-40 top-40 size-80 bg-[#8B5CF6]/10" />
        <div className="relative text-center">
          <SectionTag>Module</SectionTag>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ein System statt <span className={os.gradientText}>zehn Tools</span>
          </h2>
          <p className={classNames('mx-auto mt-4 max-w-2xl text-base leading-relaxed', os.textSecondary)}>
            Jedes Modul kennt den Kontext der anderen. Dein CRM weiß, welcher Content funktioniert — deine Funnels
            wissen, welche Leads heiß sind.
          </p>
        </div>
        <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.title} className={classNames(os.card, os.cardHover, 'group p-6')}>
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 transition-colors group-hover:bg-[#8B5CF6]/20">
                <module.icon className="size-5 text-[#A78BFA]" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{module.title}</h3>
              <p className={classNames('mt-2 text-sm leading-relaxed', os.textSecondary)}>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Prozess */}
      <section id="prozess" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <div className="text-center">
          <SectionTag>Prozess</SectionTag>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            In 4 Schritten zum <span className={os.gradientText}>Business auf Autopilot</span>
          </h2>
        </div>
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.number} className="relative">
              {i < processSteps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute -right-2 top-10 hidden h-px w-4 bg-gradient-to-r from-[#8B5CF6]/50 to-transparent lg:block"
                />
              )}
              <div className={classNames(os.card, os.cardHover, 'h-full p-6')}>
                <span className={classNames('text-4xl font-bold', os.gradientText)}>{step.number}</span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className={classNames('mt-2 text-sm leading-relaxed', os.textSecondary)}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Preise */}
      <section id="preise" className="relative mx-auto max-w-7xl scroll-mt-24 px-6 py-20">
        <GlowOrb className="-right-40 top-20 size-80 bg-[#5B7CFA]/10" />
        <div className="relative text-center">
          <SectionTag>Preise</SectionTag>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Transparent. Fair. <span className={os.gradientText}>Monatlich kündbar.</span>
          </h2>
        </div>
        <div className="relative mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={classNames(
                'relative flex flex-col rounded-2xl p-7',
                plan.highlighted
                  ? 'border border-[#8B5CF6]/50 bg-gradient-to-b from-[#8B5CF6]/[0.14] to-white/[0.03] shadow-[0_20px_60px_rgba(124,92,246,0.25)]'
                  : classNames(os.card, os.cardHover),
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#5B7CFA] px-4 py-1 text-xs font-bold text-white">
                  Beliebt
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className={classNames('mt-1 text-sm', os.textSecondary)}>{plan.tagline}</p>
              <p className="mt-5">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className={classNames('ml-1 text-sm', os.textMuted)}>/ Monat</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-[#A78BFA]" />
                    <span className={os.textSecondary}>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.highlighted ? (
                <GradientButton className="mt-8 w-full">{plan.cta}</GradientButton>
              ) : (
                <GhostButton className="mt-8 w-full">{plan.cta}</GhostButton>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <SectionTag>Stimmen</SectionTag>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Was Nutzer über ihr <span className={os.gradientText}>Business OS</span> sagen
          </h2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className={classNames(os.card, os.cardHover, 'flex flex-col p-6')}>
              <div className="flex gap-1" aria-label="5 von 5 Sternen">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-4 text-[#FBBF24]" />
                ))}
              </div>
              <blockquote className={classNames('mt-4 flex-1 text-sm leading-relaxed', os.textSecondary)}>
                {`„${testimonial.quote}"`}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#5B7CFA] text-xs font-bold text-white">
                  {testimonial.name.charAt(0)}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className={classNames('text-xs', os.textMuted)}>{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative mx-auto max-w-3xl scroll-mt-24 px-6 py-20">
        <div className="text-center">
          <SectionTag>FAQ</SectionTag>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Häufige Fragen</h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className={classNames(os.card, 'group px-6 py-5 open:bg-white/[0.05]')}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-lg text-[#A78BFA] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className={classNames('mt-3 text-sm leading-relaxed', os.textSecondary)}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#8B5CF6]/30 bg-gradient-to-br from-[#8B5CF6]/[0.16] via-[#0A0C14] to-[#5B7CFA]/[0.12] px-8 py-16 text-center sm:px-16">
          <GlowOrb className="-top-24 left-1/2 h-64 w-96 -translate-x-1/2 bg-[#8B5CF6]/25" />
          <div className="relative">
            <RocketLaunchIcon className="mx-auto size-10 text-[#A78BFA]" />
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Bereit, dein Business auf <span className={os.gradientText}>Autopilot</span> zu stellen?
            </h2>
            <p className={classNames('mx-auto mt-4 max-w-xl text-base', os.textSecondary)}>
              Starte in 5 Minuten — dein OS konfiguriert sich selbst für dein Geschäftsmodell.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <GradientButton className="!px-7 !py-3.5 !text-base">
                Kostenlos starten
                <ArrowRightIcon className="size-4" />
              </GradientButton>
              <a href="/os/dashboard">
                <GhostButton className="!px-7 !py-3.5 !text-base">Dashboard-Demo ansehen</GhostButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <BrandMark />
          <ul className={classNames('flex flex-wrap items-center gap-6 text-sm', os.textMuted)}>
            <li>
              <a href="#module" className="transition-colors hover:text-[#F4F5F9]">
                Module
              </a>
            </li>
            <li>
              <a href="#preise" className="transition-colors hover:text-[#F4F5F9]">
                Preise
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <GlobeAltIcon className="size-4" />
              Impressum · Datenschutz · AGB
            </li>
          </ul>
          <p className={classNames('text-xs', os.textMuted)}>© 2026 REVOLUTOS. Made in Germany.</p>
        </div>
      </footer>
    </div>
  );
}
