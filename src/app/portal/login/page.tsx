"use client";

import React, { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginWarga } from '@/app/actions/auth';

export default function WargaLoginPage() {
  const [nik, setNik] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<'nik' | 'pin'>('nik');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleNikSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length !== 16) {
      setError("NIK harus 16 digit");
      return;
    }
    setError("");
    setStep('pin');
    setTimeout(() => pinRefs.current[0]?.focus(), 100);
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.toUpperCase();
    setPin(newPin);

    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (paste.length === 6) {
      setPin(paste.split(''));
      pinRefs.current[5]?.focus();
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length !== 6) {
      setError("Masukkan 6 karakter PIN");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append('nik', nik);
    formData.append('pin', fullPin);

    startTransition(async () => {
      const result = await loginWarga(null, formData);
      if (result?.error) {
        setError(result.error);
        setPin(["", "", "", "", "", ""]);
        pinRefs.current[0]?.focus();
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Right Panel - Branding (reversed from admin) */}
      <div className="hidden lg:flex lg:w-[55%] lg:order-2 relative overflow-hidden bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm0-40c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm-40 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM10 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="absolute top-32 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-16 w-96 h-96 bg-indigo-400/8 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white/90 text-lg font-bold tracking-tight">PORTAL WARGA</h2>
                <p className="text-blue-300/70 text-sm font-medium">DESA KEDIREN</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center -mt-12">
            <div className="space-y-6">
              <div>
                <p className="text-blue-300/60 text-xs font-bold uppercase tracking-[0.3em] mb-4">Layanan Mandiri</p>
                <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
                  Portal<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                    Warga Desa
                  </span>
                </h1>
              </div>
              <p className="text-blue-100/50 text-base max-w-md leading-relaxed">
                Akses data keluarga, ajukan surat secara online, dan pantau status permohonan Anda dari mana saja, kapan saja.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Data Keluarga', 'Ajukan Surat Online', 'Cek Status Surat', 'Ubah PIN'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/70 bg-white/5 rounded-full border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <p className="text-white/70 text-sm font-semibold">Data Anda Aman</p>
                <p className="text-blue-300/40 text-xs mt-0.5">Hanya Anda yang bisa mengakses data pribadi melalui PIN yang diberikan operator desa.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative lg:order-1">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200/50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Portal Warga Desa Kediren</h1>
            <p className="text-slate-400 text-sm mt-1">Layanan mandiri kependudukan</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${step === 'nik' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[10px]">1</span>
              NIK
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${step === 'pin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
              <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[10px]">2</span>
              PIN
            </div>
          </div>

          {/* Step 1: NIK Input */}
          {step === 'nik' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masukkan NIK Anda</h2>
                <p className="text-slate-400 text-sm mt-2">Nomor Induk Kependudukan (16 digit) sesuai KTP.</p>
              </div>

              <form onSubmit={handleNikSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-semibold border border-red-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Nomor Induk Kependudukan</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/></svg>
                    </span>
                    <input
                      id="warga-nik"
                      type="text"
                      inputMode="numeric"
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 font-mono font-bold text-lg tracking-wider placeholder-slate-300"
                      placeholder="3520XXXXXXXXXXXX"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{nik.length}/16 digit</p>
                </div>

                <button
                  id="nik-submit"
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2.5 text-[15px]"
                >
                  Lanjutkan
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </form>
            </div>
          )}

          {/* Step 2: PIN Input */}
          {step === 'pin' && (
            <div>
              <div className="mb-8">
                <button onClick={() => { setStep('nik'); setError(''); setPin(["","","","","",""]); }} className="text-sm text-blue-600 hover:text-blue-700 font-bold mb-4 flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  Kembali
                </button>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masukkan PIN</h2>
                <p className="text-slate-400 text-sm mt-2">
                  PIN 6 karakter yang diberikan oleh operator desa.
                </p>
                <div className="mt-3 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold">
                    NIK: <span className="font-mono font-bold">{nik.slice(0, 4)}····{nik.slice(-4)}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-semibold border border-red-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {error}
                  </div>
                )}

                {/* PIN Boxes */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">PIN Akses</label>
                  <div className="flex gap-2.5 justify-center" onPaste={handlePinPaste}>
                    {pin.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { pinRefs.current[i] = el; }}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(i, e.target.value)}
                        onKeyDown={(e) => handlePinKeyDown(i, e)}
                        className="w-14 h-16 text-center text-xl font-black bg-white border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800 uppercase"
                      />
                    ))}
                  </div>
                </div>

                <button
                  id="pin-submit"
                  type="submit"
                  disabled={isPending || pin.join('').length !== 6}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
                >
                  {isPending ? (
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                      Masuk Portal Warga
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Lupa PIN? Hubungi operator desa untuk reset PIN Anda.
                </p>
              </form>
            </div>
          )}

          {/* Bottom Links */}
          <div className="mt-8 pt-8 border-t border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-slate-400 hover:text-blue-600 transition-colors font-medium">
                ← Beranda Publik
              </Link>
              <Link href="/login" className="text-sm text-slate-400 hover:text-emerald-600 transition-colors font-medium">
                Login Admin →
              </Link>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-300 mt-10 font-medium uppercase tracking-widest">
            Desa Kediren · Kec. Lembeyan · Kab. Magetan
          </p>
        </div>
      </div>
    </div>
  );
}
