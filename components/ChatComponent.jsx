import { useState, useRef, useEffect } from 'react';
import { formatTimestamp } from '../utils/formatters';

const MAX_CHARS = 300;

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taxRegime, setTaxRegime] = useState('new'); // Default to new regime
  const [presetQuestions, setPresetQuestions] = useState([
    "What's my tax on ₹10L income?",
    "How do deductions work?",
    "Which regime is better for ₹7L salary?"
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only update if we're under the character limit or if the user is deleting text
    if (value.length <= MAX_CHARS || value.length < input.length) {
      setInput(value);
    }
  };

  // Handle regime change
  const handleRegimeChange = (e) => {
    setTaxRegime(e.target.value);
  };

  // Handle clicking a preset question
  const handlePresetQuestion = (question) => {
    setInput(question);
    inputRef.current?.focus();
  };

  // Generate a static response based on the query
  const generateStaticResponse = (query) => {
    if (query.toLowerCase().includes('10l') || query.toLowerCase().includes('10 lakh')) {
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
    } else if (query.toLowerCase().includes('deduction')) {
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
    } else if (query.toLowerCase().includes('7l') || query.toLowerCase().includes('7 lakh')) {
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
    } else {
      return `To answer your question about "${query}", please use our Tax Calculator tool for more detailed information.

You can find more specific tax information by:
1. Using the Tax Regime dropdown above to switch between Old and New regimes
2. Trying one of the preset questions below
3. Calculating your exact tax liability with the main calculator`;
    }
  };

  // Handle submitting a new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim input and check if it's empty or too long
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    if (trimmedInput.length > MAX_CHARS) {
      setError(`Message exceeds maximum length of ${MAX_CHARS} characters.`);
      return;
    }
    
    // Clear input and any previous errors
    setInput('');
    setError(null);
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      content: trimmedInput,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate a brief delay for response calculation
    setTimeout(() => {
      // Generate static response
      const staticResponse = generateStaticResponse(trimmedInput);
      
      // Add system response to chat
      const systemMessage = {
        id: Date.now() + 1,
        content: staticResponse,
        role: 'system',
        timestamp: new Date(),
        taxRegime: taxRegime
      };
      
      setMessages(prev => [...prev, systemMessage]);
      setIsLoading(false);
    }, 500);
  };

  // Handle special key presses (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Copy message to clipboard
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // Show a temporary success message
        setError("Copied to clipboard!");
        setTimeout(() => setError(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setError("Failed to copy to clipboard");
      });
  };

  // Download message as PDF
  const downloadAsPDF = (content, regime) => {
    try {
      alert("PDF download feature would save this calculation as a PDF file.");
      // Show a temporary success message
      setError("PDF download simulated!");
      setTimeout(() => setError(null), 2000);
    } catch (err) {
      console.error('Failed to generate PDF: ', err);
      setError("Failed to download PDF");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header with regime selector */}
      <div className="bg-blue-600 text-white p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Tax Calculator Assistant</h2>
          <p className="text-sm text-blue-100">Ask about tax calculations</p>
        </div>
        <div className="mt-2 md:mt-0">
          <select 
            value={taxRegime} 
            onChange={handleRegimeChange}
            className="bg-blue-700 text-white rounded py-1 px-2 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="new">New Regime (FY 2025-26)</option>
            <option value="old">Old Regime (FY 2024-25)</option>
          </select>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Ask a question about tax calculations!</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-4 md:ml-12'
                    : 'bg-white shadow-sm border border-gray-200 mr-4 md:mr-12'
                }`}
              >
                <div className={message.role === 'user' ? 'text-white' : 'text-gray-800'}>
                  {/* Display message content with proper line breaks */}
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
                  <span>{formatTimestamp(message.timestamp)}</span>
                  
                  {/* Add copy and download buttons for system messages */}
                  {message.role === 'system' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(message.content)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                      <button 
                        onClick={() => downloadAsPDF(message.content, message.taxRegime)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        title="Download as PDF"
                      >
                        💾
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
                <span className="ml-2 text-sm text-gray-500">Calculating...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className={`mb-4 p-3 text-sm rounded-lg border ${
            error === "Copied to clipboard!" || error === "PDF download simulated!" 
              ? "bg-green-50 text-green-600 border-green-200" 
              : "bg-red-50 text-red-500 border-red-200"
          }`}>
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Preset questions */}
      <div className="bg-gray-50 border-t border-gray-200 py-2 px-4 overflow-x-auto">
        <div className="flex space-x-2">
          {presetQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handlePresetQuestion(question)}
              className="whitespace-nowrap px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about tax calculations..."
            className="w-full p-3 pr-20 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="absolute bottom-3 right-3 flex items-center text-xs text-gray-500">
            <span className={`mr-2 ${input.length >= MAX_CHARS * 0.8 ? 'text-orange-500' : ''} ${input.length >= MAX_CHARS ? 'text-red-500 font-semibold' : ''}`}>
              {input.length}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              disabled={!input.trim() || isLoading || input.length > MAX_CHARS}
            >
              Send
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex flex-col sm:flex-row justify-between">
          <span>Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to send</span>
          <span>Press <kbd className="bg-gray-100 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> for a new line</span>
        </div>
      </form>
    </div>
  );
} 