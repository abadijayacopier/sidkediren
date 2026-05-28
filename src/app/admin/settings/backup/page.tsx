'use client';

import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, Clock, HardDrive, CheckCircle2, AlertTriangle, ArrowLeft, Shield, Cloud } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getDatabaseSize } from '@/app/actions/backupStats';

export default function BackupPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [lastBackup, setLastBackup] = useState('Belum Pernah');
  const [dbSize, setDbSize] = useState('Menghitung...');

  useEffect(() => {
    // Ambil data size dari database
    getDatabaseSize().then(size => setDbSize(size));
    
    // Ambil riwayat backup terakhir dari local storage
    const history = localStorage.getItem('last_db_backup');
    if (history) {
      setLastBackup(history);
    }
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/backup');
      if (!response.ok) {
        throw new Error('Backup failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const safeDate = new Date().toISOString().split('T')[0];
      a.download = `Backup_Desa_Kediren_${safeDate}.sql`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Simpan riwayat backup
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(now) + ' WIB';
      localStorage.setItem('last_db_backup', formattedDate);
      setLastBackup(formattedDate);
    } catch (error) {
      console.error(error);
      alert('Gagal mengekspor database. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Database size={22} />
            </div>
            Backup & Restore
          </h1>
          <p className="text-slate-500 text-sm mt-1">Amankan data penduduk dan riwayat transaksi desa.</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><CheckCircle2 size={18} /></div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Backup Terakhir</span>
          </div>
          <p className="text-sm font-bold text-slate-800">{lastBackup}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><HardDrive size={18} /></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ukuran Database</span>
          </div>
          <p className="text-sm font-bold text-slate-800">{dbSize}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Clock size={18} /></div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Jadwal Otomatis</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Manual (Sesuai Permintaan)</p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="grid sm:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Download size={24} /></div>
            <div>
              <h3 className="font-bold text-slate-800">Ekspor Backup</h3>
              <p className="text-xs text-slate-500">Unduh seluruh data dalam format SQL</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait"
          >
            {isExporting ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengekspor...</>
            ) : (
              <><Download size={16} /> Unduh Backup Sekarang</>
            )}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Upload size={24} /></div>
            <div>
              <h3 className="font-bold text-slate-800">Restore Data</h3>
              <p className="text-xs text-slate-500">Pulihkan dari file backup SQL</p>
            </div>
          </div>
          <label className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-dashed border-slate-300">
            <Upload size={16} /> Pilih File Backup (.sql)
            <input type="file" accept=".sql" className="hidden" />
          </label>
        </motion.div>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Perhatian Penting</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">Restore data akan menimpa seluruh data yang ada saat ini. Pastikan Anda telah membuat backup terbaru sebelum melakukan restore. Proses ini tidak dapat dibatalkan.</p>
        </div>
      </div>
    </div>
  );
}
