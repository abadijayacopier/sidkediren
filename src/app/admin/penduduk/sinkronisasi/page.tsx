'use client';

import React, { useState } from 'react';
import { ArrowLeft, FileSpreadsheet, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { importStatusPerekaman } from '@/app/actions/import';

export default function SinkronisasiPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setResult(null);
    try {
      const res = await importStatusPerekaman(formData);
      setResult(res);
    } catch (err) {
      setResult({ error: 'Terjadi kesalahan sistem saat memproses file.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sinkronisasi Data Kabupaten</h1>
          <p className="text-slate-500 text-sm">Perbarui status perekaman warga secara massal lewat Excel.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
        {/* Info Format */}
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <div className="flex items-start gap-3">
             <AlertCircle className="text-blue-600 shrink-0" size={20} />
             <div className="space-y-2">
                <h3 className="font-bold text-blue-800 text-sm">Instruksi Format Excel:</h3>
                <p className="text-blue-700 text-xs leading-relaxed">
                   Pastikan file Excel bapak memiliki minimal dua kolom dengan nama persis seperti di bawah ini:
                </p>
                <div className="flex gap-4 mt-2">
                   <div className="bg-white px-3 py-1 rounded-lg border border-blue-200 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Kolom 1: NIK</div>
                   <div className="bg-white px-3 py-1 rounded-lg border border-blue-200 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Kolom 2: STATUS_REKAM</div>
                </div>
                <p className="text-blue-700 text-[10px] italic">
                   *Nilai STATUS_REKAM bisa diisi: SUDAH REKAM, BELUM REKAM, atau KTP SUDAH JADI.
                </p>
             </div>
          </div>
        </div>

        {/* Upload Form */}
        <form action={handleSubmit} className="space-y-6">
           <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer relative group">
              <input 
                type="file" 
                name="file" 
                accept=".xlsx, .xls"
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Pilih File Excel Kabupaten</p>
                <p className="text-xs text-slate-400">Klik atau seret file .xlsx bapak ke sini</p>
              </div>
           </div>

           <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
           >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Memproses Sinkronisasi...
                </>
              ) : (
                <>
                  <Upload size={20} /> Mulai Sinkronisasi Sekarang
                </>
              )}
           </button>
        </form>

        {/* Result Area */}
        {result && (
           <div className={`p-6 rounded-2xl border ${result.success ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              <div className="flex items-center gap-3">
                 {result.success ? (
                   <>
                    <CheckCircle className="text-emerald-600" size={24} />
                    <div>
                        <h4 className="font-bold text-emerald-800">Sinkronisasi Berhasil!</h4>
                        <p className="text-xs text-emerald-700">
                           Berhasil memperbarui **{result.updatedCount}** data warga. 
                           {result.errorCount > 0 && ` (Gagal: ${result.errorCount} data tidak ditemukan/NIK salah)`}
                        </p>
                    </div>
                   </>
                 ) : (
                   <>
                    <AlertCircle className="text-red-600" size={24} />
                    <p className="font-bold text-red-800">{result.error}</p>
                   </>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
