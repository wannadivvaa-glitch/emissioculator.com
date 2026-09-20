import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Building2, AlertCircle, ArrowRight, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthPageProps {
  onAuthSuccess: (institutionName: string) => void;
  onBack?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBack }) => {
  const { setInstitutionInfo, institutionName: initialInstName } = useAuth();
  
  const [institutionName, setInstitutionName] = useState(
    () => initialInstName || localStorage.getItem('em_inst_name') || ''
  );
  const [address, setAddress] = useState(
    () => localStorage.getItem('em_inst_address') || ''
  );
  const [instType, setInstType] = useState(
    () => localStorage.getItem('em_inst_type') || 'School'
  );
  
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = institutionName.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName) {
      setError("Harap masukkan nama instansi Anda.");
      return;
    }
    if (!trimmedAddress) {
      setError("Harap masukkan lokasi atau alamat instansi.");
      return;
    }

    setIsProcessing(true);

    try {
      await setInstitutionInfo(trimmedName, trimmedAddress, instType);
      onAuthSuccess(trimmedName);
    } catch (err: any) {
      console.error("Dashboard setup error:", err);
      // Fallback: guaranteed progression
      localStorage.setItem('em_inst_name', trimmedName);
      localStorage.setItem('em_inst_address', trimmedAddress);
      localStorage.setItem('em_inst_type', instType);
      onAuthSuccess(trimmedName);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 selection:bg-[#2E7D32]/20 selection:text-[#2E7D32]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-[#2E7D32] rounded-3xl mb-4 shadow-xl shadow-[#2E7D32]/20">
            <Leaf className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-black text-[#1A2E1A] tracking-tight">
            EMISSIO<span className="text-[#2E7D32]">CULATOR</span>
          </h1>
          <p className="text-[#1A2E1A]/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
            Enterprise Emission Engine
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-[#1A2E1A]/5 border border-[#1A2E1A]/5">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#1A2E1A]">Masuk ke Dashboard</h2>
            <p className="text-xs font-bold text-[#1A2E1A]/40 mt-1 leading-relaxed">
              Lengkapi data instansi di bawah ini untuk mengakses sistem pemantauan dan kalkulasi emisi.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 items-start"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-600 leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1A2E1A]/50 uppercase tracking-widest ml-1">
                  Nama Instansi
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A2E1A]/30" />
                  <input 
                    type="text" 
                    placeholder="Contoh: SMA Negeri 1 Jakarta / PT Hijau Abadi"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-[#1A2E1A] placeholder:text-[#1A2E1A]/30 focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1A2E1A]/50 uppercase tracking-widest ml-1">
                  Lokasi / Alamat
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A2E1A]/30" />
                  <input 
                    type="text" 
                    placeholder="Contoh: Jl. Sudirman No. 1, Jakarta Pusat"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-[#1A2E1A] placeholder:text-[#1A2E1A]/30 focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1A2E1A]/50 uppercase tracking-widest ml-1">
                  Tipe Instansi
                </label>
                <div className="relative">
                  <select 
                    value={instType}
                    onChange={(e) => setInstType(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl px-5 py-4 text-sm font-bold text-[#1A2E1A] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="School">Sekolah (SD / SMP / SMA)</option>
                    <option value="University">Perguruan Tinggi / Universitas</option>
                    <option value="Office">Perkantoran / Korporasi</option>
                    <option value="Residential">Kawasan Hunian / Perumahan</option>
                    <option value="Park">Taman / Fasilitas Publik</option>
                    <option value="Other">Instansi Lainnya</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#1A2E1A]/40 font-bold">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#1A2E1A] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2E7D32] transition-all duration-300 shadow-xl shadow-[#1A2E1A]/10 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Menyiapkan Dashboard...</span>
                ) : (
                  <>
                    <span>MASUK KE DASHBOARD</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {onBack && (
            <div className="mt-6 pt-6 border-t border-[#1A2E1A]/5 text-center">
              <button 
                onClick={onBack}
                type="button"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1A2E1A]/50 hover:text-[#2E7D32] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Depan</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
