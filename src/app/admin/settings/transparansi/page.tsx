'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  FileText, 
  TrendingUp, 
  BarChart, 
  ArrowLeft, 
  LayoutDashboard,
  Save,
  X,
  PlusCircle,
  MapPin,
  Image as ImageIcon,
  Camera,
  Navigation,
  Landmark,
  ClipboardList,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  getApbdesItems, 
  getApbdesKategori, 
  getProgramKerja, 
  upsertApbdesItem, 
  upsertProgramKerja,
  initializeTransparansi,
  deleteApbdesItem,
  deleteProgramKerja
} from '@/app/actions/transparansi';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { getProfilDesa } from '@/app/actions/surat';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function AdminTransparansiPage() {
  const [activeTab, setActiveTab] = useState<'apbdes' | 'program' | 'infografis'>('apbdes');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('MURNI');
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedJenis, setSelectedJenis] = useState<'ALL' | 'PENDAPATAN' | 'BELANJA' | 'PEMBIAYAAN'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [modalType, setModalType] = useState<'apbdes' | 'program'>('apbdes');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [profil, setProfil] = useState<any>(null);

  const formatIDR = (val: number) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const APBDES_TEMPLATES = [
    // Pendapatan (4.x)
    { id: 'P1', katId: 21, code: '4.2.1.01', name: 'Dana Desa (DD)' },
    { id: 'P2', katId: 22, code: '4.2.2.01', name: 'Alokasi Dana Desa (ADD)' },
    { id: 'P3', katId: 23, code: '4.2.3.01', name: 'Bagi Hasil Pajak & Retribusi (BHPR)' },
    { id: 'P4', katId: 20, code: '4.1.1.01', name: 'Pendapatan Asli Desa (PAD)' },
    // Belanja (5.x)
    { id: '1.1', katId: 1, code: '5.1.1.01', name: 'Penghasilan Tetap Kepala Desa dan Perangkat' },
    { id: '1.2', katId: 1, code: '5.1.1.02', name: 'Penyediaan Jaminan Sosial Kades & Perangkat' },
    { id: '1.3', katId: 1, code: '5.1.4.01', name: 'Penyediaan Operasional BPD' },
    { id: '1.4', katId: 1, code: '5.1.4.02', name: 'Penyediaan Operasional RT/RW' },
    { id: '2.1', katId: 2, code: '5.2.1.01', name: 'Pembangunan Jalan Desa' },
    { id: '2.2', katId: 2, code: '5.2.2.01', name: 'Pembangunan Jembatan Desa' },
    { id: '2.3', katId: 2, code: '5.2.3.01', name: 'Pembangunan Gedung Posyandu' },
    { id: '5.2', katId: 5, code: '5.5.2.01', name: 'BLT Dana Desa' },
  ];

  const handleInitialize = async () => {
    const res = await initializeTransparansi();
    if (res.success) {
      loadData();
      Swal.fire('Berhasil', res.message, 'success');
    }
  };


  const [formattedAnggaran, setFormattedAnggaran] = useState('');
  const [formattedRealisasi, setFormattedRealisasi] = useState('');
  const [coords, setCoords] = useState<{lat: number | null, lng: number | null}>({lat: null, lng: null});
  const [previewImages, setPreviewImages] = useState<(string | null)[]>([null, null, null]); // 0%, 50%, 100%

  useEffect(() => {
    if (editingItem) {
      setFormattedAnggaran(new Intl.NumberFormat('id-ID').format(Number(editingItem.anggaran)));
      setFormattedRealisasi(new Intl.NumberFormat('id-ID').format(Number(editingItem.realisasi || 0)));
      setCoords({lat: editingItem.latitude, lng: editingItem.longitude});
      try {
        const imgs = JSON.parse(editingItem.fotoProgres || '[null, null, null]');
        setPreviewImages(imgs);
      } catch {
        setPreviewImages([editingItem.fotoProgres || null, null, null]);
      }
    } else {
      setFormattedAnggaran('');
      setFormattedRealisasi('');
      setCoords({lat: null, lng: null});
      setPreviewImages([null, null, null]);
    }
  }, [editingItem]);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>, stage: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...(previewImages || [])];
        newImages[stage] = reader.result as string;
        setPreviewImages(newImages);
      };
      reader.readAsDataURL(file);

      // Get Location (only for first photo or every photo)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setCoords({lat: pos.coords.latitude, lng: pos.coords.longitude});
        }, () => {
          Swal.fire('Info', 'Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.', 'info');
        });
      }
    }
  };

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setter('');
      return;
    }
    setter(new Intl.NumberFormat('id-ID').format(parseInt(val)));
  };

  useEffect(() => {
    loadData();
  }, [tahun, status, activeTab]);
  const loadData = async () => {
    const [apbdes, kats, progs, dataProfil] = await Promise.all([
      getApbdesItems(tahun, status),
      getApbdesKategori(),
      getProgramKerja(tahun),
      getProfilDesa()
    ]);
    setItems(apbdes);
    setCategories(kats);
    setPrograms(progs);
    setProfil(dataProfil);
  };

  const handleExportExcel = () => {
    const data = items.map(item => ({
      'Kode Rekening': item.kodeRekening,
      'Uraian': item.namaItem,
      'Anggaran': Number(item.anggaran),
      'Sumber Dana': item.sumberDana,
      'Kategori': item.kategori?.namaKategori
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "APBDes");
    XLSX.writeFile(wb, `APBDes_${profil?.namaDesa}_${tahun}_${status}.xlsx`);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        Swal.fire({
          title: 'Konfirmasi Import',
          text: `Ditemukan ${data.length} data. Lanjutkan import ke database?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Ya, Import!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire({ title: 'Memproses...', didOpen: () => Swal.showLoading() });
            
            for (const row of data as any[]) {
              const formData = new FormData();
              formData.append('tahun', tahun.toString());
              formData.append('status', status);
              formData.append('kategoriId', (categories.find(c => c.namaKategori.includes(row.Kategori))?.id || categories[0]?.id).toString());
              formData.append('kodeRekening', row['Kode Rekening'] || '');
              formData.append('namaItem', row.Uraian || '');
              formData.append('anggaran', (row.Anggaran || 0).toString());
              formData.append('sumberDana', row['Sumber Dana'] || 'DD');
              
              await upsertApbdesItem(formData);
            }

            Swal.fire('Berhasil', 'Data berhasil diimport dari Excel', 'success');
            loadData();
          }
        });
      } catch (error) {
        Swal.fire('Error', 'Gagal membaca file Excel', 'error');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveApbdes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await upsertApbdesItem(formData);
      setIsModalOpen(false);
      loadData();
      Swal.fire({ icon: 'success', title: 'Berhasil disimpan', timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal menyimpan' });
    }
  };

  const handleSaveProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await upsertProgramKerja(formData);
      setIsModalOpen(false);
      loadData();
      Swal.fire({ icon: 'success', title: 'Program Kerja berhasil disimpan', timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal menyimpan program kerja' });
    }
  };

  const handleDelete = async (id: number, type: 'apbdes' | 'program') => {
    Swal.fire({
      title: 'Hapus Data?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === 'apbdes') await deleteApbdesItem(id);
          else await deleteProgramKerja(id);
          loadData();
          Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Gagal menghapus data', 'error');
        }
      }
    });
  };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/settings" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 shadow-sm group">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-all" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Transparansi</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pengaturan APBDes dan Monitoring Program Kerja</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <select 
            value={tahun} 
            onChange={(e) => setTahun(parseInt(e.target.value))}
            className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
          >
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="w-[1px] h-6 bg-slate-100"></div>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
          >
            <option value="MURNI">MURNI</option>
            <option value="PERUBAHAN">PERUBAHAN</option>
          </select>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-6 rounded-[32px] text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10" />
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Total Pendapatan</p>
          <h3 className="text-2xl font-bold">{formatIDR(items.filter(i => i.kategori?.jenis === 'PENDAPATAN').reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-[32px] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <BarChart className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10" />
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Total Belanja</p>
          <h3 className="text-2xl font-bold">{formatIDR(items.filter(i => i.kategori?.jenis === 'BELANJA').reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</h3>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg relative overflow-hidden">
          <LayoutDashboard className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-slate-50" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Pembiayaan / Silpa</p>
          <h3 className="text-2xl font-bold text-slate-800">{formatIDR(items.filter(i => i.kategori?.jenis === 'PEMBIAYAAN').reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</h3>
        </div>
      </div>

      {/* Beautiful Tabs Navigation */}
      <div className="flex justify-center md:justify-start">
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center gap-1">
          <button 
            onClick={() => setActiveTab('apbdes')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-[20px] text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'apbdes' 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <Landmark size={18} className={activeTab === 'apbdes' ? 'text-emerald-400' : 'text-slate-300'} />
            Anggaran APBDes
          </button>
          <button 
            onClick={() => setActiveTab('program')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-[20px] text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'program' 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <ClipboardList size={18} className={activeTab === 'program' ? 'text-blue-400' : 'text-slate-300'} />
            Program Kerja
          </button>
          <button 
            onClick={() => setActiveTab('infografis')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-[20px] text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'infografis' 
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
            }`}
          >
            <PieChartIcon size={18} className={activeTab === 'infografis' ? 'text-amber-400' : 'text-slate-300'} />
            Infografis
          </button>
        </div>
      </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3 flex-wrap">
              {activeTab === 'apbdes' && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setSelectedJenis('ALL')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedJenis === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >SEMUA</button>
                  <button 
                    onClick={() => setSelectedJenis('PENDAPATAN')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedJenis === 'PENDAPATAN' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >PENDAPATAN</button>
                  <button 
                    onClick={() => setSelectedJenis('BELANJA')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedJenis === 'BELANJA' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >BELANJA</button>
                  <button 
                    onClick={() => setSelectedJenis('PEMBIAYAAN')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedJenis === 'PEMBIAYAAN' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >PEMBIAYAAN</button>
                </div>
              )}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={`Cari ${activeTab === 'apbdes' ? 'Anggaran' : 'Program'}...`}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              {categories.length === 0 && (
                <button 
                  onClick={handleInitialize}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Setup Kategori
                </button>
              )}
              {activeTab !== 'infografis' && (
                <>
                  <button 
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all"
                  >
                    <div className="w-5 h-5 bg-emerald-600 text-white rounded flex items-center justify-center font-bold text-[10px]">X</div> Ekspor Excel
                  </button>
                  <div className="relative">
                    <input type="file" onChange={handleImportExcel} accept=".xlsx, .xls" className="hidden" id="excel-import" />
                    <button 
                      onClick={() => document.getElementById('excel-import')?.click()}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
                    >
                      <div className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-[10px]">I</div> Impor Excel
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      setIsPreviewOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-100"
                  >
                    <FileText size={20} /> Cetak Laporan
                  </button>
                  <button 
                    onClick={() => {
                      setEditingItem(null);
                      setModalType(activeTab as 'apbdes' | 'program');
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    <PlusCircle size={20} /> Tambah Data
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'apbdes' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-6">Kode Rekening</th>
                    <th className="px-8 py-6">Uraian / Kegiatan</th>
                    <th className="px-8 py-6 text-right">Anggaran (Rp)</th>
                    <th className="px-8 py-6">Sumber</th>
                    <th className="px-8 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items
                    .filter(item => selectedJenis === 'ALL' || item.kategori?.jenis === selectedJenis)
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="text-[10px] font-mono font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg w-fit border border-slate-200 min-w-[80px] text-center">
                          {item.kodeRekening || '---'}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{item.kategori?.namaKategori}</span>
                          <div className="text-sm font-bold text-slate-800 leading-tight">{item.namaItem}</div>
                          {/* Realization Progress Bar */}
                          <div className="mt-2 w-full max-w-[200px] space-y-1">
                            <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
                              <span>Realisasi Penyerapan</span>
                              <span className={Number(item.realisasi) > 0 ? 'text-emerald-600' : ''}>{Math.round((Number(item.realisasi) / Number(item.anggaran)) * 100) || 0}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                              <div 
                                className={`h-full transition-all duration-1000 ${
                                  (Number(item.realisasi) / Number(item.anggaran)) >= 1 ? 'bg-emerald-500' : 
                                  (Number(item.realisasi) / Number(item.anggaran)) >= 0.5 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, (Number(item.realisasi) / Number(item.anggaran)) * 100) || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="text-sm font-black text-emerald-600">{formatIDR(Number(item.anggaran))}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1">Serap: {formatIDR(Number(item.realisasi))}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{item.sumberDana}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => {
                              setEditingItem(item);
                              setModalType('apbdes');
                              setIsModalOpen(true);
                            }}
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, 'apbdes')}
                            className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'program' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-6">Nama Program</th>
                    <th className="px-8 py-6">Lokasi</th>
                    <th className="px-8 py-6">Anggaran</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {programs.map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-slate-800">{prog.namaProgram}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prog.sumberDana}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <MapPin size={12} /> {prog.lokasi}
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-emerald-600 text-sm">
                        {formatIDR(Number(prog.anggaran))}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          prog.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' :
                          prog.status === 'Berjalan' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {prog.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => {
                              setEditingItem(prog);
                              setModalType('program');
                              setIsModalOpen(true);
                            }}
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(prog.id, 'program')}
                            className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Infografis Content */
              <div className="p-10 space-y-12 bg-slate-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Alokasi Dana per Bidang */}
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Alokasi Dana per Bidang</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Persentase Pengeluaran</p>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categories.filter(c => c.jenis === 'BELANJA').map(c => ({
                              name: c.namaKategori.replace('Bidang ', '').split(' ').slice(0, 2).join(' '),
                              value: items.filter(i => i.kategoriId === c.id).reduce((acc, curr) => acc + Number(curr.anggaran), 0)
                            })).filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {[ '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6' ].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number, name: string) => [formatIDR(value), name]}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Perbandingan Pendapatan vs Belanja */}
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Kesehatan Anggaran</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pendapatan vs Pengeluaran</p>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={[
                          {
                            name: 'Anggaran',
                            Pendapatan: items.filter(i => i.kategori?.jenis === 'PENDAPATAN').reduce((acc, curr) => acc + Number(curr.anggaran), 0),
                            Belanja: items.filter(i => i.kategori?.jenis === 'BELANJA').reduce((acc, curr) => acc + Number(curr.anggaran), 0)
                          }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                          <YAxis hide />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value: number) => formatIDR(value)} />
                          <Bar dataKey="Pendapatan" fill="#10b981" radius={[10, 10, 0, 0]} barSize={60} />
                          <Bar dataKey="Belanja" fill="#334155" radius={[10, 10, 0, 0]} barSize={60} />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Program Kerja */}
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Monitoring Program Kerja</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status Pelaksanaan Kegiatan</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Selesai: {programs.filter(p => p.status === 'Selesai').length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Berjalan: {programs.filter(p => p.status === 'Berjalan').length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Rencana: {programs.filter(p => p.status === 'Rencana').length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      {[
                        { label: 'Selesai', count: programs.filter(p => p.status === 'Selesai').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Sedang Berjalan', count: programs.filter(p => p.status === 'Berjalan').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Rencana', count: programs.filter(p => p.status === 'Rencana').length, icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50' }
                      ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} p-6 rounded-2xl flex items-center justify-between group hover:scale-[1.02] transition-all cursor-default`}>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h5 className={`text-2xl font-bold ${stat.color}`}>{stat.count} <span className="text-xs font-medium text-slate-400 italic">Proyek</span></h5>
                          </div>
                          <stat.icon className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} size={32} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {activeTab === 'apbdes' && (
            <div className="p-8 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400">
                Menampilkan {Math.min(items.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(items.length, currentPage * itemsPerPage)} dari {items.length} data
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-slate-200 transition-all"
                >
                  Sebelumnya
                </button>
                <button 
                  disabled={currentPage >= Math.ceil(items.filter(item => selectedJenis === 'ALL' || item.kategori?.jenis === selectedJenis).length / itemsPerPage)}
                  onClick={() => {
                    setCurrentPage(p => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-slate-200 transition-all"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Print Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)}></div>
          <div className="relative bg-slate-200 w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center font-bold">SID</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {activeTab === 'apbdes' ? 'Pratinjau Laporan APBDes' : 'Pratinjau Monitoring Program Kerja'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tahun {tahun} - Status {status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Tutup
                </button>
                <button 
                  onClick={() => window.open(activeTab === 'apbdes' ? `/print/apbdes?tahun=${tahun}&status=${status}` : `/print/program?tahun=${tahun}`, '_blank')}
                  className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
                >
                  <Save size={18} /> Cetak / PDF Resmi
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 bg-slate-300/50 flex justify-center">
              <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] origin-top scale-90 md:scale-100 transition-transform">
                {/* Simplified Preview Content */}
                <div className="text-right mb-10 text-[10px] font-serif">
                  <p>LAMPIRAN PERATURAN DESA {profil?.namaDesa?.toUpperCase()}</p>
                  <p>NOMOR _______ TAHUN {tahun}</p>
                </div>
                
                <div className="text-center mb-10 space-y-1 font-serif">
                  <h1 className="text-sm font-bold">
                    {activeTab === 'apbdes' ? 'ANGGARAN PENDAPATAN DAN BELANJA DESA' : 'LAPORAN MONITORING PROGRAM KERJA FISIK'}
                  </h1>
                  <h1 className="text-sm font-bold">PEMERINTAH DESA {profil?.namaDesa?.toUpperCase()}</h1>
                  <h1 className="text-sm font-bold">TAHUN ANGGARAN {tahun}</h1>
                </div>

                {activeTab === 'apbdes' ? (
                  <table className="w-full border-collapse border-2 border-black text-[9px] font-serif leading-tight">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center border-b-2 border-black">
                        <th className="border-r border-black p-2 w-24">KODE REKENING</th>
                        <th className="border-r border-black p-2">URAIAN</th>
                        <th className="border-r border-black p-2 w-36">ANGGARAN (Rp)</th>
                        <th className="p-2 w-24">SUMBERDANA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PENDAPATAN */}
                      <tr className="font-bold bg-slate-200 border-b-2 border-black">
                        <td className="border-r border-black p-2 text-center">4.</td>
                        <td className="border-r border-black p-2">PENDAPATAN</td>
                        <td className="border-r border-black p-2 text-right">
                          {formatIDR(items.filter(i => i.kategori?.jenis === 'PENDAPATAN').reduce((acc, curr) => acc + Number(curr.anggaran), 0))}
                        </td>
                        <td className="p-2"></td>
                      </tr>
                      {items.filter(i => i.kategori?.jenis === 'PENDAPATAN').map(item => (
                        <tr key={item.id} className="border-b border-black">
                          <td className="border-r border-black p-1.5 text-center font-mono">{item.kodeRekening}</td>
                          <td className="border-r border-black p-1.5 pl-4">{item.namaItem}</td>
                          <td className="border-r border-black p-1.5 text-right font-bold">{formatIDR(Number(item.anggaran))}</td>
                          <td className="p-1.5 text-center text-[7px] font-bold font-sans">{item.sumberDana}</td>
                        </tr>
                      ))}
                      
                      {/* BELANJA */}
                      <tr className="font-bold bg-slate-200 border-t-2 border-b-2 border-black">
                        <td className="border-r border-black p-2 text-center">5.</td>
                        <td className="border-r border-black p-2">BELANJA</td>
                        <td className="border-r border-black p-2 text-right">
                          {formatIDR(items.filter(i => i.kategori?.jenis === 'BELANJA').reduce((acc, curr) => acc + Number(curr.anggaran), 0))}
                        </td>
                        <td className="p-2"></td>
                      </tr>
                      {categories.filter(c => c.jenis === 'BELANJA').map(cat => {
                        const catItems = items.filter(i => i.kategoriId === cat.id);
                        if (catItems.length === 0) return null;
                        return (
                          <React.Fragment key={cat.id}>
                            <tr className="font-bold bg-slate-50 border-b border-black italic">
                              <td className="border-r border-black p-1.5 text-center">{cat.id}.</td>
                              <td className="border-r border-black p-1.5">{cat.namaKategori.toUpperCase()}</td>
                              <td className="border-r border-black p-1.5 text-right">
                                {formatIDR(catItems.reduce((acc, curr) => acc + Number(curr.anggaran), 0))}
                              </td>
                              <td className="p-1.5"></td>
                            </tr>
                            {catItems.map(item => (
                              <tr key={item.id} className="border-b border-black">
                                <td className="border-r border-black p-1.5 text-center font-mono">{item.kodeRekening}</td>
                                <td className="border-r border-black p-1.5 pl-8">{item.namaItem}</td>
                                <td className="border-r border-black p-1.5 text-right font-medium">{formatIDR(Number(item.anggaran))}</td>
                                <td className="p-1.5 text-center text-[7px] font-bold font-sans">{item.sumberDana}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}

                      <tr className="font-bold bg-slate-300 border-t-4 border-black">
                        <td className="border-r border-black p-2 text-center" colSpan={2}>SURPLUS / (DEFISIT)</td>
                        <td className="border-r border-black p-2 text-right">
                          {formatIDR(
                            items.filter(i => i.kategori?.jenis === 'PENDAPATAN').reduce((acc, curr) => acc + Number(curr.anggaran), 0) -
                            items.filter(i => i.kategori?.jenis === 'BELANJA').reduce((acc, curr) => acc + Number(curr.anggaran), 0)
                          )}
                        </td>
                        <td className="p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full border-collapse border border-black text-[10px] font-serif">
                    <thead>
                      <tr className="border border-black font-bold text-center bg-slate-50">
                        <th className="border border-black p-1 w-10">NO</th>
                        <th className="border border-black p-1">KEGIATAN / PROGRAM</th>
                        <th className="border border-black p-1">LOKASI</th>
                        <th className="border border-black p-1 w-28">ANGGARAN</th>
                        <th className="border border-black p-1 w-20">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((p, idx) => (
                        <tr key={p.id}>
                          <td className="border border-black p-1 text-center">{idx + 1}</td>
                          <td className="border border-black p-1 font-bold">{p.namaProgram}</td>
                          <td className="border border-black p-1">{p.lokasi}</td>
                          <td className="border border-black p-1 text-right">{formatIDR(Number(p.anggaran))}</td>
                          <td className="border border-black p-1 text-center">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="mt-20 flex justify-end">
                  <div className="text-center font-serif text-[10px]">
                    <p>Kepala Desa {profil?.namaDesa}</p>
                    <div className="h-24"></div>
                    <p className="font-bold underline uppercase">{profil?.namaKepalaDesa || '____________________'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{editingItem ? 'Edit' : 'Tambah'} {modalType === 'apbdes' ? 'Anggaran' : 'Program'}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Lengkapi data di bawah ini</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={modalType === 'apbdes' ? handleSaveApbdes : handleSaveProgram} className="p-8 space-y-6">
              {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
              <input type="hidden" name="tahun" value={tahun} />
              <input type="hidden" name="status" value={status} />

              {modalType === 'apbdes' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gunakan Template Standar</label>
                    <select 
                      onChange={(e) => {
                        const template = APBDES_TEMPLATES.find(t => t.id === e.target.value);
                        if (template) {
                          const form = e.target.form;
                          if (form) {
                            (form.elements.namedItem('kategoriId') as HTMLSelectElement).value = template.katId.toString();
                            (form.elements.namedItem('kodeRekening') as HTMLInputElement).value = template.code;
                            (form.elements.namedItem('namaItem') as HTMLInputElement).value = template.name;
                          }
                        }
                      }}
                      className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Pilih Template Siskeudes --</option>
                      {APBDES_TEMPLATES.map(t => (
                        <option key={t.id} value={t.id}>[{t.code}] {t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bidang / Kategori</label>
                      <select name="kategoriId" defaultValue={editingItem?.kategoriId} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.namaKategori}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kode Rekening</label>
                      <input name="kodeRekening" defaultValue={editingItem?.kodeRekening} placeholder="Contoh: 2.1.01" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uraian Kegiatan</label>
                    <input name="namaItem" defaultValue={editingItem?.namaItem} required placeholder="Masukkan nama kegiatan anggaran" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anggaran (Rp)</label>
                      <input 
                        name="anggaran" 
                        value={formattedAnggaran || ''}
                        onChange={(e) => handlePriceInput(e, setFormattedAnggaran)}
                        required 
                        placeholder="Contoh: 1.000.000"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sumber Dana</label>
                      <select name="sumberDana" defaultValue={editingItem?.sumberDana || 'DD'} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500">
                        <option value="DD">DANA DESA (DD)</option>
                        <option value="ADD">ALOKASI DANA DESA (ADD)</option>
                        <option value="PAD">PENDAPATAN ASLI DESA (PAD)</option>
                        <option value="BHPR">BAGI HASIL PAJAK (BHPR)</option>
                        <option value="BANKEU">BANTUAN KEUANGAN</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Program Kerja</label>
                    <input name="namaProgram" defaultValue={editingItem?.namaProgram} required placeholder="Contoh: Pembangunan Jalan Lingkungan" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi</label>
                      <input name="lokasi" defaultValue={editingItem?.lokasi} placeholder="Contoh: Dusun Kediren RT 06" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anggaran (Rp)</label>
                      <input 
                        name="anggaran" 
                        value={formattedAnggaran || ''}
                        onChange={(e) => handlePriceInput(e, setFormattedAnggaran)}
                        required 
                        placeholder="Contoh: 50.000.000"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Proyek</label>
                      <select name="status" defaultValue={editingItem?.status || 'Rencana'} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500">
                        <option value="Rencana">RENCANA</option>
                        <option value="Berjalan">SEDANG BERJALAN</option>
                        <option value="Selesai">SELESAI</option>
                        <option value="Tertunda">TERTUNDA</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sumber Dana</label>
                      <input name="sumberDana" defaultValue={editingItem?.sumberDana || 'DANA DESA (DD)'} placeholder="Contoh: DD 2024" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foto Progres & Lokasi GPS</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Awal (0%)', icon: Activity },
                          { label: 'Progres (50%)', icon: Layers },
                          { label: 'Selesai (100%)', icon: CheckCircle2 }
                        ].map((stage, idx) => (
                          <div key={idx} className="space-y-2">
                            <span className="text-[7px] font-black text-slate-400 uppercase text-center block">{stage.label}</span>
                            <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden hover:border-emerald-500 transition-all bg-slate-50">
                              {previewImages[idx] ? (
                                <>
                                  <img src={previewImages[idx] as string} className="w-full h-full object-cover" />
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const newImgs = [...previewImages];
                                      newImgs[idx] = null;
                                      setPreviewImages(newImgs);
                                    }}
                                    className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <X size={10} />
                                  </button>
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                  <Camera size={20} className="text-slate-300 group-hover:text-emerald-500" />
                                  <span className="text-[6px] font-bold text-slate-300 uppercase">Upload</span>
                                </div>
                              )}
                              <input type="file" accept="image/*" onChange={(e) => handleCapture(e, idx)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Navigation size={14} className="text-emerald-500" /> Koordinat Geospasial (GIS)
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition((pos) => {
                                setCoords({lat: pos.coords.latitude, lng: pos.coords.longitude});
                                Swal.fire({ icon: 'success', title: 'GPS Terkunci', toast: true, position: 'top-end', timer: 1500 });
                              });
                            }
                          }}
                          className="text-[9px] font-black text-emerald-600 hover:underline uppercase tracking-widest"
                        >
                          Kunci Lokasi (GPS)
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Latitude</span>
                          <input type="text" name="latitude" value={coords?.lat || ''} readOnly className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-mono font-bold" placeholder="Otomatis..." />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Longitude</span>
                          <input type="text" name="longitude" value={coords?.lng || ''} readOnly className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-mono font-bold" placeholder="Otomatis..." />
                        </div>
                      </div>
                      <input type="hidden" name="fotoProgres" value={JSON.stringify(previewImages)} />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                  <Save size={20} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
