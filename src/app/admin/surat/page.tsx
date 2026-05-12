import React from 'react';
import { 
  FileText, 
  Plus, 
  History, 
  Settings, 
  Search, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { getRiwayatSurat, getMasterSurat } from '@/app/actions/surat';

export default async function SuratDashboard() {
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
          <p className="text-slate-500 mt-1 font-medium">Manajemen administrasi dan pengarsipan surat resmi desa.</p>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Menu */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Settings size={20} className="text-emerald-500" />
              Menu Navigasi
            </h2>
            <div className="space-y-3">
              <MenuLink 
                href="/admin/surat/riwayat" 
                icon={<History size={18} />} 
                label="Arsip Surat Keluar" 
                desc="Lihat semua riwayat surat"
              />
              <MenuLink 
                href="/admin/surat/master" 
                icon={<FileText size={18} />} 
                label="Master Surat" 
                desc="Kelola template & kode"
              />
              <MenuLink 
                href="/admin/settings/desa" 
                icon={<Settings size={18} />} 
                label="Pengaturan Kop Surat" 
                desc="Identitas & TTD Kades"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Surat Terbaru
              </h2>
              <Link href="/admin/surat/riwayat" className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1">
                Lihat Semua
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">No. Surat</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Jenis Surat</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Pemohon</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {riwayat.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-800">{r.nomorSurat}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{new Date(r.createdAt).toLocaleDateString('id-ID')}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100 uppercase">
                          {r.masterSurat.kodeSurat}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700">{r.penduduk.namaLengkap}</p>
                        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">{r.penduduk.nik}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link 
                          href={`/admin/surat/preview/${r.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                          <Search size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {riwayat.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                            <FileText size={24} />
                          </div>
                          <p className="text-slate-400 text-sm font-medium">Belum ada riwayat surat.</p>
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

function MenuLink({ href, icon, label, desc }: { href: string, icon: React.ReactNode, label: string, desc: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-emerald-50/50 transition-all group"
    >
      <div className="p-3 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-sm transition-all">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{desc}</p>
      </div>
      <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}
