import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hey! I'm Juno, Shawn's cat. Need study tips or just some motivation?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getChatResponse(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white/80 dark:bg-pastel-darkCard/80 backdrop-blur-sm rounded-3xl shadow-lg mt-6 flex flex-col h-[500px] overflow-hidden border-2 border-dashed border-pastel-lavender/50">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-pastel-mint/20 flex items-center gap-2">
        <div className="p-2 bg-pastel-mint rounded-full text-teal-700">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="font-hand text-xl text-pastel-text dark:text-pastel-darkText leading-none">Shawn's Cat: Juno</h3>
          <p className="text-xs text-gray-400 font-sans">AI-powered advice</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-pastel-peach text-orange-700' : 'bg-pastel-lavender text-indigo-700'}
            `}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div className={`
              max-w-[80%] p-3 rounded-2xl text-sm font-sans
              ${msg.role === 'user' 
                ? 'bg-pastel-peach/30 text-gray-800 dark:text-gray-200 rounded-tr-none' 
                : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-none border border-gray-100 dark:border-transparent'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-pastel-lavender flex items-center justify-center flex-shrink-0">
               <Bot size={14} />
             </div>
             <div className="bg-white dark:bg-white/10 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white/50 dark:bg-black/20 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for advice..."
          className="flex-1 bg-transparent border border-pastel-lavender rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 ring-pastel-peach dark:text-white placeholder:text-gray-400"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-pastel-lavender hover:bg-indigo-200 text-indigo-800 p-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};