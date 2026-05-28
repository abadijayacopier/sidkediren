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
  Plus,
  Trash2,
  Zap,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import { getStrukturOrganisasi } from '@/app/actions/struktur';
import { getProfilDesa, updateProfilDesa } from '@/app/actions/surat';

export default function ProfilDesaSettings() {
  const [activeTab, setActiveTab] = useState('identitas');
  const [saving, setSaving] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    Swal.fire({
      title: 'Menyimpan Perubahan...',
      text: 'Sedang menyinkronkan data dengan database.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateProfilDesa(formData);
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Disimpan!',
          text: 'Data profil desa telah diperbarui.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: 'Terjadi kesalahan sistem.'
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.message || 'Terjadi kesalahan koneksi database.'
      });
    } finally {
      setSaving(false);
    }
  };
  const [struktur, setStruktur] = useState<any[]>([]);
  const [loadingStruktur, setLoadingStruktur] = useState(false);
  const [profil, setProfil] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [welcomePreview, setWelcomePreview] = useState<string | null>(null);
  const [runningText, setRunningText] = useState('');
  const [sliderImages, setSliderImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch initial profile and structure data together
  React.useEffect(() => {
    setLoadingStruktur(true);
    Promise.all([getProfilDesa(), getStrukturOrganisasi()]).then(([resProfil, resStruktur]) => {
      const p = resProfil as any;
      setProfil(p);
      setStruktur(resStruktur);
      setLoadingStruktur(false);
      
      if (p?.logoDesa) setLogoPreview(p.logoDesa);
      if (p?.heroImage) setHeroPreview(p.heroImage);
      if (p?.welcomeImage) setWelcomePreview(p.welcomeImage);
      if (p?.runningText) setRunningText(p.runningText);
      if (p?.sliderImages) {
        try {
          setSliderImages(JSON.parse(p.sliderImages));
        } catch (e) {
          setSliderImages([]);
        }
      }
    });
  }, []);

  // Sync / refresh structure when tab is switched
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
    { id: 'landing-page', label: 'Landing Page', icon: <Globe size={16} /> },
    { id: 'kontak', label: 'Kontak & Sosmed', icon: <Phone size={16} /> }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-4">
          <Link href="/admin/settings" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500 shrink-0">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight">Profil Desa Kediren</h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">Informasi publik yang dipublikasikan secara resmi.</p>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
        >
          <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* Tabs */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full md:w-fit overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'identitas' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-6 md:p-10 space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-10">
               {/* Logo Upload */}
               <div className="md:col-span-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Logo Pemerintah Desa</p>
                  <div className="relative group w-48 h-48 mx-auto">
                     <div className="w-full h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center group-hover:border-emerald-400 transition-all overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <>
                            <img src="/logo-magetan.png" alt="Logo" className="w-24 h-auto opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                            <p className="text-[9px] text-slate-400 font-bold mt-4 uppercase">Klik untuk Ganti</p>
                          </>
                        )}
                     </div>
                     <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                        <Camera size={18} />
                     </button>
                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoPreview)} className="absolute inset-0 opacity-0 cursor-pointer" title="Ganti Logo" />
                     <input type="hidden" name="logoDesa" value={logoPreview || ''} />
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
            className="p-6 md:p-10 space-y-10"
          >
            <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Visi Desa</label>
               <textarea name="visi" defaultValue={profil?.visi || "Mewujudkan Desa Kediren yang Mandiri, Religius, dan Berbudaya Menuju Masyarakat Sejahtera."} className="w-full px-6 py-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-900 text-lg text-center leading-relaxed italic" />
            </div>
            <div>
               <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Misi Desa</label>
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
            className="p-6 md:p-10 space-y-8"
          >
             <div className="flex items-center justify-between">
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
                         
                         {(j as any).perangkatDesa && (j as any).perangkatDesa.length > 0 ? (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-inner overflow-hidden">
                                  {(j as any).perangkatDesa[0].fotoProfil ? (
                                     <img src={(j as any).perangkatDesa[0].fotoProfil} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                     <Users size={18} />
                                  )}
                               </div>
                               <div className="overflow-hidden">
                                  <p className="text-[11px] font-black text-slate-700 truncate">{(j as any).perangkatDesa[0].nama}</p>
                                  <p className="text-[9px] text-slate-400 font-mono tracking-tighter">{(j as any).perangkatDesa[0].nik}</p>
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
        
        {activeTab === 'landing-page' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-6 md:p-10 space-y-12"
          >
             {/* Running Text Settings */}
             <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-white space-y-6">
                <div className="flex items-center gap-3">
                   <Zap className="text-amber-400" size={20} />
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Pengaturan Running Text (Ticker)</h3>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Pesan Berjalan di Halaman Utama</label>
                   <input 
                     name="runningText" 
                     type="text" 
                     value={runningText}
                     onChange={(e) => setRunningText(e.target.value)}
                     placeholder="Contoh: Selamat Datang di Portal Resmi Desa Kediren - Informasi Transparan, Warga Sejahtera." 
                     className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-white shadow-inner" 
                   />
                </div>
             </div>

             {/* Slider Images Gallery */}
             <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Layout className="text-emerald-600" size={20} />
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Hero Slider Gallery</h3>
                   </div>
                   <div className="relative">
                      <button type="button" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
                         <Plus size={14} /> TAMBAH FOTO SLIDER
                      </button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSliderImages(prev => [...prev, reader.result as string]);
                            };
                            reader.readAsDataURL(file);
                          });
                        }} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                   <input type="hidden" name="sliderImages" value={JSON.stringify(sliderImages)} />
                   {sliderImages.map((img, i) => (
                      <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                         <img src={img} alt={`Slider ${i}`} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                               type="button" 
                               onClick={() => setSliderImages(prev => prev.filter((_, idx) => idx !== i))}
                               className="p-2 bg-red-600 text-white rounded-xl hover:scale-110 transition-transform"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                   ))}
                   {sliderImages.length === 0 && (
                      <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Belum Ada Foto Slider. Banner Utama Akan Menggunakan Foto Default.</p>
                      </div>
                   )}
                </div>
             </div>

             <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                   <Globe className="text-emerald-600" size={20} />
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Hero Banner (Fallback)</h3>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-10">
                   <div className="lg:col-span-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">Foto Background Utama</label>
                      <div className="relative group aspect-[4/5] w-full max-w-[200px] mx-auto">
                         <div className="w-full h-full bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group-hover:border-emerald-400 transition-all shadow-inner">
                            {heroPreview ? (
                               <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                            ) : (
                               <div className="text-center p-4">
                                 <Plus size={32} className="text-slate-300 mx-auto mb-2" />
                                 <p className="text-[8px] text-slate-400 font-bold uppercase">Upload Foto Desa</p>
                               </div>
                            )}
                         </div>
                         <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                            <Camera size={18} />
                         </button>
                         <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setHeroPreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
                         <input type="hidden" name="heroImage" value={heroPreview || ''} />
                      </div>
                   </div>

                   <div className="lg:col-span-2 space-y-6">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Judul Utama (Hero Title)</label>
                         <input name="heroTitle" type="text" defaultValue={profil?.heroTitle || "Sistem Informasi Desa Kediren"} placeholder="Contoh: Selamat Datang di Desa Kediren" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sub-Judul (Hero Subtitle)</label>
                         <input name="heroSubtitle" type="text" defaultValue={profil?.heroSubtitle || "Mewujudkan tata kelola desa yang transparan dan digital."} placeholder="Tuliskan slogan singkat..." className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                   <Target className="text-emerald-600" size={20} />
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Welcome Section (Sambutan)</h3>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-10">
                   <div className="lg:col-span-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-center">Foto Kepala Desa</label>
                      <div className="relative group aspect-[3/4] w-full max-w-[180px] mx-auto">
                         <div className="w-full h-full bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group-hover:border-emerald-400 transition-all shadow-inner">
                            {welcomePreview ? (
                               <img src={welcomePreview} alt="Welcome" className="w-full h-full object-cover" />
                            ) : (
                               <div className="text-center p-4">
                                 <Users size={32} className="text-slate-300 mx-auto mb-2" />
                                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">Upload Foto</p>
                               </div>
                            )}
                         </div>
                         <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                            <Camera size={18} />
                         </button>
                         <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setWelcomePreview)} className="absolute inset-0 opacity-0 cursor-pointer" />
                         <input type="hidden" name="welcomeImage" value={welcomePreview || ''} />
                      </div>
                   </div>

                   <div className="lg:col-span-2 space-y-6">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Judul Sambutan</label>
                         <input name="welcomeTitle" type="text" defaultValue={profil?.welcomeTitle || "Sambutan Kepala Desa Kediren"} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Isi Sambutan / Pesan Singkat</label>
                         <textarea name="welcomeMessage" defaultValue={profil?.welcomeMessage} placeholder="Tuliskan pesan pembuka untuk warga di sini..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-600 h-40 resize-none leading-relaxed" />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'kontak' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-6 md:p-10 grid md:grid-cols-2 gap-8"
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
