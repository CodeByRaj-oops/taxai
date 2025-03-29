"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define message types
type MessageType = 'user' | 'ai';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

// Sample suggestions for users
const TAX_SUGGESTIONS = [
  "How do I save tax on my salary income?",
  "Compare old vs new tax regime for me",
  "What are the best tax saving investments?",
  "How much can I save under Section 80C?",
  "What's the HRA exemption formula?",
  "Is NPS a good tax saving option?",
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hi there! I'm your AI Tax Assistant. How can I help you with your tax planning today?",
      type: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
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
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: input,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        content: generateAIResponse(input),
        type: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Optional: Auto submit when clicking a suggestion
    // const userMessage: Message = {
    //   id: generateId(),
    //   content: suggestion,
    //   type: 'user',
    //   timestamp: new Date(),
    // };
    // setMessages([...messages, userMessage]);
    // setIsTyping(true);
    // ...rest of submission logic
  };

  // Basic AI response generator (to be replaced with real AI)
  const generateAIResponse = (query: string): string => {
    const lcQuery = query.toLowerCase();
    
    if (lcQuery.includes('section 80c') || lcQuery.includes('80c')) {
      return "Under Section 80C, you can claim deductions up to ₹1,50,000 for investments in PPF, ELSS, NSC, tax-saving FDs, life insurance premiums, and more. Would you like to know which 80C investments might be best for your situation?";
    }
    
    if (lcQuery.includes('hra') || lcQuery.includes('house rent')) {
      return "HRA exemption is calculated as the minimum of: (1) Actual HRA received, (2) 50% of basic salary for metro cities or 40% for non-metros, (3) Rent paid minus 10% of basic salary. Would you like me to calculate your specific HRA exemption?";
    }
    
    if (lcQuery.includes('nps') || lcQuery.includes('national pension')) {
      return "NPS is a great tax-saving option. You get tax benefits under Section 80CCD(1) within the 80C limit of ₹1.5 lakh, plus an additional deduction of up to ₹50,000 under Section 80CCD(1B). The returns are market-linked and it helps build a retirement corpus.";
    }
    
    if (lcQuery.includes('old') && lcQuery.includes('new') && (lcQuery.includes('regime') || lcQuery.includes('tax'))) {
      return "To compare old vs new tax regimes, I need to know your income details and eligible deductions. The old regime has higher tax rates but allows various deductions like 80C, 80D, HRA, etc. The new regime has lower rates but very limited deductions. Would you like to enter your details for a personalized comparison?";
    }
    
    return "That's a good question about Indian taxes. To give you the most accurate advice, I'd need to know more about your income sources, expenses, and investment goals. Would you like to use our detailed Tax Calculator for a more personalized analysis?";
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
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
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
                  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                </svg>
                <h3 className="font-medium">AI Tax Assistant</h3>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Beta</span>
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
                    className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-dark-border'
                    }`}
                  >
                    <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                      {message.content}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="mb-3 text-left">
                  <div className="inline-block rounded-lg px-4 py-2 bg-white dark:bg-dark-card shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-0"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
            
            {/* Suggestions */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-border overflow-x-auto">
              <div className="flex space-x-2 pb-1">
                {TAX_SUGGESTIONS.map((suggestion, index) => (
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
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about taxes or savings..."
                  className="flex-grow px-4 py-2 bg-gray-100 dark:bg-dark-border border border-transparent focus:border-primary-300 dark:focus:border-primary-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 text-gray-700 dark:text-gray-200"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`p-2 rounded-full ${
                    input.trim()
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