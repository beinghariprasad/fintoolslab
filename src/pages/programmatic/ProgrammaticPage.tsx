import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import manifest from '@/data/programmatic/manifest.json';
import { CalcPageHero } from '@/components/calculators/CalcPageHero';
import { CalcShortAnswer } from '@/components/calculators/CalcShortAnswer';
import { CalcFAQ } from '@/components/calculators/CalcFAQ';
import { CalcRelatedGrid } from '@/components/calculators/CalcRelated';
import { ProgTable, ProgTableColumn, ProgTableRow } from '@/components/programmatic/ProgTable';
import { ProgProse } from '@/components/programmatic/ProgProse';
import { ProgCTA } from '@/components/programmatic/ProgCTA';
import { ProgMethodology } from '@/components/programmatic/ProgMethodology';

const SITE = 'https://fintoolslab.com';

type ProgCategory = 'salary' | 'hourly' | 'mortgage' | 'auto-loan' | 'growth';

interface ProgSection {
  type: 'table' | 'prose';
  eyebrow?: string;
  title: string;
  note?: string;
  columns?: ProgTableColumn[];
  rows?: ProgTableRow[];
  paragraphs?: string[];
}

interface ProgPageData {
  slug: string;
  path: string;
  category: ProgCategory;
  title: string;
  metaDescription: string;
  hero: {
    chip: string;
    titleBefore: string;
    titleEm: string;
    titleAfter?: string;
    lede: string;
    meta: { label: string; value: string }[];
    breadcrumb: { label: string; href?: string }[];
    example?: { prefix: string; amount: string; label: string; features: string[] };
  };
  shortAnswer: { heading: string; html: string };
  sections: ProgSection[];
  faq: { q: string; a: string }[];
  cta: { label: string; title: string; text: string; links: { label: string; href: string }[] };
  related: { name: string; desc: string; mark: string; href: string; cat?: string; time?: string }[];
  methodology: string[];
  dateModified: string;
}

function LoadingSkeleton() {
  return (
    <div className="container" style={{ paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
      <div style={{ maxWidth: 760 }}>
        <div style={{ height: 48, background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', marginBottom: 16 }} />
        <div style={{ height: 24, background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', marginBottom: 32, width: '60%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[100, 85, 70].map((w, i) => (
            <div key={i} style={{ height: 16, background: 'var(--bg-sunken)', borderRadius: 'var(--r-sm)', width: w + '%' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProgrammaticPageProps {
  /** Categories this route is allowed to serve (e.g. /salary/:slug serves both salary and hourly pages). */
  categories: ProgCategory[];
}

export default function ProgrammaticPage({ categories }: ProgrammaticPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const entry = manifest.pages.find(
    (p) => p.slug === slug && categories.includes(p.category as ProgCategory)
  );
  const [data, setData] = useState<ProgPageData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(false);
    if (!entry) return undefined;
    import(`@/data/programmatic/${entry.category}/${entry.slug}.json`)
      .then((mod) => {
        if (alive) setData(mod.default as ProgPageData);
      })
      .catch(() => {
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Unknown slug, unreleased batch, or missing payload → 404
  if (!entry || !entry.published || error) return <Navigate to="/404" replace />;
  if (!data) return <LoadingSkeleton />;

  const canonical = `${SITE}${data.path}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.hero.breadcrumb.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      item: b.href ? SITE + (b.href === '/' ? '' : b.href) : canonical,
    })),
  };

  return (
    <>
      <Helmet>
        <title>{`${data.title} | Fin Tools Lab`}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.metaDescription} />
        <meta name="twitter:image" content={`${SITE}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <CalcPageHero
        chip={data.hero.chip}
        title={
          <>
            {data.hero.titleBefore}
            <em>{data.hero.titleEm}</em>
            {data.hero.titleAfter}
          </>
        }
        lede={data.hero.lede}
        meta={data.hero.meta}
        breadcrumb={data.hero.breadcrumb}
        workedExample={
          data.hero.example
            ? {
                amount: data.hero.example.amount,
                label: data.hero.example.label,
                features: data.hero.example.features,
              }
            : undefined
        }
      />

      <CalcShortAnswer heading={data.shortAnswer.heading}>
        <span dangerouslySetInnerHTML={{ __html: data.shortAnswer.html }} />
      </CalcShortAnswer>

      {data.sections.map((section, i) =>
        section.type === 'table' ? (
          <ProgTable
            key={i}
            eyebrow={section.eyebrow || ''}
            title={section.title}
            columns={section.columns || []}
            rows={section.rows || []}
            note={section.note}
          />
        ) : (
          <ProgProse key={i} eyebrow={section.eyebrow} title={section.title} paragraphs={section.paragraphs || []} />
        )
      )}

      <ProgCTA label={data.cta.label} title={data.cta.title} text={data.cta.text} links={data.cta.links} />

      <ProgMethodology items={data.methodology} />

      <div style={{ paddingBlock: 'clamp(16px, 2.5vw, 32px)' }}>
        <CalcFAQ items={data.faq} />
      </div>

      <div style={{ paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
        <CalcRelatedGrid items={data.related} heading={<>Keep running the <em>numbers</em>.</>} />
      </div>
    </>
  );
}

/* ---- Named wrappers so App.tsx wiring is a one-liner per route family ---- */

/** Serves /salary/:slug — both "$X a year → hourly" and "$X an hour → yearly" pages. */
export function SalaryProgrammaticPage() {
  return <ProgrammaticPage categories={['salary', 'hourly']} />;
}

/** Serves /mortgage/:slug — "$X mortgage payment" pages. */
export function MortgageProgrammaticPage() {
  return <ProgrammaticPage categories={['mortgage']} />;
}

/** Serves /auto-loan/:slug — "$X car loan payment" pages. */
export function AutoLoanProgrammaticPage() {
  return <ProgrammaticPage categories={['auto-loan']} />;
}

/** Serves /savings/:slug — "how much will $X grow" pages. */
export function GrowthProgrammaticPage() {
  return <ProgrammaticPage categories={['growth']} />;
}
