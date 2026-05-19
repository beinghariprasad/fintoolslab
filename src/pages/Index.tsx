import { HeroNew } from '@/components/home/HeroNew';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Directory } from '@/components/home/Directory';
import { RatesTable } from '@/components/home/RatesTable';
import { LearnSection } from '@/components/home/LearnSection';
import { CtaBand } from '@/components/home/CtaBand';
import { AdSlot } from '@/components/ads/AdSlot';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Fin Tools Lab - Professional Financial Calculators & Investment Tools</title>
        <meta
          name="description"
          content="Free professional financial calculators including compound interest, mortgage, loan, retirement, and investment tools. Make informed financial decisions with our modern, mobile-friendly calculators."
        />
        <meta name="keywords" content="financial calculator, compound interest, mortgage calculator, investment tools, retirement calculator, loan calculator, financial planning" />
        <link rel="canonical" href="https://fintoolslab.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com" />
        <meta property="og:title" content="Fin Tools Lab - Professional Financial Calculators" />
        <meta property="og:description" content="Free professional financial calculators including compound interest, mortgage, loan, retirement, and investment tools." />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com" />
        <meta property="twitter:title" content="Fin Tools Lab - Professional Financial Calculators" />
        <meta property="twitter:description" content="Free professional financial calculators including compound interest, mortgage, loan, retirement, and investment tools." />
      </Helmet>

      <HeroNew />
      <TrustStrip />
      <Directory />
      <AdSlot size="leaderboard" />
      <RatesTable />
      <AdSlot size="billboard" />
      <LearnSection />
      <CtaBand />
    </>
  );
};

export default Index;
