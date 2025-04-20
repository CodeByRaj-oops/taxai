/**
 * Tax Calculator Controller
 * Handles tax calculations for both old and new tax regimes
 */

const { ApiError } = require('../middleware/error.middleware');
const { getRedisClient } = require('../config/database');

// Constants for tax calculation
const TAX_SLABS_OLD_REGIME = [
  { maxIncome: 250000, rate: 0 },
  { maxIncome: 500000, rate: 0.05 },
  { maxIncome: 1000000, rate: 0.2 },
  { maxIncome: Infinity, rate: 0.3 }
];

const TAX_SLABS_NEW_REGIME = [
  { maxIncome: 300000, rate: 0 },
  { maxIncome: 600000, rate: 0.05 },
  { maxIncome: 900000, rate: 0.1 },
  { maxIncome: 1200000, rate: 0.15 },
  { maxIncome: 1500000, rate: 0.2 },
  { maxIncome: Infinity, rate: 0.3 }
];

// Deduction limits for old regime
const DEDUCTION_LIMITS = {
  section80C: 150000,
  section80D: 75000,
  nps: 50000,
  housingLoan: 200000,
  standardDeduction: 50000
};

/**
 * Calculate tax for old regime (with deductions)
 * @param {Object} financialData - User's financial data
 * @returns {Object} Calculated tax details
 */
const calculateOldRegimeTax = (financialData) => {
  let {
    salary = 0,
    rentIncome = 0,
    businessIncome = 0,
    otherIncome = 0,
    deductions = {}
  } = financialData;

  // Calculate gross income
  const grossIncome = salary + rentIncome + businessIncome + otherIncome;
  
  // Apply standard deduction for salaried individuals
  let totalDeductions = salary > 0 ? DEDUCTION_LIMITS.standardDeduction : 0;
  
  // Apply house rent allowance if applicable
  if (deductions.hra) {
    // Simplified HRA calculation for demo purposes
    const hraDeduction = Math.min(
      deductions.hra,
      salary * 0.1 // 10% of salary for demo purpose
    );
    totalDeductions += hraDeduction;
  }
  
  // Apply other section 80C deductions
  const section80CDeductions = 
    (deductions.section80C || 0) + 
    (deductions.ppf || 0) + 
    (deductions.elss || 0) + 
    (deductions.lifeInsurance || 0);
  
  totalDeductions += Math.min(section80CDeductions, DEDUCTION_LIMITS.section80C);
  
  // Apply health insurance premium deduction (section 80D)
  const healthInsuranceDeduction = deductions.healthInsurance || 0;
  totalDeductions += Math.min(healthInsuranceDeduction, DEDUCTION_LIMITS.section80D);
  
  // Apply NPS deduction (additional to 80C)
  const npsDeduction = deductions.nps || 0;
  totalDeductions += Math.min(npsDeduction, DEDUCTION_LIMITS.nps);
  
  // Apply housing loan interest deduction
  const housingLoanDeduction = deductions.housingLoan || 0;
  totalDeductions += Math.min(housingLoanDeduction, DEDUCTION_LIMITS.housingLoan);
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  // Calculate tax based on slabs
  let tax = 0;
  let previousSlab = 0;
  
  for (const slab of TAX_SLABS_OLD_REGIME) {
    if (taxableIncome > previousSlab) {
      const slabIncome = Math.min(taxableIncome, slab.maxIncome) - previousSlab;
      tax += slabIncome * slab.rate;
    }
    previousSlab = slab.maxIncome;
  }
  
  // Calculate cess (4% of tax)
  const cess = tax * 0.04;
  
  // Total tax liability
  const totalTax = tax + cess;
  
  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    tax,
    cess,
    totalTax,
    regime: 'old'
  };
};

/**
 * Calculate tax for new regime (with minimal deductions)
 * @param {Object} financialData - User's financial data
 * @returns {Object} Calculated tax details
 */
const calculateNewRegimeTax = (financialData) => {
  let {
    salary = 0,
    rentIncome = 0,
    businessIncome = 0,
    otherIncome = 0
  } = financialData;

  // Calculate gross income
  const grossIncome = salary + rentIncome + businessIncome + otherIncome;
  
  // Apply minimal standard deduction
  const standardDeduction = salary > 0 ? 50000 : 0;
  
  // Calculate taxable income (new regime has very limited deductions)
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);
  
  // Calculate tax based on slabs
  let tax = 0;
  let previousSlab = 0;
  
  for (const slab of TAX_SLABS_NEW_REGIME) {
    if (taxableIncome > previousSlab) {
      const slabIncome = Math.min(taxableIncome, slab.maxIncome) - previousSlab;
      tax += slabIncome * slab.rate;
    }
    previousSlab = slab.maxIncome;
  }
  
  // Calculate cess (4% of tax)
  const cess = tax * 0.04;
  
  // Total tax liability
  const totalTax = tax + cess;
  
  return {
    grossIncome,
    totalDeductions: standardDeduction,
    taxableIncome,
    tax,
    cess,
    totalTax,
    regime: 'new'
  };
};

/**
 * Calculate tax for both regimes and recommend the better option
 * @route POST /api/tax/calculate
 * @access Private
 */
exports.calculateTax = async (req, res, next) => {
  try {
    const financialData = req.body;
    
    // Basic validation
    if (!financialData) {
      return next(new ApiError('Financial data is required', 400));
    }
    
    // Check cache if available
    const redisClient = getRedisClient();
    let result;
    
    if (redisClient) {
      // Create a cache key based on financial data
      const cacheKey = `tax:${JSON.stringify(financialData)}`;
      const cachedResult = await redisClient.get(cacheKey);
      
      if (cachedResult) {
        result = JSON.parse(cachedResult);
      } else {
        // Calculate taxes if not in cache
        const oldRegimeTax = calculateOldRegimeTax(financialData);
        const newRegimeTax = calculateNewRegimeTax(financialData);
        
        // Determine better regime
        const recommendation = oldRegimeTax.totalTax <= newRegimeTax.totalTax ? 'old' : 'new';
        const savings = Math.abs(oldRegimeTax.totalTax - newRegimeTax.totalTax);
        
        result = {
          oldRegime: oldRegimeTax,
          newRegime: newRegimeTax,
          recommendation,
          savings
        };
        
        // Cache result for 1 day
        await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 86400);
      }
    } else {
      // Calculate without caching if Redis is not available
      const oldRegimeTax = calculateOldRegimeTax(financialData);
      const newRegimeTax = calculateNewRegimeTax(financialData);
      
      // Determine better regime
      const recommendation = oldRegimeTax.totalTax <= newRegimeTax.totalTax ? 'old' : 'new';
      const savings = Math.abs(oldRegimeTax.totalTax - newRegimeTax.totalTax);
      
      result = {
        oldRegime: oldRegimeTax,
        newRegime: newRegimeTax,
        recommendation,
        savings
      };
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get tax slab information
 * @route GET /api/tax/slabs
 * @access Public
 */
exports.getTaxSlabs = async (req, res) => {
  const regime = req.query.regime || 'both';
  
  let data = {};
  
  if (regime === 'old' || regime === 'both') {
    data.oldRegime = {
      slabs: TAX_SLABS_OLD_REGIME,
      deductionLimits: DEDUCTION_LIMITS
    };
  }
  
  if (regime === 'new' || regime === 'both') {
    data.newRegime = {
      slabs: TAX_SLABS_NEW_REGIME
    };
  }
  
  res.status(200).json({
    success: true,
    data
  });
}; 