'use client';

import React, { useState, useRef, useEffect } from 'react';
import LoadingDots from './LoadingDots';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input } as Message;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to AI advisor API
      const response = await fetch('/api/aiAdvisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: input }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = { role: 'assistant', content: data.message } as Message;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request. Please try again later.' 
      } as Message;
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-indigo-600 p-4 text-white">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-2">🤖</span> TaxAI Advisor
        </h2>
        <p className="text-xs opacity-80">Expert Indian tax consultation for FY 2023-24</p>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <div>
              <p className="text-xl mb-2">👋 Welcome to TaxAI Advisor</p>
              <p className="max-w-md">Ask me anything about Indian tax regulations, savings strategies, or exemptions for FY 2023-24.</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-indigo-500 text-white rounded-tr-none' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
                } animate-fade-in`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none animate-pulse">
              <p className="flex items-center">🤖 TaxAI is typing<LoadingDots /></p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tax saving strategies..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
} 