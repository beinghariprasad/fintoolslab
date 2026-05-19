import { EmbeddableSavingsCalculator } from '@/components/calculators/EmbeddableSavingsCalculator';
import { Toaster } from '@/components/ui/sonner';
import { Helmet } from 'react-helmet-async';

export default function EmbedSavingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <EmbeddableSavingsCalculator
        theme="light"
        height="100vh"
        width="100%"
        showHeader={true}
        showFooter={true}
      />
      <Toaster />
    </div>
  );
} 