'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Smartphone, 
  ArrowLeft,
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppSettings() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showQR, setShowQR] = useState(false);

  const startLinking = () => {
    setStatus('connecting');
    setShowQR(true);
    // Simulate successful link after 5 seconds
    setTimeout(() => {
      setStatus('connected');
      setShowQR(false);
    }, 8000);
  };

  const disconnect = () => {
    setStatus('disconnected');
    setShowQR(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              WhatsApp Gateway
              {status === 'connected' && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Integrasi pengiriman pesan otomatis SID Kediren.</p>
          </div>
        </div>
        {status === 'connected' && (
          <button 
            onClick={disconnect}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
          >
            <XCircle size={18} /> Putuskan Koneksi
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Status Card */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                <MessageCircle size={200} />
             </div>
             
             <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  status === 'connected' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-300'
                }`}>
                   {status === 'connected' ? <Smartphone size={48} /> : <MessageCircle size={48} />}
                </div>

                <div>
                   <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                     {status === 'connected' ? 'WhatsApp Terhubung' : status === 'connecting' ? 'Menyiapkan Koneksi...' : 'WhatsApp Terputus'}
                   </h2>
                   <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto leading-relaxed">
                     {status === 'connected' 
                       ? 'Sistem siap mengirimkan notifikasi mutasi dan undangan digital langsung ke nomor warga.' 
                       : 'Gunakan fitur ini untuk mengirimkan pesan otomatis dari sistem desa.'}
                   </p>
                </div>

                {status === 'disconnected' && (
                  <button 
                    onClick={startLinking}
                    className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                  >
                    <QrCode size={20} /> Tautkan Perangkat
                  </button>
                )}

                {status === 'connected' && (
                   <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-left">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kediren" alt="User" className="w-8 h-8" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-800 tracking-tight">SID Kediren Official</p>
                            <p className="text-[10px] font-mono text-emerald-600 font-black">+62 856-XXXX-XXXX</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
                         Online
                      </div>
                   </div>
                )}
             </div>
          </div>

          <AnimatePresence>
            {showQR && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col items-center space-y-6"
              >
                 <div className="relative p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SID-KEDIREN-WA-LINK" alt="QR Link" className="w-64 h-64 opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity">
                       <RefreshCw size={48} className="text-emerald-600 animate-spin" />
                    </div>
                 </div>
                 <div className="text-center space-y-2">
                    <p className="font-bold text-slate-800">Scan QR Code ini melalui WhatsApp Anda</p>
                    <p className="text-xs text-slate-500">Buka WhatsApp &gt; Perangkat Tertaut &gt; Tautkan Perangkat</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info & Settings */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap size={80} className="text-amber-400" />
              </div>
              <div className="flex items-center gap-3 text-emerald-400 font-bold border-b border-white/10 pb-4">
                 <ShieldCheck size={20} /> Keamanan Data
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Sistem menggunakan enkripsi end-to-end untuk memastikan data penduduk tidak disalahgunakan saat pengiriman pesan.</p>
              
              <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Laporan Mutasi Otomatis</span>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                       <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Undangan Digital (PKK)</span>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                       <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Pengingat Bayar PBB</span>
                    <div className="w-10 h-5 bg-slate-700 rounded-full relative">
                       <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                 <Info size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Penting</p>
                 <p className="text-[11px] font-bold text-amber-900 leading-tight">Pastikan koneksi internet stabil saat proses penautan berlangsung.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
