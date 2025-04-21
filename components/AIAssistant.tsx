"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define message types
type MessageType = 'user' | 'system';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  taxRegime?: string;
}

// Character limit for user inputs
const MAX_CHARS = 300;

export default function TaxInfoAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Welcome to the Tax Calculator! Ask questions about tax regimes, deductions, or calculations for FY 2024-25 and 2025-26.",
      type: 'system',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [taxRegime, setTaxRegime] = useState('new'); // Default to new regime
  const [presetQuestions, setPresetQuestions] = useState([
    "What's my tax on ₹10L income?",
    "How do deductions work?",
    "Which regime is better for ₹7L salary?"
  ]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Helper to generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Handle user message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    // Check length
    if (trimmedInput.length > MAX_CHARS) {
      setStatusMessage(`Message exceeds maximum length of ${MAX_CHARS} characters.`);
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: trimmedInput,
      type: 'user',
      timestamp: new Date(),
      taxRegime: taxRegime
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate system response after a short delay
    setTimeout(() => {
      const systemResponse: Message = {
        id: generateId(),
        content: generateStaticResponse(trimmedInput),
        type: 'system',
        timestamp: new Date(),
        taxRegime: taxRegime
      };
      setMessages((prev) => [...prev, systemResponse]);
      setIsTyping(false);
    }, 500); // Short delay for more responsive feeling
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Handle regime change
  const handleRegimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaxRegime(e.target.value);
  };

  // Copy text to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setStatusMessage("Copied to clipboard!");
        setTimeout(() => setStatusMessage(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setStatusMessage("Failed to copy to clipboard");
        setTimeout(() => setStatusMessage(null), 2000);
      });
  };

  // Handle input change with character limit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS || value.length < input.length) {
      setInput(value);
    }
  };

  // Generate a static response based on the query
  const generateStaticResponse = (query: string): string => {
    const lcQuery = query.toLowerCase();
    
    if (lcQuery.includes('10l') || lcQuery.includes('10 lakh')) {
      if (taxRegime === 'new') {
        return `For income of ₹10,00,000 in the New Regime (FY 2025-26):

Gross Income: ₹10,00,000
Standard Deduction: ₹50,000
Taxable Income: ₹9,50,000

Tax Calculation:
- First ₹3,00,000: No tax (0%)
- Next ₹3,00,000 (₹3,00,001 to ₹6,00,000): ₹15,000 (5%)
- Next ₹3,00,000 (₹6,00,001 to ₹9,00,000): ₹30,000 (10%)
- Remaining ₹50,000 (₹9,00,001 to ₹9,50,000): ₹7,500 (15%)

Total Tax: ₹52,500
Plus 4% Education Cess: ₹2,100
Final Tax Liability: ₹54,600`;
      } else {
        return `For income of ₹10,00,000 in the Old Regime (FY 2024-25):

Gross Income: ₹10,00,000
Standard Deduction: ₹50,000
Taxable Income (without other deductions): ₹9,50,000

Tax Calculation:
- First ₹2,50,000: No tax (0%)
- Next ₹2,50,000 (₹2,50,001 to ₹5,00,000): ₹12,500 (5%)
- Next ₹5,00,000 (₹5,00,001 to ₹10,00,000): ₹1,00,000 (20%)

Total Tax: ₹1,12,500
Plus 4% Education Cess: ₹4,500
Final Tax Liability: ₹1,17,000

Note: This can be significantly lower if you claim 80C, 80D, and other deductions available in the old regime.`;
      }
    } else if (lcQuery.includes('deduction')) {
      if (taxRegime === 'new') {
        return `In the New Regime (FY 2025-26), most deductions are not available. 

Available deductions:
- Standard deduction of ₹50,000 (for salaried individuals)
- Employer contribution to NPS under Sec 80CCD(2)

The new regime compensates for fewer deductions with lower tax rates.`;
      } else {
        return `In the Old Regime (FY 2024-25), you can claim these major deductions:

1. Section 80C (up to ₹1,50,000): PPF, ELSS, Life Insurance, etc.
2. Section 80D (up to ₹25,000, ₹50,000 for senior citizens): Health Insurance
3. Housing Loan Interest (up to ₹2,00,000)
4. HRA Exemption: Based on rent paid, salary, and city
5. NPS Additional Deduction: Up to ₹50,000 under Sec 80CCD(1B)
6. Standard Deduction: Flat ₹50,000 for all salaried employees

These deductions can significantly reduce your taxable income.`;
      }
    } else if (lcQuery.includes('7l') || lcQuery.includes('7 lakh')) {
      return `For a salary of ₹7,00,000, comparing both regimes:

Old Regime (FY 2024-25):
- Gross Income: ₹7,00,000
- Standard Deduction: ₹50,000
- Possible 80C Deduction: ₹1,50,000
- Taxable Income: ₹5,00,000
- Tax: ₹12,500 (5% of ₹2,50,000) + 4% cess = ₹13,000

New Regime (FY 2025-26):
- Gross Income: ₹7,00,000
- Standard Deduction: ₹50,000
- Taxable Income: ₹6,50,000
- Tax: ₹15,000 (5% of ₹3,00,000) + ₹5,000 (10% of ₹50,000) + 4% cess = ₹20,800

For a salary of ₹7L, the Old Regime would be better IF you can utilize the full ₹1.5L deduction under 80C. Otherwise, the New Regime might be simpler.`;
    } else if (lcQuery.includes('regime')) {
      return `The Indian tax system offers two tax regimes:

1. Old Regime (FY 2024-25): Higher tax rates but offers various deductions and exemptions like 80C, 80D, HRA, home loan interest, etc. Tax slabs are 0% up to ₹2.5L, 5% for ₹2.5-5L, 20% for ₹5-10L, and 30% above ₹10L.

2. New Regime (FY 2025-26): Lower tax rates but minimal deductions. Tax slabs are 0% up to ₹3L, 5% for ₹3-6L, 10% for ₹6-9L, 15% for ₹9-12L, 20% for ₹12-15L, and 30% above ₹15L.

Choosing between them depends on your income level and how much you invest in tax-saving instruments. Generally, if you claim substantial deductions, the old regime may be better. If you prefer simplicity or don't have many deductions, the new regime might be advantageous.`;
    } else {
      return `To answer your question about "${query}", please try using our main Tax Calculator tool for more detailed information or try one of the preset questions below.`;
    }
  };

  // Chat container variants for Framer Motion
  const chatContainerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }
  };

  // Button pulse variants
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0.4)",
        "0 0 0 10px rgba(59, 130, 246, 0)",
        "0 0 0 0 rgba(59, 130, 246, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
        animate={isOpen ? "visible" : "pulse"}
        variants={pulseVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.384 1.029.768 1.5 1.175V5.75a1.125 1.125 0 012.25 0v5.519c.91.684 1.5 1.115 1.5 1.115v-3.134a1.125 1.125 0 012.25 0v7.635a6.751 6.751 0 01-6.75 6.75h-7.5a6.75 6.75 0 01-6.75-6.75v-7.635a1.125 1.125 0 012.25 0v3.134c0 .345.25.688.5 1 .312.344.813.672 1.5 1.115V5.75a1.125 1.125 0 012.25 0v5.519c.518-.44 1.03-.826 1.5-1.175V1.875z" />
          </svg>
        )}
      </motion.button>

      {/* Chat container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 md:w-96 h-96 bg-white dark:bg-dark-card rounded-lg shadow-xl flex flex-col z-40 border border-gray-200 dark:border-dark-border"
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Chat header */}
            <div className="px-4 py-3 bg-primary-500 text-white rounded-t-lg flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.384 1.029.768 1.5 1.175V5.75a1.125 1.125 0 012.25 0v5.519c.91.684 1.5 1.115 1.5 1.115v-3.134a1.125 1.125 0 012.25 0v7.635a6.751 6.751 0 01-6.75 6.75h-7.5a6.75 6.75 0 01-6.75-6.75v-7.635a1.125 1.125 0 012.25 0v3.134c0 .345.25.688.5 1 .312.344.813.672 1.5 1.115V5.75a1.125 1.125 0 012.25 0v5.519c.518-.44 1.03-.826 1.5-1.175V1.875z" />
                </svg>
                <h3 className="font-medium">Tax Calculator</h3>
              </div>
              <select 
                value={taxRegime} 
                onChange={handleRegimeChange}
                className="text-xs bg-primary-600 text-white rounded border border-primary-400 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white"
              >
                <option value="new">New Regime (FY 2025-26)</option>
                <option value="old">Old Regime (FY 2024-25)</option>
              </select>
            </div>
            
            {/* Messages container */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-dark-bg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-dark-border'
                    }`}
                  >
                    <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                      {/* Render message content with proper line breaks */}
                      {message.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                      <span>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.type === 'system' && (
                        <button 
                          onClick={() => copyToClipboard(message.content)}
                          className="text-primary-500 hover:text-primary-700 focus:outline-none"
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                      )}
                  </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="mb-3 text-left">
                  <div className="inline-block rounded-lg px-4 py-2 bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-0"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                      </div>
                      <span className="text-xs text-gray-500">Calculating...</span>
                    </div>
                  </div>
                </div>
              )}
              {statusMessage && (
                <div className={`mb-3 text-center px-3 py-1 mx-auto rounded-full text-xs ${
                  statusMessage.includes('Copied') 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {statusMessage}
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
            
            {/* Preset questions */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-border overflow-x-auto">
              <div className="flex space-x-2 pb-1">
                {presetQuestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-gray-200 dark:border-dark-border">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="relative flex-grow">
                <input
                  type="text"
                  value={input}
                    onChange={handleInputChange}
                  placeholder="Ask about tax calculations..."
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-border border border-transparent focus:border-primary-300 dark:focus:border-primary-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 text-gray-700 dark:text-gray-200 pr-16"
                  />
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    <span className={input.length > MAX_CHARS * 0.8 ? 'text-orange-500' : ''}>
                      {input.length}/{MAX_CHARS}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || input.length > MAX_CHARS}
                  className={`p-2 rounded-full ${
                    input.trim() && input.length <= MAX_CHARS
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-dark-border text-gray-400'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 