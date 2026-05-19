'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smile, Plus, MapPin, Search, Edit3, Trash2, X, Save, Calendar, Users, DollarSign, ArrowLeft, Layers, CheckCircle } from 'lucide-react';
import { getKegiatanList, saveKegiatan, getKaderPkkList, deleteKegiatan } from '@/app/actions/pkk';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function Pokja3Page() {
  const [dataKegiatan, setDataKegiatan] = useState<any[]>([]);
  const [kaderList, setKaderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State (Kategori dikunci ke "Pokja III")
  const [formId, setFormId] = useState<number | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formSubKategori, setFormSubKategori] = useState('');
  const [formTanggal, setFormTanggal] = useState('');
  const [formLokasi, setFormLokasi] = useState('');
  const [formKaderId, setFormKaderId] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formJumlahHadir, setFormJumlahHadir] = useState(0);
  const [formSumberDana, setFormSumberDana] = useState('Swadaya');

  const loadData = async () => {
    setLoading(true);
    try {
      const [kegiatanRes, kaderRes] = await Promise.all([
        getKegiatanList(),
        getKaderPkkList()
      ]);
      // Filter sejak awal untuk Pokja III
      const filtered = ((kegiatanRes || []) as any[]).filter(k => k.kategori === 'Pokja III');
      setDataKegiatan(filtered);
      setKaderList((kaderRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load Pokja III data:', error);
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
    setFormSubKategori('');
    setFormTanggal(new Date().toISOString().split('T')[0]);
    setFormLokasi('');
    setFormKaderId('');
    setFormDeskripsi('');
    setFormJumlahHadir(0);
    setFormSumberDana('Swadaya');
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormId(item.id);
    setFormNama(item.nama);
    setFormSubKategori(item.subKategori);
    setFormTanggal(new Date(item.tanggal).toISOString().split('T')[0]);
    setFormLokasi(item.lokasi);
    setFormKaderId(item.kaderId ? String(item.kaderId) : '');
    setFormDeskripsi(item.deskripsi || '');
    setFormJumlahHadir(item.jumlahHadir || 0);
    setFormSumberDana(item.sumberDana || 'Swadaya');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formSubKategori || !formTanggal || !formLokasi) {
      Swal.fire('Oops!', 'Mohon isi semua data wajib yang ditandai bintang (*)', 'warning');
      return;
    }

    Swal.fire({ title: 'Menyimpan Log...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const formData = new FormData();
      if (formId) formData.append('id', String(formId));
      formData.append('nama', formNama);
      formData.append('kategori', 'Pokja III'); // LOCK KATEGORI
      formData.append('subKategori', formSubKategori);
      formData.append('tanggal', formTanggal);
      formData.append('lokasi', formLokasi);
      if (formKaderId) formData.append('kaderId', formKaderId);
      formData.append('deskripsi', formDeskripsi);
      formData.append('jumlahHadir', String(formJumlahHadir));
      formData.append('sumberDana', formSumberDana);

      const res = await saveKegiatan(formData);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Berhasil Disimpan!', showConfirmButton: false, timer: 1500 });
        setShowModal(false);
        loadData();
      }
    } catch (err: any) {
      Swal.fire('Gagal', err.message, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Hapus Kegiatan Pokja III?',
      text: 'Data kegiatan ini akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteKegiatan(id);
          if (res.success) {
            Swal.fire({ icon: 'success', title: 'Terhapus!', showConfirmButton: false, timer: 1500 });
            loadData();
          }
        } catch (err: any) {
          Swal.fire('Gagal', err.message, 'error');
        }
      }
    });
  };

  const filteredKegiatan = dataKegiatan.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subKategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/pkk" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-amber-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Smile size={20} />
              </div>
              Buku Kegiatan Pokja III
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-semibold">
              Pembinaan Konsumsi Pangan B2SA, Lomba Kebun Pekarangan Hijau (Hatinya PKK), Tata Laksana Sandang & Rumah Tangga.
            </p>
          </div>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-100 uppercase tracking-widest"
        >
          <Plus size={16} /> Tambah Log Pokja III
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari kegiatan, sub-kategori, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-xs font-semibold outline-none text-slate-700"
          />
        </div>
        <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
           Total: {filteredKegiatan.length} Kegiatan
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
            <span className="text-xs font-bold">Memuat database kegiatan Pokja III...</span>
          </div>
        ) : filteredKegiatan.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Layers size={40} className="text-slate-300" />
            <span className="text-xs font-bold">Belum ada log kegiatan untuk Pokja III.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredKegiatan.map((item) => (
              <div key={item.id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 border bg-amber-50 text-amber-600 border-amber-100 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {item.subKategori}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                      <Calendar size={12} /> {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 tracking-tight">{item.nama}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.deskripsi}</p>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[11px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {item.lokasi}</span>
                    <span className="flex items-center gap-1.5"><Users size={13} className="text-slate-400" /> {item.jumlahHadir || 0} Orang Hadir</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-slate-400" /> Dana: {item.sumberDana}</span>
                    {item.kader && (
                      <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-amber-500" /> PJ: {item.kader.nama} ({item.kader.jabatan})</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-start">
                  <button 
                    onClick={() => handleOpenEdit(item)}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50 hover:text-amber-600 text-slate-500 rounded-xl transition-all"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 text-rose-500 rounded-xl transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <Smile size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {formId ? 'Edit Laporan Pokja III' : 'Tambah Laporan Pokja III'}
                    </h3>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                      Program Pangan, Kebun Hijau, Sandang & Rumah Tangga
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Laporan Kegiatan Pokja III *</label>
                    <input 
                      type="text" 
                      value={formNama} 
                      onChange={(e) => setFormNama(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      placeholder="Contoh: Lomba Kebun Pekarangan Sehat & Mandiri Pangan" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sub Program Kerja *</label>
                    <input 
                      type="text" 
                      list="program-p3-list"
                      value={formSubKategori} 
                      onChange={(e) => setFormSubKategori(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      placeholder="Ketik manual / pilih rekomendasi..." 
                      required 
                    />
                    <datalist id="program-p3-list">
                      <option value="Halaman Teratur, Indah, dan Nyaman (HATINYA PKK)" />
                      <option value="Sosialisasi Konsumsi Pangan B2SA" />
                      <option value="Penyuluhan Tata Laksana Rumah Tangga" />
                      <option value="Pemanfaatan Pekarangan Hijau Sehat" />
                      <option value="Pameran Sandang Khas Desa" />
                    </datalist>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tanggal Pelaksanaan *</label>
                    <input 
                      type="date" 
                      value={formTanggal} 
                      onChange={(e) => setFormTanggal(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm"
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lokasi Kegiatan *</label>
                    <input 
                      type="text" 
                      value={formLokasi} 
                      onChange={(e) => setFormLokasi(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      placeholder="Contoh: Rumah-rumah Warga RT 04 Dusun Ledok" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kader Penanggung Jawab</label>
                    <select 
                      value={formKaderId} 
                      onChange={(e) => setFormKaderId(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-semibold text-slate-700 text-sm"
                    >
                      <option value="">Pilih Kader PJ</option>
                      {kaderList.map(k => (
                        <option key={k.id} value={k.id}>{k.nama} ({k.jabatan})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Jumlah Warga Hadir (Orang)</label>
                    <input 
                      type="number" 
                      value={formJumlahHadir} 
                      onChange={(e) => setFormJumlahHadir(Number(e.target.value))} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      placeholder="0" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sumber Anggaran / Dana</label>
                    <input 
                      type="text" 
                      value={formSumberDana} 
                      onChange={(e) => setFormSumberDana(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      placeholder="APBDesa / Swadaya" 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Uraian / Deskripsi Kegiatan</label>
                    <textarea 
                      value={formDeskripsi} 
                      onChange={(e) => setFormDeskripsi(e.target.value)} 
                      rows={4}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all"
                      placeholder="Uraikan detail kegiatan Pokja III, seperti hasil tanaman pekarangan sehat, tingkat ketahanan pangan warga, pameran sandang, dsb..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-100"
                  >
                    <Save size={14} /> Simpan Laporan
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
