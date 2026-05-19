'use client';

import React, { useState } from 'react';
import { Edit3, X, Save, Home, Globe, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { updateKeluargaDetails } from '@/app/actions/keluarga';
import { useRouter } from 'next/navigation';

export default function EditKkModal({ keluarga }: { keluarga: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    Swal.fire({
      title: 'Menyimpan Perubahan KK...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateKeluargaDetails(formData);
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Kartu Keluarga Diperbarui!',
          text: 'Data keluarga berhasil disimpan.',
          showConfirmButton: false,
          timer: 1500
        });
        setIsOpen(false);
        router.refresh();
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.message || 'Terjadi kesalahan saat memperbarui data KK.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-100"
      >
        <Edit3 size={18} /> Edit Data
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Home size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800">Edit Data Kartu Keluarga</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">KK: {keluarga.noKk}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-200 text-slate-400 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} encType="multipart/form-data" className="flex-1 overflow-y-auto p-6 space-y-6">
                <input type="hidden" name="noKk" value={keluarga.noKk} />

                {/* 1. Alamat Domisili */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Home size={14} /> 1. Alamat Domisili Keluarga
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Alamat Jalan <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        name="alamat" 
                        defaultValue={keluarga.alamat || ''} 
                        required 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dusun <span className="text-rose-500">*</span></label>
                      <select 
                        name="dusun" 
                        defaultValue={keluarga.dusun || ''} 
                        required 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700"
                      >
                        <option value="Selungguh">Selungguh</option>
                        <option value="Sekadalan">Sekadalan</option>
                        <option value="Ledok">Ledok</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">RT <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          name="rt" 
                          defaultValue={keluarga.rt || ''} 
                          required 
                          maxLength={3}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700 text-center font-mono" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">RW <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          name="rw" 
                          defaultValue={keluarga.rw || ''} 
                          required 
                          maxLength={3}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700 text-center font-mono" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kode Pos</label>
                      <input 
                        type="text" 
                        name="kodePos" 
                        defaultValue={keluarga.kodePos || '63372'} 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700 font-mono" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kecamatan</label>
                      <input 
                        type="text" 
                        name="kecamatan" 
                        defaultValue={keluarga.kecamatan || 'LEMBEYAN'} 
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kabupaten</label>
                      <input 
                        type="text" 
                        name="kabupaten" 
                        defaultValue={keluarga.kabupaten || 'MAGETAN'} 
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Provinsi</label>
                      <input 
                        type="text" 
                        name="provinsi" 
                        defaultValue={keluarga.provinsi || 'JAWA TIMUR'} 
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Administrasi KK */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Info size={14} /> 2. Detail Administrasi KK
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kepala Keluarga <span className="text-rose-500">*</span></label>
                      <select 
                        name="kepalaKeluargaNik" 
                        defaultValue={keluarga.kepalaKeluargaNik || ''} 
                        required 
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-slate-700 uppercase"
                      >
                        {keluarga.penduduk.map((member: any) => (
                          <option key={member.nik} value={member.nik}>
                            {member.namaLengkap} ({member.nik})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                        <span>Scan / Foto Kartu Keluarga (KK)</span>
                        {keluarga.fotoKk && <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black">KK TERUNGGAH</span>}
                      </label>
                      
                      <div className="flex items-center gap-4 bg-white p-3 border border-slate-200 rounded-xl">
                        {keluarga.fotoKk && (
                          <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border shrink-0">
                            <img src={keluarga.fotoKk} alt="Preview KK" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <input 
                            type="file" 
                            name="fotoKk" 
                            accept="image/*,application/pdf" 
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
                          />
                          <p className="text-[8px] text-slate-400 mt-1 italic">Format: JPG, PNG, PDF. Mengunggah berkas baru akan menimpa berkas yang sudah ada.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 transition-all"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
