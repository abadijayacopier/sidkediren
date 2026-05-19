'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Plus, Search, Edit3, Trash2, X, Save, Printer, Info, 
  Home, Droplet, Trees, Sparkles, Check, Heart, Users, ShieldAlert,
  Calendar, MapPin, Activity, HelpCircle, FileText
} from 'lucide-react';
import Swal from 'sweetalert2';

type TabType = 'kelompok' | 'keluarga' | 'kegiatan' | 'laporan';

// Seed initial dasawisma groups
const initialKelompok = [
  { id: 1, nama: 'Dasawisma Mawar', dusun: 'Krajan', rt: 1, rw: 1, ketua: 'Siti Rahayu', jumlahKk: 12, airBersih: 'PDAM', jamban: true, sampah: true, kebunGizi: true },
  { id: 2, nama: 'Dasawisma Melati', dusun: 'Krajan', rt: 2, rw: 1, ketua: 'Endang Purwati', jumlahKk: 15, airBersih: 'PDAM', jamban: true, sampah: true, kebunGizi: true },
  { id: 3, nama: 'Dasawisma Anggrek', dusun: 'Krajan', rt: 3, rw: 2, ketua: 'Supriyati', jumlahKk: 10, airBersih: 'Sumur Bor', jamban: true, sampah: false, kebunGizi: true },
  { id: 4, nama: 'Dasawisma Bougenville', dusun: 'Kediren', rt: 1, rw: 3, ketua: 'Sri Wahyuni', jumlahKk: 14, airBersih: 'PDAM', jamban: true, sampah: true, kebunGizi: false },
  { id: 5, nama: 'Dasawisma Dahlia', dusun: 'Kediren', rt: 2, rw: 3, ketua: 'Rina Astuti', jumlahKk: 11, airBersih: 'Sumur Gali', jamban: true, sampah: true, kebunGizi: true },
  { id: 6, nama: 'Dasawisma Kenanga', dusun: 'Kediren', rt: 3, rw: 4, ketua: 'Kartini', jumlahKk: 13, airBersih: 'PDAM', jamban: true, sampah: false, kebunGizi: false },
  { id: 7, nama: 'Dasawisma Flamboyan', dusun: 'Kembangan', rt: 1, rw: 5, ketua: 'Suminah', jumlahKk: 16, airBersih: 'PDAM', jamban: true, sampah: true, kebunGizi: true },
  { id: 8, nama: 'Dasawisma Kamboja', dusun: 'Kembangan', rt: 2, rw: 5, ketua: 'Partini', jumlahKk: 12, airBersih: 'Sumur Bor', jamban: true, sampah: true, kebunGizi: true },
];

// Seed initial family details under dasawisma
const initialKeluarga = [
  { id: 1, namaKk: 'Bambang Triyono', kelompokId: 1, jumlahJiwa: 4, balita: 1, bumil: false, lansia: 1, pgnMandiri: true },
  { id: 2, namaKk: 'Joko Widodo', kelompokId: 1, jumlahJiwa: 5, balita: 0, bumil: true, lansia: 0, pgnMandiri: true },
  { id: 3, namaKk: 'Suhartono', kelompokId: 2, jumlahJiwa: 3, balita: 2, bumil: false, lansia: 0, pgnMandiri: false },
  { id: 4, namaKk: 'Mulyono', kelompokId: 2, jumlahJiwa: 6, balita: 1, bumil: false, lansia: 2, pgnMandiri: true },
  { id: 5, namaKk: 'Agus Purnomo', kelompokId: 4, jumlahJiwa: 4, balita: 0, bumil: false, lansia: 1, pgnMandiri: false },
];

// Seed activities
const initialKegiatan = [
  { id: 1, tanggal: '2026-05-10', kelompok: 'Dasawisma Mawar', namaKegiatan: 'Kerja Bakti Kebun Gizi Mandiri', jenis: 'Ketahanan Pangan', lokasi: 'Demplot RT 01', deskripsi: 'Pembersihan gulma dan pemberian pupuk organik cair di bedengan sayur.', hadir: 12 },
  { id: 2, tanggal: '2026-05-12', kelompok: 'Dasawisma Melati', namaKegiatan: 'Arisan & Sosialisasi Pilah Sampah Mandiri', jenis: 'Kesehatan Lingkungan', lokasi: 'Rumah Bu Endang', deskripsi: 'Sosialisasi pembuatan eco-enzyme dari limbah kulit buah dan sayur sisa dapur.', hadir: 15 },
  { id: 3, tanggal: '2026-05-15', kelompok: 'Dasawisma Flamboyan', namaKegiatan: 'Pemeriksaan Tinggi & Timbang Balita Terdekat', jenis: 'Kesehatan/Posyandu', lokasi: 'Pos Dasawisma Flamboyan', deskripsi: 'Pengukuran mandiri balita sebelum jadwal Posyandu bulanan untuk deteksi dini stunting.', hadir: 10 },
];

export default function DasawismaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('kelompok');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // States
  const [kelompokList, setKelompokList] = useState<any[]>([]);
  const [keluargaList, setKeluargaList] = useState<any[]>([]);
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);

  // e-Laporan States
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [activeReportSubTab, setActiveReportSubTab] = useState<'lingkungan' | 'kerawanan'>('lingkungan');
  const [selectedDusunFilter, setSelectedDusunFilter] = useState<string>('ALL');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Helper functions
  const getUniqueDusuns = () => {
    const list = new Set<string>();
    if (kelompokList) {
      kelompokList.forEach((item: any) => {
        if (item.dusun) list.add(item.dusun.trim().toUpperCase());
      });
    }
    return Array.from(list);
  };

  const getFilteredKelompokList = () => {
    if (!kelompokList) return [];
    if (selectedDusunFilter === 'ALL') return kelompokList;
    return kelompokList.filter((item: any) => item.dusun && item.dusun.trim().toUpperCase() === selectedDusunFilter.toUpperCase());
  };

  const getFilteredKeluargaList = () => {
    if (!keluargaList) return [];
    const filteredKelompoks = getFilteredKelompokList();
    const allowedIds = new Set(filteredKelompoks.map(k => k.id));
    return keluargaList.filter(f => allowedIds.has(f.kelompokId));
  };

  // --- FORM STATES ---
  // Kelompok Form
  const [fKelompokNama, setFKelompokNama] = useState('');
  const [fKelompokDusun, setFKelompokDusun] = useState('Krajan');
  const [fKelompokRt, setFKelompokRt] = useState(1);
  const [fKelompokRw, setFKelompokRw] = useState(1);
  const [fKelompokKetua, setFKelompokKetua] = useState('');
  const [fKelompokKk, setFKelompokKk] = useState(10);
  const [fAirBersih, setFAirBersih] = useState('PDAM');
  const [fJamban, setFJamban] = useState(true);
  const [fSampah, setFSampah] = useState(true);
  const [fKebunGizi, setFKebunGizi] = useState(true);

  // Keluarga Form
  const [fKeluargaNama, setFKeluargaNama] = useState('');
  const [fKeluargaKelompokId, setFKeluargaKelompokId] = useState(1);
  const [fKeluargaJiwa, setFKeluargaJiwa] = useState(4);
  const [fKeluargaBalita, setFKeluargaBalita] = useState(0);
  const [fKeluargaBumil, setFKeluargaBumil] = useState(false);
  const [fKeluargaLansia, setFKeluargaLansia] = useState(0);
  const [fKeluargaPgn, setFKeluargaPgn] = useState(true);

  // Kegiatan Form
  const [fKegiatanTanggal, setFKegiatanTanggal] = useState('');
  const [fKegiatanKelompok, setFKegiatanKelompok] = useState('Dasawisma Mawar');
  const [fKegiatanNama, setFKegiatanNama] = useState('');
  const [fKegiatanJenis, setFKegiatanJenis] = useState('Ketahanan Pangan');
  const [fKegiatanLokasi, setFKegiatanLokasi] = useState('');
  const [fKegiatanDeskripsi, setFKegiatanDeskripsi] = useState('');
  const [fKegiatanHadir, setFKegiatanHadir] = useState(10);

  // Load from localstorage or seed
  useEffect(() => {
    setLoading(true);
    const localKelompok = localStorage.getItem('dsw_kelompok');
    const localKeluarga = localStorage.getItem('dsw_keluarga');
    const localKegiatan = localStorage.getItem('dsw_kegiatan');

    if (localKelompok) setKelompokList(JSON.parse(localKelompok));
    else {
      setKelompokList(initialKelompok);
      localStorage.setItem('dsw_kelompok', JSON.stringify(initialKelompok));
    }

    if (localKeluarga) setKeluargaList(JSON.parse(localKeluarga));
    else {
      setKeluargaList(initialKeluarga);
      localStorage.setItem('dsw_keluarga', JSON.stringify(initialKeluarga));
    }

    if (localKegiatan) setKegiatanList(JSON.parse(localKegiatan));
    else {
      setKegiatanList(initialKegiatan);
      localStorage.setItem('dsw_kegiatan', JSON.stringify(initialKegiatan));
    }
    setLoading(false);
  }, []);

  const saveToLocal = (type: TabType, data: any[]) => {
    if (type === 'kelompok') {
      setKelompokList(data);
      localStorage.setItem('dsw_kelompok', JSON.stringify(data));
    } else if (type === 'keluarga') {
      setKeluargaList(data);
      localStorage.setItem('dsw_keluarga', JSON.stringify(data));
    } else if (type === 'kegiatan') {
      setKegiatanList(data);
      localStorage.setItem('dsw_kegiatan', JSON.stringify(data));
    }
  };

  const resetForm = () => {
    setEditId(null);
    // Kelompok
    setFKelompokNama('');
    setFKelompokDusun('Krajan');
    setFKelompokRt(1);
    setFKelompokRw(1);
    setFKelompokKetua('');
    setFKelompokKk(10);
    setFAirBersih('PDAM');
    setFJamban(true);
    setFSampah(true);
    setFKebunGizi(true);

    // Keluarga
    setFKeluargaNama('');
    setFKeluargaKelompokId(kelompokList[0]?.id || 1);
    setFKeluargaJiwa(4);
    setFKeluargaBalita(0);
    setFKeluargaBumil(false);
    setFKeluargaLansia(0);
    setFKeluargaPgn(true);

    // Kegiatan
    setFKegiatanTanggal(new Date().toISOString().split('T')[0]);
    setFKegiatanKelompok(kelompokList[0]?.nama || 'Dasawisma Mawar');
    setFKegiatanNama('');
    setFKegiatanJenis('Ketahanan Pangan');
    setFKegiatanLokasi('');
    setFKegiatanDeskripsi('');
    setFKegiatanHadir(10);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (type: TabType, item: any) => {
    resetForm();
    setEditId(item.id);
    if (type === 'kelompok') {
      setFKelompokNama(item.nama);
      setFKelompokDusun(item.dusun);
      setFKelompokRt(item.rt);
      setFKelompokRw(item.rw);
      setFKelompokKetua(item.ketua);
      setFKelompokKk(item.jumlahKk);
      setFAirBersih(item.airBersih);
      setFJamban(item.jamban);
      setFSampah(item.sampah);
      setFKebunGizi(item.kebunGizi);
    } else if (type === 'keluarga') {
      setFKeluargaNama(item.namaKk);
      setFKeluargaKelompokId(item.kelompokId);
      setFKeluargaJiwa(item.jumlahJiwa);
      setFKeluargaBalita(item.balita);
      setFKeluargaBumil(item.bumil);
      setFKeluargaLansia(item.lansia);
      setFKeluargaPgn(item.pgnMandiri);
    } else if (type === 'kegiatan') {
      setFKegiatanTanggal(item.tanggal);
      setFKegiatanKelompok(item.kelompok);
      setFKegiatanNama(item.namaKegiatan);
      setFKegiatanJenis(item.jenis);
      setFKegiatanLokasi(item.lokasi);
      setFKegiatanDeskripsi(item.deskripsi);
      setFKegiatanHadir(item.hadir);
    }
    setShowModal(true);
  };

  const handleDelete = (type: TabType, id: number) => {
    Swal.fire({
      title: 'Hapus data?',
      text: "Data yang dihapus tidak dapat dipulihkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === 'kelompok') {
          const updated = kelompokList.filter(item => item.id !== id);
          saveToLocal('kelompok', updated);
        } else if (type === 'keluarga') {
          const updated = keluargaList.filter(item => item.id !== id);
          saveToLocal('keluarga', updated);
        } else if (type === 'kegiatan') {
          const updated = kegiatanList.filter(item => item.id !== id);
          saveToLocal('kegiatan', updated);
        }
        Swal.fire('Terhapus!', 'Data berhasil dihapus dari Buku Dasawisma.', 'success');
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'kelompok') {
        if (!fKelompokNama || !fKelompokKetua) {
          Swal.fire('Gagal', 'Lengkapi seluruh kolom utama kelompok!', 'error');
          return;
        }
        let updated: any[];
        if (editId) {
          updated = kelompokList.map(item => item.id === editId ? {
            ...item, nama: fKelompokNama, dusun: fKelompokDusun, rt: Number(fKelompokRt), rw: Number(fKelompokRw),
            ketua: fKelompokKetua, jumlahKk: Number(fKelompokKk), airBersih: fAirBersih, jamban: fJamban, sampah: fSampah, kebunGizi: fKebunGizi
          } : item);
        } else {
          updated = [...kelompokList, {
            id: Date.now(), nama: fKelompokNama, dusun: fKelompokDusun, rt: Number(fKelompokRt), rw: Number(fKelompokRw),
            ketua: fKelompokKetua, jumlahKk: Number(fKelompokKk), airBersih: fAirBersih, jamban: fJamban, sampah: fSampah, kebunGizi: fKebunGizi
          }];
        }
        saveToLocal('kelompok', updated);
      } else if (activeTab === 'keluarga') {
        if (!fKeluargaNama) {
          Swal.fire('Gagal', 'Tuliskan Nama Kepala Keluarga!', 'error');
          return;
        }
        let updated: any[];
        if (editId) {
          updated = keluargaList.map(item => item.id === editId ? {
            ...item, namaKk: fKeluargaNama, kelompokId: Number(fKeluargaKelompokId), jumlahJiwa: Number(fKeluargaJiwa),
            balita: Number(fKeluargaBalita), bumil: fKeluargaBumil, lansia: Number(fKeluargaLansia), pgnMandiri: fKeluargaPgn
          } : item);
        } else {
          updated = [...keluargaList, {
            id: Date.now(), namaKk: fKeluargaNama, kelompokId: Number(fKeluargaKelompokId), jumlahJiwa: Number(fKeluargaJiwa),
            balita: Number(fKeluargaBalita), bumil: fKeluargaBumil, lansia: Number(fKeluargaLansia), pgnMandiri: fKeluargaPgn
          }];
        }
        saveToLocal('keluarga', updated);
      } else if (activeTab === 'kegiatan') {
        if (!fKegiatanNama || !fKegiatanLokasi || !fKegiatanDeskripsi) {
          Swal.fire('Gagal', 'Lengkapi seluruh isi log kegiatan!', 'error');
          return;
        }
        let updated: any[];
        if (editId) {
          updated = kegiatanList.map(item => item.id === editId ? {
            ...item, tanggal: fKegiatanTanggal, kelompok: fKegiatanKelompok, namaKegiatan: fKegiatanNama,
            jenis: fKegiatanJenis, lokasi: fKegiatanLokasi, deskripsi: fKegiatanDeskripsi, hadir: Number(fKegiatanHadir)
          } : item);
        } else {
          updated = [...kegiatanList, {
            id: Date.now(), tanggal: fKegiatanTanggal, kelompok: fKegiatanKelompok, namaKegiatan: fKegiatanNama,
            jenis: fKegiatanJenis, lokasi: fKegiatanLokasi, deskripsi: fKegiatanDeskripsi, hadir: Number(fKegiatanHadir)
          }];
        }
        saveToLocal('kegiatan', updated);
      }

      Swal.fire('Berhasil!', 'Data Dasawisma disimpan.', 'success');
      setShowModal(false);
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const getFilteredData = () => {
    if (activeTab === 'kelompok') {
      return kelompokList.filter(item => 
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ketua.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dusun.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'keluarga') {
      return keluargaList.filter(item => {
        const kelName = kelompokList.find(k => k.id === item.kelompokId)?.nama || '';
        return item.namaKk.toLowerCase().includes(searchQuery.toLowerCase()) ||
               kelName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } else if (activeTab === 'kegiatan') {
      return kegiatanList.filter(item =>
        item.namaKegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kelompok.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jenis.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
  };

  // Aggregated Stats
  const statKk = kelompokList.reduce((acc, curr) => acc + curr.jumlahKk, 0);
  const statJamban = kelompokList.filter(k => k.jamban).length;
  const statKebun = kelompokList.filter(k => k.kebunGizi).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-850 text-white shadow-lg sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/admin/pkk" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="bg-purple-100/20 text-purple-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Kelompok Dasawisma Digital
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Administrasi & Pantauan Warga</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition text-sm">
              <Printer className="w-4 h-4" /> Cetak Log
            </button>
            <button onClick={handleOpenAdd} className="bg-white text-purple-800 hover:bg-purple-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition text-sm">
              <Plus className="w-4 h-4" /> Tambah Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Banner Dashboard stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Total Kelompok</span>
              <span className="text-2xl font-black text-slate-800">{kelompokList.length}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Kelompok Aktif</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-xl"><Home className="w-6 h-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">KK Didampingi</span>
              <span className="text-2xl font-black text-slate-800">{statKk}</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Kepala Keluarga</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Droplet className="w-6 h-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Sanitasi Sehat</span>
              <span className="text-2xl font-black text-slate-800">{statJamban} <span className="text-sm font-semibold text-slate-400">/ {kelompokList.length}</span></span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Kelompok Bebas ODF</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Trees className="w-6 h-6" /></div>
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Pekarangan Aktif</span>
              <span className="text-2xl font-black text-slate-800">{statKebun} <span className="text-sm font-semibold text-slate-400">/ {kelompokList.length}</span></span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Hatinya PKK Organik</span>
            </div>
          </div>
        </div>
        {/* Tab Selection */}
        <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 pb-3 mb-6 scrollbar-none print:hidden">
          {[
            { id: 'kelompok', label: 'Buku 1: Kelompok Dasawisma', desc: 'Daftar rekapitulasi kelengkapan RT', icon: Users },
            { id: 'keluarga', label: 'Buku 2: Catatan Pantauan Keluarga', desc: 'Detail kondisi gizi & kesehatan KK', icon: Home },
            { id: 'kegiatan', label: 'Buku 3: Log Gotong Royong', desc: 'Aktivitas kebun gizi & arisan', icon: Calendar },
            { id: 'laporan', label: 'Buku 4: e-Laporan & Rekapitulasi', desc: 'Rekap otomatis realtime warga', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(''); }}
                className={`flex-1 min-w-[240px] text-left p-4 rounded-xl border transition ${
                  active 
                    ? 'bg-purple-50/50 border-purple-200 shadow-sm ring-1 ring-purple-500/20' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-slate-500'}`} />
                  <span className={`font-black text-sm ${active ? 'text-purple-800' : 'text-slate-800'}`}>{tab.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tab.desc}</p>
              </button>
            )
          })}
        </div>        {/* Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm mb-6 print:hidden">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder={`Cari berdasarkan nama kelompok, ketua, nama KK, dusun, dll...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* TAB 1: KELOMPOK DASAWISMA */}
          {activeTab === 'kelompok' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                    <th className="px-4 py-4 border w-12 text-center">No</th>
                    <th className="px-4 py-4 border">Nama Kelompok</th>
                    <th className="px-4 py-4 border">Wilayah Tugas</th>
                    <th className="px-4 py-4 border">Ketua Kelompok</th>
                    <th className="px-4 py-4 border text-center">Anggota (KK)</th>
                    <th className="px-4 py-4 border">Sumber Air Bersih</th>
                    <th className="px-4 py-4 border text-center">Jamban Keluarga</th>
                    <th className="px-4 py-4 border text-center">Kelola Sampah</th>
                    <th className="px-4 py-4 border text-center">Kebun Gizi (Toga)</th>
                    <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-slate-400 font-medium">Belum ada kelompok Dasawisma terdaftar.</td>
                    </tr>
                  ) : (
                    getFilteredData().map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                        <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 border font-black text-purple-950">{item.nama}</td>
                        <td className="px-4 py-3 border">
                          <span className="font-bold text-slate-700 block">Dsn. {item.dusun}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">RT {item.rt} / RW {item.rw}</span>
                        </td>
                        <td className="px-4 py-3 border font-semibold text-slate-800">{item.ketua}</td>
                        <td className="px-4 py-3 border text-center font-bold text-slate-700 bg-purple-50/20">{item.jumlahKk} KK</td>
                        <td className="px-4 py-3 border text-slate-600 font-semibold">{item.airBersih}</td>
                        <td className="px-4 py-3 border text-center">
                          {item.jamban ? (
                            <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">Lengkap</span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-rose-50 text-rose-700 rounded-full font-bold text-[10px]">Belum</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border text-center">
                          {item.sampah ? (
                            <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">Dikelola</span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-bold text-[10px]">Belum</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border text-center">
                          {item.kebunGizi ? (
                            <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">Aktif</span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-slate-50 text-slate-500 rounded-full font-bold text-[10px]">Tidak</span>
                          )}
                        </td>
                        <td className="px-4 py-3 border text-center print:hidden">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button onClick={() => handleEdit('kelompok', item)} className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('kelompok', item.id)} className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: CATATAN KELUARGA */}
          {activeTab === 'keluarga' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                    <th className="px-4 py-4 border w-12 text-center">No</th>
                    <th className="px-4 py-4 border">Nama Kepala Keluarga</th>
                    <th className="px-4 py-4 border">Kelompok Dasawisma</th>
                    <th className="px-4 py-4 border text-center">Anggota Keluarga (Jiwa)</th>
                    <th className="px-4 py-4 border text-center">Balita (Usia 0-5)</th>
                    <th className="px-4 py-4 border text-center">Ibu Hamil / Menyusui</th>
                    <th className="px-4 py-4 border text-center">Lansia</th>
                    <th className="px-4 py-4 border text-center">Pangan Mandiri</th>
                    <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-slate-400 font-medium">Belum ada data rekap keluarga terdaftar.</td>
                    </tr>
                  ) : (
                    getFilteredData().map((item, idx) => {
                      const kelompokNama = kelompokList.find(k => k.id === item.kelompokId)?.nama || 'Dasawisma';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border font-black text-slate-800">{item.namaKk}</td>
                          <td className="px-4 py-3 border font-semibold text-purple-900">{kelompokNama}</td>
                          <td className="px-4 py-3 border text-center font-bold text-slate-600">{item.jumlahJiwa} org</td>
                          <td className="px-4 py-3 border text-center font-bold text-blue-700 bg-blue-50/20">{item.balita} balita</td>
                          <td className="px-4 py-3 border text-center">
                            {item.bumil ? (
                              <span className="inline-block px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full font-bold text-[10px]">Bumil</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 border text-center font-bold text-amber-700 bg-amber-50/20">{item.lansia} lansia</td>
                          <td className="px-4 py-3 border text-center">
                            {item.pgnMandiri ? (
                              <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold text-[10px]">Tersedia</span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-bold text-[10px]">Rentan</span>
                            )}
                          </td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('keluarga', item)} className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('keluarga', item.id)} className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: LOG KEGIATAN */}
          {activeTab === 'kegiatan' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                    <th className="px-4 py-4 border w-12 text-center">No</th>
                    <th className="px-4 py-4 border">Waktu</th>
                    <th className="px-4 py-4 border">Kelompok Dasawisma</th>
                    <th className="px-4 py-4 border">Nama Kegiatan Gotong Royong</th>
                    <th className="px-4 py-4 border">Jenis Aksi</th>
                    <th className="px-4 py-4 border">Tempat / Lokasi</th>
                    <th className="px-4 py-4 border">Deskripsi Ringkas</th>
                    <th className="px-4 py-4 border text-center">Jumlah Hadir</th>
                    <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredData().length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-slate-400 font-medium">Belum ada log kegiatan dasawisma tercatat.</td>
                    </tr>
                  ) : (
                    getFilteredData().map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                        <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 border font-semibold text-slate-700">{new Date(item.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                        <td className="px-4 py-3 border font-black text-purple-900">{item.kelompok}</td>
                        <td className="px-4 py-3 border font-bold text-slate-800">{item.namaKegiatan}</td>
                        <td className="px-4 py-3 border text-slate-600 font-semibold">{item.jenis}</td>
                        <td className="px-4 py-3 border text-slate-600 font-medium">{item.lokasi}</td>
                        <td className="px-4 py-3 border text-slate-500 leading-relaxed font-semibold whitespace-pre-wrap">{item.deskripsi}</td>
                        <td className="px-4 py-3 border text-center font-bold text-slate-700 bg-slate-50/30">{item.hadir} org</td>
                        <td className="px-4 py-3 border text-center print:hidden">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button onClick={() => handleEdit('kegiatan', item)} className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('kegiatan', item.id)} className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: e-LAPORAN & REKAPITULASI */}
          {activeTab === 'laporan' && (
            <div className="p-6 space-y-6">
              {/* Toolbar & Filter Laporan */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-600 rounded-full animate-ping"></span>
                  <p className="text-xs font-black text-purple-900 uppercase tracking-wider">Laporan Agregat Realtime Dasawisma</p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Filter Dusun:</span>
                    <select
                      value={selectedDusunFilter}
                      onChange={(e) => setSelectedDusunFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="ALL">Semua Dusun</option>
                      {getUniqueDusuns().map(ds => (
                        <option key={ds} value={ds}>{ds}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setShowPrintPreview(true)}
                    className="bg-purple-600 hover:bg-purple-750 text-white font-bold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition text-xs shadow-sm shadow-purple-500/10"
                  >
                    <Printer className="w-3.5 h-3.5" /> Pratinjau A4
                  </button>
                </div>
              </div>

              {/* Subtabs Selector */}
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-max">
                <button
                  type="button"
                  onClick={() => setActiveReportSubTab('lingkungan')}
                  className={`px-4 py-2 rounded-md font-bold text-xs transition ${
                    activeReportSubTab === 'lingkungan' ? 'bg-white text-purple-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Rekap Sanitasi & Lingkungan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveReportSubTab('kerawanan')}
                  className={`px-4 py-2 rounded-md font-bold text-xs transition ${
                    activeReportSubTab === 'kerawanan' ? 'bg-white text-purple-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Kerawanan Gizi & Sosial KK
                </button>
              </div>

              {activeReportSubTab === 'lingkungan' ? (
                <div className="space-y-4">
                  {/* Table Rekap Lingkungan */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                          <th className="px-4 py-3 border w-12 text-center">No</th>
                          <th className="px-4 py-3 border">Nama Dasawisma</th>
                          <th className="px-4 py-3 border">Wilayah / Dusun</th>
                          <th className="px-4 py-3 border text-center bg-purple-50/20">Jumlah KK</th>
                          <th className="px-4 py-3 border">Air Bersih</th>
                          <th className="px-4 py-3 border text-center">Jamban Keluarga</th>
                          <th className="px-4 py-3 border text-center">Tempat Sampah</th>
                          <th className="px-4 py-3 border text-center">Hatinya PKK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredKelompokList().length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">Tidak ada data Dasawisma sesuai filter.</td>
                          </tr>
                        ) : (
                          getFilteredKelompokList().map((item: any, idx: number) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                              <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                              <td className="px-4 py-3 border font-black text-purple-950">{item.nama}</td>
                              <td className="px-4 py-3 border">Dsn. {item.dusun} (RT {item.rt} / RW {item.rw})</td>
                              <td className="px-4 py-3 border text-center font-bold text-purple-900 bg-purple-50/10">{item.jumlahKk} KK</td>
                              <td className="px-4 py-3 border font-semibold text-slate-600">{item.airBersih}</td>
                              <td className="px-4 py-3 border text-center">
                                {item.jamban ? (
                                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[9px]">Lengkap</span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full font-bold text-[9px]">Belum</span>
                                )}
                              </td>
                              <td className="px-4 py-3 border text-center">
                                {item.sampah ? (
                                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[9px]">Dikelola</span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold text-[9px]">Belum</span>
                                )}
                              </td>
                              <td className="px-4 py-3 border text-center">
                                {item.kebunGizi ? (
                                  <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[9px]">Aktif</span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full font-bold text-[9px]">Tidak</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Table Rekap Kerawanan */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                          <th className="px-4 py-3 border w-12 text-center">No</th>
                          <th className="px-4 py-3 border">Nama Kepala Keluarga</th>
                          <th className="px-4 py-3 border">Dasawisma Pelindung</th>
                          <th className="px-4 py-3 border text-center">Total Jiwa</th>
                          <th className="px-4 py-3 border text-center text-blue-700">Jumlah Balita</th>
                          <th className="px-4 py-3 border text-center text-pink-700">Ibu Hamil/Busui</th>
                          <th className="px-4 py-3 border text-center text-amber-700">Lansia Rentan</th>
                          <th className="px-4 py-3 border text-center">Ketahanan Pangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredKeluargaList().length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">Tidak ada data Keluarga sesuai filter.</td>
                          </tr>
                        ) : (
                          getFilteredKeluargaList().map((item: any, idx: number) => {
                            const dsw = kelompokList.find(k => k.id === item.kelompokId);
                            return (
                              <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-slate-800">{item.namaKk}</td>
                                <td className="px-4 py-3 border font-semibold text-purple-900">{dsw ? dsw.nama : 'Dasawisma'}</td>
                                <td className="px-4 py-3 border text-center font-semibold">{item.jumlahJiwa} Orang</td>
                                <td className="px-4 py-3 border text-center font-bold text-blue-700 bg-blue-50/10">{item.balita} Balita</td>
                                <td className="px-4 py-3 border text-center font-bold">
                                  {item.bumil ? (
                                    <span className="inline-block px-2.5 py-0.5 bg-pink-100 text-pink-700 rounded-full font-bold text-[9px]">Bumil</span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 border text-center font-bold text-amber-700 bg-amber-50/10">{item.lansia} Lansia</td>
                                <td className="px-4 py-3 border text-center">
                                  {item.pgnMandiri ? (
                                    <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-[9px]">Mandiri</span>
                                  ) : (
                                    <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold text-[9px]">Rentan</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-100 overflow-hidden flex flex-col my-8 max-h-[90vh]">
            <div className="bg-gradient-to-r from-purple-700 to-fuchsia-850 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Buku Baku Dasawisma
                </span>
                <h3 className="text-base sm:text-lg font-black mt-0.5">
                  {editId ? 'Ubah Data Administrasi' : 'Tambah Data Administrasi'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
              {/* Form 1: Kelompok */}
              {activeTab === 'kelompok' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Kelompok Dasawisma</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dasawisma Mawar"
                        value={fKelompokNama} 
                        onChange={(e) => setFKelompokNama(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Ketua Kelompok</label>
                      <input 
                        type="text" 
                        placeholder="Nama lengkap ketua..."
                        value={fKelompokKetua} 
                        onChange={(e) => setFKelompokKetua(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Dusun</label>
                      <select 
                        value={fKelompokDusun} 
                        onChange={(e) => setFKelompokDusun(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Krajan">Krajan</option>
                        <option value="Kediren">Kediren</option>
                        <option value="Kembangan">Kembangan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">RT</label>
                      <input 
                        type="number" 
                        value={fKelompokRt} 
                        onChange={(e) => setFKelompokRt(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">RW</label>
                      <input 
                        type="number" 
                        value={fKelompokRw} 
                        onChange={(e) => setFKelompokRw(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Anggota (KK)</label>
                      <input 
                        type="number" 
                        value={fKelompokKk} 
                        onChange={(e) => setFKelompokKk(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sumber Air Bersih Utama</label>
                      <select 
                        value={fAirBersih} 
                        onChange={(e) => setFAirBersih(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="PDAM">PDAM / PAM Desa</option>
                        <option value="Sumur Bor">Sumur Bor / Pompa</option>
                        <option value="Sumur Gali">Sumur Gali Tradisional</option>
                        <option value="Mata Air">Mata Air Pegunungan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Checklist Fasilitas Sehat</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setFJamban(!fJamban)}
                          className={`p-2 rounded-lg border font-bold text-[10px] tracking-wide transition ${
                            fJamban ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {fJamban ? '✓ Jamban Sehat' : 'x Tanpa Jamban'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFSampah(!fSampah)}
                          className={`p-2 rounded-lg border font-bold text-[10px] tracking-wide transition ${
                            fSampah ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {fSampah ? '✓ Kelola Sampah' : 'x Sampah Bebas'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setFKebunGizi(!fKebunGizi)}
                          className={`p-2 rounded-lg border font-bold text-[10px] tracking-wide transition ${
                            fKebunGizi ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {fKebunGizi ? '✓ Kebun Gizi' : 'x Tanpa Kebun'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Form 2: Keluarga */}
              {activeTab === 'keluarga' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Kepala Keluarga (KK)</label>
                      <input 
                        type="text" 
                        placeholder="Nama lengkap KK..."
                        value={fKeluargaNama} 
                        onChange={(e) => setFKeluargaNama(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kelompok Dasawisma</label>
                      <select 
                        value={fKeluargaKelompokId} 
                        onChange={(e) => setFKeluargaKelompokId(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      >
                        {kelompokList.map(k => (
                          <option key={k.id} value={k.id}>{k.nama} (Dsn. {k.dusun})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Anggota Keluarga (Jiwa)</label>
                      <input 
                        type="number" 
                        value={fKeluargaJiwa} 
                        onChange={(e) => setFKeluargaJiwa(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Balita</label>
                      <input 
                        type="number" 
                        value={fKeluargaBalita} 
                        onChange={(e) => setFKeluargaBalita(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Lansia</label>
                      <input 
                        type="number" 
                        value={fKeluargaLansia} 
                        onChange={(e) => setFKeluargaLansia(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Ibu Hamil / Menyusui</label>
                      <button
                        type="button"
                        onClick={() => setFKeluargaBumil(!fKeluargaBumil)}
                        className={`w-full p-2.5 rounded-lg border font-bold text-xs transition ${
                          fKeluargaBumil ? 'bg-pink-600 border-pink-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {fKeluargaBumil ? '✓ Ya (Bumil/Busui)' : 'x Tidak Ada'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Status Ketahanan Pangan Keluarga</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFKeluargaPgn(true)}
                        className={`p-3 rounded-lg border font-bold text-xs transition text-center ${
                          fKeluargaPgn ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Pangan Tersedia & Mandiri
                      </button>
                      <button
                        type="button"
                        onClick={() => setFKeluargaPgn(false)}
                        className={`p-3 rounded-lg border font-bold text-xs transition text-center ${
                          !fKeluargaPgn ? 'bg-amber-600 border-amber-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Rentan Pangan / Perlu Bantuan
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Form 3: Kegiatan */}
              {activeTab === 'kegiatan' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tanggal Aksi</label>
                      <input 
                        type="date" 
                        value={fKegiatanTanggal} 
                        onChange={(e) => setFKegiatanTanggal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kelompok Pelaksana</label>
                      <select 
                        value={fKegiatanKelompok} 
                        onChange={(e) => setFKegiatanKelompok(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      >
                        {kelompokList.map(k => (
                          <option key={k.id} value={k.nama}>{k.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jenis Aksi Gotong Royong</label>
                      <select 
                        value={fKegiatanJenis} 
                        onChange={(e) => setFKegiatanJenis(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Ketahanan Pangan">Ketahanan Pangan / Kebun Gizi</option>
                        <option value="Kesehatan Lingkungan">Kesehatan Lingkungan / Sampah</option>
                        <option value="Kesehatan/Posyandu">Kesehatan / Pantau Gizi</option>
                        <option value="Keagamaan/Yasinan">Keagamaan & Yasinan</option>
                        <option value="Arisan/Iuran">Arisan / Iuran Gotong Royong</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Kegiatan Utama</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Penanaman Bibit Terong & Sayuran Organik"
                        value={fKegiatanNama} 
                        onChange={(e) => setFKegiatanNama(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Lokasi Kegiatan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Kebun Gizi RT 02"
                        value={fKegiatanLokasi} 
                        onChange={(e) => setFKegiatanLokasi(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Anggota yang Hadir</label>
                    <input 
                      type="number" 
                      value={fKegiatanHadir} 
                      onChange={(e) => setFKegiatanHadir(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Deskripsi Hasil Aksi</label>
                    <textarea 
                      placeholder="Jelaskan jalannya kegiatan gotong royong..."
                      value={fKegiatanDeskripsi} 
                      onChange={(e) => setFKegiatanDeskripsi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-24 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-lg transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm"
                >
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- A4 PRINT PREVIEW MODAL --- */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-700 overflow-hidden flex flex-col my-8 h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-50/20 text-purple-300 px-2.5 py-1 rounded-full">
                  Pratinjau Cetak Fisik A4
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1.5 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-purple-400" /> Buku Bantu & e-Laporan Dasawisma
                </h3>
              </div>
              <button 
                onClick={() => setShowPrintPreview(false)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Action Bar */}
            <div className="bg-slate-850 px-6 py-3 border-b border-slate-850 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" />
                <span>Format laporan telah disesuaikan dengan standar A4 portrait resmi TP PKK.</span>
              </div>
              <button
                onClick={() => {
                  const printContent = document.getElementById('a4-dasawisma-print-area')?.innerHTML;
                  if (printContent) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Cetak Laporan Dasawisma - Desa Kediren</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              @media print {
                                @page { size: A4 portrait; margin: 15mm; }
                                body { font-family: 'Times New Roman', Times, serif; color: #000; background: #fff; }
                                .no-print { display: none; }
                              }
                              body { font-family: 'Times New Roman', Times, serif; padding: 20px; }
                              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                              th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11px; }
                              th { background-color: #f3f4f6 !important; font-weight: bold; text-transform: uppercase; }
                            </style>
                          </head>
                          <body>
                            \${printContent}
                            <script>
                              window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 500);
                              };
                            </script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Cetak Sekarang
              </button>
            </div>

            {/* Preview Container */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-900 flex justify-center">
              {/* Paper Layout (A4) */}
              <div 
                id="a4-dasawisma-print-area"
                className="bg-white text-black p-12 w-[210mm] min-h-[297mm] shadow-2xl relative text-xs flex flex-col justify-between"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                <div>
                  {/* Kop PKK Resmi */}
                  <div className="text-center border-b-4 border-black pb-4 mb-6 text-black">
                    <h2 className="text-lg font-bold tracking-widest uppercase">PEMBERDAYAAN DAN KESEJAHTERAAN KELUARGA</h2>
                    <h3 className="text-md font-bold tracking-wider uppercase mt-1">TP PKK DESA KEDIREN</h3>
                    <p className="text-xs italic mt-1.5 text-slate-750 font-semibold">
                      Kecamatan Lembeyan, Kabupaten Magetan, Provinsi Jawa Timur
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Sekretariat: Jl. Raya Kediren No. 04, Kode Pos 63372
                    </p>
                  </div>

                  {/* Judul Laporan */}
                  <div className="text-center mb-6">
                    <h4 className="text-sm font-bold uppercase underline">
                      {activeReportSubTab === 'lingkungan' 
                        ? 'REKAPITULASI LAPORAN SANITASI & LINGKUNGAN HIDUP DASAWISMA'
                        : 'REKAPITULASI CATATAN KONDISI GIZI & KESEHATAN KELUARGA'
                      }
                    </h4>
                    <p className="text-[11px] font-bold text-slate-800 mt-1 uppercase">
                      WILAYAH DUSUN: {selectedDusunFilter === 'ALL' ? 'SEMUA DUSUN' : `DUSUN ${selectedDusunFilter}`}
                    </p>
                    <p className="text-[10px] italic text-slate-500 mt-0.5">
                      Dicetak otomatis oleh Sistem PKK Digital Terintegrasi per {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
                    </p>
                  </div>

                  {/* Laporan Lingkungan */}
                  {activeReportSubTab === 'lingkungan' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] border-collapse text-black">
                        <thead>
                          <tr className="bg-slate-100 text-[9px] font-bold uppercase text-center">
                            <th className="border border-black p-2 w-8">No</th>
                            <th className="border border-black p-2">Nama Dasawisma</th>
                            <th className="border border-black p-2">Wilayah / RT-RW</th>
                            <th className="border border-black p-2 w-20">Jumlah KK</th>
                            <th className="border border-black p-2">Sumber Air</th>
                            <th className="border border-black p-2 w-24">Jamban Keluarga</th>
                            <th className="border border-black p-2 w-24">Tempat Sampah</th>
                            <th className="border border-black p-2 w-24">Kebun Gizi (Toga)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredKelompokList().length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center py-6 border border-black font-semibold text-slate-500">Tidak ada data Dasawisma.</td>
                            </tr>
                          ) : (
                            getFilteredKelompokList().map((item: any, idx: number) => (
                              <tr key={item.id} className="text-center">
                                <td className="border border-black p-2 font-bold">{idx + 1}</td>
                                <td className="border border-black p-2 font-bold text-left">{item.nama}</td>
                                <td className="border border-black p-2 text-left">Dsn. {item.dusun} (RT {item.rt} / RW {item.rw})</td>
                                <td className="border border-black p-2 font-bold">{item.jumlahKk} KK</td>
                                <td className="border border-black p-2 text-left font-medium">{item.airBersih}</td>
                                <td className="border border-black p-2 font-bold">{item.jamban ? 'LENGKAP' : 'BELUM'}</td>
                                <td className="border border-black p-2 font-bold">{item.sampah ? 'DIKELOLA' : 'BELUM'}</td>
                                <td className="border border-black p-2 font-bold">{item.kebunGizi ? 'AKTIF' : 'TIDAK'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Laporan Gizi/Kesehatan */}
                  {activeReportSubTab === 'kerawanan' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] border-collapse text-black">
                        <thead>
                          <tr className="bg-slate-100 text-[9px] font-bold uppercase text-center">
                            <th className="border border-black p-2 w-8">No</th>
                            <th className="border border-black p-2">Nama Kepala Keluarga</th>
                            <th className="border border-black p-2">Kelompok Dasawisma</th>
                            <th className="border border-black p-2 w-20">Total Jiwa</th>
                            <th className="border border-black p-2 w-20">Balita</th>
                            <th className="border border-black p-2 w-24">Ibu Hamil/Busui</th>
                            <th className="border border-black p-2 w-20">Lansia</th>
                            <th className="border border-black p-2 w-28">Ketahanan Pangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredKeluargaList().length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center py-6 border border-black font-semibold text-slate-500">Tidak ada data Keluarga.</td>
                            </tr>
                          ) : (
                            getFilteredKeluargaList().map((item: any, idx: number) => {
                              const dsw = kelompokList.find(k => k.id === item.kelompokId);
                              return (
                                <tr key={item.id} className="text-center">
                                  <td className="border border-black p-2 font-bold">{idx + 1}</td>
                                  <td className="border border-black p-2 font-bold text-left">{item.namaKk}</td>
                                  <td className="border border-black p-2 text-left font-medium">{dsw ? dsw.nama : 'Dasawisma'}</td>
                                  <td className="border border-black p-2 font-semibold">{item.jumlahJiwa} Org</td>
                                  <td className="border border-black p-2 font-bold">{item.balita} Balita</td>
                                  <td className="border border-black p-2 font-bold">{item.bumil ? 'BUMIL' : '-'}</td>
                                  <td className="border border-black p-2 font-bold">{item.lansia} Lansia</td>
                                  <td className="border border-black p-2 font-bold">{item.pgnMandiri ? 'MANDIRI' : 'RENTAN'}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Wet Signatures block */}
                <div className="grid grid-cols-2 gap-4 mt-12 text-xs text-black">
                  <div className="text-center">
                    <p>Mengetahui,</p>
                    <p className="font-bold uppercase mt-1">Ketua TP PKK Desa Kediren</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline uppercase">NY. SRI WAHYUNI</p>
                    <p className="text-[10px] text-slate-500">NIP. P-2026051901</p>
                  </div>
                  <div className="text-center">
                    <p>Kediren, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="font-bold uppercase mt-1">Kader Pendamping Dasawisma</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline uppercase">NY. ENDANG PURWATI</p>
                    <p className="text-[10px] text-slate-500">Reg. ID: DSW-2026051909</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
