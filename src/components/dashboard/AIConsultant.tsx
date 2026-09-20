import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIConsultant = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Halo! Saya AI Eco-Consultant. Berdasarkan data emisi instansi Anda, saya siap memberikan rekomendasi kebijakan berkelanjutan dan menjawab pertanyaan seputar masalah iklim atau lingkungan. Ada yang ingin ditanyakan?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          context: { platform: 'Emissioculator', timestamp: new Date().toISOString() }
        })
      });

      if (!response.ok) throw new Error('Failed to fetch recommendation');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.recommendation }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1A2E1A]">AI Eco-Consultant</h2>
        <p className="text-[#1A2E1A]/40 text-sm font-bold uppercase tracking-widest mt-1">Smart Recommendations Engine</p>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-[#2E7D32]/5 border-b border-[#1A2E1A]/5 flex items-center gap-4">
          <div className="bg-[#2E7D32] p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="font-bold text-[#1A2E1A] text-sm leading-tight">Eco-Gemini Assistant</h4>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-widest">Online & Ready</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.role === 'ai' ? 'bg-[#2E7D32] text-[#D4AF37]' : 'bg-[#FAF8F5] text-[#1A2E1A]/40'
                }`}>
                  {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed prose prose-sm max-w-none ${
                  msg.role === 'ai' 
                    ? 'bg-[#FAF8F5] text-[#1A2E1A] rounded-tl-none border border-[#1A2E1A]/5' 
                    : 'bg-[#1A2E1A] text-white rounded-tr-none prose-invert'
                }`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-[#1A2E1A]/5">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              placeholder="Tanyakan rekomendasi kebijakan emisi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-transparent rounded-2xl pl-6 pr-16 py-5 text-sm font-bold focus:outline-none focus:border-[#2E7D32] transition-all"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1A2E1A] text-white p-3 rounded-xl hover:bg-[#2E7D32] transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
