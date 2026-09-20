import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Products } from "./components/Products";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { AIChat } from "./components/AIChat";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { useState, useEffect } from "react";
import { Leaf, ArrowRight } from "lucide-react";

function AppContent() {
  const { user, profile, loading, logout, institutionName } = useAuth();
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');

  const currentInstitution = institutionName || profile?.institutionName || localStorage.getItem('em_inst_name');
  const hasActiveSession = Boolean(currentInstitution);

  const handleAuthSuccess = (name: string) => {
    setView('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] flex items-center justify-center animate-pulse">
            <Leaf className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <p className="text-xs font-black text-[#1A2E1A]/40 uppercase tracking-widest">
            Memuat Sistem Emissioculator...
          </p>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <AuthPage 
        onAuthSuccess={handleAuthSuccess} 
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <Dashboard 
        institutionName={currentInstitution || 'Instansi Terdaftar'} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-['Plus_Jakarta_Sans'] selection:bg-[#2E7D32]/20 selection:text-[#2E7D32]">
      <Navbar 
        onOpenAuth={() => setView('auth')} 
        onOpenDashboard={() => setView('dashboard')}
        hasActiveSession={hasActiveSession}
      />
      <main>
        <Hero onStartAuth={() => setView('auth')} />
        
        <section className="py-24 bg-white border-y border-[#1A2E1A]/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex p-4 bg-[#2E7D32]/5 rounded-3xl mb-8">
              <Leaf className="w-8 h-8 text-[#2E7D32]" />
            </div>
            <h2 className="text-4xl font-black text-[#1A2E1A] mb-6">Portal Emisi Institusi Terintegrasi</h2>
            <p className="max-w-2xl mx-auto text-[#1A2E1A]/60 font-medium mb-12">
              Satu portal untuk satu instansi. Kelola data penimbangan dan konversi emisi seluruh sub-unit secara terpusat dan akurat.
            </p>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setView(hasActiveSession ? 'dashboard' : 'auth')}
                className="bg-[#1A2E1A] text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-[#2E7D32] transition-all shadow-2xl shadow-[#1A2E1A]/10 group flex items-center gap-3 cursor-pointer"
              >
                <span>{hasActiveSession ? 'BUKA DASHBOARD ANDA' : 'MASUK KE DASHBOARD'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-[#1A2E1A] mb-4">Metodologi IPCC Tier 1</h2>
              <p className="text-[#1A2E1A]/40 font-black uppercase tracking-[0.2em] text-xs">Standar Internasional Pengukuran Emisi</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-[#1A2E1A]/5 shadow-sm">
                <div className="w-12 h-12 bg-[#2E7D32]/5 rounded-2xl flex items-center justify-center mb-6 text-[#2E7D32] font-black">01</div>
                <h4 className="text-xl font-black mb-4">Pengumpulan Data</h4>
                <p className="text-sm text-[#1A2E1A]/60 leading-relaxed font-medium">Input penimbangan sampah organik harian dari setiap sub-unit dengan pencatatan terstruktur.</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-[#1A2E1A]/5 shadow-sm">
                <div className="w-12 h-12 bg-[#2E7D32]/5 rounded-2xl flex items-center justify-center mb-6 text-[#2E7D32] font-black">02</div>
                <h4 className="text-xl font-black mb-4">Konversi Emisi</h4>
                <p className="text-sm text-[#1A2E1A]/60 leading-relaxed font-medium">Sistem secara otomatis mengalkulasi emisi CH4 dan CO2e menggunakan faktor emisi IPCC yang presisi.</p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-[#1A2E1A]/5 shadow-sm">
                <div className="w-12 h-12 bg-[#2E7D32]/5 rounded-2xl flex items-center justify-center mb-6 text-[#2E7D32] font-black">03</div>
                <h4 className="text-xl font-black mb-4">Analisis & Laporan</h4>
                <p className="text-sm text-[#1A2E1A]/60 leading-relaxed font-medium">Dashboard visual menyajikan tren emisi mingguan, ekspor CSV, dan rekomendasi berbasis AI.</p>
              </div>
            </div>
          </div>
        </section>

        <Products />
        <FAQ />
      </main>
      <Footer />
      <AIChat />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
