export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">About Indian Tax Regime 2025</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Overview</h2>
        <p className="mb-4">
          The Indian Tax System in 2025 continues to operate with two optional tax regimes – the Old Regime and the New Regime. 
          Taxpayers can choose whichever is more beneficial for their specific financial situation.
        </p>
        <p className="mb-4">
          This application helps you analyze your income, investments, and expenses to determine which tax regime would result 
          in lower tax liability and suggests optimal tax-saving strategies based on your financial profile.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-secondary">Key Features of Tax Regimes</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Old Tax Regime</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Higher tax rates compared to the new regime</li>
              <li>Multiple exemptions and deductions available</li>
              <li>Benefits those with significant eligible investments</li>
              <li>Allows House Rent Allowance (HRA) exemption</li>
              <li>Allows Leave Travel Allowance (LTA) exemption</li>
              <li>Deductions under various sections (80C, 80D, etc.)</li>
              <li>Home loan interest deduction of up to ₹2,00,000</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">New Tax Regime</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Lower tax rates with more slabs</li>
              <li>Very limited exemptions and deductions</li>
              <li>Basic standard deduction of ₹50,000</li>
              <li>No HRA or LTA exemptions</li>
              <li>No deductions under Section 80C, 80D, etc.</li>
              <li>No home loan interest deduction</li>
              <li>Simpler tax calculation with fewer complexities</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-accent">Major Tax-Saving Instruments</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Section 80C Instruments (Up to ₹1,50,000)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Public Provident Fund (PPF)</h4>
                <p className="text-sm text-gray-600">Long-term savings with tax-free interest and 15-year lock-in period.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Equity Linked Saving Scheme (ELSS)</h4>
                <p className="text-sm text-gray-600">Tax-saving mutual funds with potential for high returns and 3-year lock-in.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-1">National Pension System (NPS)</h4>
                <p className="text-sm text-gray-600">Retirement scheme with additional tax benefits under Section 80CCD(1B).</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Tax Saving Fixed Deposits</h4>
                <p className="text-sm text-gray-600">Bank deposits with 5-year lock-in period and guaranteed returns.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Life Insurance Premiums</h4>
                <p className="text-sm text-gray-600">Premiums paid for life insurance policies for self, spouse, and children.</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold mb-1">Unit Linked Insurance Plans (ULIPs)</h4>
                <p className="text-sm text-gray-600">Combined investment and insurance products with tax benefits.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Health Insurance (Section 80D)</h3>
            <p className="mb-2">
              Deduction for health insurance premiums paid for self, family, and parents:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Up to ₹25,000 for self and family</li>
              <li>Additional ₹25,000 for parents below 60 years</li>
              <li>Additional ₹50,000 for senior citizen parents (above 60 years)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">House Rent Allowance (HRA)</h3>
            <p className="mb-2">
              Exemption for rent paid, calculated as the minimum of:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Actual HRA received</li>
              <li>Rent paid minus 10% of basic salary</li>
              <li>50% of basic salary (for metro cities) or 40% of basic salary (for non-metro cities)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Home Loan Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Interest on home loan up to ₹2,00,000 under Section 24</li>
              <li>Principal repayment under Section 80C (within overall limit of ₹1,50,000)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Tax Planning Tips</h2>
        
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <p className="font-semibold">Start Early:</p>
            <p className="text-gray-600">Begin tax planning at the start of the financial year rather than waiting until the last quarter.</p>
          </li>
          <li>
            <p className="font-semibold">Max Out Section 80C:</p>
            <p className="text-gray-600">Fully utilize the ₹1,50,000 limit under Section 80C through a mix of ELSS, PPF, and insurance premiums.</p>
          </li>
          <li>
            <p className="font-semibold">Health Insurance for All:</p>
            <p className="text-gray-600">Ensure health coverage for yourself, family, and parents to maximize Section 80D benefits.</p>
          </li>
          <li>
            <p className="font-semibold">Additional NPS Investment:</p>
            <p className="text-gray-600">Invest up to ₹50,000 in NPS for additional tax benefits under Section 80CCD(1B), over and above the 80C limit.</p>
          </li>
          <li>
            <p className="font-semibold">House Rent Receipts:</p>
            <p className="text-gray-600">Maintain proper rent receipts and rental agreements if claiming HRA exemption.</p>
          </li>
          <li>
            <p className="font-semibold">Compare Both Regimes:</p>
            <p className="text-gray-600">Calculate tax liability under both regimes before deciding which one to opt for.</p>
          </li>
          <li>
            <p className="font-semibold">Professional Advice:</p>
            <p className="text-gray-600">Consult with a tax professional for personalized strategies based on your specific financial situation.</p>
          </li>
        </ol>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 italic">
        <p>Note: The tax information provided here is based on the Indian Tax Regime as of 2025. Tax laws are subject to change. This information is for general guidance only and should not be considered as legal or financial advice.</p>
      </div>
    </div>
  );
} 