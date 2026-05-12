'use client';

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Network
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getStrukturOrganisasi } from '@/app/actions/struktur';

export default function BaganVisualPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStrukturOrganisasi().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const kades = data.find(j => j.id === 1);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin text-emerald-500"><Network size={40} /></div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col -m-8 overflow-hidden bg-slate-50">
      {/* Mini Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings/profil" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="font-black text-slate-800 text-lg leading-tight">Bagan Organisasi Desa</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Visualisasi Hierarki Kepemimpinan</p>
          </div>
        </div>
        <div className="flex items-center gap-3 no-print">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ZoomIn size={16} /></button>
             <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ZoomOut size={16} /></button>
             <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Maximize size={16} /></button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-12 custom-scrollbar">
         <div className="min-w-max flex flex-col items-center">
            {kades && <Node jabatan={kades} allData={data} />}
         </div>
      </div>

      <style jsx global>{`
         .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

function Node({ jabatan, allData }: { jabatan: any, allData: any[] }) {
  const children = allData.filter(j => j.parentId === jabatan.id);

  return (
    <div className="flex flex-col items-center">
      {/* Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className={`
          w-56 bg-white p-4 rounded-3xl border-2 transition-all shadow-lg
          ${jabatan.level === 1 ? 'border-emerald-500 shadow-emerald-100' : 'border-slate-100 hover:border-emerald-300'}
        `}>
          <div className="flex flex-col items-center text-center space-y-3">
             <div className={`
                w-16 h-16 rounded-2xl bg-slate-50 border-2 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner
                ${jabatan.level === 1 ? 'border-emerald-100' : 'border-slate-100'}
             `}>
                {jabatan.perangkat && jabatan.perangkat.length > 0 && jabatan.perangkat[0].fotoProfil ? (
                   <img src={jabatan.perangkat[0].fotoProfil} className="w-full h-full object-cover" />
                ) : (
                   <Network size={24} />
                )}
             </div>
             <div>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{jabatan.namaJabatan}</p>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {jabatan.perangkat && jabatan.perangkat.length > 0 
                   ? (jabatan.perangkat[0].nama) 
                   : 'BELUM TERISI'}
                </p>
                <p className="text-[8px] font-mono text-slate-400 mt-1">{jabatan.perangkat && jabatan.perangkat.length > 0 ? jabatan.perangkat[0].nik : '---------'}</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Connection Lines & Children */}
      {children.length > 0 && (
        <div className="flex flex-col items-center mt-8">
           {/* Vertical Line from parent */}
           <div className="w-0.5 h-8 bg-slate-200 -mt-8 mb-0"></div>
           
           {/* Horizontal Line connecting siblings */}
           <div className="flex flex-row relative pt-8">
              {children.length > 1 && (
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200"></div>
              )}
              
              {children.map((child, idx) => (
                <div key={child.id} className="relative px-8">
                   {/* Vertical line to each sibling */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                   <Node jabatan={child} allData={allData} />
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
