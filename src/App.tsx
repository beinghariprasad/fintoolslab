import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from "@/components/layout/Layout";
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

// Embed pages
const EmbedSavingsPage = lazy(() => import("./pages/EmbedSavingsPage"));

// Blog pages
const Blog = lazy(() => import("./pages/Blog"));
const CompoundInterestGuide = lazy(() => import("./pages/blog/CompoundInterestGuide"));

const queryClient = new QueryClient();

const App = () => {
  // Initialize performance monitoring
  usePerformance();
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
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
                
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
