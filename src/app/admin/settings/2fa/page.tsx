'use client';

import React, { useState } from 'react';
import { Lock, ArrowLeft, Smartphone, ShieldCheck, KeyRound, QrCode, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TwoFactorPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [step, setStep] = useState(0); // 0=intro, 1=scan, 2=verify, 3=done

  const fakeSecret = 'JBSWY3DPEHPK3PXP';

  const handleActivate = () => setStep(1);
  const handleVerify = () => { setStep(3); setIs2FAEnabled(true); };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <Lock size={22} />
            </div>
            Keamanan 2FA
          </h1>
          <p className="text-slate-500 text-sm mt-1">Lapisan keamanan tambahan untuk akun admin.</p>
        </div>
      </div>

      {/* Status Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-5 sm:p-6 flex items-center gap-4 ${is2FAEnabled ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {is2FAEnabled ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-black ${is2FAEnabled ? 'text-emerald-800' : 'text-red-800'}`}>
            {is2FAEnabled ? '2FA Aktif — Akun Anda Terlindungi' : '2FA Belum Aktif — Akun Rentan'}
          </p>
          <p className={`text-xs mt-0.5 ${is2FAEnabled ? 'text-emerald-600' : 'text-red-600'}`}>
            {is2FAEnabled ? 'Autentikasi dua faktor berhasil dikonfigurasi.' : 'Aktifkan 2FA untuk mencegah akses tidak sah ke panel admin.'}
          </p>
        </div>
      </motion.div>

      {/* Steps */}
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><KeyRound size={18} className="text-red-500" /> Cara Kerja 2FA</h3>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Unduh Aplikasi Authenticator', desc: 'Google Authenticator atau Microsoft Authenticator di HP Anda.' },
              { step: '2', title: 'Scan QR Code', desc: 'Pindai kode QR yang ditampilkan oleh sistem ini.' },
              { step: '3', title: 'Masukkan Kode Verifikasi', desc: 'Ketik 6 digit kode dari aplikasi untuk mengonfirmasi.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-black shrink-0">{s.step}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{s.title}</p>
                  <p className="text-[11px] text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleActivate}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
            <Smartphone size={16} /> Mulai Konfigurasi 2FA
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-center">
          <h3 className="font-bold text-slate-800">Scan QR Code</h3>
          <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center mx-auto">
            <QrCode size={80} className="text-slate-300" />
          </div>
          <p className="text-xs text-slate-500">Pindai QR di atas menggunakan Google Authenticator</p>
          <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-700 inline-block">
            {fakeSecret}
          </div>
          <button onClick={() => setStep(2)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer">
            Sudah Scan → Lanjut
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-center">
          <h3 className="font-bold text-slate-800">Masukkan Kode Verifikasi</h3>
          <p className="text-xs text-slate-500">Ketik 6 digit kode yang muncul di aplikasi authenticator.</p>
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <input key={i} type="text" maxLength={1} className="w-10 h-12 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
            ))}
          </div>
          <button onClick={handleVerify}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Verifikasi & Aktifkan
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-lg font-black text-emerald-800">2FA Berhasil Diaktifkan!</h3>
          <p className="text-sm text-emerald-700">Akun admin Anda kini terlindungi dengan autentikasi dua faktor.</p>
        </motion.div>
      )}
    </div>
  );
}
