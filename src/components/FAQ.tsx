import { motion, AnimatePresence } from "motion/react";
import { APP_CONFIG } from "../shared/appConfig";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#2E7D32] font-black tracking-widest uppercase text-sm mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Pertanyaan Umum</span>
          </div>
          <h2 className="text-4xl font-black text-[#1A2E1A] mb-4">FAQ & Metodologi</h2>
        </div>

        <div className="space-y-4">
          {APP_CONFIG.faq.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl border border-[#1A2E1A]/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-[#2E7D32]/5 transition-colors"
              >
                <span className="text-lg font-bold text-[#1A2E1A] pr-8">{item.q}</span>
                <motion.div
                  animate={{ rotate: activeIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 text-[#2E7D32]"
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </button>
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-[#1A2E1A]/70 leading-relaxed border-t border-[#1A2E1A]/5 pt-6">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
