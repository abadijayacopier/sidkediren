import React from 'react';
import prisma from '@/lib/prisma';
import { 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Globe, 
  Phone, 
  Save,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { updateProfilDesa } from '@/app/actions/surat';

export default async function SettingsDesaPage() {
  const profil = await prisma.profilDesa.findFirst({ where: { id: 1 } });

  if (!profil) {
     // Seed data should have created this, but just in case:
     return <div className="p-10 text-red-500">Profil Desa tidak ditemukan. Silakan jalankan seeding database.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Identitas Desa</h1>
          <p className="text-slate-500 mt-1 font-medium">Atur informasi resmi desa yang akan tampil pada Kop Surat.</p>
        </div>
      </div>

      <form action={updateProfilDesa} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bagian 1: Informasi Umum */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
              <Building2 className="text-emerald-500" size={20} />
              Informasi Umum
            </h2>

            <div className="space-y-4">
              <InputField label="Nama Desa" name="namaDesa" defaultValue={profil.namaDesa} />
              <InputField label="Kode Desa" name="kodeDesa" defaultValue={profil.kodeDesa} placeholder="Contoh: 35.20.03.2001" />
              <InputField label="Kecamatan" name="kecamatan" defaultValue={profil.kecamatan} />
              <InputField label="Kabupaten" name="kabupaten" defaultValue={profil.kabupaten} />
              <InputField label="Provinsi" name="provinsi" defaultValue={profil.provinsi} />
            </div>
          </div>

          {/* Bagian 2: Kontak & Alamat */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
              <MapPin className="text-blue-500" size={20} />
              Kontak & Alamat
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Alamat Lengkap</label>
                <textarea 
                  name="alamat" 
                  defaultValue={profil.alamat}
                  rows={3}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
              </div>
              <InputField label="Kode Pos" name="kodePos" defaultValue={profil.kodePos} />
              <InputField label="Telepon" name="telepon" defaultValue={profil.telepon || ''} />
              <InputField label="Email" name="email" defaultValue={profil.email || ''} type="email" />
              <InputField label="Website" name="website" defaultValue={profil.website || ''} />
            </div>
          </div>

          {/* Bagian 3: Penandatangan */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
              <User className="text-amber-500" size={20} />
              Pejabat Penandatangan
            </h2>

            <div className="space-y-4">
              <InputField label="Nama Kepala Desa" name="namaKepalaDesa" defaultValue={profil.namaKepalaDesa} />
              <InputField label="NIP Kepala Desa" name="nipKepalaDesa" defaultValue={profil.nipKepalaDesa || ''} placeholder="Gunakan '-' jika tidak ada NIP" />
            </div>
          </div>

          {/* Bagian 4: Logo & TTD */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
             <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
              <ImageIcon className="text-purple-500" size={20} />
              Logo & Tanda Tangan
            </h2>
            <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
               <p className="text-xs text-slate-400 font-bold italic">Fitur upload logo & TTD digital akan tersedia pada pembaruan mendatang.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-[30px] font-black hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 uppercase tracking-widest text-sm"
          >
            <Save size={20} />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, name, defaultValue, type = 'text', placeholder = '' }: { label: string, name: string, defaultValue: string, type?: string, placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{label}</label>
      <input 
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
      />
    </div>
  );
}
