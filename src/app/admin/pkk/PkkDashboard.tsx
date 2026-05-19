'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartPulse, Users, Activity, FileText, Plus, MapPin, Search, Edit3, Trash2, X, Save, Phone, ShieldCheck, Link as LinkIcon, Edit } from 'lucide-react';
import { getKaderPkkList, seedPkkData, saveKader, deleteKader, getWargaList, getPosyanduList } from '@/app/actions/pkk';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function PkkDashboard() {
  const [dataKader, setDataKader] = useState<any[]>([]);
  const [wargaList, setWargaList] = useState<any[]>([]);
  const [posyanduList, setPosyanduList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State & Sinkronisasi
  const [isAutoWarga, setIsAutoWarga] = useState(true); // Default true untuk alur sinkron kependudukan
  const [selectedWargaNik, setSelectedWargaNik] = useState('');
  const [formId, setFormId] = useState<number | null>(null);
  const [formNik, setFormNik] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formAreaTugas, setFormAreaTusun] = useState('');
  const [formKontak, setFormKontak] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      await seedPkkData();
      const [kaderRes, wargaRes, posyanduRes] = await Promise.all([
        getKaderPkkList(),
        getWargaList(),
        getPosyanduList()
      ]);
      setDataKader((kaderRes as any[]) || []);
      setWargaList((wargaRes as any[]) || []);
      setPosyanduList((posyanduRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load PKK data:', error);
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
      setFormAreaTusun('');
      return;
    }

    const warga = wargaList.find(w => w.nik === nik);
    if (warga) {
      setFormNik(warga.nik);
      setFormNama(warga.namaLengkap);
      setFormKontak('');
      
      const dusun = warga.keluarga?.dusun || '';
      // Cocokkan apakah dusun tempat tinggal warga terdaftar di daftar Posyandu Aktif (case-insensitive)
      const matchedDusun = dusunOptions.find(d => d.toLowerCase() === dusun.toLowerCase());
      if (matchedDusun) {
        setFormAreaTusun(matchedDusun);
      } else {
        setFormAreaTusun(''); // Kosongkan agar operator memilih Dusun posyandu yang valid
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
    setFormAreaTusun('');
    setFormKontak('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setFormId(item.id);
    setFormNik(item.nik);
    setFormNama(item.nama);
    setFormJabatan(item.jabatan);
    setFormAreaTusun(item.areaTugas);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
               <HeartPulse size={20} />
             </div>
             PKK Desa Kediren
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Informasi Pemberdayaan Kesejahteraan Keluarga (PKK) Desa Kediren.</p>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/admin/pkk/kegiatan">
             <button className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-100 transition-all">
               <FileText size={16} /> Laporan Kegiatan
             </button>
           </Link>
           <button 
             onClick={handleOpenAdd}
             className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-700 shadow-sm transition-all shadow-rose-200"
           >
             <Plus size={16} /> Tambah Kader
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users size={24} />} label="Total Kader TP PKK" value={dataKader.length || 0} suffix="Orang" color="bg-rose-50" textColor="text-rose-600" />
        <StatCard icon={<Activity size={24} />} label="Kelompok Dasawisma" value="12" suffix="Kelompok" color="bg-emerald-50" textColor="text-emerald-600" />
        <StatCard icon={<FileText size={24} />} label="Kegiatan Pokja" value="4" suffix="Agenda" color="bg-amber-50" textColor="text-amber-600" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
         <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users size={16} className="text-rose-500" /> Daftar Pengurus & Kader TP PKK
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
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Kader / NIK</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jabatan TP PKK</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wilayah Tugas</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKader.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-tight">{item.jabatan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> Dusun {item.areaTugas}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-bold flex items-center gap-1.5"><Phone size={14} className="text-emerald-500" /> {item.kontak || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
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

      {/* Modal Form Tambah/Edit Kader */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">{formId ? 'Edit Data Pengurus/Kader' : 'Registrasi Pengurus & Kader TP PKK'}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Kelompok Pemberdayaan Keluarga & Posyandu</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Metode Penginputan</h4>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => { setIsAutoWarga(true); handleSelectWarga(''); }}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${isAutoWarga ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <LinkIcon size={12} /> Ambil Data Warga
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsAutoWarga(false); handleSelectWarga(''); }}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${!isAutoWarga ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Edit size={12} /> Input Manual
                    </button>
                  </div>
                </div>

                {isAutoWarga && (
                  <div className="animate-fade-in space-y-1.5">
                    <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">Pilih Warga untuk Dijadikan Kader</label>
                    <select 
                      value={selectedWargaNik} 
                      onChange={(e) => handleSelectWarga(e.target.value)} 
                      className="w-full px-5 py-3 bg-rose-50/50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
                      required={isAutoWarga}
                    >
                      <option value="">-- Cari Nama Warga / NIK --</option>
                      {wargaList.map(w => (
                        <option key={w.nik} value={w.nik}>
                          {w.namaLengkap} (NIK: {w.nik}) - Dusun {w.keluarga?.dusun || '-'}
                        </option>
                      ))}
                    </select>
                    <p className="text-[9px] text-slate-400 font-semibold">Memilih warga otomatis mengimpor nama, NIK, kontak, and wilayah kediamannya.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Lengkap Kader</label>
                    <input 
                      type="text" 
                      value={formNama} 
                      onChange={(e) => setFormNama(e.target.value)} 
                      disabled={isAutoWarga && !!selectedWargaNik}
                      className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                        isAutoWarga && !!selectedWargaNik 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-rose-500'
                      }`} 
                      placeholder="Nama lengkap beserta gelar (jika ada)" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nomor Induk Kependudukan (NIK)</label>
                    <input 
                      type="text" 
                      maxLength={16}
                      value={formNik} 
                      onChange={(e) => setFormNik(e.target.value)} 
                      disabled={isAutoWarga && !!selectedWargaNik}
                      className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                        isAutoWarga && !!selectedWargaNik 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-rose-500'
                      }`} 
                      placeholder="NIK 16 digit" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nomor WhatsApp / Kontak</label>
                    <input 
                      type="text" 
                      value={formKontak} 
                      onChange={(e) => setFormKontak(e.target.value)} 
                      disabled={isAutoWarga && !!selectedWargaNik && !!formKontak}
                      className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                        isAutoWarga && !!selectedWargaNik && !!formKontak
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-rose-500'
                      }`} 
                      placeholder="Contoh: 08123456789" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Jabatan (Organisasi)</label>
                    <select 
                      value={formJabatan} 
                      onChange={(e) => setFormJabatan(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      <option value="Ketua TP PKK">Ketua TP PKK</option>
                      <option value="Wakil Ketua TP PKK">Wakil Ketua TP PKK</option>
                      <option value="Ketua Posyandu">Ketua Posyandu</option>
                      <option value="Sekretaris Posyandu">Sekretaris Posyandu</option>
                      <option value="Bendahara Posyandu">Bendahara Posyandu</option>
                      <option value="Kader Pelaksana PKK">Kader Pelaksana PKK</option>
                      <option value="Kader Posyandu">Kader Posyandu</option>
                    </select>
                  </div>

                   <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Wilayah / Area Tugas (Dusun)</label>
                    <select 
                      value={formAreaTugas} 
                      onChange={(e) => setFormAreaTusun(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
                      required
                    >
                      <option value="">Pilih Dusun Tugas</option>
                      {dusunOptions.map(dusun => (
                        <option key={dusun} value={dusun}>Dusun {dusun}</option>
                      ))}
                    </select>
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
                    <Save size={14} /> Simpan Anggota
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

function StatCard({ icon, label, value, suffix, color, textColor }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${color} ${textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value} <span className="text-sm font-bold text-slate-400">{suffix}</span></p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}
