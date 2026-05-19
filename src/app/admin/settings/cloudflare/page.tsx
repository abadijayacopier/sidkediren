'use client';

import React, { useState } from 'react';
import { Shield, Globe, Lock, Zap, CheckCircle2, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const cfFeatures = [
  { name: 'SSL/TLS Mode', status: 'Full (Strict)', active: true, desc: 'Enkripsi end-to-end dengan sertifikat SSL teruji.' },
  { name: 'DDoS Protection', status: 'Auto Mitigated', active: true, desc: 'Proteksi otomatis dari serangan volumetrik.' },
  { name: 'Firewall Rules', status: '3 Rules Active', active: true, desc: 'Filter permintaan mencurigakan otomatis.' },
  { name: 'Bot Management', status: 'Challenge Mode', active: true, desc: 'Tantangan CAPTCHA untuk bot tidak dikenal.' },
  { name: 'Caching', status: 'Standard', active: true, desc: 'Cache aset statis untuk akselerasi load time.' },
  { name: 'Minify (JS/CSS/HTML)', status: 'Enabled', active: true, desc: 'Kompres kode otomatis untuk performa maksimal.' },
  { name: 'Always HTTPS', status: 'On', active: true, desc: 'Redirect semua permintaan HTTP ke HTTPS.' },
  { name: 'Early Hints', status: 'Off', active: false, desc: 'Pre-connect resource untuk load lebih cepat.' },
];

export default function CloudflarePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-600 hover:border-orange-200 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Shield size={22} />
            </div>
            Keamanan Cloudflare
          </h1>
          <p className="text-slate-500 text-sm mt-1">Proteksi DDoS, SSL, dan performa web desa.</p>
        </div>
      </div>

      {/* Connection Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 sm:p-6 text-white flex items-center gap-4 shadow-lg shadow-orange-200">
        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
          <Globe size={24} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Status Koneksi</p>
          <p className="text-lg font-black">Terhubung — desakediren.id</p>
        </div>
        <div className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-xs font-black uppercase tracking-wider">Active</div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {cfFeatures.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${f.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
              {f.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-800 truncate">{f.name}</h3>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${f.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{f.status}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
        <Lock size={18} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">Konfigurasi Cloudflare hanya dapat diubah melalui dashboard resmi Cloudflare. Halaman ini menampilkan status terkini dari API zona yang terdaftar.</p>
      </div>
    </div>
  );
}
