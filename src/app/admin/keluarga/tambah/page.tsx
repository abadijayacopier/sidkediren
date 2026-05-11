import React from 'react';
import { ArrowLeft, Save, Home, User } from 'lucide-react';
import Link from 'next/link';
import { createKeluargaBaru } from '@/app/actions/keluarga';

export default function TambahKeluargaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Daftarkan Keluarga Baru</h1>
        </div>
      </div>

      <form action={createKeluargaBaru} className="space-y-6">
        {/* Bagian 1: Data Kartu Keluarga */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6">
            <Home size={20} /> Informasi Kartu Keluarga (KK)
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <FormInput label="Nomor Kartu Keluarga" name="noKk" placeholder="16 Digit No. KK" required maxLength={16} />
            </div>
            <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Alamat Lengkap (Jalan/Dusun)</label>
                <textarea 
                    name="alamat" 
                    placeholder="Contoh: Jl. Mawar No. 12 atau Dusun Krajan" 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24"
                ></textarea>
            </div>
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <FormInput label="Dusun" name="dusun" placeholder="Nama Dusun" required />
                <FormInput label="RT" name="rt" placeholder="001" required maxLength={3} />
                <FormInput label="RW" name="rw" placeholder="001" required maxLength={3} />
            </div>
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <FormInput label="Kecamatan" name="kecamatan" defaultValue="LEMBEYAN" required />
                <FormInput label="Kabupaten/Kota" name="kabupaten" defaultValue="MAGETAN" required />
                <FormInput label="Provinsi" name="provinsi" defaultValue="JAWA TIMUR" required />
                <FormInput label="Kode Pos" name="kodePos" defaultValue="63372" required />
            </div>
          </div>
        </div>

        {/* Bagian 2: Data Kepala Keluarga */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-slate-100 pb-4 mb-6">
            <User size={20} /> Data Kepala Keluarga
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput label="NIK Kepala Keluarga" name="nik" placeholder="16 Digit NIK" required maxLength={16} />
            <FormInput label="Nama Lengkap Kepala Keluarga" name="namaLengkap" placeholder="Sesuai KTP" required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Tempat Lahir" name="tempatLahir" placeholder="Kota" required />
              <FormInput label="Tanggal Lahir" name="tanggalLahir" type="date" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Agama</label>
              <select name="agama" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                <option>ISLAM</option>
                <option>KRISTEN</option>
                <option>KATOLIK</option>
                <option>HINDU</option>
                <option>BUDHA</option>
              </select>
            </div>
            <FormInput label="Pekerjaan" name="pekerjaan" placeholder="Contoh: PETANI" />
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Jenis Kelamin</label>
              <select name="jenisKelamin" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
                <option value="L">LAKI-LAKI</option>
                <option value="P">PEREMPUAN</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/penduduk" className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
            Batal
          </Link>
          <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2">
            <Save size={20} /> Daftarkan Keluarga Baru
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, type = "text", defaultValue = "", placeholder = "", required = false, maxLength }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <input 
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
      />
    </div>
  );
}
