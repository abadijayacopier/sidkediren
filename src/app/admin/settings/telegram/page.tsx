'use client';

import React, { useState } from 'react';
import { Send, ArrowLeft, Bot, Bell, CheckCircle2, Copy, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TelegramPage() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTest = () => {
    if (!botToken || !chatId) { setTestResult('Harap isi Bot Token dan Chat ID terlebih dahulu.'); return; }
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => { setIsTesting(false); setTestResult('Pesan tes berhasil dikirim ke grup Telegram!'); }, 2000);
  };

  const notifications = [
    { label: 'Surat Baru Dibuat', desc: 'Kirim notif saat ada permohonan surat dari warga.', enabled: true },
    { label: 'Mutasi Penduduk', desc: 'Kirim notif pindah datang / pindah keluar.', enabled: true },
    { label: 'Backup Harian Selesai', desc: 'Konfirmasi bahwa backup otomatis telah berhasil.', enabled: false },
    { label: 'Login Admin Baru', desc: 'Alert saat ada login baru ke panel admin desa.', enabled: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-200 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
              <Send size={22} />
            </div>
            Bot Telegram Desa
          </h1>
          <p className="text-slate-500 text-sm mt-1">Notifikasi otomatis ke grup perangkat desa.</p>
        </div>
      </div>

      {/* Config Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <Bot size={20} className="text-sky-500" />
          <h3 className="font-bold text-slate-800">Konfigurasi Bot</h3>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Bot Token (@BotFather)</label>
          <div className="relative">
            <input type={showToken ? 'text' : 'password'} value={botToken} onChange={e => setBotToken(e.target.value)}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all pr-20" />
            <button onClick={() => setShowToken(!showToken)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer">
              {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Chat ID Grup / Channel</label>
          <input type="text" value={chatId} onChange={e => setChatId(e.target.value)}
            placeholder="-1001234567890"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleTest} disabled={isTesting}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:cursor-wait flex items-center gap-2">
            {isTesting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
            {isTesting ? 'Mengirim...' : 'Tes Kirim Pesan'}
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            Simpan Konfigurasi
          </button>
        </div>

        {testResult && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${testResult.includes('berhasil') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            <CheckCircle2 size={14} /> {testResult}
          </div>
        )}
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <Bell size={20} className="text-sky-500" />
          <h3 className="font-bold text-slate-800">Preferensi Notifikasi</h3>
        </div>

        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-bold text-slate-800">{n.label}</p>
                <p className="text-[11px] text-slate-500">{n.desc}</p>
              </div>
              <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-all ${n.enabled ? 'bg-sky-500' : 'bg-slate-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${n.enabled ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
