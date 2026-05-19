'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Plus, MapPin, Search, Edit3, Trash2, X, Save, Calendar, Users, DollarSign, Award, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { getKegiatanList, saveKegiatan, deleteKegiatan, getKaderPkkList } from '@/app/actions/pkk';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function KegiatanPkkPage() {
  const [dataKegiatan, setDataKegiatan] = useState<any[]>([]);
  const [kaderList, setKaderList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formId, setFormId] = useState<number | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formKategori, setFormKategori] = useState('');
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
      setDataKegiatan((kegiatanRes as any[]) || []);
      setKaderList((kaderRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load kegiatan PKK data:', error);
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
    setFormKategori('');
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
    setFormKategori(item.kategori);
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
    if (!formNama || !formKategori || !formSubKategori || !formTanggal || !formLokasi) {
      Swal.fire({
        icon: 'error',
        title: 'Formulir Belum Lengkap',
        text: 'Mohon isi semua data wajib yang ditandai bintang (*)'
      });
      return;
    }

    try {
      const formData = new FormData();
      if (formId) formData.append('id', String(formId));
      formData.append('nama', formNama);
      formData.append('kategori', formKategori);
      formData.append('subKategori', formSubKategori);
      formData.append('tanggal', formTanggal);
      formData.append('lokasi', formLokasi);
      if (formKaderId) formData.append('kaderId', formKaderId);
      formData.append('deskripsi', formDeskripsi);
      formData.append('jumlahHadir', String(formJumlahHadir));
      formData.append('sumberDana', formSumberDana);

      const res = await saveKegiatan(formData);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Disimpan!',
          text: 'Data kegiatan PKK berhasil disimpan ke sistem.',
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
        text: err.message || 'Gagal menyimpan data kegiatan.'
      });
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Hapus Kegiatan PKK?',
      text: 'Data kegiatan ini beserta riwayatnya akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteKegiatan(id);
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Dihapus!',
              text: 'Data kegiatan telah dihapus dari sistem.',
              timer: 1500,
              showConfirmButton: false
            });
            loadData();
          }
        } catch (err: any) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
            text: err.message || 'Gagal menghapus data.'
          });
        }
      }
    });
  };

  // Filter & Search Logic
  const filteredKegiatan = dataKegiatan.filter(item => {
    const matchesTab = activeTab === 'Semua' || item.kategori === activeTab;
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subKategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Hitung statistik untuk cards
  const stats = {
    total: dataKegiatan.length,
    pokja1: dataKegiatan.filter(k => k.kategori === 'Pokja I').length,
    pokja2: dataKegiatan.filter(k => k.kategori === 'Pokja II').length,
    pokja3: dataKegiatan.filter(k => k.kategori === 'Pokja III').length,
    pokja4: dataKegiatan.filter(k => k.kategori === 'Pokja IV').length,
    dasawisma: dataKegiatan.filter(k => k.kategori === 'Dasawisma').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Award size={14} /> Juara 2 PKK Kabupaten Magetan 🏆
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <BookOpen className="text-rose-600" /> Log Kegiatan & Pembinaan PKK
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Pencatatan real-time dokumentasi 10 Program Pokok PKK dan Dasawisma Desa Kediren.
          </p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-rose-100 self-start md:self-auto"
        >
          <Plus size={16} /> Tambah Log Kegiatan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Kegiatan', value: stats.total, color: 'from-rose-500 to-pink-600', text: 'text-rose-600' },
          { title: 'Pokja I', value: stats.pokja1, color: 'from-blue-500 to-indigo-600', text: 'text-indigo-600' },
          { title: 'Pokja II', value: stats.pokja2, color: 'from-amber-500 to-orange-600', text: 'text-amber-600' },
          { title: 'Pokja III', value: stats.pokja3, color: 'from-emerald-500 to-teal-600', text: 'text-emerald-600' },
          { title: 'Pokja IV', value: stats.pokja4, color: 'from-sky-500 to-cyan-600', text: 'text-sky-600' },
          { title: 'Dasawisma', value: stats.dasawisma, color: 'from-purple-500 to-fuchsia-600', text: 'text-purple-600' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{stat.title}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className={`text-2xl font-black ${stat.text}`}>{stat.value}</span>
              <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl self-start">
          {['Semua', 'Pokja I', 'Pokja II', 'Pokja III', 'Pokja IV', 'Dasawisma'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                activeTab === tab 
                  ? 'bg-white text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Cari kegiatan, sub-kategori, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-xs font-bold outline-none text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent"></div>
            <span className="text-xs font-bold">Memuat database kegiatan PKK...</span>
          </div>
        ) : filteredKegiatan.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Layers size={40} className="text-slate-300" />
            <span className="text-xs font-bold">Belum ada log kegiatan untuk kategori ini.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredKegiatan.map((item) => {
              // Bag warna berdasarkan kategori
              let tagColor = 'bg-rose-50 text-rose-600 border-rose-100';
              if (item.kategori === 'Pokja I') tagColor = 'bg-indigo-50 text-indigo-600 border-indigo-100';
              if (item.kategori === 'Pokja II') tagColor = 'bg-amber-50 text-amber-600 border-amber-100';
              if (item.kategori === 'Pokja III') tagColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
              if (item.kategori === 'Pokja IV') tagColor = 'bg-sky-50 text-sky-600 border-sky-100';
              if (item.kategori === 'Dasawisma') tagColor = 'bg-purple-50 text-purple-600 border-purple-100';

              return (
                <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-black uppercase tracking-wider ${tagColor}`}>
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
                    <p className="text-xs text-slate-500 leading-relaxed">{item.deskripsi}</p>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[11px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {item.lokasi}</span>
                      <span className="flex items-center gap-1.5"><Users size={13} className="text-slate-400" /> {item.jumlahHadir || 0} Orang Hadir</span>
                      <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-slate-400" /> Dana: {item.sumberDana}</span>
                      {item.kader && (
                        <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-rose-500" /> PJ: {item.kader.nama} ({item.kader.jabatan})</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-start">
                    <button 
                      onClick={() => handleOpenEdit(item)}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
                      title="Edit Log Kegiatan"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                      title="Hapus Log"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {formId ? 'Edit Log Laporan Kegiatan PKK' : 'Tambah Log Laporan Kegiatan PKK'}
                  </h3>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">
                    Cakupan Evaluasi Program Gotong Royong
                  </p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Laporan Kegiatan *</label>
                    <input 
                      type="text" 
                      value={formNama} 
                      onChange={(e) => setFormNama(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl outline-none font-bold text-slate-700 text-sm transition-all"
                      placeholder="Contoh: Sosialisasi PHBS & Penyuluhan Jumantik" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kategori PKK *</label>
                    <select 
                      value={formKategori} 
                      onChange={(e) => setFormKategori(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="Pokja I">Pokja I (Sosial/Karakter)</option>
                      <option value="Pokja II">Pokja II (Pendidikan/UP2K)</option>
                      <option value="Pokja III">Pokja III (Sandang/Pangan/Hatinya PKK)</option>
                      <option value="Pokja IV">Pokja IV (Kesehatan/PHBS/Posyandu)</option>
                      <option value="Dasawisma">Dasawisma (Unit RT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sub Kategori Program *</label>
                    <input 
                      type="text" 
                      value={formSubKategori} 
                      onChange={(e) => setFormSubKategori(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl outline-none font-bold text-slate-700 text-sm transition-all"
                      placeholder="Contoh: UP2K / Hatinya PKK / PHBS" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tanggal Kegiatan *</label>
                    <input 
                      type="date" 
                      value={formTanggal} 
                      onChange={(e) => setFormTanggal(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm"
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lokasi / Tempat Kegiatan *</label>
                    <input 
                      type="text" 
                      value={formLokasi} 
                      onChange={(e) => setFormLokasi(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl outline-none font-bold text-slate-700 text-sm transition-all"
                      placeholder="Contoh: Rumah RT 02 Dusun Selungguh" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Kader Penanggung Jawab</label>
                    <select 
                      value={formKaderId} 
                      onChange={(e) => setFormKaderId(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-slate-700 text-sm"
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
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl outline-none font-bold text-slate-700 text-sm transition-all"
                      placeholder="0" 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sumber Anggaran / Sumber Dana</label>
                    <input 
                      type="text" 
                      value={formSumberDana} 
                      onChange={(e) => setFormSumberDana(e.target.value)} 
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl outline-none font-bold text-slate-700 text-sm transition-all"
                      placeholder="Contoh: APBDesa / Swadaya / CSR / Kas PKK" 
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Deskripsi Lengkap Kegiatan</label>
                    <textarea 
                      value={formDeskripsi} 
                      onChange={(e) => setFormDeskripsi(e.target.value)} 
                      rows={4}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl outline-none font-bold text-slate-700 text-sm transition-all"
                      placeholder="Tuliskan detail jalannya kegiatan, hasil kegiatan, dan catatan evaluasi penting..."
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
                    className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-100"
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
