import { motion } from "motion/react";
import { ArrowRight, Globe2, ShieldCheck, Leaf } from "lucide-react";

interface HeroProps {
  onStartAuth: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAuth }) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden bg-[#FAF8F5] min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2E7D32]/5 rounded-l-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#2E7D32]/10 text-[#2E7D32] px-4 py-2 rounded-full mb-6 border border-[#2E7D32]/20 shadow-sm">
              <Globe2 className="w-4 h-4" />
              <span className="text-xs font-black tracking-widest uppercase">IPCC Tier 1 Standard Compliance</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#1A2E1A] leading-[0.9] tracking-tighter mb-8">
              UKUR EMISI <span className="text-[#2E7D32]">ORGANIK</span> SECARA REAL-TIME.
            </h1>
            <p className="text-lg md:text-xl text-[#1A2E1A]/60 font-medium leading-relaxed mb-12 max-w-2xl">
              Platform cerdas bagi berbagai instansi untuk mengonversi data limbah organik menjadi jejak emisi karbon (CO2e) yang akurat berbasis standar IPCC.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onStartAuth}
                className="w-full sm:w-auto bg-[#1A2E1A] text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[#2E7D32] transition-all shadow-2xl shadow-[#1A2E1A]/10 group"
              >
                MULAI SEKARANG <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onStartAuth}
                className="w-full sm:w-auto bg-white text-[#1A2E1A] border-2 border-[#1A2E1A]/5 px-10 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:border-[#2E7D32] hover:text-[#2E7D32] transition-all"
              >
                MASUK DASHBOARD
              </button>
            </div>

            <div className="mt-16 flex items-center gap-12 pt-12 border-t border-[#1A2E1A]/5 opacity-60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Enterprise Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Zero Waste Policy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
