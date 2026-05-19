'use client';

import React from 'react';
import { 
  Settings, 
  Building, 
  Database, 
  Shield, 
  Send, 
  MessageCircle, 
  Printer, 
  Lock, 
  RefreshCw,
  ChevronRight,
  ArrowUpCircle,
  TrendingUp,
  Cloud,
  QrCode,
  Fingerprint,
  Zap,
  Newspaper,
  Palmtree,
  HeartPulse,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const settingMenus = [
  {
    title: 'Profil Desa Kediren',
    description: 'Data wilayah, visi misi, and struktur organisasi sesuai standar Kemendes.',
    icon: <Building className="text-emerald-600" />,
    href: '/admin/settings/profil',
    status: 'Lengkap',
    color: 'bg-emerald-50'
  },
  {
    title: 'Manajemen Posyandu',
    description: 'Kelola nama posyandu, alamat cakupan dusun, and operasional pos pelayanan.',
    icon: <HeartPulse className="text-rose-600" />,
    href: '/admin/settings/posyandu',
    status: 'Aktif',
    color: 'bg-rose-50'
  },
  {
    title: 'Manajemen Kader PKK',
    description: 'Kelola daftar pengurus TP PKK, jabatan, wilayah tugas dusun, dan kontak aktif.',
    icon: <Users className="text-rose-600" />,
    href: '/admin/settings/pkk',
    status: 'Aktif',
    color: 'bg-rose-50'
  },
  {
    title: 'Berita Desa',
    description: 'Kelola artikel berita, pengumuman, dan kegiatan terbaru untuk warga.',
    icon: <Newspaper className="text-emerald-600" />,
    href: '/admin/berita',
    status: 'Aktif',
    color: 'bg-emerald-50'
  },
  {
    title: 'Transparansi & APBDes',
    description: 'Manajemen data anggaran desa, realisasi belanja, dan monitoring program kerja.',
    icon: <TrendingUp className="text-emerald-600" />,
    href: '/admin/settings/transparansi',
    status: 'Aktif',
    color: 'bg-emerald-50'
  },
  {
    title: 'Potensi & Wisata',
    description: 'Manajemen destinasi wisata desa, galeri foto pesona alam, dan produk unggulan UMKM.',
    icon: <Palmtree className="text-emerald-600" />,
    href: '/admin/settings/potensi',
    status: 'Aktif',
    color: 'bg-emerald-50'
  },
  {
    title: 'Backup & Restore',
    description: 'Amankan data penduduk dan riwayat transaksi desa ke storage lokal atau cloud.',
    icon: <Database className="text-blue-600" />,
    href: '/admin/settings/backup',
    status: 'Harian Aktif',
    color: 'bg-blue-50'
  },
  {
    title: 'Keamanan Cloudflare',
    description: 'Konfigurasi proteksi DDoS, SSL, dan optimalisasi performa web desa.',
    icon: <Shield className="text-orange-600" />,
    href: '/admin/settings/cloudflare',
    status: 'Terhubung',
    color: 'bg-orange-50'
  },
  {
    title: 'Bot Telegram Desa',
    description: 'Notifikasi otomatis laporan mutasi dan persuratan ke grup perangkat desa.',
    icon: <Send className="text-sky-500" />,
    href: '/admin/settings/telegram',
    status: 'Siap',
    color: 'bg-sky-50'
  },
  {
    title: 'WhatsApp Integration',
    description: 'Tautkan nomor WhatsApp desa untuk pengiriman undangan digital.',
    icon: <MessageCircle className="text-green-600" />,
    href: '/admin/settings/whatsapp',
    status: 'Perlu Scan',
    color: 'bg-green-50'
  },
  {
    title: 'Pengaturan Printer',
    description: 'Deteksi printer yang terhubung ke PC untuk cetak dokumen langsung.',
    icon: <Printer className="text-slate-600" />,
    href: '/admin/settings/printer',
    status: 'Default',
    color: 'bg-slate-50'
  },
  {
    title: 'Keamanan 2FA',
    description: 'Tambah lapisan keamanan login menggunakan aplikasi authenticator.',
    icon: <Lock className="text-red-600" />,
    href: '/admin/settings/2fa',
    status: 'Belum Aktif',
    color: 'bg-red-50'
  },
  {
    title: 'Update Fitur Otomatis',
    description: 'Perbarui sistem langsung dari repositori Github (Release V2026.1.0.1).',
    icon: <RefreshCw className="text-indigo-600" />,
    href: '/admin/settings/update',
    status: 'Coming Soon',
    color: 'bg-indigo-50'
  }
];

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-emerald-600">
                <Settings size={28} />
             </div>
             Pusat Pengaturan
           </h1>
           <p className="text-slate-500 mt-2 font-medium">Konfigurasi infrastruktur digital dan identitas Desa Kediren.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <Fingerprint size={14} /> System Verified
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingMenus.map((menu, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              href={menu.href}
              className="group block bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all relative overflow-hidden"
            >
              {/* Decorative Background Icon */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all transform group-hover:scale-110">
                {React.cloneElement(menu.icon as React.ReactElement, { size: 100 })}
              </div>

              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 ${menu.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(menu.icon as React.ReactElement, { size: 28 })}
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                    menu.status === 'Coming Soon' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {menu.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{menu.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">{menu.description}</p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Buka Konfigurasi</span>
                   <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <ChevronRight size={16} />
                   </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cloud size={200} />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/20">
               <Zap size={48} className="text-amber-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h2 className="text-2xl font-black tracking-tight mb-3">Enterprise Infrastructure Kediren</h2>
               <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">Sistem ini didukung oleh arsitektur Cloud yang aman. Semua pengaturan di atas memerlukan hak akses Administrator tertinggi untuk melakukan perubahan. Pastikan backup dilakukan secara berkala sebelum mengubah konfigurasi keamanan.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
               <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
                  Dokumentasi Sistem
               </button>
               <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                  Cek Status Server
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
