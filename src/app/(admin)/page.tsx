import React from 'react';
import { Users, UserCheck, FileText, PieChart, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ringkasan SID</h2>
        <p className="text-slate-500">Pantau statistik kependudukan dan administrasi Desa Kediren hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Penduduk" 
          value="1,248" 
          change="+12 bulan ini"
          icon={<Users size={24} className="text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard 
          title="Kepala Keluarga" 
          value="342" 
          change="+2 baru"
          icon={<UserCheck size={24} className="text-emerald-600" />}
          color="bg-emerald-50"
        />
        <StatCard 
          title="Permohonan Surat" 
          value="18" 
          change="Menunggu proses"
          icon={<FileText size={24} className="text-amber-600" />}
          color="bg-amber-50"
        />
        <StatCard 
          title="Realisasi APBDes" 
          value="64%" 
          change="Tahun Anggaran 2026"
          icon={<PieChart size={24} className="text-purple-600" />}
          color="bg-purple-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Aktivitas Pelayanan Terbaru</h3>
            <button className="text-sm text-emerald-600 font-semibold hover:underline">Lihat Semua</button>
          </div>
          <div className="divide-y divide-slate-50">
            <ActivityItem 
              name="Ahmad Fauzi" 
              type="Surat Keterangan Domisili" 
              time="10 menit yang lalu" 
              status="Selesai"
            />
            <ActivityItem 
              name="Siti Aminah" 
              type="Surat Pengantar Nikah" 
              time="45 menit yang lalu" 
              status="Diproses"
            />
            <ActivityItem 
              name="Budi Santoso" 
              type="Update Data Keluarga" 
              time="2 jam yang lalu" 
              status="Selesai"
            />
          </div>
        </div>

        {/* Quick Links / Info */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg shadow-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Update APBDes</h3>
            <p className="text-emerald-50 mb-6 text-sm leading-relaxed">
              Realisasi anggaran bulan Mei meningkat 12% dibandingkan bulan sebelumnya. 
              Segera selesaikan laporan untuk termin kedua.
            </p>
            <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-all">
              Detail Laporan <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-xs text-slate-400 font-medium">{change}</p>
    </div>
  );
}

function ActivityItem({ name, type, time, status }: { name: string, type: string, time: string, status: string }) {
  return (
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
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
          status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
