// Tax brackets for new tax regime 2025 (hypothetical)
export const NEW_TAX_REGIME = [
  { limit: 300000, rate: 0 },
  { limit: 600000, rate: 5 },
  { limit: 900000, rate: 10 },
  { limit: 1200000, rate: 15 },
  { limit: 1500000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

// Tax brackets for old tax regime 2025 (hypothetical)
export const OLD_TAX_REGIME = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 5 },
  { limit: 1000000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

// Maximum deduction limits
export const MAX_80C = 150000;
export const MAX_80D_SELF = 25000;
export const MAX_80D_PARENTS = 50000;
export const MAX_HRA_PERCENT_METRO = 0.5; // 50% of basic salary for metro cities
export const MAX_HRA_PERCENT_NON_METRO = 0.4; // 40% of basic salary for non-metro cities
export const MAX_NPS_ADDITIONAL = 50000;
export const MAX_HOME_LOAN_INTEREST = 200000;
export const STANDARD_DEDUCTION = 50000;

export interface TaxInputs {
  basicSalary: number;
  hra: number;
  lta: number;
  otherAllowances: number;
  rentPaid: number;
  cityType: 'metro' | 'non-metro';
  section80C: number;
  section80D_self: number;
  section80D_parents: number;
  nps: number;
  otherIncome: number;
  homeLoanInterest: number;
}

export interface TaxResults {
  grossTotalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxLiabilityOld: number;
  taxLiabilityNew: number;
  savings: number;
  bestRegime: 'old' | 'new';
}

/**
 * Calculate HRA exemption based on basic salary, HRA received, and rent paid
 */
export const calculateHRAExemption = (
  basicSalary: number,
  hra: number,
  rentPaid: number,
  cityType: 'metro' | 'non-metro'
): number => {
  // HRA exemption is minimum of:
  // 1. Actual HRA received
  // 2. Rent paid - 10% of basic salary
  // 3. 50% of basic salary for metro cities, 40% for non-metro
  
  const hraReceived = hra;
  const rentMinusBasic = Math.max(0, rentPaid - 0.1 * basicSalary);
  const percentOfBasic = 
    cityType === 'metro' 
      ? MAX_HRA_PERCENT_METRO * basicSalary 
      : MAX_HRA_PERCENT_NON_METRO * basicSalary;
  
  return Math.min(hraReceived, rentMinusBasic, percentOfBasic);
};

/**
 * Calculate tax based on income and applicable tax brackets
 */
export const calculateTax = (
  income: number, 
  brackets: typeof NEW_TAX_REGIME
): number => {
  let remainingIncome = income;
  let tax = 0;
  let previousLimit = 0;
  
  for (const bracket of brackets) {
    const taxableInThisBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
    tax += (taxableInThisBracket * bracket.rate) / 100;
    remainingIncome -= taxableInThisBracket;
    previousLimit = bracket.limit;
    if (remainingIncome <= 0) break;
  }
  
  // Add 4% health and education cess
  tax += tax * 0.04;
  
  return Math.round(tax);
};

/**
 * Main function to calculate taxes based on inputs
 */
export const calculateTaxLiability = (inputs: TaxInputs): TaxResults => {
  // Calculate gross total income
  const grossTotalIncome = 
    inputs.basicSalary + 
    inputs.hra + 
    inputs.lta + 
    inputs.otherAllowances + 
    inputs.otherIncome;
  
  // Calculate exemptions and deductions for old regime
  const hraExemption = calculateHRAExemption(
    inputs.basicSalary,
    inputs.hra,
    inputs.rentPaid,
    inputs.cityType
  );
  const ltaExemption = Math.min(inputs.lta, 75000); // Assuming LTA exemption limit
  
  // Capped deductions as per limits
  const section80C = Math.min(inputs.section80C, MAX_80C);
  const section80D_self = Math.min(inputs.section80D_self, MAX_80D_SELF);
  const section80D_parents = Math.min(inputs.section80D_parents, MAX_80D_PARENTS);
  const homeLoanInterest = Math.min(inputs.homeLoanInterest, MAX_HOME_LOAN_INTEREST);
  const npsDeduction = Math.min(inputs.nps, MAX_NPS_ADDITIONAL);
  
  // Total deductions under old regime
  const totalDeductions = 
    section80C + 
    section80D_self + 
    section80D_parents + 
    homeLoanInterest + 
    npsDeduction +
    hraExemption + 
    ltaExemption;
  
  // Taxable income under old regime
  const taxableIncomeOld = Math.max(0, grossTotalIncome - totalDeductions);
  
  // Taxable income under new regime (fewer deductions)
  const taxableIncomeNew = Math.max(0, grossTotalIncome - STANDARD_DEDUCTION);
  
  // Calculate tax liability
  const taxLiabilityOld = calculateTax(taxableIncomeOld, OLD_TAX_REGIME);
  const taxLiabilityNew = calculateTax(taxableIncomeNew, NEW_TAX_REGIME);
  
  // Determine which regime is better
  const savings = Math.max(taxLiabilityNew - taxLiabilityOld, taxLiabilityOld - taxLiabilityNew);
  const bestRegime = taxLiabilityOld <= taxLiabilityNew ? 'old' : 'new';
  
  return {
    grossTotalIncome,
    totalDeductions,
    taxableIncome: bestRegime === 'old' ? taxableIncomeOld : taxableIncomeNew,
    taxLiabilityOld,
    taxLiabilityNew,
    savings,
    bestRegime
  };
};

/**
 * Get investment recommendations based on current inputs
 */
export const getTaxSavingRecommendations = (inputs: TaxInputs): string[] => {
  const recommendations: string[] = [];
  
  if (inputs.section80C < MAX_80C) {
    recommendations.push(`Consider investing ₹${(MAX_80C - inputs.section80C).toLocaleString()} more in Section 80C instruments like ELSS, PPF, or NPS.`);
  }
  
  if (inputs.section80D_self < MAX_80D_SELF) {
    recommendations.push(`You can claim up to ₹${(MAX_80D_SELF - inputs.section80D_self).toLocaleString()} more for health insurance premiums for self and family.`);
  }
  
  if (inputs.section80D_parents < MAX_80D_PARENTS) {
    recommendations.push(`Consider getting health insurance for parents to claim additional deduction up to ₹${(MAX_80D_PARENTS - inputs.section80D_parents).toLocaleString()}.`);
  }
  
  if (inputs.nps < MAX_NPS_ADDITIONAL) {
    recommendations.push(`Invest ₹${(MAX_NPS_ADDITIONAL - inputs.nps).toLocaleString()} more in NPS to get additional tax benefit under Section 80CCD(1B).`);
  }
  
  return recommendations;
}; 