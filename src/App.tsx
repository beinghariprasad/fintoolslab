import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { LayoutNew } from "@/components/layout/LayoutNew";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { lazy, Suspense } from 'react';
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import { usePerformance } from "@/hooks/use-performance";
import Index from "./pages/Index";
import CalculatorList from "./pages/CalculatorList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Import main pages directly for better performance
import CompoundInterestPage from "./pages/CompoundInterestPage";

// Lazy load other calculator pages
const MortgagePage = lazy(() => import("./pages/MortgagePage"));
const InvestmentPage = lazy(() => import("./pages/InvestmentPage"));
const LoanPage = lazy(() => import("./pages/LoanPage"));
const RetirementPage = lazy(() => import("./pages/RetirementPage"));
const SavingsPage = lazy(() => import("./pages/SavingsPage"));
const RentVsBuyPage = lazy(() => import("./pages/RentVsBuyPage"));
const SalaryToHourlyPage = lazy(() => import("./pages/SalaryToHourlyPage"));
const CoastFirePage = lazy(() => import("./pages/CoastFirePage"));
const CDCalculatorPage = lazy(() => import("./pages/CDCalculatorPage"));
const HYSAPage = lazy(() => import("./pages/HYSAPage"));
const RMDCalculatorPage = lazy(() => import("./pages/RMDCalculatorPage"));

// Programmatic SEO pages (data-driven; see src/data/programmatic/manifest.json)
const SalaryProgrammaticPage = lazy(() =>
  import("./pages/programmatic/ProgrammaticPage").then((m) => ({ default: m.SalaryProgrammaticPage }))
);
const MortgageProgrammaticPage = lazy(() =>
  import("./pages/programmatic/ProgrammaticPage").then((m) => ({ default: m.MortgageProgrammaticPage }))
);
const AutoLoanProgrammaticPage = lazy(() =>
  import("./pages/programmatic/ProgrammaticPage").then((m) => ({ default: m.AutoLoanProgrammaticPage }))
);
const GrowthProgrammaticPage = lazy(() =>
  import("./pages/programmatic/ProgrammaticPage").then((m) => ({ default: m.GrowthProgrammaticPage }))
);

// Embed pages
const EmbedSavingsPage = lazy(() => import("./pages/EmbedSavingsPage"));

// Blog pages
const Blog = lazy(() => import("./pages/Blog"));
const CompoundInterestGuide = lazy(() => import("./pages/blog/CompoundInterestGuide"));
const CompoundInterestCalculatorGuide2025 = lazy(() => import("./pages/blog/CompoundInterestCalculatorGuide2025"));
const BlogPostTemplate = lazy(() => import("./pages/blog/BlogPostTemplate"));

const queryClient = new QueryClient();

const App = () => {
  // Initialize performance monitoring
  usePerformance();
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <TooltipProvider>
            <BrowserRouter>
              <LayoutNew>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calculators" element={<CalculatorList />} />
                
                {/* Critical page - no lazy loading */}
                <Route path="/calculators/compound-interest" element={<CompoundInterestPage />} />
                
                {/* Other calculator pages with lazy loading */}
                <Route 
                  path="/calculators/mortgage" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <MortgagePage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/calculators/investment" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <InvestmentPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/calculators/loan" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <LoanPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/calculators/retirement" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <RetirementPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/calculators/savings" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <SavingsPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/calculators/rent-vs-buy" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <RentVsBuyPage />
                    </Suspense>
                  } 
                />
                <Route
                  path="/calculators/salary-to-hourly"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <SalaryToHourlyPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/calculators/coast-fire"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <CoastFirePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/calculators/cd"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <CDCalculatorPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/calculators/hysa"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <HYSAPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/calculators/rmd"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <RMDCalculatorPage />
                    </Suspense>
                  }
                />
                {/* Embed routes */}
                <Route 
                  path="/embed/savings" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <EmbedSavingsPage />
                    </Suspense>
                  } 
                />
                
                {/* Blog routes */}
                <Route 
                  path="/blog" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <Blog />
                    </Suspense>
                  } 
                />
                <Route
                  path="/blog/compound-interest-guide"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <CompoundInterestGuide />
                    </Suspense>
                  }
                />
                <Route
                  path="/blog/compound-interest-calculator-guide-2025"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <CompoundInterestCalculatorGuide2025 />
                    </Suspense>
                  }
                />
                {/* Dynamic blog post route for new posts */}
                <Route
                  path="/blog/:slug"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <BlogPostTemplate />
                    </Suspense>
                  }
                />

                {/* Programmatic SEO pages (src/data/programmatic/manifest.json) */}
                <Route
                  path="/salary/:slug"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <SalaryProgrammaticPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/mortgage/:slug"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <MortgageProgrammaticPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/auto-loan/:slug"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <AutoLoanProgrammaticPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/savings/:slug"
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <GrowthProgrammaticPage />
                    </Suspense>
                  }
                />

                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </LayoutNew>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
