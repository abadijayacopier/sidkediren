'use client';

import React, { useState, useEffect } from 'react';
import { 
  Palmtree, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Save, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { getPotensiList, savePotensi, deletePotensi } from '@/app/actions/potensi';

export default function PotensiSettingsPage() {
  const [activeTab, setActiveTab] = useState<'WISATA' | 'UMKM'>('WISATA');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Form State
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [harga, setHarga] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [mapsUrl, setMapsUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Load data
  const loadData = () => {
    setLoading(true);
    getPotensiList(activeTab).then(res => {
      setItems(res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Handle Image Upload to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setGambar(base64);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Open Add/Edit Modal
  const openModal = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setJudul(item.judul || '');
      setDeskripsi(item.deskripsi || '');
      setGambar(item.gambar || '');
      setLokasi(item.lokasi || '');
      setHarga(item.harga || '');
      setIsBestSeller(item.isBestSeller || false);
      setMapsUrl(item.mapsUrl || '');
      setImagePreview(item.gambar || '');
    } else {
      setSelectedItem(null);
      setJudul('');
      setDeskripsi('');
      setGambar('');
      setLokasi('');
      setHarga('');
      setIsBestSeller(false);
      setMapsUrl('');
      setImagePreview('');
    }
    setShowModal(true);
  };

  // Handle Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!judul) {
      Swal.fire('Error', 'Judul/Nama harus diisi!', 'error');
      return;
    }

    Swal.fire({
      title: 'Menyimpan...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    if (selectedItem?.id) {
      formData.append('id', selectedItem.id.toString());
    }
    formData.append('kategori', activeTab);
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('gambar', gambar);
    formData.append('lokasi', lokasi);
    formData.append('harga', harga);
    formData.append('isBestSeller', isBestSeller ? 'true' : 'false');
    formData.append('mapsUrl', mapsUrl);

    try {
      const res = await savePotensi(formData);
      if (res?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Disimpan!',
          timer: 1500,
          showConfirmButton: false
        });
        setShowModal(false);
        loadData();
      } else {
        Swal.fire('Gagal', 'Terjadi kesalahan sistem.', 'error');
      }
    } catch (err: any) {
      Swal.fire('Gagal', err.message || 'Terjadi kesalahan.', 'error');
    }
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Menghapus...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        try {
          const res = await deletePotensi(id);
          if (res?.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil Dihapus!',
              timer: 1500,
              showConfirmButton: false
            });
            loadData();
          }
        } catch (err: any) {
          Swal.fire('Gagal', err.message || 'Gagal menghapus.', 'error');
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Potensi & Wisata</h1>
            <p className="text-slate-500 text-sm font-medium">Manajemen destinasi wisata dan produk UMKM Desa Kediren.</p>
          </div>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={18} /> Tambah Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('WISATA')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'WISATA' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palmtree size={16} /> Destinasi Wisata
        </button>
        <button
          onClick={() => setActiveTab('UMKM')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'UMKM' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag size={16} /> Produk UMKM
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold">Memuat data potensi...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
              {activeTab === 'WISATA' ? <Palmtree size={36} className="text-slate-300" /> : <ShoppingBag size={36} className="text-slate-300" />}
            </div>
            <p className="font-black text-slate-700 text-lg">Belum Ada Data</p>
            <p className="text-slate-400 text-sm mt-2 max-w-sm font-medium">Klik tombol "Tambah Item" di pojok kanan atas untuk mengisi data {activeTab.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-200 flex flex-col group hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  {item.gambar ? (
                    <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {item.isBestSeller && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Star size={10} fill="white" /> Best Seller
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{item.judul}</h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium line-clamp-2">{item.deskripsi || 'Tidak ada deskripsi.'}</p>
                    
                    <div className="mt-4 space-y-2">
                      {activeTab === 'WISATA' && item.lokasi && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                          <MapPin size={14} className="text-emerald-600" />
                          <span>{item.lokasi}</span>
                        </div>
                      )}
                      {activeTab === 'UMKM' && item.harga && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                          <DollarSign size={14} className="text-emerald-600" />
                          <span>{item.harga}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-200/50">
                    <button
                      onClick={() => openModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-xs border border-slate-200 transition-all"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-lg">
                    {selectedItem ? 'Edit Item' : 'Tambah Item Baru'}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">Lengkapi formulir potensi di bawah ini.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  Batal
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    {activeTab === 'WISATA' ? 'Nama Destinasi Wisata' : 'Nama Produk UMKM'}
                  </label>
                  <input 
                    type="text" 
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                    placeholder={activeTab === 'WISATA' ? 'Contoh: Curug Makmur Sentosa' : 'Contoh: Tenun Ikat Kediren'}
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Gambar Pendukung</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="modal-image-upload"
                      />
                      <label 
                        htmlFor="modal-image-upload"
                        className="inline-block px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs cursor-pointer transition-all border border-emerald-100"
                      >
                        Pilih File Gambar
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Format JPG/PNG. Maksimal 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Deskripsi Lengkap</label>
                  <textarea 
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 h-24 resize-none" 
                    placeholder="Tuliskan keterangan detail seputar produk atau wisata ini..."
                  />
                </div>

                {/* Wisata Only Fields */}
                {activeTab === 'WISATA' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lokasi / Dusun</label>
                      <input 
                        type="text" 
                        value={lokasi}
                        onChange={(e) => setLokasi(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                        placeholder="Contoh: Dusun Barat / RT 02 RW 01"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Link Google Maps (Koordinat)</label>
                      <input 
                        type="text" 
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                        placeholder="Contoh: https://goo.gl/maps/..."
                      />
                    </div>
                  </>
                )}

                {/* UMKM Only Fields */}
                {activeTab === 'UMKM' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Harga Produk</label>
                      <input 
                        type="text" 
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" 
                        placeholder="Contoh: Rp 25.000 / Rp 350.000+"
                      />
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <input 
                        type="checkbox" 
                        id="isBestSeller"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="isBestSeller" className="text-xs font-bold text-slate-600 cursor-pointer uppercase tracking-wider select-none">
                        Tampilkan lencana "Best Seller"
                      </label>
                    </div>
                  </>
                )}

                {/* Modal Footer */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    <Save size={16} /> Simpan Data
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
