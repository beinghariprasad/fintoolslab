import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { EnhancedLineChart, EnhancedBarChart, EnhancedPieChart } from '@/components/ui/enhanced-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Home, DollarSign, Calendar, TrendingUp, BarChart3, Building, Wallet, Info, Target, PieChart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RentVsBuyData {
  // Home details
  homePrice: number;
  downPayment: number;
  
  // Home loan details
  loanRate: number;
  loanTerm: number;
  loanProcessingFee: number;
  legalCharges: number;
  
  // Monthly costs
  monthlyRent: number;
  rentIncrease: number;
  rentIncreaseFrequency: number; // 11 or 12 months
  propertyTax: number;
  homeInsurance: number;
  maintenance: number;
  societyCharges: number;
  
  // Other costs
  stampDutyRate: number;
  registrationFee: number;
  
  // Investment assumptions
  homeAppreciation: number;
  investmentRiskProfile: string;
  investmentReturn: number;
  timeHorizon: number;
  inflationRate: number;
  
  // Tax considerations
  taxBracket: number;
}

export function RentVsBuyCalculator() {
  const [data, setData] = useState<RentVsBuyData>({
    homePrice: 5000000, // ₹50 lakhs
    downPayment: 20,
    loanRate: 8.5,
    loanTerm: 20,
    loanProcessingFee: 0.5,
    legalCharges: 25000,
    monthlyRent: 35000,
    rentIncrease: 8,
    rentIncreaseFrequency: 11,
    propertyTax: 0.5,
    homeInsurance: 15000,
    maintenance: 1,
    societyCharges: 3000,
    stampDutyRate: 3,
    registrationFee: 1,
    homeAppreciation: 7,
    investmentRiskProfile: 'moderate',
    investmentReturn: 9,
    timeHorizon: 10,
    inflationRate: 5,
    taxBracket: 20
  });

  // Investment risk profiles with typical Indian returns
  const investmentRiskProfiles = useMemo(() => ({
    low: { name: 'Low Risk (FD/Debt)', return: 6.5 },
    moderate: { name: 'Moderate Risk (Balanced Funds)', return: 9 },
    high: { name: 'High Risk (Equity/Growth)', return: 12 }
  }), []);

    const results = useMemo(() => {
    const principal = data.homePrice * (1 - data.downPayment / 100);
    const downPaymentAmount = data.homePrice * (data.downPayment / 100);
    const stampDutyAmount = data.homePrice * (data.stampDutyRate / 100);
    const registrationAmount = data.homePrice * (data.registrationFee / 100);
    const loanProcessingAmount = principal * (data.loanProcessingFee / 100);
    const legalChargesAmount = data.legalCharges;
    
    // Total upfront costs
    const totalUpfrontCosts = downPaymentAmount + stampDutyAmount + registrationAmount + 
                             loanProcessingAmount + legalChargesAmount;
    
    const monthlyRate = data.loanRate / 100 / 12;
    const totalPayments = data.loanTerm * 12;
    
    // Get investment return based on risk profile
    const selectedProfile = investmentRiskProfiles[data.investmentRiskProfile as keyof typeof investmentRiskProfiles];
    const actualInvestmentReturn = selectedProfile ? selectedProfile.return : data.investmentReturn;
    
    // Monthly home loan payment (P&I)
    const monthlyLoanPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                              (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Additional monthly home ownership costs
    const monthlyPropertyTax = (data.homePrice * data.propertyTax / 100) / 12;
    const monthlyInsurance = data.homeInsurance / 12;
    const monthlyMaintenance = (data.homePrice * data.maintenance / 100) / 12;
    
    const totalMonthlyOwnership = monthlyLoanPayment + monthlyPropertyTax + monthlyInsurance + 
                                 monthlyMaintenance + data.societyCharges;
    
    // Year-by-year analysis with comprehensive breakdowns
    const yearlyAnalysis = [];
    let currentRent = data.monthlyRent;
    let remainingBalance = principal;
    let cumulativeRentCost = 0;
    let cumulativeOwnershipCost = totalUpfrontCosts;
    let homeValue = data.homePrice;
    let downPaymentInvestment = totalUpfrontCosts;
    let totalRentInvested = 0;
    let cumulativeInterestPaid = 0;
    let cumulativePrincipalPaid = 0;
    let cumulativeTaxBenefits = 0;
    
    for (let year = 1; year <= data.timeHorizon; year++) {
        // Inflation factor for this year
        const inflationFactor = Math.pow(1 + data.inflationRate / 100, year);
        
        // Rent calculations with Indian frequency pattern
        const yearlyRentCost = currentRent * 12;
        cumulativeRentCost += yearlyRentCost;
        
        // Home ownership calculations
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        
        // Calculate principal and interest for the year
        for (let month = 1; month <= 12; month++) {
          const interestPayment = remainingBalance * monthlyRate;
          const principalPayment = monthlyLoanPayment - interestPayment;
          yearlyInterest += interestPayment;
          yearlyPrincipal += principalPayment;
          remainingBalance = Math.max(0, remainingBalance - principalPayment);
        }
        
        cumulativeInterestPaid += yearlyInterest;
        cumulativePrincipalPaid += yearlyPrincipal;
        
        const yearlyTax = monthlyPropertyTax * 12;
        const yearlyInsurance = data.homeInsurance;
        const yearlyMaintenance = monthlyMaintenance * 12;
        const yearlySocietyCharges = data.societyCharges * 12;
        
        const totalYearlyOwnership = monthlyLoanPayment * 12 + yearlyTax + yearlyInsurance + 
                                    yearlyMaintenance + yearlySocietyCharges;
      
        cumulativeOwnershipCost += totalYearlyOwnership;
      
        // Home appreciation
        homeValue *= (1 + data.homeAppreciation / 100);
        
        // Investment growth for down payment (rent scenario)
        downPaymentInvestment *= (1 + actualInvestmentReturn / 100);
        
        // Investment of rent difference
        const monthlyDifference = totalMonthlyOwnership - currentRent;
        let yearlyDifferenceInvested = 0;
        
        if (monthlyDifference > 0) {
          // If buying costs more, invest the saved amount in rent scenario
          yearlyDifferenceInvested = monthlyDifference * 12;
          totalRentInvested += yearlyDifferenceInvested;
          downPaymentInvestment += yearlyDifferenceInvested * (1 + actualInvestmentReturn / 100);
        }
        
        // Net worth calculations
        const homeEquity = homeValue - remainingBalance;
        const rentScenarioNetWorth = downPaymentInvestment;
        const buyScenarioNetWorth = homeEquity;
        
        // Tax benefits (home loan interest deduction under Section 24(b) in India)
        const maxInterestDeduction = 200000;
        const deductibleInterest = Math.min(yearlyInterest, maxInterestDeduction);
        const taxBenefit = deductibleInterest * (data.taxBracket / 100);
        const effectiveOwnershipCost = totalYearlyOwnership - taxBenefit;
        cumulativeTaxBenefits += taxBenefit;
        
        // Inflation-adjusted (real) values
        const realYearlyRentCost = yearlyRentCost / inflationFactor;
        const realCumulativeRentCost = cumulativeRentCost / inflationFactor;
        const realHomeValue = homeValue / inflationFactor;
        const realHomeEquity = homeEquity / inflationFactor;
        const realYearlyOwnershipCost = totalYearlyOwnership / inflationFactor;
        const realCumulativeOwnershipCost = cumulativeOwnershipCost / inflationFactor;
        const realRentNetWorth = rentScenarioNetWorth / inflationFactor;
        const realBuyNetWorth = buyScenarioNetWorth / inflationFactor;
        const realYearlyInterest = yearlyInterest / inflationFactor;
        const realCumulativeInterest = cumulativeInterestPaid / inflationFactor;
        
        // Actual property cost (total investment including all costs)
        const totalPropertyInvestment = totalUpfrontCosts + cumulativeInterestPaid + 
                                       (yearlyTax + yearlyInsurance + yearlyMaintenance + yearlySocietyCharges) * year;
        const realTotalPropertyInvestment = totalPropertyInvestment / inflationFactor;
        const actualPropertyValue = homeValue - totalPropertyInvestment;
        const realActualPropertyValue = actualPropertyValue / inflationFactor;
        
        yearlyAnalysis.push({
          year,
          inflationFactor,
          
          // Rent scenario - Nominal values
          monthlyRent: currentRent,
          yearlyRentCost,
          cumulativeRentCost,
          rentNetWorth: rentScenarioNetWorth,
          totalRentInvested,
          yearlyDifferenceInvested,
          
          // Rent scenario - Real (inflation-adjusted) values
          realYearlyRentCost,
          realCumulativeRentCost,
          realRentNetWorth,
          
          // Buy scenario - Nominal values
          homeValue,
          monthlyOwnership: totalMonthlyOwnership,
          yearlyOwnershipCost: totalYearlyOwnership,
          effectiveOwnershipCost,
          cumulativeOwnershipCost,
          homeEquity,
          buyNetWorth: buyScenarioNetWorth,
          remainingLoanBalance: remainingBalance,
          
          // Buy scenario - Real (inflation-adjusted) values
          realHomeValue,
          realHomeEquity,
          realYearlyOwnershipCost,
          realCumulativeOwnershipCost,
          realBuyNetWorth,
          
          // Property investment breakdown
          totalPropertyInvestment,
          realTotalPropertyInvestment,
          actualPropertyValue,
          realActualPropertyValue,
          
          // Comparison
          monthlySavings: currentRent - totalMonthlyOwnership,
          netWorthDifference: buyScenarioNetWorth - rentScenarioNetWorth,
          realNetWorthDifference: realBuyNetWorth - realRentNetWorth,
          
          // Detailed breakdown - Nominal
          principalPayment: yearlyPrincipal,
          interestPayment: yearlyInterest,
          cumulativeInterestPaid,
          cumulativePrincipalPaid,
          propertyTax: yearlyTax,
          insurance: yearlyInsurance,
          maintenance: yearlyMaintenance,
          societyCharges: yearlySocietyCharges,
          taxBenefit: taxBenefit,
          cumulativeTaxBenefits,
          
          // Detailed breakdown - Real (inflation-adjusted)
          realYearlyInterest,
          realCumulativeInterest,
          realTaxBenefit: taxBenefit / inflationFactor,
          realCumulativeTaxBenefits: cumulativeTaxBenefits / inflationFactor
        });
        
        // Update rent for next year based on Indian frequency (11 or 12 months)
        if (data.rentIncreaseFrequency === 11) {
          // For 11-month cycle, rent increases slightly more frequently
          currentRent *= Math.pow(1 + data.rentIncrease / 100, 12/11);
        } else {
          // Annual increase
          currentRent *= (1 + data.rentIncrease / 100);
        }
    }
    
    const finalYear = yearlyAnalysis[yearlyAnalysis.length - 1];
    const totalInterest = finalYear?.cumulativeInterestPaid || 0;
    const totalTaxBenefits = finalYear?.cumulativeTaxBenefits || 0;
    const finalTotalRentInvested = finalYear?.totalRentInvested || 0;
    
    // Break-even analysis (both nominal and real terms)
    let breakEvenYear = null;
    let realBreakEvenYear = null;
    for (let i = 0; i < yearlyAnalysis.length; i++) {
      if (!breakEvenYear && yearlyAnalysis[i].buyNetWorth > yearlyAnalysis[i].rentNetWorth) {
        breakEvenYear = yearlyAnalysis[i].year;
      }
      if (!realBreakEvenYear && yearlyAnalysis[i].realBuyNetWorth > yearlyAnalysis[i].realRentNetWorth) {
        realBreakEvenYear = yearlyAnalysis[i].year;
      }
    }
    
    // Calculate comprehensive metrics
    const totalEMI = monthlyLoanPayment * totalPayments;
    const totalCostOfOwnership = finalYear?.cumulativeOwnershipCost || 0;
    const effectiveMonthlyRentAtEnd = finalYear?.monthlyRent || data.monthlyRent;
    const rentToIncomeRatio = (data.monthlyRent / 100000) * 100; // Assuming 1L monthly income for ratio
    const loanToValueRatio = (principal / data.homePrice) * 100;
    
    // Final inflation adjustment factor
    const finalInflationFactor = Math.pow(1 + data.inflationRate / 100, data.timeHorizon);
    
    // Real vs Nominal summary comparisons
    const nominalRentTotal = finalYear?.cumulativeRentCost || 0;
    const realRentTotal = finalYear?.realCumulativeRentCost || 0;
    const nominalOwnershipTotal = finalYear?.cumulativeOwnershipCost || 0;
    const realOwnershipTotal = finalYear?.realCumulativeOwnershipCost || 0;
    
    // Property value analysis
    const finalPropertyValue = finalYear?.homeValue || 0;
    const realFinalPropertyValue = finalYear?.realHomeValue || 0;
    const totalPropertyCost = finalYear?.totalPropertyInvestment || 0;
    const realTotalPropertyCost = finalYear?.realTotalPropertyInvestment || 0;
    const actualPropertyReturn = finalYear?.actualPropertyValue || 0;
    const realActualPropertyReturn = finalYear?.realActualPropertyValue || 0;

    return {
      initialCosts: {
        downPayment: downPaymentAmount,
        stampDuty: stampDutyAmount,
        registration: registrationAmount,
        loanProcessing: loanProcessingAmount,
        legalCharges: legalChargesAmount,
        total: totalUpfrontCosts
      },
      monthlyPayments: {
        loanPayment: monthlyLoanPayment,
        propertyTax: monthlyPropertyTax,
        insurance: monthlyInsurance,
        maintenance: monthlyMaintenance,
        societyCharges: data.societyCharges,
        total: totalMonthlyOwnership
      },
      summary: {
        // Basic loan metrics
        totalInterest,
        totalTaxBenefits,
        totalEMI,
        totalCostOfOwnership,
        totalRentInvested: finalTotalRentInvested,
        
        // Property values (nominal and real)
        finalPropertyValue,
        realFinalPropertyValue,
        finalHomeEquity: finalYear?.homeEquity || 0,
        realFinalHomeEquity: finalYear?.realHomeEquity || 0,
        totalPropertyCost,
        realTotalPropertyCost,
        actualPropertyReturn,
        realActualPropertyReturn,
        
        // Rent vs ownership costs (nominal and real)
        nominalRentTotal,
        realRentTotal,
        nominalOwnershipTotal,
        realOwnershipTotal,
        
        // Net worth comparison (nominal and real)
        finalNetWorthDifference: finalYear?.netWorthDifference || 0,
        realFinalNetWorthDifference: finalYear?.realNetWorthDifference || 0,
        
        // Investment scenarios
        finalRentScenarioNetWorth: finalYear?.rentNetWorth || 0,
        realFinalRentScenarioNetWorth: finalYear?.realRentNetWorth || 0,
        finalBuyScenarioNetWorth: finalYear?.buyNetWorth || 0,
        realFinalBuyScenarioNetWorth: finalYear?.realBuyNetWorth || 0,
        
        // Market metrics
        effectiveMonthlyRentAtEnd,
        rentToIncomeRatio,
        loanToValueRatio,
        finalInflationFactor,
        
        // Break-even analysis
        breakEvenYear,
        realBreakEvenYear,
        
        // Investment profile
        investmentRiskProfile: data.investmentRiskProfile,
        actualInvestmentReturn
      },
      yearlyAnalysis
    };
  }, [data, investmentRiskProfiles]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = results.yearlyAnalysis.map(item => ({
    year: `Year ${item.year}`,
    'Rent Total Cost': item.cumulativeRentCost,
    'Buy Total Cost': item.cumulativeOwnershipCost,
    'Rent Net Worth': item.rentNetWorth,
    'Buy Net Worth': item.buyNetWorth,
    'Real Rent Total Cost': item.realCumulativeRentCost,
    'Real Buy Total Cost': item.realCumulativeOwnershipCost,
    'Real Rent Net Worth': item.realRentNetWorth,
    'Real Buy Net Worth': item.realBuyNetWorth
  }));

  const monthlyComparisonData = results.yearlyAnalysis.slice(0, 5).map(item => ({
    year: `Year ${item.year}`,
    'Monthly Rent': item.monthlyRent,
    'Monthly Ownership': item.monthlyOwnership
  }));

  const inflationComparisonData = results.yearlyAnalysis.map(item => ({
    year: `Year ${item.year}`,
    'Nominal Property Value': item.homeValue,
    'Real Property Value': item.realHomeValue,
    'Nominal Rent Cost': item.cumulativeRentCost,
    'Real Rent Cost': item.realCumulativeRentCost
  }));

  const interestBreakdownData = results.yearlyAnalysis.map(item => ({
    year: `Year ${item.year}`,
    'Principal Payment': item.principalPayment,
    'Interest Payment': item.interestPayment,
    'Cumulative Interest': item.cumulativeInterestPaid,
    'Tax Benefits': item.taxBenefit
  }));

  const costBreakdownData = [
    { name: 'Principal & Interest', value: results.monthlyPayments.loanPayment },
    { name: 'Property Tax', value: results.monthlyPayments.propertyTax },
    { name: 'Home Insurance', value: results.monthlyPayments.insurance },
    { name: 'Maintenance', value: results.monthlyPayments.maintenance },
    { name: 'Society Charges', value: results.monthlyPayments.societyCharges }
  ].filter(item => item.value > 0);

  const upfrontCostBreakdownData = [
    { name: 'Down Payment', value: results.initialCosts.downPayment },
    { name: 'Stamp Duty', value: results.initialCosts.stampDuty },
    { name: 'Registration Fee', value: results.initialCosts.registration },
    { name: 'Loan Processing', value: results.initialCosts.loanProcessing },
    { name: 'Legal Charges', value: results.initialCosts.legalCharges }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
          <Home className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Rent vs Buy Calculator (India)</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Make informed housing decisions with comprehensive financial analysis for the Indian market
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="financial-card bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Housing Details
              </CardTitle>
              <CardDescription>Configure your housing scenario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="property" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="property">Property</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                  <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="property" className="space-y-4">
                  {/* Home Price */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Property Price (₹)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The purchase price of the property you're considering in Indian Rupees</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={data.homePrice}
                        onChange={(e) => setData({...data, homePrice: Number(e.target.value)})}
                        className="pl-8"
                        placeholder="5000000"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Example: ₹50,00,000 (50 lakhs)</p>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Down Payment (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Percentage of home price paid upfront (typically 10-20%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.downPayment}
                      onChange={(e) => setData({...data, downPayment: Number(e.target.value)})}
                      placeholder="20"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  {/* Home Loan Rate */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Home Loan Interest Rate (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual interest rate for your home loan from Indian banks (typically 7.5% - 9.5%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.loanRate}
                      onChange={(e) => setData({...data, loanRate: Number(e.target.value)})}
                      placeholder="8.5"
                      step="0.1"
                    />
                  </div>

                  {/* Loan Term */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Loan Term (years)
                    </Label>
                    <Select 
                      value={data.loanTerm.toString()} 
                      onValueChange={(value) => setData({...data, loanTerm: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="25">25 years</SelectItem>
                        <SelectItem value="30">30 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Monthly Rent */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Monthly Rent (₹)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current monthly rent for a comparable property in your area</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={data.monthlyRent}
                        onChange={(e) => setData({...data, monthlyRent: Number(e.target.value)})}
                        className="pl-8"
                        placeholder="35000"
                      />
                    </div>
                  </div>

                  {/* Rent Increase Frequency */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Rent Increase Frequency
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>In India, rent is typically increased every 11 months or annually</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select 
                      value={data.rentIncreaseFrequency.toString()} 
                      onValueChange={(value) => setData({...data, rentIncreaseFrequency: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11">Every 11 months (Common in India)</SelectItem>
                        <SelectItem value="12">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="costs" className="space-y-4">
                  {/* Property Tax */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Property Tax (% per year)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual property tax as percentage of property value (varies by city in India)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.propertyTax}
                      onChange={(e) => setData({...data, propertyTax: Number(e.target.value)})}
                      placeholder="0.5"
                      step="0.1"
                    />
                  </div>

                  {/* Home Insurance */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Home Insurance (₹ per year)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual home insurance premium in Indian Rupees</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={data.homeInsurance}
                        onChange={(e) => setData({...data, homeInsurance: Number(e.target.value)})}
                        className="pl-8"
                        placeholder="15000"
                      />
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Maintenance (% per year)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual maintenance cost as percentage of property value</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.maintenance}
                      onChange={(e) => setData({...data, maintenance: Number(e.target.value)})}
                      placeholder="1"
                      step="0.1"
                    />
                  </div>

                  {/* Society Charges */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Society/HOA Charges (₹ per month)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Monthly society or housing association charges</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={data.societyCharges}
                        onChange={(e) => setData({...data, societyCharges: Number(e.target.value)})}
                        className="pl-8"
                        placeholder="3000"
                      />
                    </div>
                  </div>

                  {/* Stamp Duty */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Stamp Duty (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Stamp duty rate in your state (typically 2-7% in India)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.stampDutyRate}
                      onChange={(e) => setData({...data, stampDutyRate: Number(e.target.value)})}
                      placeholder="3"
                      step="0.1"
                    />
                  </div>

                  {/* Registration Fee */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Registration Fee (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Property registration fee (typically 1-3% in India)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.registrationFee}
                      onChange={(e) => setData({...data, registrationFee: Number(e.target.value)})}
                      placeholder="1"
                      step="0.1"
                    />
                  </div>

                  {/* Loan Processing Fee */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Loan Processing Fee (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Home loan processing fee charged by banks (typically 0.25-1% of loan amount)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.loanProcessingFee}
                      onChange={(e) => setData({...data, loanProcessingFee: Number(e.target.value)})}
                      placeholder="0.5"
                      step="0.1"
                    />
                  </div>

                  {/* Legal Charges */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Legal & Valuation Charges (₹)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Legal verification, property valuation, and documentation charges</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={data.legalCharges}
                        onChange={(e) => setData({...data, legalCharges: Number(e.target.value)})}
                        className="pl-8"
                        placeholder="25000"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assumptions" className="space-y-4">
                  {/* Rent Increase */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Annual Rent Increase (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected annual rent increase in India (typically 5-10%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.rentIncrease}
                      onChange={(e) => setData({...data, rentIncrease: Number(e.target.value)})}
                      placeholder="8"
                      step="0.1"
                    />
                  </div>

                  {/* Property Appreciation */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Annual Property Appreciation (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected annual property value growth in India (historically 6-8%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.homeAppreciation}
                      onChange={(e) => setData({...data, homeAppreciation: Number(e.target.value)})}
                      placeholder="7"
                      step="0.1"
                    />
                  </div>

                  {/* Investment Risk Profile */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Investment Risk Profile
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose your investment risk appetite for the down payment alternative</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select 
                      value={data.investmentRiskProfile} 
                      onValueChange={(value) => {
                        const profile = investmentRiskProfiles[value as keyof typeof investmentRiskProfiles];
                        setData({
                          ...data, 
                          investmentRiskProfile: value,
                          investmentReturn: profile ? profile.return : data.investmentReturn
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex flex-col">
                            <span>{investmentRiskProfiles.low.name}</span>
                            <span className="text-xs text-muted-foreground">{investmentRiskProfiles.low.return}% expected return</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="moderate">
                          <div className="flex flex-col">
                            <span>{investmentRiskProfiles.moderate.name}</span>
                            <span className="text-xs text-muted-foreground">{investmentRiskProfiles.moderate.return}% expected return</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex flex-col">
                            <span>{investmentRiskProfiles.high.name}</span>
                            <span className="text-xs text-muted-foreground">{investmentRiskProfiles.high.return}% expected return</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Investment Return (Auto-populated) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Expected Investment Return (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Auto-populated based on risk profile, can be customized</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.investmentReturn}
                      onChange={(e) => setData({...data, investmentReturn: Number(e.target.value)})}
                      placeholder="9"
                      step="0.1"
                    />
                  </div>

                  {/* Inflation Rate */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Expected Inflation Rate (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected annual inflation rate in India (typically 4-6%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={data.inflationRate}
                      onChange={(e) => setData({...data, inflationRate: Number(e.target.value)})}
                      placeholder="5"
                      step="0.1"
                    />
                  </div>

                  {/* Time Horizon */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Time Horizon (years)
                    </Label>
                    <Select 
                      value={data.timeHorizon.toString()} 
                      onValueChange={(value) => setData({...data, timeHorizon: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                        <SelectItem value="15">15 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="30">30 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tax Bracket */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-semibold">
                      Income Tax Bracket (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your income tax slab rate for calculating home loan interest deduction benefits</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select 
                      value={data.taxBracket.toString()} 
                      onValueChange={(value) => setData({...data, taxBracket: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% (No tax)</SelectItem>
                        <SelectItem value="5">5% (₹2.5L - ₹5L)</SelectItem>
                        <SelectItem value="20">20% (₹5L - ₹10L)</SelectItem>
                        <SelectItem value="30">30% (Above ₹10L)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards - 8 comprehensive cards with time horizon analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Row 1 - Initial & Monthly Costs */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Initial Investment</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.initialCosts.total)}</p>
                  <p className="text-xs text-muted-foreground">All upfront costs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Monthly EMI</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.monthlyPayments.loanPayment)}</p>
                  <p className="text-xs text-muted-foreground">Principal + Interest</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
                  <Calculator className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Monthly Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.monthlyPayments.total)}</p>
                  <p className="text-xs text-muted-foreground">Including all expenses</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Rent Paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.summary.nominalRentTotal)}</p>
                  <p className="text-xs text-muted-foreground">Over {data.timeHorizon} years (nominal)</p>
                  <p className="text-xs text-green-600">Real: {formatCurrency(results.summary.realRentTotal)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Row 2 - Total Costs & Property Analysis */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Interest Paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.summary.totalInterest)}</p>
                  <p className="text-xs text-muted-foreground">Over loan term</p>
                  <p className="text-xs text-green-600">Real: {formatCurrency(results.summary.totalInterest / results.summary.finalInflationFactor)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Tax Benefits</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.summary.totalTaxBenefits)}</p>
                  <p className="text-xs text-muted-foreground">Section 24(b) savings</p>
                  <p className="text-xs text-green-600">Real: {formatCurrency(results.summary.totalTaxBenefits / results.summary.finalInflationFactor)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-full mx-auto mb-3">
                  <Building className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Property Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.summary.finalPropertyValue)}</p>
                  <p className="text-xs text-muted-foreground">After {data.timeHorizon} years (nominal)</p>
                  <p className="text-xs text-green-600">Real: {formatCurrency(results.summary.realFinalPropertyValue)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Net Worth Difference</p>
                  <p className={`text-2xl font-bold ${results.summary.finalNetWorthDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.summary.finalNetWorthDifference >= 0 ? '+' : ''}{formatCurrency(results.summary.finalNetWorthDifference)}
                  </p>
                  <p className="text-xs text-muted-foreground">Buy vs Rent (nominal)</p>
                  <p className={`text-xs ${results.summary.realFinalNetWorthDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Real: {results.summary.realFinalNetWorthDifference >= 0 ? '+' : ''}{formatCurrency(results.summary.realFinalNetWorthDifference)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Break-even Analysis with Inflation Consideration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Break-even Analysis
              </CardTitle>
              <CardDescription>Time horizon when buying becomes financially advantageous</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center py-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Nominal Terms</p>
                  {results.summary.breakEvenYear ? (
                    <>
                      <p className="text-3xl font-bold text-blue-600">{results.summary.breakEvenYear} years</p>
                      <p className="text-sm text-muted-foreground">Break-even point</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-red-600">No break-even</p>
                      <p className="text-sm text-muted-foreground">Renting remains better in {data.timeHorizon} years</p>
                    </>
                  )}
                </div>
                <div className="text-center py-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Inflation-Adjusted (Real)</p>
                  {results.summary.realBreakEvenYear ? (
                    <>
                      <p className="text-3xl font-bold text-green-600">{results.summary.realBreakEvenYear} years</p>
                      <p className="text-sm text-muted-foreground">Real purchasing power</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-red-600">No break-even</p>
                      <p className="text-sm text-muted-foreground">Renting better in real terms</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Time Horizon Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Time Horizon Financial Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive breakdown of costs, investments, and property values over {data.timeHorizon} years
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Rent in {data.timeHorizon} years</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(results.summary.effectiveMonthlyRentAtEnd)}</p>
                  <p className="text-xs text-muted-foreground">With {data.rentIncrease}% annual increase</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Property Equity</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(results.summary.finalHomeEquity)}</p>
                  <p className="text-xs text-green-600">Real: {formatCurrency(results.summary.realFinalHomeEquity)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Invested (Rent Scenario)</p>
                  <p className="text-xl font-bold text-purple-600">{formatCurrency(results.summary.finalRentScenarioNetWorth)}</p>
                  <p className="text-xs text-green-600">Real: {formatCurrency(results.summary.realFinalRentScenarioNetWorth)}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Actual Property Return</p>
                  <p className={`text-xl font-bold ${results.summary.actualPropertyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.summary.actualPropertyReturn)}
                  </p>
                  <p className="text-xs text-muted-foreground">Value - Total Costs</p>
                </div>
              </div>

              {/* Cost Breakdown Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3 text-blue-600">Rent Scenario Total Costs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Rent Paid:</span>
                      <span className="font-medium">{formatCurrency(results.summary.nominalRentTotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Inflation-adjusted:</span>
                      <span className="font-medium">{formatCurrency(results.summary.realRentTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Investment Value:</span>
                      <span className="font-medium">{formatCurrency(results.summary.finalRentScenarioNetWorth)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Real Investment Value:</span>
                      <span className="font-medium">{formatCurrency(results.summary.realFinalRentScenarioNetWorth)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3 text-orange-600">Buy Scenario Total Costs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Ownership Cost:</span>
                      <span className="font-medium">{formatCurrency(results.summary.nominalOwnershipTotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Inflation-adjusted:</span>
                      <span className="font-medium">{formatCurrency(results.summary.realOwnershipTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Interest Paid:</span>
                      <span className="font-medium">{formatCurrency(results.summary.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Property Value:</span>
                      <span className="font-medium">{formatCurrency(results.summary.finalPropertyValue)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Real Property Value:</span>
                      <span className="font-medium">{formatCurrency(results.summary.realFinalPropertyValue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Financial Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Loan-to-Value Ratio:</span>
                      <span className="text-sm font-medium">{results.summary.loanToValueRatio.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Interest Paid:</span>
                      <span className="text-sm font-medium">{formatCurrency(results.summary.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax Savings:</span>
                      <span className="text-sm font-medium text-green-600">{formatCurrency(results.summary.totalTaxBenefits)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Inflation Impact:</span>
                      <span className="text-sm font-medium">{((results.summary.finalInflationFactor - 1) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Investment Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Risk Profile:</span>
                      <span className="text-sm font-medium">{investmentRiskProfiles[data.investmentRiskProfile as keyof typeof investmentRiskProfiles]?.name || 'Moderate'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Return:</span>
                      <span className="text-sm font-medium">{results.summary.actualInvestmentReturn}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Inflation Rate:</span>
                      <span className="text-sm font-medium">{data.inflationRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Real Return:</span>
                      <span className="text-sm font-medium">{(results.summary.actualInvestmentReturn - data.inflationRate).toFixed(1)}% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Analysis Charts */}
              <Tabs defaultValue="comparison" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                  <TabsTrigger value="comparison">Net Worth</TabsTrigger>
                  <TabsTrigger value="inflation">Inflation Impact</TabsTrigger>
                  <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                  <TabsTrigger value="interest">Interest & Tax</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                
                <TabsContent value="comparison">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Net Worth Comparison (Nominal vs Real)
                      </CardTitle>
                      <CardDescription>
                        Comparison of net worth between renting and buying scenarios with inflation adjustment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedLineChart
                        data={chartData}
                        height={400}
                        lines={[
                          { dataKey: 'Rent Net Worth', stroke: '#f59e0b', strokeWidth: 3 },
                          { dataKey: 'Buy Net Worth', stroke: '#10b981', strokeWidth: 3 },
                          { dataKey: 'Real Rent Net Worth', stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 5' },
                          { dataKey: 'Real Buy Net Worth', stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }
                        ]}
                        xAxisKey="year"
                        labelFormatter={(label) => label}
                        valueFormatter={(value, name) => [formatCurrency(Number(value)), name]}
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p><span className="text-orange-500">Solid lines:</span> Nominal values | <span className="text-green-600">Dashed lines:</span> Inflation-adjusted (real) values</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="inflation">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Inflation Impact Analysis
                      </CardTitle>
                      <CardDescription>
                        How inflation affects property values and rent costs over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedLineChart
                        data={inflationComparisonData}
                        height={400}
                        lines={[
                          { dataKey: 'Nominal Property Value', stroke: '#3b82f6', strokeWidth: 3 },
                          { dataKey: 'Real Property Value', stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' },
                          { dataKey: 'Nominal Rent Cost', stroke: '#ef4444', strokeWidth: 3 },
                          { dataKey: 'Real Rent Cost', stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }
                        ]}
                        xAxisKey="year"
                        labelFormatter={(label) => label}
                        valueFormatter={(value, name) => [formatCurrency(Number(value)), name]}
                      />
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-700">Property Value Impact</p>
                          <p className="text-blue-600">Nominal: {formatCurrency(results.summary.finalPropertyValue)}</p>
                          <p className="text-blue-600">Real: {formatCurrency(results.summary.realFinalPropertyValue)}</p>
                          <p className="text-xs text-muted-foreground">Loss due to inflation: {formatCurrency(results.summary.finalPropertyValue - results.summary.realFinalPropertyValue)}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="font-medium text-red-700">Rent Cost Impact</p>
                          <p className="text-red-600">Nominal: {formatCurrency(results.summary.nominalRentTotal)}</p>
                          <p className="text-red-600">Real: {formatCurrency(results.summary.realRentTotal)}</p>
                          <p className="text-xs text-muted-foreground">Inflation benefit: {formatCurrency(results.summary.nominalRentTotal - results.summary.realRentTotal)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="costs">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Total Cost Comparison Over Time
                      </CardTitle>
                      <CardDescription>
                        Cumulative costs for rent vs buy scenarios (nominal and real values)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedLineChart
                        data={chartData}
                        height={400}
                        lines={[
                          { dataKey: 'Rent Total Cost', stroke: '#f59e0b', strokeWidth: 3 },
                          { dataKey: 'Buy Total Cost', stroke: '#10b981', strokeWidth: 3 },
                          { dataKey: 'Real Rent Total Cost', stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 5' },
                          { dataKey: 'Real Buy Total Cost', stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }
                        ]}
                        xAxisKey="year"
                        labelFormatter={(label) => label}
                        valueFormatter={(value, name) => [formatCurrency(Number(value)), name]}
                      />
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p><span className="text-orange-500">Solid lines:</span> Nominal costs | <span className="text-green-600">Dashed lines:</span> Inflation-adjusted (real) costs</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="interest">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Interest Payments & Tax Benefits Analysis
                      </CardTitle>
                      <CardDescription>
                        Year-by-year breakdown of loan interest, principal, and tax benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedBarChart
                        data={interestBreakdownData}
                        height={400}
                        bars={[
                          { dataKey: 'Principal Payment', fill: '#10b981' },
                          { dataKey: 'Interest Payment', fill: '#ef4444' },
                          { dataKey: 'Tax Benefits', fill: '#3b82f6' }
                        ]}
                        xAxisKey="year"
                        labelFormatter={(label) => label}
                        valueFormatter={(value, name) => [formatCurrency(Number(value)), name]}
                      />
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-green-700">Total Principal</p>
                          <p className="text-xl font-bold text-green-600">{formatCurrency(results.yearlyAnalysis[results.yearlyAnalysis.length - 1]?.cumulativePrincipalPaid || 0)}</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="font-medium text-red-700">Total Interest</p>
                          <p className="text-xl font-bold text-red-600">{formatCurrency(results.summary.totalInterest)}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-700">Total Tax Benefits</p>
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(results.summary.totalTaxBenefits)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Year-by-Year Timeline Analysis
                      </CardTitle>
                      <CardDescription>
                        Detailed financial breakdown for each year of the analysis period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Year</th>
                              <th className="text-right p-2">Monthly Rent</th>
                              <th className="text-right p-2">Property Value</th>
                              <th className="text-right p-2">Home Equity</th>
                              <th className="text-right p-2">Rent Net Worth</th>
                              <th className="text-right p-2">Buy Net Worth</th>
                              <th className="text-right p-2">Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.yearlyAnalysis.map((year) => (
                              <tr key={year.year} className="border-b">
                                <td className="p-2 font-medium">{year.year}</td>
                                <td className="p-2 text-right">{formatCurrency(year.monthlyRent)}</td>
                                <td className="p-2 text-right">{formatCurrency(year.homeValue)}</td>
                                <td className="p-2 text-right">{formatCurrency(year.homeEquity)}</td>
                                <td className="p-2 text-right">{formatCurrency(year.rentNetWorth)}</td>
                                <td className="p-2 text-right">{formatCurrency(year.buyNetWorth)}</td>
                                <td className={`p-2 text-right font-medium ${year.netWorthDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {year.netWorthDifference >= 0 ? '+' : ''}{formatCurrency(year.netWorthDifference)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 