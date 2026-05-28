'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-500"></div>
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100 relative">
             <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
             <ShieldAlert size={48} className="text-slate-400" />
             <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                <span className="font-black text-slate-800">404</span>
             </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Halaman Tidak Ditemukan</h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Maaf, halaman yang Anda tuju tidak tersedia atau mungkin sedang dalam perbaikan sistem.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                   window.history.back();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-colors shadow-md"
            >
              <ArrowLeft size={18} />
              Kembali ke Sebelumnya
            </button>
            <Link 
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold transition-colors"
            >
              <Home size={18} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pemerintah Desa Kediren</p>
        </div>
      </div>
    </div>
  );
}
