"use client";

import { useState, useCallback, useMemo } from 'react';
import { 
  TaxInputs,
  TaxResults,
  calculateTaxLiability,
  getTaxSavingRecommendations,
  MAX_80C,
  MAX_80D_SELF,
  MAX_80D_PARENTS,
  MAX_NPS_ADDITIONAL
} from '@/utils/taxCalculations';

// Tax brackets for new tax regime 2025 (hypothetical)
const NEW_TAX_REGIME = [
  { limit: 300000, rate: 0 },
  { limit: 600000, rate: 5 },
  { limit: 900000, rate: 10 },
  { limit: 1200000, rate: 15 },
  { limit: 1500000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

// Tax brackets for old tax regime 2025 (hypothetical)
const OLD_TAX_REGIME = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 5 },
  { limit: 1000000, rate: 20 },
  { limit: Infinity, rate: 30 },
];

// Maximum deduction limits
const MAX_HRA_PERCENT = 0.5; // 50% of basic salary

/**
 * TaxCalculator Component
 * 
 * A comprehensive tax calculation form that allows users to enter
 * their income and deduction details to compare tax liability under
 * old and new tax regimes of the Indian Tax System 2025.
 */
export default function TaxCalculator() {
  // State for form inputs
  const [inputs, setInputs] = useState<TaxInputs>({
    basicSalary: 0,
    hra: 0,
    lta: 0,
    otherAllowances: 0,
    rentPaid: 0,
    cityType: 'metro',
    section80C: 0,
    section80D_self: 0,
    section80D_parents: 0,
    nps: 0,
    otherIncome: 0,
    homeLoanInterest: 0
  });

  // State for calculation results and errors
  const [results, setResults] = useState<TaxResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * Handle input changes in form fields
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'cityType' ? value : Number(value) || 0 // Ensure numbers or default to 0
    }));
    
    // Clear any previous errors when user makes changes
    if (error) setError(null);
  }, [error]);

  /**
   * Calculate HRA exemption based on inputs
   */
  const calculateHRAExemption = useCallback(() => {
    const { basicSalary, hra, rentPaid, cityType } = inputs;
    
    // HRA exemption is minimum of:
    // 1. Actual HRA received
    // 2. Rent paid - 10% of basic salary
    // 3. 50% of basic salary for metro cities, 40% for non-metro
    
    const hraReceived = hra;
    const rentMinusBasic = Math.max(0, rentPaid - 0.1 * basicSalary);
    const percentOfBasic = cityType === 'metro' ? 0.5 * basicSalary : 0.4 * basicSalary;
    
    return Math.min(hraReceived, rentMinusBasic, percentOfBasic);
  }, [inputs]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setError(null);
    
    try {
      // Simulate API calculation delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const taxResults = calculateTaxLiability(inputs);
      setResults(taxResults);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while calculating taxes');
      console.error('Tax calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [inputs]);

  // Calculate tax saving recommendations based on inputs
  const taxSavingRecommendations = useMemo(() => {
    if (!results) return [];
    return getTaxSavingRecommendations(inputs);
  }, [results, inputs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary" id="calculator-heading">AI Tax Consultant - Indian Tax Regime 2025</h1>
      <p className="text-gray-600 mb-6">I'll help you legally minimize your taxes by finding the best deductions, exemptions, and investment strategies.</p>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">How I Can Help You</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Compare both tax regimes to find which one saves you more money</li>
            <li>Suggest personalized tax-saving investments based on your profile</li>
            <li>Identify all eligible deductions under Section 80C, 80D, and more</li>
            <li>Calculate optimum HRA exemptions based on your city and rent</li>
            <li>Provide step-by-step actions to legally minimize your tax liability</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} aria-labelledby="calculator-heading">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Income Details</h3>
              
              <div className="mb-4">
                <label htmlFor="basicSalary" className="block text-gray-700 mb-2">Basic Salary (₹)</label>
                <input
                  type="number"
                  id="basicSalary"
                  name="basicSalary"
                  value={inputs.basicSalary}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                  aria-describedby="basicSalary-help"
                />
                <p id="basicSalary-help" className="text-xs text-gray-500 mt-1">Enter your annual basic salary component</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="hra" className="block text-gray-700 mb-2">HRA Received (₹)</label>
                <input
                  type="number"
                  id="hra"
                  name="hra"
                  value={inputs.hra}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="lta" className="block text-gray-700 mb-2">LTA (₹)</label>
                <input
                  type="number"
                  id="lta"
                  name="lta"
                  value={inputs.lta}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="otherAllowances" className="block text-gray-700 mb-2">Other Allowances (₹)</label>
                <input
                  type="number"
                  id="otherAllowances"
                  name="otherAllowances"
                  value={inputs.otherAllowances}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="otherIncome" className="block text-gray-700 mb-2">Other Income (₹)</label>
                <input
                  type="number"
                  id="otherIncome"
                  name="otherIncome"
                  value={inputs.otherIncome}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="rentPaid" className="block text-gray-700 mb-2">Rent Paid (₹)</label>
                <input
                  type="number"
                  id="rentPaid"
                  name="rentPaid"
                  value={inputs.rentPaid}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="cityType" className="block text-gray-700 mb-2">City Type</label>
                <select
                  id="cityType"
                  name="cityType"
                  value={inputs.cityType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="metro">Metro City</option>
                  <option value="non-metro">Non-Metro City</option>
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-secondary">Deductions & Exemptions</h3>
              
              <div className="mb-4">
                <label htmlFor="section80C" className="block text-gray-700 mb-2">Section 80C (₹) - Max {MAX_80C.toLocaleString()}</label>
                <input
                  type="number"
                  id="section80C"
                  name="section80C"
                  value={inputs.section80C}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                  max={MAX_80C}
                />
                <p className="text-sm text-gray-500 mt-1">Includes PPF, ELSS, EPF, NPS, Tax-saving FDs</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="section80D_self" className="block text-gray-700 mb-2">Section 80D - Self & Family (₹) - Max {MAX_80D_SELF.toLocaleString()}</label>
                <input
                  type="number"
                  id="section80D_self"
                  name="section80D_self"
                  value={inputs.section80D_self}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                  max={MAX_80D_SELF}
                />
                <p className="text-sm text-gray-500 mt-1">Health insurance premiums for yourself and family</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="section80D_parents" className="block text-gray-700 mb-2">Section 80D - Parents (₹) - Max {MAX_80D_PARENTS.toLocaleString()}</label>
                <input
                  type="number"
                  id="section80D_parents"
                  name="section80D_parents"
                  value={inputs.section80D_parents}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                  max={MAX_80D_PARENTS}
                />
                <p className="text-sm text-gray-500 mt-1">Health insurance premiums for parents (₹50,000 for senior citizens)</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="nps" className="block text-gray-700 mb-2">NPS Additional (₹) - Max {MAX_NPS_ADDITIONAL.toLocaleString()}</label>
                <input
                  type="number"
                  id="nps"
                  name="nps"
                  value={inputs.nps}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                  max={MAX_NPS_ADDITIONAL}
                />
                <p className="text-sm text-gray-500 mt-1">Additional NPS contribution under Section 80CCD(1B)</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="homeLoanInterest" className="block text-gray-700 mb-2">Home Loan Interest (₹) - Max 2,00,000</label>
                <input
                  type="number"
                  id="homeLoanInterest"
                  name="homeLoanInterest"
                  value={inputs.homeLoanInterest}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none"
                  min="0"
                  max={200000}
                />
                <p className="text-sm text-gray-500 mt-1">Interest paid on home loan under Section 24(b)</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className={`px-6 py-3 rounded-lg font-medium transition ${
                isCalculating 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
              disabled={isCalculating}
              aria-busy={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate My Tax Savings'}
            </button>
          </div>
        </form>
      </div>
      
      {showResults && results && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8" aria-live="polite">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Your Personalized Tax Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <dl className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <dt>Gross Total Income:</dt>
                  <dd className="font-semibold">₹{results.grossTotalIncome.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt>Total Deductions:</dt>
                  <dd className="font-semibold">₹{results.totalDeductions.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt>Taxable Income:</dt>
                  <dd className="font-semibold">₹{results.taxableIncome.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <dl className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <dt>Tax (Old Regime):</dt>
                  <dd className="font-semibold">₹{results.taxLiabilityOld.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt>Tax (New Regime):</dt>
                  <dd className="font-semibold">₹{results.taxLiabilityNew.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between py-2 border-b text-green-600">
                  <dt>You Save:</dt>
                  <dd className="font-semibold">₹{results.savings.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-primary mb-2">Tax Expert Recommendation</h3>
            <p className="mb-3">
              Based on your financial profile, the <span className="font-bold text-blue-700">{results.bestRegime === 'old' ? 'Old' : 'New'} Tax Regime</span> is 
              better for you, saving you <span className="font-bold text-green-600">₹{results.savings.toLocaleString()}</span> in taxes.
            </p>
            
            {/* Special note for income under 7L in new regime */}
            {results.bestRegime === 'new' && results.grossTotalIncome <= 700000 && (
              <div className="bg-green-100 p-3 rounded-lg mb-3 border-l-4 border-green-500">
                <p className="font-semibold text-green-800">
                  Good news! Under the New Regime, you qualify for the Section 87A rebate. Your tax liability is ZERO!
                </p>
              </div>
            )}
            
            {results.bestRegime === 'old' && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Personalized Tax Saving Recommendations:</h4>
                <ul className="list-disc pl-5 space-y-2" role="list">
                  {taxSavingRecommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-800">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.bestRegime === 'new' && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">New Tax Regime Insights:</h4>
                <p className="mb-2">Under the new tax regime, most deductions aren't available, but you benefit from lower tax rates and simplified compliance.</p>
                <ul className="list-disc pl-5 space-y-1" role="list">
                  <li>No need to make tax-saving investments</li>
                  <li>Simplified tax filing with fewer deductions to track</li>
                  <li>Lower tax rates compensate for the lack of deductions</li>
                  {inputs.basicSalary > 500000 && inputs.basicSalary < 1500000 && (
                    <li className="text-blue-700 font-semibold">You fall in the income bracket where the New Regime often benefits salaried employees</li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-blue-200">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Review your current investments and adjust based on recommendations</li>
                <li>Consult with your employer about salary structure optimization</li>
                <li>Update your tax declaration form with HR department</li>
                <li>Keep all receipts and proofs for deductions claimed</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 