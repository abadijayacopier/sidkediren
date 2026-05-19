'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  X,
  Plus,
  Type,
  FileText,
  Layers,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createBerita } from '@/app/actions/berita';

export default function TambahBeritaPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={createBerita} className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/berita" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tambah Berita Baru</h1>
            <p className="text-slate-500 text-sm font-medium">Buat konten informatif untuk warga desa.</p>
          </div>
        </div>
        <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
          <Save size={18} /> Publikasikan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                <Type size={14} className="text-emerald-600" /> Judul Berita
              </label>
              <input 
                name="judul" 
                type="text" 
                required 
                placeholder="Contoh: Perayaan Hari Kemerdekaan di Balai Desa" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300 transition-all" 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                <FileText size={14} className="text-emerald-600" /> Ringkasan Singkat
              </label>
              <textarea 
                name="ringkasan" 
                placeholder="Tuliskan ringkasan berita dalam 1-2 kalimat..." 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-600 h-24 resize-none leading-relaxed transition-all" 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                <Layers size={14} className="text-emerald-600" /> Isi Konten Berita
              </label>
              <textarea 
                name="konten" 
                required 
                placeholder="Tuliskan detail berita secara lengkap di sini..." 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-600 h-80 resize-none leading-relaxed transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Thumbnail Image */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
              <ImageIcon size={14} className="text-emerald-600" /> Gambar Utama
            </label>
            <div className="relative group aspect-video w-full">
              <div className="w-full h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group-hover:border-emerald-400 transition-all">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Plus size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Upload Thumbnail</p>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <input type="hidden" name="gambar" value={imagePreview || ''} />
              {imagePreview && (
                <button 
                  type="button" 
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">Gunakan gambar dengan rasio 16:9 untuk hasil terbaik.</p>
          </div>

          {/* Meta Data */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Kategori</label>
              <select name="kategori" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm appearance-none cursor-pointer">
                <option value="Umum">Umum</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Pembangunan">Pembangunan</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Ekonomi">Ekonomi</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                     <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none">Status</p>
                    <p className="text-[9px] text-emerald-600 font-bold mt-1">Publikasikan Langsung</p>
                  </div>
               </div>
               <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isPublished" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
