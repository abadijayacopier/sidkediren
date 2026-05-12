'use client';

import React from 'react';
import { updatePerangkatDesa } from '@/app/actions/struktur';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Save, Image as ImageIcon, Camera, FileText, AlertCircle } from 'lucide-react';

export default function PejabatFormClient({ jabatanId, perangkat }: { jabatanId: number, perangkat: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const nik = formData.get('nik') as string;
    if (nik && nik.length !== 16) {
      setIsSubmitting(false);
      Swal.fire({
        title: 'NIK Tidak Valid',
        text: 'NIK harus berjumlah tepat 16 digit angka.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      await updatePerangkatDesa(formData);
      await Swal.fire({
        title: 'Tersimpan!',
        text: 'Data Pejabat Desa berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
      router.push('/admin/settings/profil');
      router.refresh();
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <input type="hidden" name="jabatanId" value={jabatanId} />
      <input type="hidden" name="existingFoto" value={perangkat?.fotoProfil || ''} />
      <input type="hidden" name="existingTTD" value={perangkat?.tandaTanganDigital || ''} />

      {/* Info & Uploads */}
      <div className="lg:col-span-1 space-y-6">
         {/* Foto Profil */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto Profil Pejabat</p>
            <div className="relative group w-40 h-40 mx-auto">
               <div className="w-full h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center group-hover:border-emerald-400 transition-all overflow-hidden">
                  {perangkat?.fotoProfil ? (
                    <img src={perangkat.fotoProfil} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-slate-300 mb-2" />
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Format PNG/JPG</p>
                    </>
                  )}
               </div>
               <label className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={18} />
                  <input type="file" name="fotoProfil" className="hidden" accept="image/*" />
               </label>
            </div>
         </div>

         {/* Tanda Tangan */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanda Tangan Digital</p>
            <div className="relative group w-full h-32 mx-auto">
               <div className="w-full h-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center group-hover:border-emerald-400 transition-all overflow-hidden">
                  {perangkat?.tandaTanganDigital ? (
                    <img src={perangkat.tandaTanganDigital} alt="TTD" className="h-full object-contain" />
                  ) : (
                    <>
                      <FileText size={24} className="text-slate-300 mb-2" />
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Upload TTD (PNG Transparan)</p>
                    </>
                  )}
               </div>
               <label className="absolute -bottom-2 -right-2 p-2 bg-slate-800 text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform text-[10px] flex items-center gap-2">
                  <Save size={14} /> GANTI
                  <input type="file" name="tandaTanganDigital" className="hidden" accept="image/*" />
               </label>
            </div>
         </div>
      </div>

      {/* Form Details */}
      <div className="lg:col-span-2 space-y-6">
         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Pejabat</label>
                  <input 
                    name="nama" 
                    type="text"
                    required
                    defaultValue={perangkat?.nama || ''}
                    placeholder="Contoh: Supriyanto, S.Sos"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  />
               </div>
               <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIK (Nomor Induk Kependudukan)</label>
                  <input 
                    name="nik" 
                    type="text"
                    required
                    minLength={16}
                    maxLength={16}
                    pattern="\d{16}"
                    defaultValue={perangkat?.nik || ''}
                    placeholder="16 Digit Angka"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-mono font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  />
               </div>
            </div>

            <div className="space-y-3">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Jabatan</label>
               <select 
                  name="status"
                  defaultValue={perangkat?.status || 'AKTIF'}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer outline-none"
               >
                  <option value="AKTIF">AKTIF - Pejabat saat ini sedang menjabat</option>
                  <option value="CUTI">CUTI - Pejabat sedang berhalangan sementara</option>
                  <option value="NON-AKTIF">NON-AKTIF - Pejabat sudah selesai masa tugas</option>
               </select>
            </div>

            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex gap-4">
               <AlertCircle size={24} className="text-emerald-500 shrink-0" />
               <div className="space-y-1">
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">Informasi Penugasan</p>
                  <p className="text-[11px] text-emerald-700/80 font-medium leading-relaxed">
                    Data ini akan dipublikasikan di halaman depan profil desa dan digunakan sebagai tanda tangan otomatis pada dokumen surat-menyurat resmi desa.
                  </p>
               </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-3xl font-black transition-all shadow-2xl ${isSubmitting ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-200'}`}
            >
              <Save size={20} className={isSubmitting ? 'animate-pulse' : ''} />
              <span>{isSubmitting ? 'MENYIMPAN DATA...' : 'SIMPAN PERUBAHAN PEJABAT'}</span>
            </button>
         </div>
      </div>
    </form>
  );
}
