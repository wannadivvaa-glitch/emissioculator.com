import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Database, 
  Calculator, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  Search, 
  User,
  Leaf,
  Menu,
  Building2,
  ArrowRight,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import { Overview } from './dashboard/Overview';
import { DataEntry } from './dashboard/DataEntry';
import { CalculatorModule } from './dashboard/CalculatorModule';
import { Reports } from './dashboard/Reports';
import { AIConsultant } from './dashboard/AIConsultant';
import { useAuth } from '../lib/AuthContext';
import { db, loginWithGoogle } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, onSnapshot } from 'firebase/firestore';

interface DashboardProps {
  institutionName: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ institutionName, onLogout }) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [units, setUnits] = useState<string[]>(['Unit Utama', 'Kantin', 'Area Kompos']);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const currentInstId = profile?.institutionId || localStorage.getItem('em_inst_id') || 'inst_default';
  const displayInstName = institutionName || profile?.institutionName || localStorage.getItem('em_inst_name') || 'Instansi Terdaftar';
  const displayAddress = localStorage.getItem('em_inst_address') || 'Alamat Terdaftar';

  // Load Initial Records & Units from Local Storage
  useEffect(() => {
    const storageKey = `em_records_${currentInstId}`;
    const localRecords = localStorage.getItem(storageKey);
    
    if (localRecords) {
      try {
        const parsed = JSON.parse(localRecords);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
        } else {
          loadInitialDemoRecords();
        }
      } catch (e) {
        loadInitialDemoRecords();
      }
    } else {
      loadInitialDemoRecords();
    }

    const unitsKey = `em_units_${currentInstId}`;
    const savedUnits = localStorage.getItem(unitsKey);
    if (savedUnits) {
      try {
        const parsedUnits = JSON.parse(savedUnits);
        if (Array.isArray(parsedUnits) && parsedUnits.length > 0) {
          setUnits(parsedUnits);
        }
      } catch (e) {
        // keep default
      }
    }
  }, [currentInstId]);

  const loadInitialDemoRecords = () => {
    const today = new Date();
    const demo = [
      {
        id: `rec_${Date.now() - 86400000 * 2}`,
        institutionId: currentInstId,
        unitId: 'Kantin',
        unitName: 'Kantin',
        weight: 18.5,
        category: 'Sisa Makanan',
        ch4: 18.5 * 0.05,
        co2e: 18.5 * 0.05 * 28,
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: `rec_${Date.now() - 86400000}`,
        institutionId: currentInstId,
        unitId: 'Unit Utama',
        unitName: 'Unit Utama',
        weight: 24.0,
        category: 'Sampah Dapur',
        ch4: 24.0 * 0.05,
        co2e: 24.0 * 0.05 * 28,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: `rec_${Date.now()}`,
        institutionId: currentInstId,
        unitId: 'Area Kompos',
        unitName: 'Area Kompos',
        weight: 12.0,
        category: 'Limbah Sayuran',
        ch4: 12.0 * 0.05,
        co2e: 12.0 * 0.05 * 28,
        date: today.toISOString().split('T')[0],
        createdAt: today.toISOString()
      }
    ];
    setRecords(demo);
    localStorage.setItem(`em_records_${currentInstId}`, JSON.stringify(demo));
  };

  // Sync with Firestore if authenticated
  useEffect(() => {
    if (!user || !db || !currentInstId) return;

    try {
      const q = query(collection(db, 'institutions', currentInstId, 'records'));
      const unsubscribe = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const cloudRecords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setRecords(prev => {
            const map = new Map<string, any>();
            prev.forEach(r => map.set(r.id, r));
            cloudRecords.forEach((r: any) => map.set(r.id, r));
            const merged = Array.from(map.values()).sort((a, b) => {
              return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
            });
            localStorage.setItem(`em_records_${currentInstId}`, JSON.stringify(merged));
            return merged;
          });
        }
      }, (err) => {
        console.warn("Firestore subscription notice:", err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Cloud listener init notice:", err);
    }
  }, [user, currentInstId]);

  const handleSaveRecord = async (record: any) => {
    try {
      const recordId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const weightNum = Number(record.weight) || 0;
      const ch4Val = Number(record.ch4) || weightNum * 0.05;
      const co2eVal = Number(record.co2e) || ch4Val * 28;

      const newRecord = {
        id: recordId,
        institutionId: currentInstId,
        unitId: record.unitId || record.unitName || 'Unit Utama',
        unitName: record.unitName || record.unitId || 'Unit Utama',
        weight: weightNum,
        category: record.category || 'Sampah Organik',
        ch4: ch4Val,
        co2e: co2eVal,
        documentationUrl: record.documentationUrl || '',
        submittedBy: profile?.uid || user?.uid || 'guest_user',
        date: record.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      // 1. Immediately update UI state
      setRecords(prev => [newRecord, ...prev]);

      // 2. Persist to localStorage
      const updated = [newRecord, ...records];
      localStorage.setItem(`em_records_${currentInstId}`, JSON.stringify(updated));

      // 3. Persist to Firestore if user is authenticated
      if (user && db) {
        try {
          await setDoc(doc(db, 'institutions', currentInstId, 'records', recordId), newRecord);
          await setDoc(doc(db, 'emission_records', recordId), newRecord);
        } catch (fbErr) {
          console.warn("Firestore background sync notice:", fbErr);
        }
      }
    } catch (err) {
      console.error("Error saving record:", err);
    }
  };

  const handleAddUnit = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !units.includes(trimmed)) {
      const updated = [...units, trimmed];
      setUnits(updated);
      localStorage.setItem(`em_units_${currentInstId}`, JSON.stringify(updated));
    }
  };

  const handleRemoveUnit = (name: string) => {
    const updated = units.filter(u => u !== name);
    setUnits(updated);
    localStorage.setItem(`em_units_${currentInstId}`, JSON.stringify(updated));
  };

  const handleSearch = async (queryStr: string) => {
    setSearchQuery(queryStr);
    if (queryStr.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      if (db) {
        const q = query(
          collection(db, 'institutions'),
          where('name', '>=', queryStr),
          where('name', '<=', queryStr + '\uf8ff')
        );
        const snap = await getDocs(q);
        setSearchResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (err) {
      // Local search fallback
      if (displayInstName.toLowerCase().includes(queryStr.toLowerCase())) {
        setSearchResults([{ id: currentInstId, name: displayInstName, address: displayAddress }]);
      } else {
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'entry', label: 'Data Entry', icon: Database },
    { id: 'calculator', label: 'IPCC Engine', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'management', label: 'Management', icon: User },
    { id: 'consultant', label: 'AI Consultant', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': 
        return <Overview institutionName={displayInstName} records={records} />;
      case 'entry': 
        return <DataEntry onSave={handleSaveRecord} units={units} />;
      case 'calculator': 
        return <CalculatorModule />;
      case 'reports': 
        return <Reports records={records} />;
      case 'management': 
        return (
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-black text-[#1A2E1A]">Manajemen Sub-Unit</h3>
                <p className="text-[#1A2E1A]/60 mt-1 text-sm">
                  Kelola daftar sub-unit (seperti Kantin, Gedung A, Laboratorium) untuk pelacakan limbah terperinci.
                </p>
              </div>
            </div>
            
            <div className="space-y-3 my-8">
              {units.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl border border-[#1A2E1A]/5 hover:border-[#2E7D32]/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32] font-black text-xs">
                      {i + 1}
                    </div>
                    <span className="font-bold text-[#1A2E1A] text-sm">{u}</span>
                  </div>
                  {units.length > 1 && (
                    <button 
                      onClick={() => handleRemoveUnit(u)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Hapus unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={(e: any) => {
              e.preventDefault();
              const name = e.target.unitName.value;
              if (name) {
                handleAddUnit(name);
                e.target.reset();
              }
            }} className="flex gap-2">
              <input 
                name="unitName"
                type="text" 
                placeholder="Tambah nama sub-unit baru..." 
                className="flex-1 bg-[#FAF8F5] border border-[#1A2E1A]/10 rounded-2xl px-5 py-4 text-sm font-bold text-[#1A2E1A] placeholder:text-[#1A2E1A]/30 focus:border-[#2E7D32] focus:bg-white outline-none transition-all"
              />
              <button 
                type="submit" 
                className="bg-[#2E7D32] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1A2E1A] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2E7D32]/10"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </form>
          </div>
        );
      case 'consultant': 
        return <AIConsultant />;
      default: 
        return <Overview institutionName={displayInstName} records={records} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex overflow-hidden font-['Plus_Jakarta_Sans'] selection:bg-[#2E7D32]/20 selection:text-[#2E7D32]">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="bg-[#1A2E1A] text-white flex flex-col relative z-50 shadow-2xl shrink-0 transition-all duration-300"
      >
        <div className="p-6 h-24 flex items-center justify-between overflow-hidden border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-[#2E7D32] p-2.5 rounded-xl shrink-0">
              <Leaf className="w-6 h-6 text-[#D4AF37]" />
            </div>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-w-0">
                <span className="font-black text-lg leading-none tracking-tight">
                  EMISSIO<span className="text-[#2E7D32]">CULATOR</span>
                </span>
                <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">
                  Enterprise Engine
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-[#2E7D32] text-white shadow-xl shadow-[#2E7D32]/20' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-[#D4AF37]' : ''}`} />
              {isSidebarOpen && <span className="font-bold text-sm truncate">{item.label}</span>}
              {activeTab === item.id && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1.5 h-6 bg-[#D4AF37] rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          {isSidebarOpen && (
            <div className="px-4 py-3 bg-white/5 rounded-2xl mb-2">
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Penyimpanan Aktif</span>
              </div>
              <p className="text-[10px] text-white/50 mt-1 truncate">
                {records.length} data emisi tersimpan
              </p>
            </div>
          )}

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Keluar Dashboard</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white border-b border-[#1A2E1A]/5 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-xl">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-[#FAF8F5] rounded-xl transition-all cursor-pointer text-[#1A2E1A]"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex-1 items-center gap-2 px-4 py-2.5 bg-[#FAF8F5] rounded-2xl border border-[#1A2E1A]/5 relative hidden sm:flex">
              <Search className="w-4 h-4 text-[#1A2E1A]/30 shrink-0" />
              <input 
                type="text" 
                placeholder="Cari data atau organisasi..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-xs font-bold w-full text-[#1A2E1A] placeholder:text-[#1A2E1A]/30" 
              />
              
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-[#1A2E1A]/5 p-2 z-[60]"
                  >
                    {searchResults.map((res) => (
                      <div 
                        key={res.id}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-[#FAF8F5] rounded-2xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#2E7D32]/10 rounded-xl flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-[#2E7D32]" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-[#1A2E1A]">{res.name}</p>
                            <p className="text-[10px] font-bold text-[#1A2E1A]/40 line-clamp-1">{res.address || 'Instansi Terverifikasi'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[9px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Instansi Aktif</span>
              <span className="text-xs font-black text-[#1A2E1A] max-w-[200px] truncate">{displayInstName}</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="h-11 px-3 bg-[#1A2E1A] rounded-2xl flex items-center gap-2.5 text-[#D4AF37] font-black border-2 border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all cursor-pointer shadow-sm"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-[#2E7D32] rounded-full flex items-center justify-center text-white text-xs">
                    {displayInstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-white hidden sm:inline max-w-[100px] truncate">
                  {user?.displayName || displayInstName}
                </span>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-[#1A2E1A]/5 p-6 z-50"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b border-[#1A2E1A]/5">
                        <div className="w-12 h-12 bg-[#2E7D32] rounded-2xl flex items-center justify-center text-white font-black text-xl">
                          {displayInstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-[#1A2E1A] text-sm truncate">{displayInstName}</span>
                          <span className="text-[10px] font-bold text-[#1A2E1A]/50 truncate">{displayAddress}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Status Akses</span>
                        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#1A2E1A]/5 flex items-center justify-between">
                          <span className="text-xs font-black text-[#2E7D32]">
                            {user ? 'Cloud Connected' : 'Local Storage Mode'}
                          </span>
                          <span className="text-[10px] font-bold text-[#1A2E1A]/40">
                            {user ? 'Google' : 'Perangkat Ini'}
                          </span>
                        </div>
                      </div>

                      {!user && (
                        <button 
                          onClick={async () => {
                            try {
                              await loginWithGoogle();
                              setIsProfileMenuOpen(false);
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="w-full py-3 bg-[#1A2E1A] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2E7D32] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                          <Cloud className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Hubungkan Akun Google</span>
                        </button>
                      )}

                      <button 
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Platform</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
