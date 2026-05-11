import React from 'react';
import { 
  RefreshCcw, 
  Baby, 
  Skull, 
  LogOut, 
  LogIn, 
  Calendar, 
  Search, 
  ArrowLeft,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { getRiwayatMutasi } from '@/app/actions/mutasi';

export default async function MutasiWargaPage() {
  const riwayat = await getRiwayatMutasi();

  // Hitung Statistik Sederhana
  const stats = {
    lahir: riwayat.filter((r: any) => r.jenisMutasi === 'KELAHIRAN').length,
    mati: riwayat.filter((r: any) => r.jenisMutasi === 'KEMATIAN').length,
    pindah: riwayat.filter((r: any) => r.jenisMutasi.includes('PINDAH')).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Mutasi Warga</h1>
            <p className="text-slate-500 text-sm">Riwayat perubahan data kependudukan Desa Kediren.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all font-bold text-sm shadow-xl shadow-slate-200">
            <Plus size={20} /> Lapor Kejadian Mutasi
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            icon={<Baby className="text-blue-600" />} 
            label="Kelahiran" 
            value={stats.lahir} 
            color="bg-blue-50 border-blue-100" 
        />
        <StatCard 
            icon={<Skull className="text-rose-600" />} 
            label="Kematian" 
            value={stats.mati} 
            color="bg-rose-50 border-rose-100" 
        />
        <StatCard 
            icon={<RefreshCcw className="text-amber-600" />} 
            label="Perpindahan" 
            value={stats.pindah} 
            color="bg-amber-50 border-amber-100" 
        />
      </div>

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-600" /> Log Perubahan Kronologis
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari NIK atau Nama..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs w-full md:w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tanggal</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Warga</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Jenis Mutasi</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Keterangan</th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {riwayat.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    Belum ada riwayat mutasi yang tercatat.
                  </td>
                </tr>
              ) : (
                riwayat.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <p className="font-bold text-slate-700">{new Date(log.tanggalMutasi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-[10px] text-slate-400 font-mono italic">Input: {new Date(log.createdAt).toLocaleTimeString('id-ID')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{log.penduduk.namaLengkap}</p>
                      <p className="text-[10px] font-mono text-emerald-600">{log.nik}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge jenis={log.jenisMutasi} />
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-[11px] leading-relaxed max-w-xs">
                      {log.keterangan}
                      {log.jenisMutasi === 'PINDAH KELUAR' && log.alamatTujuan && (
                        <div className="mt-1 p-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
                          <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Tujuan:</span>
                          {log.alamatTujuan}, {log.desaTujuan}, {log.kecamatanTujuan}, {log.kabupatenTujuan}, {log.provinsiTujuan} {log.kodePosTujuan && `(${log.kodePosTujuan})`}
                        </div>
                      )}
                      {log.jenisMutasi === 'PINDAH MASUK' && log.alamatAsal && (
                        <div className="mt-1 p-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700">
                          <span className="font-bold text-[9px] uppercase text-emerald-600 block mb-1">Asal:</span>
                          {log.alamatAsal}, {log.desaAsal}, {log.kecamatanAsal}, {log.kabupatenAsal}, {log.provinsiAsal} {log.kodePosAsal && `(${log.kodePosAsal})`}
                        </div>
                      )}
                      {!log.keterangan && !log.alamatTujuan && !log.alamatAsal && '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {log.petugasInput?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <span className="text-xs font-medium text-slate-600">{log.petugasInput || 'Admin'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`${color} p-6 rounded-3xl border flex items-center gap-5 transition-all hover:scale-[1.02]`}>
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function Badge({ jenis }: { jenis: string }) {
  const configs: any = {
    'KELAHIRAN': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Baby size={12} /> },
    'KEMATIAN': { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: <Skull size={12} /> },
    'PINDAH MASUK': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <LogIn size={12} /> },
    'PINDAH KELUAR': { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <LogOut size={12} /> },
  };

  const config = configs[jenis] || { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <RefreshCcw size={12} /> };

  return (
    <div className={`px-2.5 py-1 rounded-full border ${config.color} text-[10px] font-bold flex items-center gap-1.5 w-fit uppercase`}>
      {config.icon}
      {jenis}
    </div>
  );
}
