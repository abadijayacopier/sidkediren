import React from 'react';
import { 
  FileText, 
  Plus, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { getRiwayatSurat, getMasterSurat } from '@/app/actions/surat';

export default async function SuratDashboardComponent() {
  const riwayat = await getRiwayatSurat();
  const master = await getMasterSurat();

  const stats = [
    { label: 'Total Surat Keluar', value: riwayat.length, icon: <FileText size={20} />, color: 'bg-blue-500' },
    { label: 'Surat Bulan Ini', value: riwayat.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length, icon: <TrendingUp size={20} />, color: 'bg-emerald-500' },
    { label: 'Jenis Surat Aktif', value: master.length, icon: <FileCheck size={20} />, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Persuratan Desa</h1>
          <p className="text-slate-500 mt-1 font-medium">Manajemen administrasi and pengarsipan surat resmi desa.</p>
        </div>
        <Link 
          href="/admin/surat/buat"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          <span>Buat Surat Baru</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Modul Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/admin/surat/antrean"
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all flex flex-col justify-between group min-h-[160px]"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
            <Clock size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 group-hover:text-amber-600 transition-colors leading-tight">Antrean Pengajuan</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">Verifikasi Online Warga</p>
          </div>
        </Link>

        <Link 
          href="/admin/surat/masuk"
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between group min-h-[160px]"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">Surat Masuk</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">Arsip & Disposisi</p>
          </div>
        </Link>

        <Link 
          href="/admin/surat/riwayat"
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between group min-h-[160px]"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 group-hover:text-emerald-600 transition-colors leading-tight">Arsip Surat Keluar</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">Riwayat Cetak Dokumen</p>
          </div>
        </Link>

        <Link 
          href="/admin/surat/master"
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group min-h-[160px]"
        >
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-all shadow-inner">
            <FileCheck size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 group-hover:text-slate-700 transition-colors leading-tight">Master Template</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">Kelola Format Surat</p>
          </div>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Recent Activity */}
        <div className="w-full">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Daftar Riwayat Surat Keluar Terbaru
              </h2>
              <Link href="/admin/surat/riwayat" className="px-4 py-2 bg-slate-50 text-emerald-600 text-xs font-black rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-2 uppercase tracking-tighter">
                Lihat Semua Arsip
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Nomor Surat & Tanggal</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Jenis & Kode</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Nama Pemohon / Warga</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {riwayat.slice(0, 10).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-600 transition-all shadow-sm">
                              <FileText size={18} />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors">{r.nomorSurat}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-slate-700">{r.masterSurat.namaSurat}</span>
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 w-fit uppercase tracking-tighter">
                            {r.masterSurat.kodeSurat}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-700">{r.penduduk.namaLengkap}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{r.penduduk.nik}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          href={`/admin/surat/preview/${r.id}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-200 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                          <FileText size={14} />
                          <span>Preview</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {riwayat.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center text-slate-200 shadow-inner">
                            <FileText size={40} />
                          </div>
                          <div>
                            <p className="text-slate-800 font-black text-lg">Belum Ada Riwayat</p>
                            <p className="text-slate-400 text-sm font-medium">Silakan buat surat pertama Anda melalui tombol di atas.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
