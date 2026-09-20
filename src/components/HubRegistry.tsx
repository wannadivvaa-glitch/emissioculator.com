import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, loginWithGoogle } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { EcoHub, SubUnit } from '../types';
import { Plus, Trash2, Building2, School, Home, Trees, Briefcase, GraduationCap, ChevronRight, LayoutDashboard, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HubRegistryProps {
  onSelectUnit: (hub: EcoHub, unit: SubUnit) => void;
  selectedUnitId?: string;
}

export const HubRegistry: React.FC<HubRegistryProps> = ({ onSelectUnit, selectedUnitId }) => {
  const { user } = useAuth();
  const [hubs, setHubs] = useState<EcoHub[]>([]);
  const [units, setUnits] = useState<{ [hubId: string]: SubUnit[] }>({});
  const [newHubName, setNewHubName] = useState('');
  const [newHubType, setNewHubType] = useState<EcoHub['type']>('School');
  const [newHubPlaceId, setNewHubPlaceId] = useState('');
  const [newHubAddress, setNewHubAddress] = useState('');
  const [newUnitNames, setNewUnitNames] = useState<{ [hubId: string]: string }>({});
  const [isAddingHub, setIsAddingHub] = useState(false);
  const [expandedHubId, setExpandedHubId] = useState<string | null>(null);

  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (isAddingHub && autocompleteRef.current) {
      const autocomplete = autocompleteRef.current;
      const handlePlaceSelect = (e: any) => {
        const place = e.target.value;
        if (place) {
          setNewHubName(place.displayName || '');
          setNewHubPlaceId(place.id || '');
          setNewHubAddress(place.formattedAddress || '');
        }
      };
      autocomplete.addEventListener('gmp-placeselect', handlePlaceSelect);
      return () => autocomplete.removeEventListener('gmp-placeselect', handlePlaceSelect);
    }
  }, [isAddingHub]);

  const fetchHubs = async () => {
    if (!user) return;
    const path = 'hubs';
    try {
      const q = query(collection(db, path), where('ownerId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const hubList: EcoHub[] = [];
      querySnapshot.forEach((doc) => {
        hubList.push({ id: doc.id, ...doc.data() } as EcoHub);
      });
      setHubs(hubList);
      
      // Fetch units for each hub
      for (const hub of hubList) {
        await fetchUnits(hub.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  };

  const fetchUnits = async (hubId: string) => {
    const path = `hubs/${hubId}/units`;
    try {
      const q = query(collection(db, path));
      const querySnapshot = await getDocs(q);
      const unitList: SubUnit[] = [];
      querySnapshot.forEach((doc) => {
        unitList.push({ id: doc.id, ...doc.data() } as SubUnit);
      });
      setUnits(prev => ({ ...prev, [hubId]: unitList }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, [user]);

  const addHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newHubName.trim()) return;
    if (!newHubPlaceId) {
      alert("Harap pilih lokasi yang terdaftar di Google Maps.");
      return;
    }
    const path = 'hubs';
    try {
      await addDoc(collection(db, path), {
        name: newHubName,
        type: newHubType,
        placeId: newHubPlaceId,
        address: newHubAddress,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewHubName('');
      setNewHubPlaceId('');
      setNewHubAddress('');
      setIsAddingHub(false);
      fetchHubs();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const addUnit = async (hubId: string) => {
    const unitName = newUnitNames[hubId];
    if (!unitName?.trim()) return;
    const path = `hubs/${hubId}/units`;
    try {
      await addDoc(collection(db, path), {
        hubId,
        name: unitName,
        createdAt: serverTimestamp(),
      });
      setNewUnitNames(prev => ({ ...prev, [hubId]: '' }));
      fetchUnits(hubId);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteHub = async (hubId: string) => {
    if (!window.confirm('Hapus tempat ini beserta semua unit di dalamnya?')) return;
    const path = `hubs/${hubId}`;
    try {
      await deleteDoc(doc(db, 'hubs', hubId));
      fetchHubs();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-[2rem] p-8 border border-[#1A2E1A]/5 text-center">
        <div className="bg-[#2E7D32]/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-8 h-8 text-[#2E7D32]" />
        </div>
        <h3 className="text-xl font-bold mb-2">Kelola Eco-Hub Anda</h3>
        <p className="text-[#1A2E1A]/60 text-sm mb-6">Masuk untuk mendaftarkan instansi, sekolah, atau perumahan Anda guna pelaporan emisi yang terpusat.</p>
        <button 
          onClick={loginWithGoogle}
          className="bg-[#1A2E1A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2E7D32] transition-all"
        >
          Masuk dengan Google
        </button>
      </div>
    );
  }

  const getTypeIcon = (type: EcoHub['type']) => {
    switch (type) {
      case 'School': return <School className="w-5 h-5" />;
      case 'Office': return <Briefcase className="w-5 h-5" />;
      case 'Residential': return <Home className="w-5 h-5" />;
      case 'Park': return <Trees className="w-5 h-5" />;
      case 'University': return <GraduationCap className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-[#1A2E1A] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[#2E7D32]" />
          My Eco-Hubs
        </h3>
        <button 
          onClick={() => setIsAddingHub(true)}
          className="bg-[#2E7D32] text-white p-2 rounded-xl hover:bg-[#1A2E1A] transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isAddingHub && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#2E7D32]/5 p-6 rounded-3xl border border-[#2E7D32]/20"
          >
            <form onSubmit={addHub} className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2E7D32] z-10" />
                {/* @ts-ignore */}
                <gmp-place-autocomplete
                  ref={autocompleteRef}
                  placeholder="Cari Lokasi Instansi di Maps"
                  className="w-full bg-white border border-[#2E7D32]/20 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
              
              {newHubAddress && (
                <p className="text-[10px] font-bold text-[#2E7D32] px-2 italic line-clamp-1">{newHubAddress}</p>
              )}

              <div className="grid grid-cols-2 gap-2">
                {(['School', 'Office', 'Residential', 'Park', 'University', 'Other'] as EcoHub['type'][]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewHubType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      newHubType === type ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#1A2E1A]/40 border border-[#1A2E1A]/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#2E7D32] text-white py-3 rounded-xl font-bold text-sm">Daftarkan Tempat</button>
                <button type="button" onClick={() => setIsAddingHub(false)} className="px-6 py-3 border border-[#1A2E1A]/10 rounded-xl font-bold text-sm">Batal</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {hubs.map(hub => (
          <div key={hub.id} className="bg-white rounded-[2rem] border border-[#1A2E1A]/5 overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div 
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => setExpandedHubId(expandedHubId === hub.id ? null : hub.id)}
              >
                <div className="bg-[#2E7D32]/10 p-3 rounded-2xl text-[#2E7D32]">
                  {getTypeIcon(hub.type)}
                </div>
                <div>
                  <h4 className="font-bold text-[#1A2E1A]">{hub.name}</h4>
                  <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                    {hub.type}
                    {hub.address && <span className="text-[#1A2E1A]/20 normal-case font-medium truncate max-w-[200px]">• {hub.address}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => deleteHub(hub.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className={`w-5 h-5 transition-transform ${expandedHubId === hub.id ? 'rotate-90' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedHubId === hub.id && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-[#FAF8F5] border-t border-[#1A2E1A]/5 px-6 pb-6"
                >
                  <div className="pt-6 space-y-3">
                    <p className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest mb-2">Sub-Units (e.g. Units/Departments)</p>
                    {units[hub.id]?.map(unit => (
                      <button
                        key={unit.id}
                        onClick={() => onSelectUnit(hub, unit)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          selectedUnitId === unit.id 
                            ? 'bg-[#2E7D32] text-white border-transparent shadow-lg shadow-[#2E7D32]/20' 
                            : 'bg-white text-[#1A2E1A] border-[#1A2E1A]/5 hover:border-[#2E7D32]/30'
                        }`}
                      >
                        <span className="font-bold text-sm">{unit.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                    <div className="pt-2">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Nama Unit Baru..."
                          value={newUnitNames[hub.id] || ''}
                          onChange={(e) => setNewUnitNames(prev => ({ ...prev, [hub.id]: e.target.value }))}
                          className="flex-1 bg-white border border-[#1A2E1A]/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2E7D32]"
                        />
                        <button 
                          onClick={() => addUnit(hub.id)}
                          className="bg-[#1A2E1A] text-white p-2 rounded-xl"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
