"use client";

import { useState } from 'react';
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

export default function TaxCalculator() {
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

  const [results, setResults] = useState<TaxResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: name === 'cityType' ? value : Number(value)
    });
  };

  const calculateHRAExemption = () => {
    const { basicSalary, hra, rentPaid, cityType } = inputs;
    
    // HRA exemption is minimum of:
    // 1. Actual HRA received
    // 2. Rent paid - 10% of basic salary
    // 3. 50% of basic salary for metro cities, 40% for non-metro
    
    const hraReceived = hra;
    const rentMinusBasic = Math.max(0, rentPaid - 0.1 * basicSalary);
    const percentOfBasic = cityType === 'metro' ? 0.5 * basicSalary : 0.4 * basicSalary;
    
    return Math.min(hraReceived, rentMinusBasic, percentOfBasic);
  };

  const calculateTax = (income: number, brackets: typeof NEW_TAX_REGIME) => {
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

  const calculateTaxes = () => {
    // Calculate gross total income
    const grossTotalIncome = 
      inputs.basicSalary + 
      inputs.hra + 
      inputs.lta + 
      inputs.otherAllowances + 
      inputs.otherIncome;
    
    // Calculate exemptions and deductions for old regime
    const hraExemption = calculateHRAExemption();
    const ltaExemption = Math.min(inputs.lta, 75000); // Assuming LTA exemption limit
    
    // Capped deductions as per limits
    const section80C = Math.min(inputs.section80C, MAX_80C);
    const section80D_self = Math.min(inputs.section80D_self, MAX_80D_SELF);
    const section80D_parents = Math.min(inputs.section80D_parents, MAX_80D_PARENTS);
    const homeLoanInterest = Math.min(inputs.homeLoanInterest, 200000);
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
    // Assuming only standard deduction of 50,000 in new regime
    const standardDeduction = 50000;
    const taxableIncomeNew = Math.max(0, grossTotalIncome - standardDeduction);
    
    // Calculate tax liability
    const taxLiabilityOld = calculateTax(taxableIncomeOld, OLD_TAX_REGIME);
    const taxLiabilityNew = calculateTax(taxableIncomeNew, NEW_TAX_REGIME);
    
    // Determine which regime is better
    const savings = Math.max(taxLiabilityNew - taxLiabilityOld, taxLiabilityOld - taxLiabilityNew);
    const bestRegime = taxLiabilityOld <= taxLiabilityNew ? 'old' : 'new';
    
    setResults({
      grossTotalIncome,
      totalDeductions,
      taxableIncome: bestRegime === 'old' ? taxableIncomeOld : taxableIncomeNew,
      taxLiabilityOld,
      taxLiabilityNew,
      savings,
      bestRegime
    });
    
    setShowResults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taxResults = calculateTaxLiability(inputs);
    setResults(taxResults);
    setShowResults(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">Tax Calculator 2025</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">Income Details</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Basic Salary (₹)</label>
                <input
                  type="number"
                  name="basicSalary"
                  value={inputs.basicSalary}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">HRA Received (₹)</label>
                <input
                  type="number"
                  name="hra"
                  value={inputs.hra}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">LTA (₹)</label>
                <input
                  type="number"
                  name="lta"
                  value={inputs.lta}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Other Allowances (₹)</label>
                <input
                  type="number"
                  name="otherAllowances"
                  value={inputs.otherAllowances}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Other Income (₹)</label>
                <input
                  type="number"
                  name="otherIncome"
                  value={inputs.otherIncome}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rent Paid (₹)</label>
                <input
                  type="number"
                  name="rentPaid"
                  value={inputs.rentPaid}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">City Type</label>
                <select
                  name="cityType"
                  value={inputs.cityType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="metro">Metro City</option>
                  <option value="non-metro">Non-Metro City</option>
                </select>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-secondary">Deductions & Exemptions</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Section 80C (₹) - Max {MAX_80C.toLocaleString()}</label>
                <input
                  type="number"
                  name="section80C"
                  value={inputs.section80C}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  max={MAX_80C}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Section 80D - Self & Family (₹) - Max {MAX_80D_SELF.toLocaleString()}</label>
                <input
                  type="number"
                  name="section80D_self"
                  value={inputs.section80D_self}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  max={MAX_80D_SELF}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Section 80D - Parents (₹) - Max {MAX_80D_PARENTS.toLocaleString()}</label>
                <input
                  type="number"
                  name="section80D_parents"
                  value={inputs.section80D_parents}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  max={MAX_80D_PARENTS}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">NPS Additional (₹) - Max {MAX_NPS_ADDITIONAL.toLocaleString()}</label>
                <input
                  type="number"
                  name="nps"
                  value={inputs.nps}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  max={MAX_NPS_ADDITIONAL}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Home Loan Interest (₹) - Max 2,00,000</label>
                <input
                  type="number"
                  name="homeLoanInterest"
                  value={inputs.homeLoanInterest}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  max={200000}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
            >
              Calculate Tax
            </button>
          </div>
        </form>
      </div>
      
      {showResults && results && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Tax Calculation Results</h2>
          
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
            <h3 className="text-xl font-semibold text-primary mb-2">Recommendation</h3>
            <p>
              Based on your inputs, the <span className="font-bold">{results.bestRegime === 'old' ? 'Old' : 'New'} Tax Regime</span> is 
              better for you, saving you ₹{results.savings.toLocaleString()} in taxes.
            </p>
            
            {results.bestRegime === 'old' && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Tax Saving Recommendations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {inputs.section80C < MAX_80C && (
                    <li>Consider investing ₹{(MAX_80C - inputs.section80C).toLocaleString()} more in Section 80C instruments like ELSS, PPF, or NPS.</li>
                  )}
                  {inputs.section80D_self < MAX_80D_SELF && (
                    <li>You can claim up to ₹{(MAX_80D_SELF - inputs.section80D_self).toLocaleString()} more for health insurance premiums for self and family.</li>
                  )}
                  {inputs.section80D_parents < MAX_80D_PARENTS && (
                    <li>Consider getting health insurance for parents to claim additional deduction up to ₹{(MAX_80D_PARENTS - inputs.section80D_parents).toLocaleString()}.</li>
                  )}
                  {inputs.nps < MAX_NPS_ADDITIONAL && (
                    <li>Invest ₹{(MAX_NPS_ADDITIONAL - inputs.nps).toLocaleString()} more in NPS to get additional tax benefit under Section 80CCD(1B).</li>
                  )}
                </ul>
              </div>
            )}
            
            {results.bestRegime === 'new' && (
              <div className="mt-4">
                <p>Under the new tax regime, most deductions aren't available, but you benefit from lower tax rates.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 