'use client';

import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Users, 
  Target, 
  History, 
  Globe, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Save, 
  ArrowLeft,
  Camera,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { getStrukturOrganisasi } from '@/app/actions/struktur';
import { getProfilDesa, updateProfilDesa } from '@/app/actions/surat';

export default function ProfilDesaSettings() {
  const [activeTab, setActiveTab] = useState('identitas');
  const [struktur, setStruktur] = useState<any[]>([]);
  const [loadingStruktur, setLoadingStruktur] = useState(false);
  const [profil, setProfil] = useState<any>(null);

  // Fetch initial profile data
  React.useEffect(() => {
    getProfilDesa().then(res => {
      setProfil(res);
    });
  }, []);

  // Fetch struktur data when tab is active
  React.useEffect(() => {
    if (activeTab === 'struktur') {
      setLoadingStruktur(true);
      getStrukturOrganisasi().then(res => {
        setStruktur(res);
        setLoadingStruktur(false);
      });
    }
  }, [activeTab]);

  const tabs = [
    { id: 'identitas', label: 'Identitas Desa', icon: <Building size={16} /> },
    { id: 'visi-misi', label: 'Visi & Misi', icon: <Target size={16} /> },
    { id: 'struktur', label: 'Struktur Organisasi', icon: <Users size={16} /> },
    { id: 'kontak', label: 'Kontak & Sosmed', icon: <Phone size={16} /> }
  ];

  const categories = [
    { label: 'Pemerintah Desa', key: 'PEMERINTAH', color: 'bg-emerald-500' },
    { id: 'bpd', label: 'BPD', key: 'BPD', color: 'bg-blue-500' },
    { id: 'lsm', label: 'LSM', key: 'LSM', color: 'bg-amber-500' },
  ];

  return (
    <form action={updateProfilDesa} className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profil Desa Kediren</h1>
            <p className="text-slate-500 text-sm font-medium">Informasi publik yang dipublikasikan secara resmi.</p>
          </div>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
          <Save size={18} /> Simpan Perubahan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'identitas' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-10 space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-10">
               {/* Logo Upload */}
               <div className="md:col-span-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Logo Pemerintah Desa</p>
                  <div className="relative group w-48 h-48 mx-auto">
                     <div className="w-full h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center group-hover:border-emerald-400 transition-all">
                        <img src="/logo-magetan.png" alt="Logo" className="w-24 h-auto opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                        <p className="text-[9px] text-slate-400 font-bold mt-4 uppercase">Klik untuk Ganti</p>
                     </div>
                     <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                        <Camera size={18} />
                     </button>
                  </div>
               </div>

               {/* Fields */}
               <div className="md:col-span-2 grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Resmi Desa</label>
                     <input name="namaDesa" type="text" defaultValue={profil?.namaDesa || "KEDIREN"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kabupaten</label>
                     <input name="kabupaten" type="text" defaultValue={profil?.kabupaten || "MAGETAN"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kecamatan</label>
                     <input name="kecamatan" type="text" defaultValue={profil?.kecamatan || "LEMBEYAN"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Kepala Desa</label>
                     <input name="namaKepalaDesa" type="text" defaultValue={profil?.namaKepalaDesa || "SUPRIYANTO"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">NIP / Identitas Pimpinan</label>
                     <input name="nipKepalaDesa" type="text" defaultValue={profil?.nipKepalaDesa || "-"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                  </div>
                  <div className="col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Alamat Kantor Desa</label>
                     <textarea name="alamat" defaultValue={profil?.alamat || "Jl. Raya Kediren No. 01, Kediren, Lembeyan, Magetan, Jawa Timur"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 h-20 resize-none" />
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <History size={18} className="text-emerald-600" /> Sejarah Singkat Desa
               </h3>
               <textarea name="sejarah" defaultValue={profil?.sejarah} placeholder="Tuliskan sejarah desa di sini..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-600 h-48 resize-none leading-relaxed" />
            </div>
          </motion.div>
        )}

        {activeTab === 'visi-misi' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-10 space-y-10"
          >
            <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Visi Desa</label>
               <textarea name="visi" defaultValue={profil?.visi || "Mewujudkan Desa Kediren yang Mandiri, Religius, dan Berbudaya Menuju Masyarakat Sejahtera."} className="w-full px-6 py-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900 text-lg text-center leading-relaxed italic" />
            </div>
            <div>
               <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Misi Desa</label>
                  <button type="button" className="p-2 bg-emerald-600 text-white rounded-lg hover:scale-110 transition-transform">
                     <Plus size={16} />
                  </button>
               </div>
               <div className="space-y-3">
                  <input type="hidden" name="misi" value={profil?.misi || "[]"} />
                  {(profil?.misi ? JSON.parse(profil.misi) : [
                    "Meningkatkan pelayanan publik yang transparan and akuntabel.",
                    "Mengoptimalkan potensi pertanian desa berbasis teknologi.",
                    "Membangun infrastruktur desa yang merata and berkelanjutan."
                  ]).map((misi: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <span className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-black text-emerald-600 text-xs">{i+1}</span>
                       <input type="text" defaultValue={misi} className="flex-1 bg-transparent outline-none font-bold text-slate-700" />
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'struktur' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-10 space-y-8"
          >
             <div className="flex items-center justify-between">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 no-print">
                   <Link href="/admin/settings/struktur/bagan" className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg text-xs font-black shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
                      <Plus size={14} className="text-emerald-600" />
                      LIHAT BAGAN VISUAL
                   </Link>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Total {struktur.length} Jabatan Terdefinisi</p>
             </div>

             {loadingStruktur ? (
                <div className="py-20 flex justify-center"><div className="animate-spin text-emerald-500 rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
             ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {struktur.map((j) => (
                      <div key={j.id} className="group relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-tighter">Level {j.level}</span>
                            <Link href={`/admin/settings/struktur/${j.id}/edit`} className="p-2 text-slate-300 hover:text-emerald-600 transition-colors">
                               <Plus size={16} />
                            </Link>
                         </div>
                         <h4 className="text-sm font-black text-slate-800 leading-tight mb-4">{j.namaJabatan}</h4>
                         
                         {j.perangkat && j.perangkat.length > 0 ? (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-inner overflow-hidden">
                                  {j.perangkat[0].fotoProfil ? (
                                     <img src={j.perangkat[0].fotoProfil} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                     <Users size={18} />
                                  )}
                               </div>
                               <div className="overflow-hidden">
                                  <p className="text-[11px] font-black text-slate-700 truncate">{j.perangkat[0].nama}</p>
                                  <p className="text-[9px] text-slate-400 font-mono tracking-tighter">{j.perangkat[0].nik}</p>
                               </div>
                            </div>
                         ) : (
                            <Link href={`/admin/settings/struktur/${j.id}/edit`} className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-[9px] font-black uppercase tracking-widest">
                               <Plus size={14} /> ISI JABATAN
                            </Link>
                         )}
                      </div>
                   ))}
                </div>
             )}
          </motion.div>
        )}

        {activeTab === 'kontak' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-10 grid md:grid-cols-2 gap-8"
          >
             <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Kontak Resmi</h3>
                <div className="space-y-4">
                   <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                      <input name="telepon" type="text" placeholder="Nomor Telepon Kantor" defaultValue={profil?.telepon || "0351-XXXXXX"} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                   </div>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                      <input name="email" type="email" placeholder="Email Desa" defaultValue={profil?.email || "desa.kediren@magetan.go.id"} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                   </div>
                   <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                      <input name="website" type="text" placeholder="Website Resmi" defaultValue={profil?.website || "www.kediren.desa.id"} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                   </div>
                </div>
             </div>
             <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Media Sosial</h3>
                <div className="space-y-4">
                   <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
                      <input name="instagram" type="text" placeholder="@desakediren" defaultValue={profil?.instagram} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                   </div>
                   <div className="relative">
                      <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                      <input name="facebook" type="text" placeholder="facebook.com/kediren" defaultValue={profil?.facebook} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </div>
    </form>
  );
}
