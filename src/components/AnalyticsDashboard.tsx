import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { EcoHub, EmissionRecord, SubUnit } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { PieChart as PieIcon, LineChart as LineIcon, Activity, TrendingDown } from 'lucide-react';

interface AnalyticsDashboardProps {
  hub: EcoHub;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ hub }) => {
  const [records, setRecords] = useState<EmissionRecord[]>([]);
  const [units, setUnits] = useState<SubUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch units
        const unitsSnapshot = await getDocs(collection(db, `hubs/${hub.id}/units`));
        const unitList: SubUnit[] = [];
        unitsSnapshot.forEach(doc => unitList.push({ id: doc.id, ...doc.data() } as SubUnit));
        setUnits(unitList);

        // Fetch records
        const recordsSnapshot = await getDocs(
          query(collection(db, `hubs/${hub.id}/records`), orderBy('date', 'desc'), limit(50))
        );
        const recordList: EmissionRecord[] = [];
        recordsSnapshot.forEach(doc => recordList.push({ id: doc.id, ...doc.data() } as EmissionRecord));
        setRecords(recordList);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `hubs/${hub.id}/records`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hub.id]);

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
    </div>
  );

  if (records.length === 0) return (
    <div className="bg-[#2E7D32]/5 rounded-3xl p-12 text-center border border-[#2E7D32]/10">
      <p className="text-[#1A2E1A]/40 font-bold uppercase tracking-widest text-sm">Belum ada data emisi untuk {hub.name}</p>
    </div>
  );

  // Aggregations
  const unitAggregation = units.map(unit => {
    const unitRecords = records.filter(r => r.unitId === unit.id);
    return {
      name: unit.name,
      totalCO2e: unitRecords.reduce((acc, curr) => acc + curr.co2e, 0),
      totalWeight: unitRecords.reduce((acc, curr) => acc + curr.weight, 0),
    };
  }).filter(u => u.totalWeight > 0);

  const dailyAggregation = Array.from(new Set(records.map(r => r.date))).sort().map(date => {
    const dateRecords = records.filter(r => r.date === date);
    return {
      date: date.split('-').slice(1).join('/'),
      co2e: dateRecords.reduce((acc, curr) => acc + curr.co2e, 0),
    };
  });

  const totalCO2e = records.reduce((acc, curr) => acc + curr.co2e, 0);
  const totalWeight = records.reduce((acc, curr) => acc + curr.weight, 0);

  const COLORS = ['#2E7D32', '#D4AF37', '#1A2E1A', '#45A049', '#FFD700'];

  return (
    <div className="space-y-8 mt-12">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-[#1A2E1A]/5">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-[#2E7D32]" />
            <span className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Total Sampah</span>
          </div>
          <div className="text-4xl font-black text-[#1A2E1A]">{totalWeight.toFixed(1)} <span className="text-lg">kg</span></div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-[#1A2E1A]/5">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Total CO2e</span>
          </div>
          <div className="text-4xl font-black text-[#2E7D32]">{totalCO2e.toFixed(1)} <span className="text-lg">kg</span></div>
        </div>
        <div className="bg-[#1A2E1A] p-8 rounded-[2rem] text-white">
          <div className="flex items-center gap-3 mb-4">
            <LineIcon className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Units</span>
          </div>
          <div className="text-4xl font-black">{unitAggregation.length} <span className="text-lg">Units</span></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-[#1A2E1A]/5">
          <h4 className="font-bold text-[#1A2E1A] mb-8 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#2E7D32]" />
            Emisi per Unit (CO2e)
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unitAggregation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="totalCO2e"
                >
                  {unitAggregation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {unitAggregation.map((unit, idx) => (
              <div key={unit.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-xs font-bold text-[#1A2E1A]/60 truncate">{unit.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-[#1A2E1A]/5">
          <h4 className="font-bold text-[#1A2E1A] mb-8 flex items-center gap-2">
            <LineIcon className="w-5 h-5 text-[#2E7D32]" />
            Tren Emisi Harian
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAggregation}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#2E7D3210' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="co2e" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
