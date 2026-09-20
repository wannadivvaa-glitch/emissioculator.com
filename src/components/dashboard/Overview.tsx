import React from 'react';
import { motion } from 'motion/react';
import { Activity, Wind, Droplets, TrendingDown, Info, ArrowUpRight, Bike, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

interface OverviewProps {
  institutionName: string;
  records: any[];
}

export const Overview: React.FC<OverviewProps> = ({ institutionName, records }) => {
  const totalWeight = records.reduce((acc, curr) => acc + curr.weight, 0);
  const totalCH4 = records.reduce((acc, curr) => acc + curr.ch4, 0);
  const totalCO2e = records.reduce((acc, curr) => acc + curr.co2e, 0);
  
  // 1 kg CO2e = 10 km motor ride
  const motorKm = totalCO2e * 10;

  // Aggregate daily records
  const dailyDataMap = records.reduce((acc: any, curr) => {
    const day = new Date(curr.date).toLocaleDateString('id-ID', { weekday: 'short' });
    if (!acc[day]) acc[day] = { day, weight: 0, co2e: 0 };
    acc[day].weight += curr.weight;
    acc[day].co2e += curr.co2e;
    return acc;
  }, {});

  const chartData = Object.values(dailyDataMap).length > 0 
    ? Object.values(dailyDataMap) 
    : [];

  // Aggregate canteen / unit records
  const canteenMap = records.reduce((acc: any, curr) => {
    const name = curr.unitName || curr.canteenStand || curr.unitId || 'Unit Utama';
    if (!acc[name]) acc[name] = { name, value: 0 };
    acc[name].value += curr.weight;
    return acc;
  }, {});

  const canteenData = Object.values(canteenMap).length > 0
    ? Object.values(canteenMap)
    : [];

  const COLORS = ['#2E7D32', '#D4AF37', '#1A2E1A', '#45A049', '#689F38'];

  const downloadCSV = () => {
    if (records.length === 0) return;
    const headers = ["Tanggal", "Sub Unit", "Berat (KG)", "CH4 (KG)", "CO2e (KG)", "Kategori"];
    const rows = records.map(r => [
      r.date,
      r.unitName || r.canteenStand || r.unitId || 'Unit Utama',
      r.weight,
      (r.ch4 || 0).toFixed(3),
      (r.co2e || 0).toFixed(3),
      r.category || '-'
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `report_emisi_${institutionName.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1A2E1A]">Dashboard Overview</h2>
          <p className="text-[#1A2E1A]/40 text-sm font-bold uppercase tracking-widest mt-1">{institutionName}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-[#1A2E1A]/5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:border-[#2E7D32]/20 transition-all">7 Hari Terakhir</button>
          <button 
            onClick={downloadCSV}
            disabled={records.length === 0}
            className="bg-[#1A2E1A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl shadow-[#1A2E1A]/10 flex items-center gap-2 hover:bg-[#2E7D32] transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sampah', val: totalWeight, unit: 'kg', icon: Activity, color: '#2E7D32', bg: 'bg-[#2E7D32]/5' },
          { label: 'Total CH4', val: totalCH4, unit: 'kg', icon: Wind, color: '#D4AF37', bg: 'bg-[#D4AF37]/5' },
          { label: 'Total CO2e', val: totalCO2e, unit: 'kg', icon: Droplets, color: '#1A2E1A', bg: 'bg-[#1A2E1A]/5' },
          { label: 'Reduksi Target', val: 0, unit: '%', icon: TrendingDown, color: '#2E7D32', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[2rem] bg-white border border-[#1A2E1A]/5 relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
            <stat.icon className="w-5 h-5 mb-4 relative z-10" style={{ color: stat.color }} />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="text-3xl font-black text-[#1A2E1A] flex items-baseline gap-1">
                {stat.val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                <span className="text-sm font-bold text-[#1A2E1A]/40">{stat.unit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {records.length === 0 ? (
        <div className="bg-white border border-[#1A2E1A]/5 rounded-[2.5rem] p-12 text-center">
          <div className="bg-[#FAF8F5] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-[#1A2E1A]/10" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E1A] mb-2">Belum Ada Data Penimbangan</h3>
          <p className="text-[#1A2E1A]/40 max-w-md mx-auto text-sm">
            Silakan lakukan input penimbangan sampah organik harian di menu <b>Data Entry</b> untuk melihat analisis emisi instansi Anda.
          </p>
        </div>
      ) : (
        <>
          {/* Impact Widget */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1A2E1A] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32]/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mb-6">
                  <Info className="w-3 h-3 text-[#D4AF37]" />
                  Real-World Impact Analysis
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  Emisi Anda setara dengan mengendarai motor sejauh <span className="text-[#D4AF37]">{motorKm.toLocaleString(undefined, { maximumFractionDigits: 0 })} KM!</span>
                </h3>
                <p className="text-white/60 font-medium leading-relaxed max-w-md">
                  Bayangkan jumlah polusi yang bisa kita tekan dengan mengelola limbah organik secara sirkular. Data ini adalah langkah awal perubahan besar.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                <div className="flex items-center justify-between mb-8">
                  <Bike className="w-12 h-12 text-[#D4AF37]" />
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Impact Scale</p>
                    <p className="text-2xl font-black text-white">{totalCO2e > 500 ? 'High' : totalCO2e > 100 ? 'Moderate' : 'Low'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (totalCO2e / 1000) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-[#2E7D32] to-[#D4AF37]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <span>Safe</span>
                    <span>Warning</span>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-[#1A2E1A] uppercase tracking-wider text-sm">Tren Emisi & Sampah Harian</h4>
                <ArrowUpRight className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCo2e" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A2E1A08" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#1A2E1A40' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#1A2E1A40' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="co2e" stroke="#2E7D32" strokeWidth={4} fillOpacity={1} fill="url(#colorCo2e)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-[#1A2E1A] uppercase tracking-wider text-sm">Kontribusi per Sub Unit (kg)</h4>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                    <span className="text-[10px] font-bold text-[#1A2E1A]/40">Active</span>
                  </div>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={canteenData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A2E1A08" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#1A2E1A40' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#1A2E1A40' }} />
                    <Tooltip 
                      cursor={{ fill: '#1A2E1A05' }}
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {canteenData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
