'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowLeft, Edit3, Trash2, X, Save, MapPin, Phone, Search } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { getKaderPkkList, saveKader, deleteKader, getWargaList, getPosyanduList } from '@/app/actions/pkk';

export default function SettingsPkkPage() {
  const [dataKader, setDataKader] = useState<any[]>([]);
  const [wargaList, setWargaList] = useState<any[]>([]);
  const [posyanduList, setPosyanduList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State & Sinkronisasi
  const [isAutoWarga, setIsAutoWarga] = useState(true);
  const [selectedWargaNik, setSelectedWargaNik] = useState('');
  const [formId, setFormId] = useState<number | null>(null);
  const [formNik, setFormNik] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formAreaTugas, setFormAreaTugas] = useState('');
  const [formKontak, setFormKontak] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [kaderRes, wargaRes, posyanduRes] = await Promise.all([
        getKaderPkkList(),
        getWargaList(),
        getPosyanduList()
      ]);
      setDataKader((kaderRes as any[]) || []);
      setWargaList((wargaRes as any[]) || []);
      setPosyanduList((posyanduRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load PKK settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectWarga = (nik: string) => {
    setSelectedWargaNik(nik);
    if (!nik) {
      setFormNik('');
      setFormNama('');
      setFormKontak('');
      setFormAreaTugas('');
      return;
    }

    const warga = wargaList.find(w => w.nik === nik);
    if (warga) {
      setFormNik(warga.nik);
      setFormNama(warga.namaLengkap);
      setFormKontak('');
      
      const dusun = warga.keluarga?.dusun || '';
      const matchedDusun = dusunOptions.find(d => d.toLowerCase() === dusun.toLowerCase());
      if (matchedDusun) {
        setFormAreaTugas(matchedDusun);
      } else {
        setFormAreaTugas('');
      }
    }
  };

  const handleOpenAdd = () => {
    setFormId(null);
    setIsAutoWarga(true);
    setSelectedWargaNik('');
    setFormNik('');
    setFormNama('');
    setFormJabatan('');
    setFormAreaTugas('');
    setFormKontak('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormId(item.id);
    setIsAutoWarga(false);
    setFormNik(item.nik);
    setFormNama(item.nama);
    setFormJabatan(item.jabatan);
    setFormAreaTugas(item.areaTugas);
    setFormKontak(item.kontak || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: 'Menyimpan Data Kader...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    if (formId) formData.append('id', String(formId));
    formData.append('nik', formNik);
    formData.append('nama', formNama);
    formData.append('jabatan', formJabatan);
    formData.append('areaTugas', formAreaTugas);
    formData.append('kontak', formKontak);

    try {
      const res = await saveKader(formData);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Disimpan!',
          text: 'Data Pengurus/Kader TP PKK telah diperbarui.',
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
      title: 'Hapus Kader?',
      text: "Seluruh jadwal posyandu yang diampu kader ini akan disinkronkan kembali.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteKader(id);
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Dihapus!',
              text: 'Data kader telah dihapus dari sistem.',
              timer: 1500,
              showConfirmButton: false
            });
            loadData();
          }
        } catch (err: any) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: err.message || 'Gagal menghapus data kader.'
          });
        }
      }
    });
  };

  const registeredDusuns = Array.from(
    new Set(
      posyanduList
        .map(p => p.dusun)
        .filter(Boolean)
    )
  );
  const dusunOptions = registeredDusuns.length > 0 ? registeredDusuns : ['Selungguh', 'Sekadalan', 'Ledok'];

  const filteredKader = dataKader.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.areaTugas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <Users size={20} />
              </div>
              Manajemen Kader PKK
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Atur data pengurus TP PKK Desa Kediren, wilayah penugasan, dan singkronisasi data kependudukan.</p>
          </div>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 uppercase tracking-widest text-xs"
        >
          <Plus size={16} /> Tambah Kader
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Users size={16} className="text-rose-500" /> Daftar Pengurus & Kader TP PKK Aktif
          </h3>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kader, jabatan, wilayah tugas..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data kader...</div>
          ) : filteredKader.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold text-sm">Tidak ditemukan data kader matching.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Kader / NIK</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan TP PKK</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah Tugas</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKader.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
                          {item.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.nik}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-tight">{item.jabatan}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-600 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> Dusun {item.areaTugas}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-600 font-bold flex items-center gap-1.5"><Phone size={14} className="text-emerald-500" /> {item.kontak || '-'}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">{formId ? 'Edit Data Kader' : 'Tambah Kader PKK Baru'}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Integrasi Pengurus TP PKK Desa</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  {/* Mode Sinkronisasi Kependudukan */}
                  {!formId && (
                    <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-rose-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Auto-Sinkron Kependudukan</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Ambil Profil dari Database Warga</p>
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isAutoWarga} 
                        onChange={(e) => setIsAutoWarga(e.target.checked)}
                        className="w-4 h-4 text-rose-600 accent-rose-600 border-rose-200 rounded focus:ring-rose-500"
                      />
                    </div>
                  )}

                  {isAutoWarga && !formId ? (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Warga Desa Kediren</label>
                      <select 
                        value={selectedWargaNik}
                        onChange={(e) => handleSelectWarga(e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-semibold text-slate-700 text-sm"
                        required
                      >
                        <option value="">-- Pilih Warga --</option>
                        {wargaList.map((w) => (
                          <option key={w.nik} value={w.nik}>
                            {w.namaLengkap} - NIK: {w.nik} ({w.keluarga?.dusun || 'Tanpa Dusun'})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">NIK Kader</label>
                        <input 
                          type="text" 
                          value={formNik} 
                          onChange={(e) => setFormNik(e.target.value)} 
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-semibold text-slate-700 text-sm"
                          placeholder="Masukkan NIK 16 digit" 
                          maxLength={16}
                          required 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={formNama} 
                          onChange={(e) => setFormNama(e.target.value)} 
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-semibold text-slate-700 text-sm"
                          placeholder="Nama lengkap kader" 
                          required 
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Jabatan TP PKK</label>
                    <input 
                      type="text" 
                      value={formJabatan} 
                      onChange={(e) => setFormJabatan(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-semibold text-slate-700 text-sm"
                      placeholder="Contoh: KETUA TP PKK, KADER POSYANDU BALITA" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Wilayah Tugas (Dusun)</label>
                    <select 
                      value={formAreaTugas} 
                      onChange={(e) => setFormAreaTugas(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-semibold text-slate-700 text-sm"
                      required
                    >
                      <option value="">-- Pilih Dusun Tugas --</option>
                      <option value="Desa Kediren">Seluruh Desa Kediren</option>
                      {dusunOptions.map((d) => (
                        <option key={d} value={`Dusun ${d}`}>Dusun {d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kontak / Nomor HP</label>
                    <input 
                      type="text" 
                      value={formKontak} 
                      onChange={(e) => setFormKontak(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-semibold text-slate-700 text-sm"
                      placeholder="Contoh: 0812-3456-7890" 
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
                    <Save size={14} /> Simpan Kader
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
