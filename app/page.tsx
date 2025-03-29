export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-primary">Indian Tax Consultation System 2025</h1>
        <p className="text-lg mb-4">
          Get personalized tax-saving strategies based on the latest Indian Tax Regime. Optimize your tax liability legally with our expert analysis.
        </p>
        <div className="flex gap-4 mt-6">
          <a 
            href="/calculator" 
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition"
          >
            Calculate Your Tax
          </a>
          <a 
            href="/about" 
            className="bg-white border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
          <h2 className="text-xl font-semibold mb-3">Tax Calculation</h2>
          <p>Comprehensive analysis of your income, deductions, and tax liability under both old and new tax regimes.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-secondary">
          <h2 className="text-xl font-semibold mb-3">Optimization Strategies</h2>
          <p>Personalized recommendations for investments, deductions, and exemptions to minimize your tax burden legally.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
          <h2 className="text-xl font-semibold mb-3">Latest Tax Rules</h2>
          <p>Up-to-date information on the latest tax laws, exemptions, and deductions applicable for the Financial Year 2025-26.</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Tax-Saving Instruments</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-primary-dark text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">ELSS (Equity Linked Saving Scheme)</h3>
                <p className="text-gray-600">Tax-saving mutual funds with potential for high returns and a lock-in period of 3 years.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-dark text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">PPF (Public Provident Fund)</h3>
                <p className="text-gray-600">Government-backed savings scheme with tax-free interest and a 15-year lock-in period.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-primary-dark text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">NPS (National Pension System)</h3>
                <p className="text-gray-600">Retirement savings scheme with additional tax benefits under Section 80CCD(1B).</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
} 