import { EmbeddableSavingsCalculator } from '@/components/calculators/EmbeddableSavingsCalculator';
import { Toaster } from '@/components/ui/sonner';

export default function EmbedSavingsPage() {
  return (
    <div className="min-h-screen bg-white">
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