'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Users, Activity, FileText, Plus, MapPin, Search } from 'lucide-react';
import { getKaderPkkList, seedPkkData } from '@/app/actions/pkk';

export default function PkkDashboard() {
  const [dataKader, setDataKader] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      await seedPkkData();
      const kaderRes = await getKaderPkkList();
      setDataKader((kaderRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load PKK data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
               <HeartPulse size={20} />
             </div>
             PKK Desa Kediren
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Informasi Pemberdayaan Kesejahteraan Keluarga (PKK) Desa Kediren.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-100 transition-all">
             <FileText size={16} /> Laporan Kegiatan
           </button>
           <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-700 shadow-sm transition-all shadow-rose-200">
             <Plus size={16} /> Tambah Kader
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users size={24} />} label="Total Kader Aktif" value={dataKader.length || 0} suffix="Orang" color="bg-rose-50" textColor="text-rose-600" />
        <StatCard icon={<Activity size={24} />} label="Kelompok Dasawisma" value="12" suffix="Kelompok" color="bg-emerald-50" textColor="text-emerald-600" />
        <StatCard icon={<FileText size={24} />} label="Kegiatan Pokja" value="4" suffix="Agenda" color="bg-amber-50" textColor="text-amber-600" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
         <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users size={16} className="text-rose-500" /> Daftar Pengurus & Kader TP PKK
            </h3>
         </div>

         {/* Filter & Search Bar */}
         <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
           <div className="relative max-w-md w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Cari nama kader, jabatan..." 
               className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
             />
           </div>
         </div>

         {/* Content Table */}
         <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data kader...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Kader</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah Tugas</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataKader.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
                            {item.nama.charAt(0)}
                          </div>
                          <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-600">{item.jabatan}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> {item.areaTugas}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-slate-500">{item.kontak || '-'}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color, textColor }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${color} ${textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value} <span className="text-sm font-bold text-slate-400">{suffix}</span></p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}
