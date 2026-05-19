'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Plus, ArrowLeft, Edit3, Trash2, X, Save, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { getPosyanduList, savePosyandu, deletePosyandu } from '@/app/actions/pkk';

export default function SettingsPosyanduPage() {
  const [posyanduList, setPosyanduList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formId, setFormId] = useState<number | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formDusun, setFormDusun] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getPosyanduList();
      setPosyanduList(res || []);
    } catch (error) {
      console.error('Failed to load Posyandu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormId(null);
    setFormNama('');
    setFormDusun('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormId(item.id);
    setFormNama(item.nama);
    setFormDusun(item.dusun);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Menyimpan Data...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    if (formId) formData.append('id', String(formId));
    formData.append('nama', formNama);
    formData.append('dusun', formDusun);

    try {
      const res = await savePosyandu(formData);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Disimpan!',
          text: 'Data Posyandu berhasil diperbarui.',
          timer: 1500,
          showConfirmButton: false
        });
        setShowModal(false);
        loadData();
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.message || 'Terjadi kesalahan sistem.'
      });
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Seluruh jadwal pelayanan dan data balita di bawah Posyandu ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deletePosyandu(id);
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Dihapus!',
              text: 'Data Posyandu telah dihapus.',
              timer: 1500,
              showConfirmButton: false
            });
            loadData();
          }
        } catch (err: any) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: err.message || 'Gagal menghapus data dari database.'
          });
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <HeartPulse size={20} />
              </div>
              Manajemen Posyandu
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Tambah, edit, and hapus pos pelayanan terpadu beserta dusun cakupannya.</p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 uppercase tracking-widest text-xs"
        >
          <Plus size={16} /> Tambah Posyandu
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <HeartPulse size={16} className="text-rose-500" /> Daftar Posyandu Aktif Desa Kediren
          </h3>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data Posyandu...</div>
          ) : posyanduList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">Belum ada data Posyandu yang terdaftar.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Posyandu</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cakupan Wilayah / Dusun</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posyanduList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm">
                          <HeartPulse size={16} />
                        </div>
                        <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" /> Dusun {item.dusun}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form Tambah/Edit */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">{formId ? 'Edit Data Posyandu' : 'Tambah Posyandu Baru'}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Wilayah Layanan Kesehatan Desa</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Posyandu</label>
                    <input 
                      type="text" 
                      value={formNama} 
                      onChange={(e) => setFormNama(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
                      placeholder="Contoh: Posyandu Kenanga 3" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Dusun Cakupan</label>
                    <input 
                      type="text" 
                      value={formDusun} 
                      onChange={(e) => setFormDusun(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
                      placeholder="Contoh: Ngujung" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-5 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl text-xs uppercase tracking-widest"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 uppercase tracking-widest text-xs"
                  >
                    <Save size={14} /> Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
