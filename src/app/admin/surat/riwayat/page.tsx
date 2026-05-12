import React from 'react';
import prisma from '@/lib/prisma';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Filter,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default async function RiwayatSuratPage() {
  const riwayat = await prisma.riwayatSurat.findMany({
    include: {
      penduduk: true,
      masterSurat: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/surat" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Arsip Surat Keluar</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Data seluruh surat resmi yang telah diterbitkan oleh pemerintah desa.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari NIK, Nama, atau Nomor Surat..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold placeholder:text-slate-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold hover:bg-slate-100 transition-all text-xs uppercase tracking-widest border border-slate-100">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-all text-xs uppercase tracking-widest border border-emerald-100">
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nomor Surat</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Pemohon</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {riwayat.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                        <Calendar size={18} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">{new Date(s.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-mono font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-block">
                      {s.nomorSurat}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{s.masterSurat.namaSurat}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{s.masterSurat.kodeSurat}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{s.penduduk.namaLengkap}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">{s.penduduk.nik}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/surat/preview/${s.id}`}
                        className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Preview & Cetak"
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {riwayat.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center text-slate-200">
                        <FileText size={40} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-800">Belum Ada Arsip</p>
                        <p className="text-sm text-slate-400 font-medium">Silakan buat surat baru untuk memulai pengarsipan.</p>
                      </div>
                      <Link href="/admin/surat/buat" className="mt-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                        Buat Surat Pertama
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
