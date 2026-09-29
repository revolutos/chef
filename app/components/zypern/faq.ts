import { company, PAGE_URL } from './config';

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Können Deutsche Immobilien auf Zypern kaufen?',
    a: 'Ja. Als EU-Bürger können Deutsche und Österreicher in der Republik Zypern Immobilien grundsätzlich ohne besondere Beschränkungen kaufen. Für Käufer aus Staaten außerhalb der EU, dazu zählt auch die Schweiz, kann eine behördliche Genehmigung erforderlich sein. Ob und in welchem Umfang das zutrifft, prüft ein zypriotischer Anwalt im Einzelfall.',
  },
  {
    q: 'Wie läuft ein Immobilienkauf auf Zypern ab?',
    a: 'Üblich ist diese Reihenfolge: Auswahl und Besichtigung, Reservierung, rechtliche Prüfung durch einen unabhängigen Anwalt, Unterzeichnung des Kaufvertrags, Stempelung des Vertrags und Hinterlegung beim Grundbuchamt (Land Registry), Zahlung nach Vertrag und schließlich die Übertragung des Eigentums. Bei Neubauten wird meist in Raten nach Baufortschritt gezahlt.',
  },
  {
    q: 'Welche Nebenkosten entstehen beim Kauf einer Immobilie auf Zypern?',
    a: 'Neben dem Kaufpreis können unter anderem Anwaltskosten, Stempelsteuer auf den Kaufvertrag, Gebühren für die Eigentumsübertragung, bei Neubauten Mehrwertsteuer, Finanzierungskosten und Vermittlungskosten anfallen. Die Höhe hängt von Kaufpreis, Objektart und Ihrer persönlichen Situation ab. Wir besprechen die Kosten für Ihr Vorhaben, bevor Sie etwas reservieren.',
  },
  {
    q: 'Welche Regionen sind für einen Immobilienkauf auf Zypern interessant?',
    a: 'Die meisten Käufer entscheiden sich zwischen Paphos, Limassol, Larnaca und Nikosia; dazu kommt die Region um Ayia Napa und Protaras. Welche Region passt, hängt vor allem vom Kaufziel ab: dauerhaft wohnen, Ferienimmobilie oder Vermietung. Das klären wir im ersten Gespräch.',
  },
  {
    q: 'Kann ich meine Immobilie auf Zypern vermieten?',
    a: 'Grundsätzlich ja. Langzeitvermietung ist verbreitet. Für die kurzfristige Vermietung an Feriengäste gelten auf Zypern Registrierungs- und Genehmigungspflichten. Mieteinnahmen sind steuerpflichtig; die steuerliche Behandlung sollte mit einem Steuerberater geklärt werden.',
  },
  {
    q: 'Benötige ich beim Kauf einen Anwalt?',
    a: 'Wir empfehlen ausdrücklich einen unabhängigen zypriotischen Anwalt, der nur Ihre Interessen vertritt. Er prüft unter anderem Eigentumsverhältnisse, Belastungen, Genehmigungen und den Kaufvertrag. Auf Wunsch stellen wir Kontakt zu Partnerkanzleien her. Die Wahl des Anwalts liegt bei Ihnen.',
  },
  {
    q: 'Wie funktioniert der Kauf eines Neubauprojekts?',
    a: 'Sie kaufen direkt vom Bauträger, häufig vor Fertigstellung. Gezahlt wird in der Regel in Raten nach Baufortschritt. Vorher sollten Baugenehmigung, Erfahrung des Bauträgers, die Absicherung Ihrer Zahlungen und mögliche Belastungen des Grundstücks geprüft werden.',
  },
  {
    q: 'Kann ich eine Immobilie auf Zypern finanzieren?',
    a: 'Grundsätzlich ja, zum Beispiel über zypriotische Banken. Konditionen und der nötige Eigenkapitalanteil hängen von Bonität, Wohnsitz und Objekt ab. Deutsche Banken finanzieren Auslandsimmobilien häufig nur mit zusätzlichen Sicherheiten im Inland. Klären Sie die Finanzierung, bevor Sie reservieren.',
  },
  {
    q: 'Kann ich die Immobilie vor dem Kauf besichtigen?',
    a: 'Ja, und wir empfehlen das. Wir stimmen Termine vorab ab, damit Sie bei einem Aufenthalt mehrere vorausgewählte Objekte sehen. Wenn Sie nicht anreisen können, sind je nach Anbieter auch Video-Besichtigungen möglich.',
  },
  {
    q: 'Unterstützen Sie auch nach dem Kauf?',
    a: 'Auf Wunsch koordinieren wir die nächsten Schritte mit lokalen Partnern, etwa für Verwaltung, Vermietung oder Anmeldungen. Welche Leistungen Sie brauchen, legen wir gemeinsam fest.',
  },
  {
    q: 'Welche Unterlagen benötige ich für den Kauf?',
    a: 'In der Regel einen gültigen Reisepass oder Personalausweis, einen Nachweis über die Herkunft der Mittel (Geldwäscheprüfung) und eine zypriotische Steuernummer, die meist über den Anwalt beantragt wird. Häufig ist ein Bankkonto auf Zypern sinnvoll. Bei einer Finanzierung kommen Einkommens- und Vermögensnachweise hinzu.',
  },
  {
    q: 'Was ist beim Immobilienkauf auf Zypern besonders wichtig?',
    a: 'Prüfen lassen, ob eine eigene Eigentumsurkunde (Title Deed) existiert oder wann sie ausgestellt wird und ob Belastungen bestehen. Den Kaufvertrag beim Grundbuchamt hinterlegen lassen. Nebenkosten vorab kalkulieren. Zahlungen nur auf nachvollziehbare Konten leisten. Und nicht unter Zeitdruck reservieren.',
  },
  {
    q: 'Was ist der Unterschied zwischen der Republik Zypern und Nordzypern?',
    a: 'Die Republik Zypern ist Mitglied der EU und hat den Euro. Der Norden der Insel steht nicht unter der Kontrolle der Regierung der Republik; die dortige Verwaltung ist international nicht anerkannt, mit Ausnahme der Türkei. Beim Kauf im Norden bestehen erhebliche rechtliche Risiken, unter anderem durch Eigentumsansprüche früherer Eigentümer. Wir begleiten Käufe ausschließlich in der Republik Zypern.',
  },
];

const isPlaceholder = (value: string | null) => !value || value.startsWith('[');

export function structuredData() {
  const hasAddress = !isPlaceholder(company.street) && !isPlaceholder(company.city);
  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${company.websiteUrl}/#organization`,
    name: company.name,
    url: company.websiteUrl,
    description: company.positioning,
    areaServed: { '@type': 'Country', name: 'Zypern' },
    knowsLanguage: ['de'],
  };
  if (hasAddress) {
    organization.address = {
      '@type': 'PostalAddress',
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressCountry: 'CY',
    };
  }
  if (!isPlaceholder(company.email)) {
    organization.email = company.email;
  }
  if (!isPlaceholder(company.phone)) {
    organization.telephone = company.phone;
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Zypern Immobilien kaufen | Deutsche Beratung vor Ort',
        inLanguage: 'de',
        publisher: { '@id': `${company.websiteUrl}/#organization` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}
