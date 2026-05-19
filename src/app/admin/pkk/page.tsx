'use client';

import React from 'react';
import { HeartPulse, Users, Activity, FileText, Plus, Bell } from 'lucide-react';
import Link from 'next/link';

export default function PkkPosyanduPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
               <HeartPulse size={20} />
             </div>
             PKK & Posyandu Desa
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manajemen data kesehatan balita, ibu hamil, dan kegiatan Pemberdayaan Kesejahteraan Keluarga.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm">
             <Plus size={16} /> Jadwal Posyandu Baru
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kader Aktif</p>
            <p className="text-2xl font-black text-slate-800">24 <span className="text-sm font-medium text-slate-400">Orang</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balita Terdaftar</p>
            <p className="text-2xl font-black text-slate-800">186 <span className="text-sm font-medium text-slate-400">Anak</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kegiatan Bulan Ini</p>
            <p className="text-2xl font-black text-slate-800">4 <span className="text-sm font-medium text-slate-400">Agenda</span></p>
          </div>
        </div>
      </div>

      {/* Under Construction Banner */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-rose-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <HeartPulse size={150} />
        </div>
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md mb-4 inline-block">Modul Dalam Pengembangan</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Integrasi e-KMS dan SIP-PKK</h2>
          <p className="text-rose-100 max-w-xl leading-relaxed text-sm">
            Modul ini sedang dikembangkan untuk terintegrasi dengan Kartu Menuju Sehat (KMS) Elektronik. Nantinya data stunting dan pertumbuhan balita dapat langsung ditarik dari data Posyandu.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
           <button className="w-14 h-14 rounded-full bg-white text-rose-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
             <Bell size={24} />
           </button>
           <p className="text-center text-[10px] font-bold mt-2 uppercase tracking-widest text-rose-200">Beri Tahu Saya</p>
        </div>
      </div>
    </div>
  );
}
