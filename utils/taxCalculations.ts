/**
 * Tax Calculation Utility Module
 * 
 * This module provides comprehensive tax calculation functions for the Indian Tax Regime 2025.
 * It includes tax brackets, deduction limits, calculation logic for both old and new tax regimes,
 * and utility functions for tax optimization recommendations.
 * 
 * @module taxCalculations
 */

// Tax brackets for new tax regime 2025
export const NEW_TAX_REGIME = [
  { limit: 300000, rate: 0 },  // No tax up to 3 lakhs
  { limit: 600000, rate: 5 },  // 5% from 3-6 lakhs
  { limit: 900000, rate: 10 }, // 10% from 6-9 lakhs
  { limit: 1200000, rate: 15 },// 15% from 9-12 lakhs
  { limit: 1500000, rate: 20 },// 20% from 12-15 lakhs
  { limit: Infinity, rate: 30 },// 30% above 15 lakhs
];

// Tax brackets for old tax regime 2025
export const OLD_TAX_REGIME = [
  { limit: 250000, rate: 0 },  // No tax up to 2.5 lakhs
  { limit: 500000, rate: 5 },  // 5% from 2.5-5 lakhs
  { limit: 1000000, rate: 20 },// 20% from 5-10 lakhs
  { limit: Infinity, rate: 30 },// 30% above 10 lakhs
];

// Maximum deduction limits as per Income Tax Act
export const MAX_80C = 150000; // ₹1,50,000 - EPF, PPF, ELSS, etc.
export const MAX_80D_SELF = 25000; // ₹25,000 - Health insurance for self and family
export const MAX_80D_PARENTS = 50000; // ₹50,000 - Health insurance for parents (senior citizens)
export const MAX_HRA_PERCENT_METRO = 0.5; // 50% of basic salary for metro cities
export const MAX_HRA_PERCENT_NON_METRO = 0.4; // 40% of basic salary for non-metro cities
export const MAX_NPS_ADDITIONAL = 50000; // ₹50,000 - Additional NPS contribution u/s 80CCD(1B)
export const MAX_HOME_LOAN_INTEREST = 200000; // ₹2,00,000 - Home loan interest u/s 24(b)
export const STANDARD_DEDUCTION = 50000; // ₹50,000 - Standard deduction for salaried individuals

/**
 * Interface for tax calculation input parameters
 */
export interface TaxInputs {
  /** Basic salary component */
  basicSalary: number;
  /** House Rent Allowance received */
  hra: number;
  /** Leave Travel Allowance */
  lta: number;
  /** Other allowances (e.g., special allowance, conveyance) */
  otherAllowances: number;
  /** Annual rent paid */
  rentPaid: number;
  /** City type for HRA calculation */
  cityType: 'metro' | 'non-metro';
  /** Investments and expenses eligible under Section 80C */
  section80C: number;
  /** Health insurance premium for self and family */
  section80D_self: number;
  /** Health insurance premium for parents */
  section80D_parents: number;
  /** Additional NPS contribution under section 80CCD(1B) */
  nps: number;
  /** Income from other sources */
  otherIncome: number;
  /** Interest paid on home loan */
  homeLoanInterest: number;
}

/**
 * Interface for tax calculation results
 */
export interface TaxResults {
  /** Total income before deductions */
  grossTotalIncome: number;
  /** Total deductions applicable */
  totalDeductions: number;
  /** Taxable income after deductions */
  taxableIncome: number;
  /** Tax payable under old regime */
  taxLiabilityOld: number;
  /** Tax payable under new regime */
  taxLiabilityNew: number;
  /** Tax saved between regimes */
  savings: number;
  /** Recommended tax regime */
  bestRegime: 'old' | 'new';
}

/**
 * Validates the input values for tax calculation
 * @param inputs - Tax calculation inputs
 * @returns Validated inputs with non-negative values
 * @throws Error if any input is invalid
 */
export const validateInputs = (inputs: TaxInputs): TaxInputs => {
  const validatedInputs = { ...inputs };
  
  // Ensure all numerical inputs are non-negative
  Object.keys(validatedInputs).forEach(key => {
    if (key !== 'cityType' && (validatedInputs as any)[key] < 0) {
      throw new Error(`Invalid negative value for ${key}: ${(validatedInputs as any)[key]}`);
    }
  });

  // Ensure cityType is valid
  if (validatedInputs.cityType !== 'metro' && validatedInputs.cityType !== 'non-metro') {
    throw new Error(`Invalid city type: ${validatedInputs.cityType}`);
  }

  return validatedInputs;
};

/**
 * Calculate HRA exemption based on basic salary, HRA received, and rent paid
 * 
 * @param basicSalary - Basic salary component
 * @param hra - HRA received from employer
 * @param rentPaid - Annual rent paid
 * @param cityType - Whether the city is metro or non-metro
 * @returns HRA exemption amount
 */
export const calculateHRAExemption = (
  basicSalary: number,
  hra: number,
  rentPaid: number,
  cityType: 'metro' | 'non-metro'
): number => {
  try {
    // Ensure all inputs are valid numbers
    if (isNaN(basicSalary) || isNaN(hra) || isNaN(rentPaid)) {
      throw new Error('Invalid inputs for HRA calculation');
    }
    
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
  } catch (error) {
    console.error('Error calculating HRA exemption:', error);
    return 0; // Return 0 in case of error
  }
};

/**
 * Calculate tax based on income and applicable tax brackets
 * 
 * @param income - Taxable income
 * @param brackets - Tax brackets to apply
 * @returns Calculated tax amount including education cess
 */
export const calculateTax = (
  income: number, 
  brackets: typeof NEW_TAX_REGIME
): number => {
  try {
    // Validate input
    if (isNaN(income) || income < 0) {
      throw new Error(`Invalid income amount: ${income}`);
    }
    
    let remainingIncome = income;
    let tax = 0;
    let previousLimit = 0;
    
    // Calculate tax for each bracket
    for (const bracket of brackets) {
      const taxableInThisBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
      tax += (taxableInThisBracket * bracket.rate) / 100;
      remainingIncome -= taxableInThisBracket;
      previousLimit = bracket.limit;
      if (remainingIncome <= 0) break;
    }
    
    // Apply Section 87A rebate if applicable (for new regime only)
    if (brackets === NEW_TAX_REGIME && income <= 700000) {
      tax = Math.max(0, tax - Math.min(tax, 25000));
    }
    
    // Add 4% health and education cess
    tax += tax * 0.04;
    
    return Math.round(tax);
  } catch (error) {
    console.error('Error calculating tax:', error);
    return 0; // Return 0 in case of error
  }
};

/**
 * Main function to calculate taxes based on inputs
 * 
 * @param inputs - Tax calculation inputs
 * @returns Comprehensive tax results including comparison between regimes
 */
export const calculateTaxLiability = (inputs: TaxInputs): TaxResults => {
  try {
    // Validate inputs
    const validatedInputs = validateInputs(inputs);
    
    // Calculate gross total income
    const grossTotalIncome = 
      validatedInputs.basicSalary + 
      validatedInputs.hra + 
      validatedInputs.lta + 
      validatedInputs.otherAllowances + 
      validatedInputs.otherIncome;
    
    // Calculate exemptions and deductions for old regime
    const hraExemption = calculateHRAExemption(
      validatedInputs.basicSalary,
      validatedInputs.hra,
      validatedInputs.rentPaid,
      validatedInputs.cityType
    );
    const ltaExemption = Math.min(validatedInputs.lta, 75000); // Assuming LTA exemption limit
    
    // Capped deductions as per limits
    const section80C = Math.min(validatedInputs.section80C, MAX_80C);
    const section80D_self = Math.min(validatedInputs.section80D_self, MAX_80D_SELF);
    const section80D_parents = Math.min(validatedInputs.section80D_parents, MAX_80D_PARENTS);
    const homeLoanInterest = Math.min(validatedInputs.homeLoanInterest, MAX_HOME_LOAN_INTEREST);
    const npsDeduction = Math.min(validatedInputs.nps, MAX_NPS_ADDITIONAL);
    
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
  } catch (error) {
    console.error('Error calculating tax liability:', error);
    // Return a default tax result in case of error
    return {
      grossTotalIncome: 0,
      totalDeductions: 0,
      taxableIncome: 0,
      taxLiabilityOld: 0,
      taxLiabilityNew: 0,
      savings: 0,
      bestRegime: 'new' // Default to new regime in case of error
    };
  }
};

/**
 * Get investment recommendations based on current inputs
 * 
 * @param inputs - Tax calculation inputs
 * @returns Array of tax-saving recommendations
 */
export const getTaxSavingRecommendations = (inputs: TaxInputs): string[] => {
  try {
    const recommendations: string[] = [];
    
    // Recommend 80C investments if not fully utilized
    if (inputs.section80C < MAX_80C) {
      recommendations.push(`Consider investing ₹${(MAX_80C - inputs.section80C).toLocaleString()} more in Section 80C instruments like ELSS, PPF, or NPS.`);
    }
    
    // Recommend health insurance for self/family if not fully utilized
    if (inputs.section80D_self < MAX_80D_SELF) {
      recommendations.push(`You can claim up to ₹${(MAX_80D_SELF - inputs.section80D_self).toLocaleString()} more for health insurance premiums for self and family.`);
    }
    
    // Recommend health insurance for parents if not fully utilized
    if (inputs.section80D_parents < MAX_80D_PARENTS) {
      recommendations.push(`Consider getting health insurance for parents to claim additional deduction up to ₹${(MAX_80D_PARENTS - inputs.section80D_parents).toLocaleString()}.`);
    }
    
    // Recommend NPS if not fully utilized
    if (inputs.nps < MAX_NPS_ADDITIONAL) {
      recommendations.push(`Invest ₹${(MAX_NPS_ADDITIONAL - inputs.nps).toLocaleString()} more in NPS to get additional tax benefit under Section 80CCD(1B).`);
    }
    
    // If no specific recommendations, provide a general one
    if (recommendations.length === 0) {
      recommendations.push('You have optimized your tax deductions well. Consider consulting a tax professional for advanced strategies.');
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error generating tax saving recommendations:', error);
    return ['Please provide valid inputs to get personalized tax-saving recommendations.'];
  }
}; 