import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Store, Scale, Tag, Save, CheckCircle2, Camera, X, AlertCircle } from 'lucide-react';

interface DataEntryProps {
  onSave: (record: any) => void;
  units: string[];
}

export const DataEntry: React.FC<DataEntryProps> = ({ onSave, units }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [canteenStand, setCanteenStand] = useState(units[0] || 'Unit Utama');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('Sampah Organik');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [documentation, setDocumentation] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentation(file);
      const reader = new FileReader();
      reader.onloadend = () => setDocPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setDocumentation(null);
    setDocPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setErrorMsg("Harap masukkan berat sampah yang valid (lebih dari 0 kg).");
      return;
    }

    setIsSaving(true);
    
    // IPCC Factors: 1 kg waste = 0.05 kg CH4, 1 kg CH4 = 28 kg CO2e
    const ch4 = w * 0.05;
    const co2e = ch4 * 28;

    try {
      onSave({
        date,
        unitId: canteenStand,
        unitName: canteenStand,
        weight: w,
        category,
        ch4,
        co2e,
        documentationUrl: docPreview || '',
        createdAt: new Date().toISOString()
      });

      setIsSaving(false);
      setShowSuccess(true);
      setWeight('');
      setDocumentation(null);
      setDocPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setShowSuccess(false), 3500);
    } catch (err: any) {
      setIsSaving(false);
      setErrorMsg("Gagal menyimpan data: " + (err.message || 'Terjadi kesalahan'));
    }
  };

  const calculatedWeight = parseFloat(weight) || 0;
  const previewCH4 = calculatedWeight * 0.05;
  const previewCO2e = previewCH4 * 28;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#1A2E1A]">Data Entry Harian</h2>
        <p className="text-[#1A2E1A]/40 text-sm font-bold uppercase tracking-widest mt-1">
          Input Penimbangan Sampah Organik (Tersimpan Lokal & Cloud)
        </p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-black text-sm">Data Berhasil Disimpan!</p>
              <p className="text-xs text-emerald-700/80">
                Pencatatan emisi telah tersimpan ke sistem dan otomatis memperbarui Overview & Reports.
              </p>
            </div>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="font-bold text-sm">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-[#1A2E1A]/5 shadow-sm space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest ml-2">
                  Tanggal Input
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E7D32]" />
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-[#1A2E1A] focus:outline-none focus:border-[#2E7D32] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest ml-2">
                  Pilih Sub Unit
                </label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E7D32]" />
                  <select 
                    value={canteenStand}
                    onChange={(e) => setCanteenStand(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-[#1A2E1A] focus:outline-none focus:border-[#2E7D32] appearance-none transition-all cursor-pointer"
                  >
                    {units.map((u, i) => (
                      <option key={i} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest ml-2">
                Berat Sampah Organik (KG)
              </label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2E7D32]" />
                <input 
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl pl-12 pr-24 py-4 text-2xl font-black text-[#1A2E1A] focus:outline-none focus:border-[#2E7D32] transition-all placeholder:text-[#1A2E1A]/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[#1A2E1A]/30">
                  KILOGRAM
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest ml-2">
                Kategori Limbah
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E7D32]" />
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-[#1A2E1A] focus:outline-none focus:border-[#2E7D32] appearance-none transition-all cursor-pointer"
                >
                  <option value="Sampah Organik">Sampah Organik Umum</option>
                  <option value="Sisa Makanan">Sisa Makanan / Food Waste</option>
                  <option value="Limbah Sayuran">Limbah Sayuran & Buah</option>
                  <option value="Sisa Masak Dapur">Sisa Masak Dapur / Kantin</option>
                  <option value="Sampah Kebun / Daun">Sampah Kebun & Dedaunan</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-2">
                <label className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">
                  Dokumentasi Foto Penimbangan (Opsional)
                </label>
                {docPreview && (
                  <button 
                    type="button" 
                    onClick={removeFile}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
              
              {!docPreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-[#1A2E1A]/10 rounded-2xl bg-[#FAF8F5] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2E7D32]/30 hover:bg-[#2E7D32]/5 transition-all group"
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <p className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">
                    Klik untuk Ambil / Upload Foto (Opsional)
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-[#1A2E1A]/10 shadow-sm group">
                  <img src={docPreview} alt="Documentation Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#1A2E1A]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full py-4 bg-[#2E7D32] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1A2E1A] transition-all shadow-xl shadow-[#2E7D32]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan Data..." : "Simpan Data Penimbangan"}</span>
            </button>
          </form>
        </div>

        {/* Live Calculation Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A2E1A] text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32]/20 rounded-full blur-2xl" />
            
            <h4 className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37] mb-2">
              Kalkulasi Otomatis (IPCC Tier 1)
            </h4>
            <p className="text-xs text-white/60 mb-6">
              Berdasarkan berat penimbangan {calculatedWeight > 0 ? `${calculatedWeight} kg` : '0 kg'}:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                  Estimasi Emisi Metana (CH4)
                </span>
                <p className="text-2xl font-black text-white mt-1">
                  {previewCH4.toFixed(4)} <span className="text-xs font-bold text-[#D4AF37]">KG CH4</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">Faktor Emisi: 0.05 kg CH4 / kg sampah</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                  Total Karbon Dioksida Ekuivalen (CO2e)
                </span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {previewCO2e.toFixed(3)} <span className="text-xs font-bold text-white/60">KG CO2e</span>
                </p>
                <p className="text-[10px] text-white/40 mt-1">GWP (Global Warming Potential) Metana: 28x</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                  Setara Perjalanan Motor
                </span>
                <p className="text-xl font-black text-[#D4AF37] mt-1">
                  ~{(previewCO2e * 10).toFixed(1)} <span className="text-xs font-bold text-white/60">KM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
