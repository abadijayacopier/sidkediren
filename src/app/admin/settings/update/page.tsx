'use client';

import React from 'react';
import { RefreshCw, ArrowLeft, CheckCircle2, Clock, Package, GitBranch, Download, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const changelog = [
  { version: 'V2.1.0', date: '19 Mei 2026', current: true, changes: ['Mobile responsive premium layout', 'BPN Cadastral Plotter (Pemetaan Tanah)', 'Custom SweetAlert2 premium dialogs', 'Halaman pengaturan lengkap (Telegram, 2FA, Backup)'] },
  { version: 'V2.0.5', date: '15 Mei 2026', current: false, changes: ['Peta GIS interaktif + layer kontrol', 'Dashboard statistik realtime', 'Manajemen surat otomatis'] },
  { version: 'V2.0.0', date: '10 Mei 2026', current: false, changes: ['Launch awal Sistem Informasi Desa', 'Modul kependudukan & KK', 'Persuratan digital dengan QR Code'] },
];

export default function UpdatePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <RefreshCw size={22} />
            </div>
            Update Fitur Sistem
          </h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui sistem dari repositori resmi.</p>
        </div>
      </div>

      {/* Current Version */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center gap-4 shadow-lg shadow-indigo-200">
        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
          <Package size={28} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Versi Saat Ini</p>
          <p className="text-2xl font-black">SID Kediren V2.1.0</p>
          <p className="text-xs opacity-70 mt-0.5">Release: 19 Mei 2026 — Build #2026.1.0.1</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Terbaru
          </span>
        </div>
      </motion.div>

      {/* Check Update */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Sistem sudah versi terbaru</p>
              <p className="text-xs text-slate-500">Terakhir dicek: Hari ini pukul 08:30 WIB</p>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0">
            <RefreshCw size={14} /> Cek Pembaruan
          </button>
        </div>
      </motion.div>

      {/* Changelog */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><GitBranch size={18} className="text-indigo-600" /> Riwayat Versi</h2>
        {changelog.map((ver, i) => (
          <motion.div key={ver.version} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
            className={`bg-white p-5 rounded-2xl border shadow-sm ${ver.current ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black ${ver.current ? 'text-indigo-600' : 'text-slate-700'}`}>{ver.version}</span>
                {ver.current && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-wider">Current</span>}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> {ver.date}</span>
            </div>
            <ul className="space-y-1.5">
              {ver.changes.map((c, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                  <Star size={10} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
