import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, ArrowRight, Info, HelpCircle, Bike, TreeDeciduous } from 'lucide-react';

export const CalculatorModule = () => {
  const [weight, setWeight] = useState(10);
  
  const CH4_FACTOR = 0.05;
  const GWP = 28;

  const methane = weight * CH4_FACTOR;
  const co2e = methane * GWP;
  const trees = co2e / 20; // 1 tree absorbs ~20kg CO2 per year

  return (
    <div className="max-w-6xl">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-[#1A2E1A]">IPCC Tier 1 Engine</h2>
        <p className="text-[#1A2E1A]/40 text-sm font-bold uppercase tracking-widest mt-1">Live Educational Calculator</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[2.5rem] p-10 border border-[#1A2E1A]/5 shadow-sm space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest ml-4">Simulasi Berat Sampah</label>
              <span className="text-4xl font-black text-[#2E7D32]">{weight} <span className="text-sm">kg</span></span>
            </div>
            <input 
              type="range"
              min="1"
              max="1000"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              className="w-full h-3 bg-[#FAF8F5] rounded-full appearance-none cursor-pointer accent-[#2E7D32]"
            />
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-3 h-3 text-[#D4AF37]" />
              Breakdown Metodologi IPCC
            </h4>
            
            <div className="space-y-4">
              <motion.div 
                key={weight}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#1A2E1A]/5"
              >
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[#1A2E1A]/40">STEP 1: Waste to Methane (CH4)</span>
                  <span className="text-[#2E7D32]">EF: 0.05</span>
                </div>
                <p className="text-lg font-black text-[#1A2E1A]">
                  {weight} kg <span className="text-[#1A2E1A]/20">×</span> 0.05 <span className="text-[#1A2E1A]/20">=</span> {methane.toFixed(2)} kg CH4
                </p>
              </motion.div>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-[#1A2E1A]/10 rotate-90" />
              </div>

              <motion.div 
                key={methane}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1A2E1A] p-6 rounded-2xl text-white"
              >
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-white/40">STEP 2: GWP Conversion (CO2e)</span>
                  <span className="text-[#D4AF37]">GWP: 28</span>
                </div>
                <p className="text-lg font-black">
                  {methane.toFixed(2)} kg CH4 <span className="text-white/20">×</span> 28 <span className="text-white/20">=</span> {co2e.toFixed(2)} kg CO2e
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm text-center">
              <Bike className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
              <p className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest mb-2">Impact Jarak Tempuh</p>
              <div className="text-3xl font-black text-[#1A2E1A]">{(co2e * 10).toFixed(0)} <span className="text-sm">km</span></div>
              <p className="text-[8px] font-bold text-[#1A2E1A]/20 mt-2">Setara naik motor</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm text-center">
              <TreeDeciduous className="w-10 h-10 text-[#2E7D32] mx-auto mb-4" />
              <p className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest mb-2">Kebutuhan Pohon</p>
              <div className="text-3xl font-black text-[#1A2E1A]">{trees.toFixed(1)} <span className="text-sm">Pohon</span></div>
              <p className="text-[8px] font-bold text-[#1A2E1A]/20 mt-2">Untuk serapan 1 tahun</p>
            </div>
          </div>

          <div className="bg-[#2E7D32]/5 p-8 rounded-[2.5rem] border border-[#2E7D32]/10">
            <div className="flex gap-4 items-start">
              <HelpCircle className="w-6 h-6 text-[#2E7D32] shrink-0" />
              <div>
                <h4 className="font-bold text-[#1A2E1A] mb-2">Kenapa IPCC Tier 1?</h4>
                <p className="text-xs text-[#1A2E1A]/60 font-medium leading-relaxed">
                  Metodologi Tier 1 adalah standar internasional default dari IPCC untuk mengestimasi emisi gas rumah kaca ketika data spesifik lokasi (Tier 2/3) belum tersedia. Formula ini memberikan penilaian konservatif namun akurat untuk perencanaan awal strategi dekarbonisasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
