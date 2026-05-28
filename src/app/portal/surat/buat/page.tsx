import React from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft, MailPlus, Sparkles, Clock } from 'lucide-react';

export default function BuatSuratPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"></div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="p-8 sm:p-10 text-center relative z-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100/50 relative transform rotate-3">
             <div className="absolute inset-0 bg-blue-400/20 rounded-2xl animate-pulse blur-xl"></div>
             <Settings size={40} className="text-blue-600 animate-[spin_10s_linear_infinite]" />
             
             {/* Floating badge */}
             <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-md transform -rotate-12">
               <Sparkles size={20} className="text-amber-500" />
             </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-3">
            Segera Hadir
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-8">
            Fitur <strong className="text-slate-700">Layanan Pembuatan Surat Mandiri</strong> sedang dalam tahap pengembangan akhir. Kami bekerja keras untuk menghadirkan pengalaman terbaik untuk Anda.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <MailPlus size={20} className="text-indigo-500 mb-2" />
              <h3 className="font-bold text-slate-800 text-sm mb-1">Cetak Mandiri</h3>
              <p className="text-[11px] text-slate-500">Ajukan dan cetak surat langsung dari rumah.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Clock size={20} className="text-emerald-500 mb-2" />
              <h3 className="font-bold text-slate-800 text-sm mb-1">Proses Cepat</h3>
              <p className="text-[11px] text-slate-500">Persetujuan instan oleh perangkat desa secara digital.</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              href="/portal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} />
              Kembali ke Portal
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SID Kediren v2.1</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
             Tahap Uji Coba
          </div>
        </div>
      </div>
    </div>
  );
}
