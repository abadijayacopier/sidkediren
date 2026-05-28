import React from 'react';
import prisma from '@/lib/prisma';
import { Users, UserCheck, FileText, PieChart, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Ambil statistik kependudukan & keuangan secara PARALEL dengan agregasi database berkecepatan tinggi
  const [totalPenduduk, totalKeluarga, totalSurat, apbdesAgg, recentSurat] = await Promise.all([
    prisma.penduduk.count({ where: { isHidup: true } }),
    prisma.keluarga.count(),
    prisma.riwayatSurat.count(),
    prisma.apbdesItem.aggregate({
      _sum: {
        anggaran: true,
        realisasi: true,
      }
    }),
    prisma.riwayatSurat.findMany({
      take: 5,
      orderBy: { tanggalSurat: 'desc' },
      include: {
        penduduk: true,
        masterSurat: true
      }
    })
  ]);

  const totalAnggaran = Number(apbdesAgg._sum.anggaran || 0);
  const totalRealisasi = Number(apbdesAgg._sum.realisasi || 0);
  const realisasiPercentage = totalAnggaran > 0 ? Math.round((totalRealisasi / totalAnggaran) * 100) : 0;

  // Helper untuk formatting waktu relatif
  const getRelativeTime = (date: Date) => {
    const diffMs = new Date().getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${diffDays} hari yang lalu`;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ringkasan SID</h2>
        <p className="text-slate-500">Pantau statistik kependudukan dan administrasi Desa Kediren hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          title="Total Penduduk" 
          value={totalPenduduk.toLocaleString('id-ID')} 
          change="Warga aktif"
          icon={<Users size={24} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard 
          title="Kepala Keluarga" 
          value={totalKeluarga.toLocaleString('id-ID')} 
          change="Kartu Keluarga"
          icon={<UserCheck size={24} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard 
          title="Permohonan Surat" 
          value={totalSurat.toLocaleString('id-ID')} 
          change="Total pengajuan"
          icon={<FileText size={24} className="text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard 
          title="Realisasi APBDes" 
          value={`${realisasiPercentage}%`} 
          change="Tahun Anggaran 2026"
          icon={<PieChart size={24} className="text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Aktivitas Pelayanan Terbaru</h3>
            <Link href="/admin/surat" className="text-sm text-emerald-600 font-semibold hover:underline">Lihat Semua</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentSurat.length > 0 ? (
              recentSurat.map((surat) => (
                <ActivityItem 
                   key={surat.id}
                   name={surat.penduduk.namaLengkap} 
                   type={surat.masterSurat.namaSurat} 
                   time={getRelativeTime(surat.tanggalSurat)} 
                   status={surat.statusSurat === 'Selesai' ? 'Selesai' : surat.statusSurat === 'Pending' ? 'Diproses' : 'Ditolak'}
                />
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                Belum ada aktivitas pengajuan surat terbaru.
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Info */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 sm:p-8 text-white shadow-lg shadow-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4 font-black tracking-tight">Infrastruktur APBDes</h3>
              <p className="text-emerald-50 mb-6 text-xs sm:text-sm leading-relaxed opacity-95">
                Realisasi serapan APBDes telah mencapai <span className="font-black underline text-amber-300">{realisasiPercentage}%</span> secara transparan dan akuntabel.
              </p>
            </div>
            <Link href="/admin/settings/transparansi" className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all w-fit shadow-md">
              Detail Transparansi <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
        {icon}
      </div>
      <p className="text-xs sm:text-sm font-medium text-slate-500 mb-0.5 sm:mb-1">{title}</p>
      <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-0.5 sm:mb-1">{value}</h3>
      <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{change}</p>
    </div>
  );
}

function ActivityItem({ name, type, time, status }: { name: string, type: string, time: string, status: string }) {
  return (
    <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] sm:text-xs shrink-0">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{name}</p>
          <p className="text-xs text-slate-500">{type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 mb-1">{time}</p>
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
          status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 
          status === 'Ditolak' ? 'bg-rose-100 text-rose-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
