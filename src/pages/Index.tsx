import { HeroSection } from '@/components/home/HeroSection';
import { CalculatorPreview } from '@/components/home/CalculatorPreview';
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

      <div className="bg-background">
        <HeroSection />
        <CalculatorPreview />
      </div>
    </>
  );
};

export default Index;
