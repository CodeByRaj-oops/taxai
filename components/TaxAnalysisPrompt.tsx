"use client";

import { useState } from 'react';
import { config } from '@/utils/config';
import { TaxResult } from '@/utils/taxCalculations';

interface TaxAnalysisPromptProps {
  taxResults: TaxResult;
  onAnalysisRequest: (prompt: string) => void;
  isLoading?: boolean;
}

export default function TaxAnalysisPrompt({ 
  taxResults, 
  onAnalysisRequest,
  isLoading = false 
}: TaxAnalysisPromptProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Pre-defined prompt suggestions based on the tax results
  const getSuggestedPrompts = (): string[] => {
    const prompts = [
      `Explain why the ${taxResults.bestRegime === 'old' ? 'Old' : 'New'} regime is better for me in simple terms`,
      "What strategies can I use to reduce my tax liability further?",
      "How can I optimize my salary structure for better tax efficiency?",
    ];
    
    // Add regime-specific prompts
    if (taxResults.bestRegime === 'old') {
      prompts.push(
        "Which Section 80C investments would give the best returns?",
        "Should I increase my HRA component in my salary?",
        `Is it worth investing in NPS beyond the ${config.formatCurrency(config.tax.limits.section80C)} 80C limit?`
      );
    } else {
      prompts.push(
        "What are the disadvantages of choosing the New regime?",
        "When should I consider switching back to the Old regime?",
        "How will the New regime affect my retirement planning?"
      );
    }
    
    // Salary-level specific prompts
    const totalIncome = taxResults.oldRegime.inHandAmount + taxResults.oldRegime.taxAmount;
    if (totalIncome < 1000000) {
      prompts.push("What tax benefits are available for low-income individuals?");
    } else if (totalIncome >= 1000000 && totalIncome < 2000000) {
      prompts.push("What tax planning strategies work best for middle-income earners?");
    } else {
      prompts.push(
        "What are the most effective tax planning strategies for high-income earners?",
        "Should I consider setting up an HUF for tax planning?"
      );
    }
    
    return prompts;
  };
  
  const promptSuggestions = getSuggestedPrompts();
  
  const handlePromptSelection = (prompt: string) => {
    setCustomPrompt(prompt);
    onAnalysisRequest(prompt);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onAnalysisRequest(customPrompt);
    }
  };
  
  return (
    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
      <h3 className="text-xl font-semibold text-primary mb-3">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Ask our AI Tax Expert
        </span>
      </h3>
      
      <p className="mb-4 text-gray-700">
        What would you like to know about your tax situation? Get personalized advice based on your tax calculation.
      </p>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2 text-gray-700">Suggested Questions:</h4>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptSelection(prompt)}
              className="bg-white px-3 py-2 rounded-full text-sm border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Or ask your own question about your tax calculation..."
            className="flex-grow p-3 rounded-l-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-3 rounded-r-lg font-medium ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isLoading || !customPrompt.trim()}
          >
            {isLoading ? 'Analyzing...' : 'Ask'}
          </button>
        </div>
      </form>
      
      {!config.features.openAiIntegration && (
        <div className="mt-4 text-amber-700 bg-amber-50 p-3 rounded-lg text-sm">
          <strong>Note:</strong> AI Tax Expert is currently disabled. Enable it by setting ENABLE_OPENAI_INTEGRATION=true in your .env file.
        </div>
      )}
    </div>
  );
} 