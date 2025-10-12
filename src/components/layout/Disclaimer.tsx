import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Disclaimer = () => {
  return (
    <div className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Alert className="border-amber-200 bg-amber-50/50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-800 leading-relaxed">
            {/* Mobile/Compact Version */}
            <div className="block md:hidden">
              <div className="space-y-2">
                <div>
                  <strong className="text-amber-900">Disclaimer:</strong> Financial calculators are for educational purposes only. Not financial advice. Consult professionals before making decisions.
                </div>
                <div>
                  <strong className="text-amber-900">Risks:</strong> All investments carry risks. Past performance doesn't guarantee future results. Verify calculations independently.
                </div>
              </div>
            </div>

            {/* Desktop/Full Version */}
            <div className="hidden md:block space-y-3">
              <div>
                <strong className="text-amber-900">Important Disclaimer:</strong> The financial calculators and tools provided on this website are for educational and informational purposes only. They are not intended to provide financial advice, and should not be considered as a substitute for professional financial consultation.
              </div>
              
              <div>
                <strong className="text-amber-900">Investment Risks:</strong> All investments carry inherent risks, including the potential loss of principal. Past performance does not guarantee future results. The calculations and projections shown are estimates based on the information you provide and may not reflect actual investment outcomes.
              </div>
              
              <div>
                <strong className="text-amber-900">Accuracy:</strong> While we strive for accuracy, we cannot guarantee that the calculations are error-free or suitable for your specific financial situation. Always consult with a qualified financial advisor, accountant, or tax professional before making any financial decisions.
              </div>
              
              <div>
                <strong className="text-amber-900">No Liability:</strong> Fin Tools Lab and its operators are not responsible for any financial losses, damages, or decisions made based on the use of these calculators. Users should independently verify all calculations and consult with appropriate professionals.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}; 