"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define message types
type MessageType = 'user' | 'ai' | 'system';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

// Sample initial prompts
const INITIAL_PROMPTS = [
  {
    title: "Compare tax regimes",
    content: "Can you explain the key differences between old and new tax regimes in 2025?",
  },
  {
    title: "80C Investments",
    content: "What are the best tax-saving investments under Section 80C?",
  },
  {
    title: "Home loan benefits",
    content: "How can I claim tax benefits on my home loan?",
  },
  {
    title: "HRA exemption",
    content: "Calculate my HRA exemption if my basic salary is ₹50,000 and I pay ₹20,000 as rent in a metro city.",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Welcome to the AI Tax Assistant! I'm here to help with all your tax planning needs for the Indian Tax Regime 2025. Ask me anything about tax-saving, deductions, or optimizing your tax liability.",
      type: 'ai',
      timestamp: new Date(),
    },
    {
      id: '2',
      content: "You can start by asking questions about specific deductions, comparing tax regimes, or calculating potential tax savings. I'm here to provide personalized guidance!",
      type: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInitialPrompts, setShowInitialPrompts] = useState(true);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Helper to generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Handle user message submission
  const handleSubmit = (e: React.FormEvent, submitMessage = input) => {
    e.preventDefault();
    if (!submitMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: submitMessage,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowInitialPrompts(false);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        content: generateAIResponse(submitMessage),
        type: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Handle prompt selection
  const handlePromptClick = (promptContent: string) => {
    setInput(promptContent);
  };

  // Basic AI response generator (to be replaced with real AI)
  const generateAIResponse = (query: string): string => {
    const lcQuery = query.toLowerCase();
    
    if (lcQuery.includes('section 80c') || lcQuery.includes('80c')) {
      return `Under Section 80C of the Indian Income Tax Act, you can claim deductions up to ₹1,50,000 for the following investments and expenses:

1. Public Provident Fund (PPF) - Long-term savings with tax-free interest
2. Equity Linked Saving Scheme (ELSS) - Tax-saving mutual funds with higher return potential
3. National Pension System (NPS) - Retirement savings scheme
4. Tax Saving Fixed Deposits - Min 5-year lock-in period
5. Life Insurance Premiums - For self, spouse, and children
6. Tuition fees for children - For full-time education
7. Home Loan Principal Repayment - For self-occupied property

Based on your risk profile, I'd recommend distributing your investments across ELSS (higher risk, higher returns), PPF (secure, stable returns), and NPS (additional tax benefits). Would you like a more personalized recommendation based on your age and risk appetite?`;
    }
    
    if (lcQuery.includes('hra') || lcQuery.includes('house rent') || lcQuery.includes('rent')) {
      if (lcQuery.includes('50,000') && lcQuery.includes('20,000')) {
        return `Based on the information provided (basic salary: ₹50,000 and rent: ₹20,000 in a metro city), I'll calculate your HRA exemption:

1. Actual HRA received (assuming 40% of basic): ₹20,000
2. Rent paid minus 10% of basic: ₹20,000 - ₹5,000 = ₹15,000
3. 50% of basic salary (metro city): ₹25,000

The minimum of these three is ₹15,000.

Therefore, your monthly HRA exemption would be ₹15,000, or ₹1,80,000 annually. This amount would be exempt from your taxable income.

Note: For more accurate calculations, please provide your actual HRA amount received.`;
      }
      
      return `HRA (House Rent Allowance) exemption is calculated as the minimum of these three amounts:

1. Actual HRA received from employer
2. Rent paid minus 10% of basic salary
3. 50% of basic salary for metro cities or 40% for non-metro cities

To calculate your specific HRA exemption, I'll need:
- Your basic salary
- The actual HRA you receive
- The rent you pay
- Whether you live in a metro or non-metro city

Would you like to provide these details for a personalized calculation?`;
    }
    
    if (lcQuery.includes('nps') || lcQuery.includes('national pension')) {
      return `National Pension System (NPS) offers excellent tax benefits under the Indian Tax Regime 2025:

1. Under Section 80CCD(1): Contributions up to 10% of your salary (basic + DA) are deductible within the overall 80C limit of ₹1.5 lakh.

2. Under Section 80CCD(1B): Additional deduction of up to ₹50,000 beyond the 80C limit.

3. Under Section 80CCD(2): Employer contributions up to 10% of salary are tax-exempt (not counted in 80C limit).

4. At maturity: 60% of the corpus can be withdrawn tax-free. The remaining 40% must be used to purchase an annuity.

NPS is especially beneficial for high-income individuals who have already exhausted the 80C limit. It combines tax savings with retirement planning, though it comes with a lock-in period until retirement age (60 years).

Would you like to know how much tax you could save with NPS based on your income details?`;
    }
    
    if ((lcQuery.includes('old') && lcQuery.includes('new') && (lcQuery.includes('regime') || lcQuery.includes('tax')))) {
      return `The Indian Tax Regime 2025 offers two options - Old and New regimes with key differences:

**Old Tax Regime:**
- Higher tax rates (After basic exemption of ₹2.5 lakh: 5% up to ₹5 lakh, 20% up to ₹10 lakh, 30% beyond)
- Multiple deductions and exemptions allowed:
  - Section 80C investments (up to ₹1.5 lakh)
  - Section 80D health insurance (up to ₹25,000 self, ₹50,000 parents)
  - HRA exemption for rent paid
  - LTA exemption
  - Home loan interest (up to ₹2 lakh) and principal repayment

**New Tax Regime:**
- Lower tax rates with more slabs (After basic exemption of ₹3 lakh: 5% up to ₹6 lakh, 10% up to ₹9 lakh, 15% up to ₹12 lakh, 20% up to ₹15 lakh, 30% beyond)
- Standard deduction of ₹50,000
- Very limited deductions and exemptions
- Simpler tax calculation

The Old Regime typically benefits those with significant investments and deductions, while the New Regime is better for those with fewer deductions and lower income.

Would you like me to analyze which regime would be better for your specific financial situation?`;
    }
    
    if (lcQuery.includes('home loan') || lcQuery.includes('house loan')) {
      return `For home loans, you can claim tax benefits under two sections in the Indian Tax Regime 2025:

1. Section 24: Interest paid on home loan
   - Up to ₹2,00,000 per year for self-occupied property
   - No upper limit for rented property (actual interest paid is deductible)

2. Section 80C: Principal repayment
   - Up to ₹1,50,000 per year (shared with other 80C investments)

Additional benefits:
- First-time homebuyers can claim an additional deduction of up to ₹1,50,000 under Section 80EEA for loans sanctioned before March 31, 2025 (conditions apply)
- Stamp duty and registration charges are also eligible for deduction under Section 80C

Note: These deductions are available only under the Old Tax Regime. Under the New Tax Regime, these deductions cannot be claimed.

Would you like me to calculate your potential tax savings based on your home loan details?`;
    }

    if (lcQuery.includes('elss') || lcQuery.includes('equity linked')) {
      return `ELSS (Equity Linked Saving Scheme) funds are tax-saving mutual funds that offer:

1. Tax Deduction: Investments up to ₹1,50,000 per year qualify for deduction under Section 80C

2. Returns: Potential for higher returns compared to other 80C instruments like PPF or Tax Saver FDs as they invest in equity markets

3. Lock-in Period: Shortest among all 80C instruments - only 3 years (compared to 5 years for tax-saving FDs, 15 years for PPF)

4. Taxation of Gains: Long-term capital gains above ₹1 lakh are taxed at 10% without indexation benefit

ELSS is particularly suitable for:
- Young investors with a higher risk appetite
- Those seeking potential for capital appreciation along with tax benefits
- Investors with a long-term horizon who can withstand market volatility

Would you like recommendations for top-performing ELSS funds, or would you prefer to know how to incorporate ELSS into your overall tax-saving strategy?`;
    }
    
    return `That's a great question about Indian taxation. Based on the Indian Tax Regime 2025, I can provide you with detailed guidance.

To give you the most accurate advice, I'd need to understand more about your financial situation, including:

- Your income sources and annual income
- Current investments and deductions you're claiming
- Your specific financial goals and risk tolerance
- Any particular tax concerns you're trying to address

Would you like to provide some of these details so I can offer more personalized tax planning advice? Alternatively, you can explore our Tax Calculator for a comprehensive analysis of your tax liability under both old and new tax regimes.`;
  };

  // Message bubble animation
  const messageBubbleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-dark-border">
        <div className="bg-primary-500 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
            <h1 className="text-xl font-bold">AI Tax Assistant</h1>
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
            Indian Tax 2025
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="h-[60vh] overflow-y-auto p-4 bg-gray-50 dark:bg-dark-bg" id="message-container">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial="hidden"
              animate="visible"
              variants={messageBubbleVariants}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-dark-card shadow border border-gray-200 dark:border-dark-border'
                }`}
              >
                <div className={message.type === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}>
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              className="mb-4 flex justify-start"
              initial="hidden"
              animate="visible"
              variants={messageBubbleVariants}
            >
              <div className="bg-white dark:bg-dark-card rounded-lg px-4 py-3 shadow border border-gray-200 dark:border-dark-border">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Initial Prompts */}
        {showInitialPrompts && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Suggested questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INITIAL_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={index}
                  className="text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border transition-colors text-gray-700 dark:text-gray-300"
                  onClick={() => handlePromptClick(prompt.content)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="font-medium">{prompt.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{prompt.content}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Indian taxes..."
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-gray-800 dark:text-gray-200"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`rounded-full p-2 ${
                input.trim()
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            AI responses are generated for demonstration purposes and may not reflect actual tax advice.
            Always consult with a tax professional for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
} 