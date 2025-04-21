"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export default function Home() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75z" />
        </svg>
      ),
      title: 'Comprehensive Tax Analysis',
      description: 'Compare both tax regimes to find which saves you more and provides tailored recommendations for your profile.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
          <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Smart Investment Suggestions',
      description: 'Discover the best tax-saving investments based on your risk profile, income level, and financial goals.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
        </svg>
      ),
      title: 'AI-Powered Assistant',
      description: 'Chat with our intelligent assistant to get instant answers about deductions, exemptions, and tax-saving strategies.',
    },
  ];

  const taxInstruments = [
    {
      title: 'ELSS',
      fullName: 'Equity Linked Saving Scheme',
      description: 'Tax-saving mutual funds with potential for high returns and a lock-in period of 3 years.',
      color: 'bg-blue-500',
    },
    {
      title: 'PPF',
      fullName: 'Public Provident Fund',
      description: 'Government-backed savings scheme with tax-free interest and a 15-year lock-in period.',
      color: 'bg-purple-500',
    },
    {
      title: 'NPS',
      fullName: 'National Pension System',
      description: 'Retirement savings scheme with additional tax benefits under Section 80CCD(1B).',
      color: 'bg-green-500',
    },
    {
      title: 'Health Insurance',
      fullName: 'Section 80D',
      description: 'Premiums paid for health insurance for self, family and parents with benefits up to ₹75,000.',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.section 
        className="py-12 md:py-20"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="text-center max-w-3xl mx-auto px-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
            variants={fadeIn}
            custom={0}
          >
            Indian Tax Consultation System 2025
          </motion.h1>
          <motion.p 
            className="text-lg mb-8 text-gray-700 dark:text-gray-300"
            variants={fadeIn}
            custom={1}
          >
            Optimize your tax liability with personalized strategies based on the latest Indian Tax Regime. 
            Our AI-powered platform helps you make smart financial decisions.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeIn}
            custom={2}
          >
            <Link href="/calculator" className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-3 rounded-lg font-medium shadow-md">
              Calculate Your Tax
            </Link>
            <Link href="/advisor" className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-3 rounded-lg font-medium shadow-md">
              AI Tax Advisor
            </Link>
            <Link href="/chat" className="bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-border transition-colors border border-gray-300 dark:border-dark-border text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium shadow-sm">
              Chat with AI Assistant
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-12 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-12 text-center"
            variants={fadeIn}
            custom={0}
          >
            Smart Features for Your Tax Planning
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="p-6 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow"
                variants={fadeIn}
                custom={index + 1}
              >
                <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tax Comparison */}
      <motion.section 
        className="py-12 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            variants={fadeIn}
            custom={0}
          >
            Choose Your Ideal Tax Regime
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={fadeIn}
            custom={1}
          >
            <div className="p-6 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Old Tax Regime</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Higher Deductions
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Multiple exemptions and deductions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Section 80C, 80D deductions available</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">HRA and LTA exemptions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Home loan interest deduction</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Higher tax rates</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Best for individuals with:</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">High deductions and exemptions</p>
              </div>
            </div>
            
            <div className="p-6 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">New Tax Regime</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium">
                  Lower Tax Rates
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Lower tax rates with more slabs</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Standard deduction of ₹50,000</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Simplified tax calculation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">No HRA or LTA exemptions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">No Section 80C/80D deductions</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Best for individuals with:</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">Few investments or deductions</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="text-center mt-8"
            variants={fadeIn}
            custom={2}
          >
            <Link href="/calculator" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
              Compare both regimes for your situation
              <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Tax Saving Instruments */}
      <motion.section 
        className="py-12 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            variants={fadeIn}
            custom={0}
          >
            Top Tax-Saving Instruments
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {taxInstruments.map((instrument, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-border hover:shadow-md transition-shadow"
                variants={fadeIn}
                custom={index + 1}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`h-2 ${instrument.color}`}></div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1">{instrument.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{instrument.fullName}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{instrument.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-12 mb-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            variants={fadeIn}
            custom={0}
          >
            Ready to Optimize Your Tax Liability?
          </motion.h2>
          <motion.p 
            className="text-primary-100 mb-8 max-w-2xl mx-auto"
            variants={fadeIn}
            custom={1}
          >
            Our AI-powered calculator and personalized recommendations will help you save more and make smarter tax decisions.
          </motion.p>
          <motion.div
            variants={fadeIn}
            custom={2}
          >
            <Link
              href="/calculator"
              className="inline-block bg-white text-primary-600 hover:bg-gray-100 transition-colors px-6 py-3 rounded-lg font-medium shadow-md"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
} 