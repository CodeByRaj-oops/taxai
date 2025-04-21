import React from 'react';
import ChatBot from '../../components/ChatBot';

export const metadata = {
  title: 'AI Tax Advisor | Indian Tax Consultation 2023-24',
  description: 'Get expert AI-powered advice on Indian tax regulations, savings strategies, and exemptions for FY 2023-24.',
};

export default function TaxAdvisorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Tax Advisor</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get expert advice on Indian tax regulations and savings strategies
          </p>
        </div>
        
        <ChatBot />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This AI-powered advisor provides information based on Indian tax laws for FY 2023-24.</p>
          <p className="mt-1">For official tax advice, please consult with a certified tax professional.</p>
        </div>
      </div>
    </main>
  );
} 