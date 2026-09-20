import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { APP_CONFIG } from "../shared/appConfig";

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: `Halo! Saya AI Sustainability Consultant ${APP_CONFIG.brandName}. Ada yang bisa saya bantu terkait pengelolaan limbah dan pengurangan jejak karbon di instansi Anda?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage,
          context: {
            brandName: APP_CONFIG.brandName,
            standard: "IPCC Tier 1"
          }
        }),
      });

      const data = await response.json();
      if (data.recommendation) {
        setChatHistory(prev => [...prev, { role: 'ai', content: data.recommendation }]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Maaf, sistem sedang mengalami kendala teknis. Silakan coba lagi nanti." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-[#2E7D32] text-white p-4 rounded-full shadow-2xl shadow-[#2E7D32]/40 flex items-center gap-2 group"
      >
        <Sparkles className="w-6 h-6 text-[#D4AF37]" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">AI Consultant</span>
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1A2E1A]/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#1A2E1A] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#2E7D32] p-2 rounded-xl">
                    <Bot className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">AI Consultant</h3>
                    <p className="text-[10px] text-[#2E7D32] font-black uppercase tracking-widest">Sustainability Expert</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F5]">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                      chat.role === 'user' 
                        ? 'bg-[#2E7D32] text-white rounded-tr-none' 
                        : 'bg-white text-[#1A2E1A] border border-[#1A2E1A]/5 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{chat.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#1A2E1A]/5 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32]" />
                      <span className="text-xs font-bold text-[#1A2E1A]/40 uppercase tracking-widest">Analyzing Data...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-[#1A2E1A]/5">
                <div className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tanyakan sesuatu tentang emisi..."
                    className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-[#2E7D32] transition-all text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2E7D32] text-white p-2 rounded-xl disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] text-center mt-4 text-[#1A2E1A]/30 font-bold uppercase tracking-widest">
                  Powered by Google Gemini 3.8 Flash
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
