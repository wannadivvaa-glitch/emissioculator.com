import { motion } from "motion/react";
import { Calculator as CalcIcon, Droplets, Info, Wind, Save, CheckCircle2, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";
import { EcoHub, SubUnit } from "../types";

interface CalculatorProps {
  selectedHub: EcoHub | null;
  selectedUnit: SubUnit | null;
}

export const Calculator: React.FC<CalculatorProps> = ({ selectedHub, selectedUnit }) => {
  const { user } = useAuth();
  const [weight, setWeight] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // IPCC Tier 1 Conversion Factors
  const CH4_FACTOR = 0.05; // 0.05 kg CH4 per 1 kg organic waste
  const CO2E_FACTOR = 28;  // GWP 100 for CH4 (IPCC AR5)

  const methane = weight * CH4_FACTOR;
  const co2e = methane * CO2E_FACTOR;

  const saveRecord = async () => {
    if (!user || !selectedHub || !selectedUnit || weight <= 0) return;
    setIsSaving(true);
    const path = `hubs/${selectedHub.id}/records`;
    try {
      await addDoc(collection(db, path), {
        hubId: selectedHub.id,
        unitId: selectedUnit.id,
        weight,
        ch4: methane,
        co2e,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      setSaveSuccess(true);
      setWeight(0);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="calculator" className="py-24 bg-[#1A2E1A] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex p-3 bg-[#2E7D32]/20 rounded-2xl mb-4"
          >
            <CalcIcon className="w-8 h-8 text-[#D4AF37]" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">IPCC Tier 1 Calculator</h2>
          <p className="text-[#FAF8F5]/60 max-w-2xl mx-auto">
            Simulasikan data penimbangan sampah kantin Anda untuk melihat estimasi emisi gas rumah kaca secara real-time.
          </p>

          {selectedUnit && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 inline-flex items-center gap-3 bg-[#2E7D32] px-6 py-3 rounded-2xl border border-white/10 shadow-xl"
            >
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <div className="text-left">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Logging To Unit</p>
                <p className="font-bold text-sm">{selectedHub?.name} - {selectedUnit.name}</p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] backdrop-blur-xl">
            <label className="block text-sm font-black uppercase tracking-widest text-[#D4AF37] mb-6">
              Input Berat Sampah Organik (kg)
            </label>
            <div className="relative mb-8">
              <input 
                type="number" 
                value={weight || ""}
                onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#1A2E1A] border-2 border-[#2E7D32]/30 rounded-2xl px-8 py-6 text-4xl font-black focus:outline-none focus:border-[#2E7D32] transition-all text-white placeholder:text-white/10"
                placeholder="0.00"
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-[#D4AF37]">KG</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#2E7D32]/20 p-6 rounded-2xl border border-[#2E7D32]/30">
                <div className="flex items-center gap-3 mb-2">
                  <Wind className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FAF8F5]/60">Metana (CH4)</span>
                </div>
                <div className="text-3xl font-black">{methane.toFixed(3)} <span className="text-sm">kg</span></div>
              </div>
              <div className="bg-[#D4AF37]/20 p-6 rounded-2xl border border-[#D4AF37]/30">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FAF8F5]/60">CO2 Ekuivalen</span>
                </div>
                <div className="text-3xl font-black">{co2e.toFixed(3)} <span className="text-sm">kg CO2e</span></div>
              </div>
            </div>

            {selectedUnit && (
              <button
                onClick={saveRecord}
                disabled={weight <= 0 || isSaving}
                className={`w-full py-6 rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                  saveSuccess 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#D4AF37] text-[#1A2E1A] hover:bg-white disabled:opacity-50'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" /> DATA TERSIMPAN!
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" /> {isSaving ? 'MENYIMPAN...' : 'SIMPAN KE DATABASE'}
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center font-black text-xl">1</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Pencatatan Akurat</h4>
                <p className="text-[#FAF8F5]/60 leading-relaxed">Setiap gram sampah organik yang tidak terkelola dengan baik akan berfermentasi di TPA dan menghasilkan gas metana yang sangat kuat.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center font-black text-xl text-[#1A2E1A]">2</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Konversi IPCC</h4>
                <p className="text-[#FAF8F5]/60 leading-relaxed">Kami menggunakan GWP (Global Warming Potential) 28 untuk metana, yang berarti metana 28 kali lebih berbahaya bagi atmosfer dibanding CO2.</p>
              </div>
            </div>
            {!selectedUnit && (
              <div className="bg-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/20 flex gap-4 items-start">
                <MapPin className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
                <div>
                  <p className="font-bold text-[#D4AF37] mb-1">Pilih Unit Terlebih Dahulu</p>
                  <p className="text-xs text-[#FAF8F5]/60 italic leading-relaxed">Daftarkan tempat dan unit Anda di fitur "My Eco-Hub" untuk menyimpan data ini secara permanen.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
