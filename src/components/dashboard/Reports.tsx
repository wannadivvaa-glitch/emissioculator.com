import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Table, Download, FileSpreadsheet, Search, ImageIcon } from 'lucide-react';

interface ReportsProps {
  records: any[];
}

export const Reports: React.FC<ReportsProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const unit = (r.unitName || r.unitId || r.canteenStand || '').toLowerCase();
    const cat = (r.category || '').toLowerCase();
    const date = (r.date || '').toLowerCase();
    return unit.includes(term) || cat.includes(term) || date.includes(term);
  });

  const downloadCSV = () => {
    if (records.length === 0) return;
    
    const headers = ['Tanggal', 'Sub Unit', 'Berat (KG)', 'Kategori', 'Emisi CH4 (KG)', 'Emisi CO2e (KG)', 'Dokumentasi'];
    const csvRows = [
      headers.join(','),
      ...records.map(r => [
        r.date,
        `"${r.unitName || r.canteenStand || r.unitId || 'Unit Utama'}"`,
        r.weight,
        `"${r.category || '-'}"`,
        (r.ch4 || 0).toFixed(4),
        (r.co2e || 0).toFixed(4),
        `"${r.documentationUrl || ''}"`
      ].join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `laporan_emisi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1A2E1A]">Laporan & Export</h2>
          <p className="text-[#1A2E1A]/40 text-sm font-bold uppercase tracking-widest mt-1">
            Histori & Arsip Data Emisi Organik
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-[#2E7D32]/10 text-[#2E7D32] px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#2E7D32] hover:text-white transition-all disabled:opacity-50 cursor-pointer"
            disabled={records.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4" /> 
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[#1A2E1A]/5 shadow-sm overflow-hidden">
        {records.length === 0 ? (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 bg-[#FAF8F5] rounded-full mb-4">
              <Table className="w-8 h-8 text-[#1A2E1A]/10" />
            </div>
            <p className="text-sm font-bold text-[#1A2E1A]/40 uppercase tracking-widest">
              Belum ada data emisi yang tercatat. Silakan input di tab "Data Entry".
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-[#1A2E1A]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A2E1A]/30" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari berdasarkan unit, tanggal, atau kategori..."
                  className="w-full bg-[#FAF8F5] border border-transparent rounded-2xl pl-12 pr-4 py-3 text-xs font-bold text-[#1A2E1A] focus:outline-none focus:border-[#2E7D32] transition-all"
                />
              </div>
              <span className="text-xs font-bold text-[#1A2E1A]/40">
                Menampilkan {filteredRecords.length} dari {records.length} data
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FAF8F5]">
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Tanggal</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Sub Unit</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Berat (KG)</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Kategori</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Emisi CH4</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Emisi CO2e</th>
                    <th className="px-6 py-5 text-[10px] font-black text-[#1A2E1A]/40 uppercase tracking-widest">Dokumentasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2E1A]/5">
                  {filteredRecords.map((record, i) => (
                    <tr key={record.id || i} className="hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-[#1A2E1A]">{record.date}</td>
                      <td className="px-6 py-5">
                        <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {record.unitName || record.canteenStand || record.unitId || 'Unit Utama'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-[#1A2E1A]">{record.weight} kg</td>
                      <td className="px-6 py-5 text-sm font-medium text-[#1A2E1A]/60">{record.category || 'Sampah Organik'}</td>
                      <td className="px-6 py-5 text-sm font-bold text-[#D4AF37]">
                        {(record.ch4 || 0).toFixed(4)} kg
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-sm font-black text-[#1A2E1A]">
                            {(record.co2e || 0).toFixed(3)} kg
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {record.documentationUrl ? (
                          <a 
                            href={record.documentationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#2E7D32] uppercase tracking-widest hover:underline"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Lihat Foto
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-[#1A2E1A]/30 uppercase">Tanpa Foto</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
