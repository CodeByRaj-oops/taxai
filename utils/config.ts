/**
 * Configuration utility for accessing environment variables with type safety
 * Provides defaults in case environment variables are not set
 */

// Application settings
export const APP_NAME = process.env.APP_NAME || 'TaxSage India';
export const APP_VERSION = process.env.APP_VERSION || '1.0.0';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Tax system configuration
export const TAX_YEAR = parseInt(process.env.TAX_YEAR || '2025');
export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'INR';

// Feature flags
export const ENABLE_BETA_FEATURES = process.env.ENABLE_BETA_FEATURES === 'true';
export const ENABLE_EXPORT_PDF = process.env.ENABLE_EXPORT_PDF === 'true';
export const ENABLE_COMPARISON_CHARTS = process.env.ENABLE_COMPARISON_CHARTS === 'true';
export const ENABLE_TAX_OPTIMIZER = process.env.ENABLE_TAX_OPTIMIZER === 'true';
export const ENABLE_RECOMMENDATIONS = process.env.ENABLE_RECOMMENDATIONS === 'true';

// Tax deduction limits
export const MAX_80C_LIMIT = parseInt(process.env.MAX_80C_LIMIT || '150000');
export const MAX_80D_SELF_LIMIT = parseInt(process.env.MAX_80D_SELF_LIMIT || '25000');
export const MAX_80D_PARENTS_LIMIT = parseInt(process.env.MAX_80D_PARENTS_LIMIT || '50000');
export const MAX_NPS_ADDITIONAL = parseInt(process.env.MAX_NPS_ADDITIONAL || '50000');
export const MAX_HOME_LOAN_INTEREST = parseInt(process.env.MAX_HOME_LOAN_INTEREST || '200000');
export const STANDARD_DEDUCTION = parseInt(process.env.STANDARD_DEDUCTION || '50000');

// HRA calculation settings
export const HRA_METRO_PERCENTAGE = parseFloat(process.env.HRA_METRO_PERCENTAGE || '0.5');
export const HRA_NON_METRO_PERCENTAGE = parseFloat(process.env.HRA_NON_METRO_PERCENTAGE || '0.4');

// Rebate settings
export const MAX_REBATE_AMOUNT = parseInt(process.env.MAX_REBATE_AMOUNT || '25000');
export const REBATE_INCOME_LIMIT = parseInt(process.env.REBATE_INCOME_LIMIT || '700000');

// OpenAI integration
export const ENABLE_OPENAI_INTEGRATION = process.env.ENABLE_OPENAI_INTEGRATION === 'true';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// Currency formatter
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    maximumFractionDigits: 0
  }).format(amount);
};

// Validation helper
export const isConfigValid = (): boolean => {
  if (ENABLE_OPENAI_INTEGRATION && !OPENAI_API_KEY) {
    console.warn('OpenAI integration is enabled but API key is missing');
    return false;
  }
  return true;
};

// Export configuration object for easy access
export const config = {
  app: {
    name: APP_NAME,
    version: APP_VERSION,
    environment: NODE_ENV,
    isProduction: IS_PRODUCTION,
    baseUrl: BASE_URL
  },
  tax: {
    year: TAX_YEAR,
    currency: DEFAULT_CURRENCY,
    limits: {
      section80C: MAX_80C_LIMIT,
      section80D_self: MAX_80D_SELF_LIMIT,
      section80D_parents: MAX_80D_PARENTS_LIMIT,
      npsAdditional: MAX_NPS_ADDITIONAL,
      homeLoanInterest: MAX_HOME_LOAN_INTEREST,
      standardDeduction: STANDARD_DEDUCTION
    },
    hra: {
      metroPercentage: HRA_METRO_PERCENTAGE,
      nonMetroPercentage: HRA_NON_METRO_PERCENTAGE
    },
    rebate: {
      maxAmount: MAX_REBATE_AMOUNT,
      incomeLimit: REBATE_INCOME_LIMIT
    }
  },
  features: {
    betaFeatures: ENABLE_BETA_FEATURES,
    exportPdf: ENABLE_EXPORT_PDF,
    comparisonCharts: ENABLE_COMPARISON_CHARTS,
    taxOptimizer: ENABLE_TAX_OPTIMIZER,
    recommendations: ENABLE_RECOMMENDATIONS,
    openAiIntegration: ENABLE_OPENAI_INTEGRATION
  },
  formatCurrency,
  isConfigValid
}; 