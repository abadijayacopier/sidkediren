'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartPulse, Users, Activity, FileText, Settings, BookOpen, Trophy, Award, Star, ArrowUpRight, ShieldAlert, BookOpenCheck, Landmark, Heart, Smile } from 'lucide-react';
import { getKaderPkkList, seedPkkData } from '@/app/actions/pkk';

export default function PkkDashboard() {
  const [dataKader, setDataKader] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      await seedPkkData();
      const kaderRes = await getKaderPkkList();
      setDataKader((kaderRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load PKK dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center animate-pulse">
               <HeartPulse size={20} />
             </div>
             PKK Desa Kediren
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Informasi Pemberdayaan Kesejahteraan Keluarga (PKK) Desa Kediren.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <Link href="/admin/pkk/kegiatan">
             <button className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-100 transition-all">
               <FileText size={16} /> Log Kegiatan
             </button>
           </Link>
           <Link href="/admin/pkk/pokja4">
             <button className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-amber-100 transition-all">
               <BookOpen size={16} /> Buku Baku Pokja IV
             </button>
           </Link>
           <Link href="/admin/settings/pkk">
             <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-sm transition-all shadow-slate-200">
               <Settings size={16} /> Pengaturan Kader
             </button>
           </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users size={24} />} label="Total Kader TP PKK" value={loading ? '...' : dataKader.length} suffix="Orang" color="bg-rose-50" textColor="text-rose-600" />
        <StatCard icon={<Activity size={24} />} label="Kelompok Dasawisma" value="12" suffix="Kelompok" color="bg-emerald-50" textColor="text-emerald-600" />
        <StatCard icon={<FileText size={24} />} label="Program Kerja Pokja" value="4 Pokja Utama" suffix="" color="bg-amber-50" textColor="text-amber-600" />
      </div>

      {/* Banner Prestasi PKK */}
      <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-rose-200/50">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-12 translate-x-12 transform scale-150">
          <Trophy size={300} />
        </div>
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">
            <Award size={14} className="text-amber-300" /> Prestasi Tingkat Kabupaten Magetan
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Juara II Lomba Pelaksanaan PKK Terbaik Tingkat Kabupaten Magetan 🎉
          </h2>
          <p className="text-rose-100 text-sm md:text-base leading-relaxed font-medium">
            Selamat dan sukses kepada Tim Penggerak PKK Desa Kediren atas pencapaian luar biasa meraih Juara Dua dalam Lomba PKK Kabupaten Magetan. Apresiasi setinggi-tingginya untuk 12 Kelompok Dasawisma Aktif dan seluruh Kader Posyandu Terintegrasi yang telah bergotong royong menyukseskan program kerja nasional!
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
             <Link href="/admin/berita" className="inline-flex items-center gap-2 bg-white text-rose-600 hover:bg-rose-50 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-md">
                Tinjau Berita Prestasi <ArrowUpRight size={14} />
             </Link>
          </div>
        </div>
      </div>

      {/* Title Menu Pokja */}
      <div className="pt-4">
        <div className="border-l-4 border-rose-600 pl-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kategori Bidang & Kegiatan Pokja PKK</h2>
          <p className="text-slate-500 text-xs mt-1 font-semibold">Silakan pilih bidang kegiatan PKK untuk melihat log aktivitas khusus masing-masing bidang.</p>
        </div>
      </div>

      {/* Grid Pokja & Dasawisma Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        
        {/* POKJA I */}
        <PokjaCard 
          colorClass="border-sky-100 hover:border-sky-300"
          icon={<Landmark size={24} />}
          iconColorClass="bg-sky-50 text-sky-600"
          title="Pokja I (Sosial & Karakter)"
          description="Fokus pada pembinaan karakter keluarga, gotong royong kebersihan, dan kerukunan sosial."
          items={[
            "Pengajian rutin antar dusun secara bergilir",
            "Penyuluhan pola asuh anak & remaja (PAAR)",
            "Gotong royong kebersihan lingkungan RT/RW"
          ]}
          actionLink="/admin/pkk/pokja1"
          actionText="Buka Kegiatan Pokja I"
        />

        {/* POKJA II */}
        <PokjaCard 
          colorClass="border-emerald-100 hover:border-emerald-300"
          icon={<BookOpenCheck size={24} />}
          iconColorClass="bg-emerald-50 text-emerald-600"
          title="Pokja II (Pendidikan & Ekonomi)"
          description="Fokus pada peningkatan ekonomi keluarga lewat UP2K dan pembinaan pendidikan anak usia dini."
          items={[
            "Pengelolaan PAUD terpadu binaan TP PKK",
            "Pelatihan ketrampilan tangan & kerajinan",
            "Pengembangan usaha mikro ekonomi UP2K"
          ]}
          actionLink="/admin/pkk/pokja2"
          actionText="Buka Kegiatan Pokja II"
        />

        {/* POKJA III */}
        <PokjaCard 
          colorClass="border-amber-100 hover:border-amber-300"
          icon={<Smile size={24} />}
          iconColorClass="bg-amber-50 text-amber-600"
          title="Pokja III (Sandang, Pangan, RT)"
          description="Fokus pada pemanfaatan pekarangan rumah pangan mandiri serta tata laksana rumah tangga."
          items={[
            "Sosialisasi konsumsi makanan bergizi B2SA",
            "Lomba pemanfaatan pekarangan hijau sehat",
            "Penyuluhan sandang & perumahan sehat"
          ]}
          actionLink="/admin/pkk/pokja3"
          actionText="Buka Kegiatan Pokja III"
        />

        {/* POKJA IV */}
        <PokjaCard 
          colorClass="border-rose-100 hover:border-rose-300"
          icon={<Heart size={24} />}
          iconColorClass="bg-rose-50 text-rose-600"
          title="Pokja IV (Kesehatan & Lingkungan)"
          description="Fokus pada peningkatan derajat kesehatan, penurunan stunting, dan kelestarian lingkungan."
          items={[
            "Pelayanan Posyandu Balita & Ibu Hamil e-KMS",
            "Kampanye PHBS & pemeriksaan kesehatan lansia",
            "Pemberantasan sarang nyamuk (Jumantik)"
          ]}
          actionLink="/admin/pkk/pokja4"
          actionText="Kelola Buku Baku Pokja IV"
          isHighlight={true}
        />

        {/* DASAWISMA */}
        <PokjaCard 
          colorClass="border-teal-100 hover:border-teal-300"
          icon={<Activity size={24} />}
          iconColorClass="bg-teal-50 text-teal-600"
          title="Gerakan Kelompok Dasawisma"
          description="Kelompok kecil (10-20 rumah tangga) sebagai ujung tombak pengumpulan data & kegiatan PKK."
          items={[
            "Pemantauan gizi & tinggi anak terdekat",
            "Kebun gizi mini organik Dasawisma Mawar",
            "Arisan sehat & iuran gotong royong warga"
          ]}
          actionLink="/admin/pkk/dasawisma"
          actionText="Kelola Kelompok Dasawisma"
        />

        {/* POSYANDU LINK */}
        <PokjaCard 
          colorClass="border-blue-100 hover:border-blue-300"
          icon={<HeartPulse size={24} />}
          iconColorClass="bg-blue-50 text-blue-600"
          title="KMS & Pelayanan Posyandu"
          description="Pelayanan posyandu terintegrasi penuh dengan e-KMS kependudukan SID Desa Kediren."
          items={[
            "Pengukuran tinggi & berat badan stunting",
            "Pemberian Vitamin A & Imunisasi dasar lengkap",
            "Pemberian Makanan Tambahan (PMT) nutrisi"
          ]}
          actionLink="/admin/posyandu"
          actionText="Buka Modul e-KMS Posyandu"
        />

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color, textColor }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${color} ${textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value} <span className="text-sm font-bold text-slate-400">{suffix}</span></p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

function PokjaCard({ colorClass, icon, iconColorClass, title, description, items, actionLink, actionText, isHighlight = false }: any) {
  return (
    <div className={`bg-white border rounded-[2.5rem] p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1 transform duration-300 ${colorClass}`}>
      <div className="space-y-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${iconColorClass}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors flex items-center gap-2">
            {title}
            {isHighlight && (
              <span className="px-2 py-0.5 text-[8px] font-black uppercase bg-rose-100 text-rose-600 rounded-md">Buku Baku</span>
            )}
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">TP PKK Desa Kediren</p>
          <p className="text-slate-500 text-xs mt-3 leading-relaxed font-semibold">{description}</p>
        </div>
        
        {/* Bullet Points */}
        <div className="space-y-2 pt-2 border-t border-slate-50">
          {items.map((item: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-600 leading-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0 group-hover:bg-rose-500 transition-colors" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <Link href={actionLink} className="block w-full">
          <button className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border ${
            isHighlight 
              ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-md shadow-rose-100' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100'
          }`}>
            {actionText} <ArrowUpRight size={14} />
          </button>
        </Link>
      </div>
    </div>
  );
}
