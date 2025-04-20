import { useState, useRef, useEffect } from 'react';
import { formatTimestamp } from '../utils/formatters';
import LoadingDots from './LoadingDots';

const MAX_CHARS = 500;

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Handle submitting a new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim input and check if it's empty
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
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
    
    try {
      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedInput }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific HTTP error codes
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
        } else {
          throw new Error(data.error || 'Failed to get a response');
        }
      }
      
      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        content: data.reply,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error calling chat API:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle special key presses (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">TaxAI Assistant</h2>
        <p className="text-sm text-blue-100">Ask me anything about taxes</p>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-12'
                    : 'bg-white shadow-sm border border-gray-200 mr-12'
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
                <div className="mt-1 text-xs opacity-70">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white shadow-sm border border-gray-200">
              <LoadingDots />
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 text-red-500 bg-red-50 rounded-lg text-sm border border-red-200">
            <p className="font-medium">Error: {error}</p>
            <p className="mt-1 text-xs">Please try again or refresh the page.</p>
          </div>
        )}
        
        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
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
              disabled={!input.trim() || isLoading}
            >
              Send
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to send</span>
          <span>Press <kbd className="bg-gray-100 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> for a new line</span>
        </div>
      </form>
    </div>
  );
} 