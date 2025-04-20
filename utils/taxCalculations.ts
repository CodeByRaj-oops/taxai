/**
 * Tax Calculation Utility Module
 * 
 * This module provides comprehensive tax calculation functions for the Indian Tax Regime 2025.
 * It includes tax brackets, deduction limits, calculation logic for both old and new tax regimes,
 * and utility functions for tax optimization recommendations.
 * 
 * @module taxCalculations
 */

// Essential tax calculation utilities

// Tax brackets for new tax regime 2025
export const NEW_TAX_BRACKETS = [
  { limit: 300000, rate: 0 },
  { limit: 600000, rate: 5 },
  { limit: 900000, rate: 10 },
  { limit: 1200000, rate: 15 },
  { limit: 1500000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

// Tax brackets for old tax regime 2025
export const OLD_TAX_BRACKETS = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 5 },
  { limit: 1000000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

// Maximum deduction limits as per Income Tax Act
export const MAX_80C = 150000;
export const MAX_80D_SELF = 25000;
export const MAX_80D_PARENTS = 50000;
export const MAX_HRA_PERCENT_METRO = 0.5;
export const MAX_HRA_PERCENT_NON_METRO = 0.4;
export const MAX_NPS_ADDITIONAL = 50000;
export const MAX_HOME_LOAN_INTEREST = 200000;
export const STANDARD_DEDUCTION = 50000;

// Tax calculation input interface
export interface TaxCalculationInput {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  lta: number;
  otherIncome: number;
  rentPaid: number;
  cityType: 'metro' | 'non-metro';
  section80C: number;
  section80D_self: number;
  section80D_parents: number;
  nps: number;
  homeLoanInterest: number;
}

export interface TaxResult {
  oldRegime: {
    taxableIncome: number;
    taxAmount: number;
    inHandAmount: number;
  };
  newRegime: {
    taxableIncome: number;
    taxAmount: number;
    inHandAmount: number;
  };
  bestRegime: 'old' | 'new';
  totalSavings: number;
}

// Default tax calculation inputs
export const defaultTaxInput: TaxCalculationInput = {
  basicSalary: 800000,
  hra: 400000,
  specialAllowance: 300000,
  lta: 0,
  otherIncome: 0,
  rentPaid: 240000,
  cityType: 'metro',
  section80C: 150000,
  section80D_self: 25000,
  section80D_parents: 0,
  nps: 50000,
  homeLoanInterest: 0,
};

// Validate and normalize inputs
export function validateInputs(input: Partial<TaxCalculationInput>): TaxCalculationInput {
  const validatedInput = { ...defaultTaxInput };
  
  for (const key in input) {
    if (input.hasOwnProperty(key) && key in defaultTaxInput) {
      if (typeof input[key as keyof TaxCalculationInput] === 'number') {
        (validatedInput as any)[key] = Math.max(0, input[key as keyof TaxCalculationInput] as number);
      } else if (key === 'cityType' && (input.cityType === 'metro' || input.cityType === 'non-metro')) {
        validatedInput.cityType = input.cityType;
      }
    }
  }
  
  return validatedInput;
}

// Calculate HRA exemption
export function calculateHRAExemption(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  cityType: 'metro' | 'non-metro'
): number {
  try {
    const maxHRAPercent = cityType === 'metro' ? MAX_HRA_PERCENT_METRO : MAX_HRA_PERCENT_NON_METRO;
    
    const exemption1 = hraReceived;
    const exemption2 = rentPaid - (0.1 * basicSalary);
    const exemption3 = basicSalary * maxHRAPercent;
    
    return Math.max(0, Math.min(exemption1, exemption2, exemption3));
  } catch (error) {
    return 0;
  }
}

// Calculate tax for a given income and tax brackets
export function calculateTax(
  taxableIncome: number,
  taxBrackets: { limit: number; rate: number }[],
  isNewRegime: boolean = false
): number {
  try {
    if (taxableIncome <= 0) return 0;
    
    let tax = 0;
    let remainingIncome = taxableIncome;
    
    for (let i = 0; i < taxBrackets.length; i++) {
      const { limit, rate } = taxBrackets[i];
      const prevLimit = i === 0 ? 0 : taxBrackets[i - 1].limit;
      const bracketIncome = Math.min(remainingIncome, limit - prevLimit);
      
      if (bracketIncome <= 0) break;
      
      tax += bracketIncome * (rate / 100);
      remainingIncome -= bracketIncome;
      
      if (remainingIncome <= 0) break;
    }
    
    // Apply Section 87A rebate if applicable (for new regime only)
    if (isNewRegime && taxableIncome <= 700000) {
      tax = Math.max(0, tax - 25000);
    }
    
    // Add 4% health and education cess
    tax = tax * 1.04;
    
    return Math.round(tax);
  } catch (error) {
    return 0;
  }
}

// Main tax calculation function
export function calculateTaxLiability(inputs: Partial<TaxCalculationInput> = {}): TaxResult {
  try {
    const validatedInputs = validateInputs(inputs);
    
    // Calculate gross total income
    const grossSalary = 
      validatedInputs.basicSalary + 
      validatedInputs.hra + 
      validatedInputs.specialAllowance +
      validatedInputs.lta;
    
    const grossIncome = grossSalary + validatedInputs.otherIncome;
    
    // Calculate exemptions and deductions for old regime
    const hraExemption = calculateHRAExemption(
      validatedInputs.basicSalary,
      validatedInputs.hra,
      validatedInputs.rentPaid,
      validatedInputs.cityType
    );
    
    const ltaExemption = Math.min(validatedInputs.lta, 75000);
    
    // Capped deductions as per limits
    const section80C = Math.min(validatedInputs.section80C, MAX_80C);
    const section80D_self = Math.min(validatedInputs.section80D_self, MAX_80D_SELF);
    const section80D_parents = Math.min(validatedInputs.section80D_parents, MAX_80D_PARENTS);
    const nps = Math.min(validatedInputs.nps, MAX_NPS_ADDITIONAL);
    const homeLoanInterest = Math.min(validatedInputs.homeLoanInterest, MAX_HOME_LOAN_INTEREST);
    
    // Total deductions under old regime
    const totalDeductions = 
      section80C + 
      section80D_self + 
      section80D_parents + 
      nps + 
      homeLoanInterest;
    
    // Taxable income under old regime
    const oldRegimeTaxableIncome = Math.max(0, grossIncome - hraExemption - ltaExemption - totalDeductions);
    
    // Taxable income under new regime (fewer deductions)
    const newRegimeTaxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);
    
    // Calculate tax liability
    const oldRegimeTax = calculateTax(oldRegimeTaxableIncome, OLD_TAX_BRACKETS);
    const newRegimeTax = calculateTax(newRegimeTaxableIncome, NEW_TAX_BRACKETS, true);
    
    // Determine which regime is better
    const bestRegime = oldRegimeTax <= newRegimeTax ? 'old' : 'new';
    const savings = Math.abs(oldRegimeTax - newRegimeTax);
    
    return {
      oldRegime: {
        taxableIncome: oldRegimeTaxableIncome,
        taxAmount: oldRegimeTax,
        inHandAmount: grossIncome - oldRegimeTax,
      },
      newRegime: {
        taxableIncome: newRegimeTaxableIncome,
        taxAmount: newRegimeTax,
        inHandAmount: grossIncome - newRegimeTax,
      },
      bestRegime,
      totalSavings: savings,
    };
  } catch (error) {
    return {
      oldRegime: { taxableIncome: 0, taxAmount: 0, inHandAmount: 0 },
      newRegime: { taxableIncome: 0, taxAmount: 0, inHandAmount: 0 },
      bestRegime: 'new',
      totalSavings: 0,
    };
  }
}

// Generate tax-saving recommendations
export function generateTaxSavingRecommendations(inputs: TaxCalculationInput): string[] {
  const recommendations: string[] = [];
  
  if (inputs.section80C < MAX_80C) {
    recommendations.push(`Consider investing ₹${MAX_80C - inputs.section80C} more in Section 80C instruments like PPF, ELSS, or NPS.`);
  }
  
  if (inputs.section80D_self < MAX_80D_SELF) {
    recommendations.push(`You can save up to ₹${MAX_80D_SELF - inputs.section80D_self} more in tax by getting a health insurance policy for yourself and family.`);
  }
  
  if (inputs.section80D_parents < MAX_80D_PARENTS) {
    recommendations.push(`Consider getting a health insurance policy for your parents to claim an additional deduction of up to ₹${MAX_80D_PARENTS}.`);
  }
  
  if (inputs.nps < MAX_NPS_ADDITIONAL) {
    recommendations.push(`Investing in NPS can give you an additional tax benefit of up to ₹${MAX_NPS_ADDITIONAL} under Section 80CCD(1B).`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push("You're already optimizing your tax savings quite well! Consider consulting a tax professional for advanced strategies.");
  }
  
  return recommendations;
} 