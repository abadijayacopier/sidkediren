"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { changeWargaPin } from '@/app/actions/warga';

export default function UbahPinPage() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPin.length !== 6) {
      setError("PIN baru harus 6 karakter.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("Konfirmasi PIN tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      await changeWargaPin(currentPin, newPin);
      setSuccess(true);
      setTimeout(() => {
        router.push('/portal');
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Gagal mengubah PIN.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">PIN Berhasil Diubah!</h2>
          <p className="text-slate-500 text-sm">Mengarahkan kembali ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 py-12">
      <div className="mb-6">
        <Link href="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <KeyRound size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">Ubah PIN Akses</h1>
          <p className="text-slate-500 text-sm mb-8">Gunakan PIN yang mudah diingat (6 karakter huruf/angka).</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">PIN Saat Ini</label>
              <input
                type="password"
                maxLength={6}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-mono tracking-widest"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">PIN Baru (6 Karakter)</label>
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-mono tracking-widest"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Konfirmasi PIN Baru</label>
              <input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-mono tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || newPin.length !== 6 || confirmPin.length !== 6}
              className="w-full py-3.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan PIN Baru"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
