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
  Landmark,
  ClipboardList,
  Navigation
} from 'lucide-react';
import Link from 'next/link';
import { 
  getApbdesItems, 
  getApbdesKategori, 
  getProgramKerja, 
  upsertApbdesItem, 
  upsertProgramKerja,
  initializeTransparansi
} from '@/app/actions/transparansi';
import { getProfilDesa } from '@/app/actions/surat';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function AdminTransparansiPage() {
  const [activeTab, setActiveTab] = useState<'apbdes' | 'program'>('apbdes');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('MURNI');
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
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
    { id: '1.1', katId: 1, code: '2.1.01', name: 'Penghasilan Tetap Kepala Desa dan Perangkat' },
    { id: '1.2', katId: 1, code: '2.1.02', name: 'Penyediaan Jaminan Sosial Kades & Perangkat' },
    { id: '1.3', katId: 1, code: '2.1.04', name: 'Penyediaan Operasional BPD' },
    { id: '1.4', katId: 1, code: '2.1.06', name: 'Penyediaan Operasional RT/RW' },
    { id: '1.5', katId: 1, code: '2.1.05', name: 'Penyediaan Insentif/Operasional KPM/LKD' },
    { id: '1.6', katId: 1, code: '2.1.10', name: 'Penyediaan ATK, Listrik, Air & Telepon Kantor' },
    { id: '2.1', katId: 2, code: '2.2.01', name: 'Pembangunan/Rehabilitasi/Peningkatan Jalan Desa' },
    { id: '2.2', katId: 2, code: '2.2.02', name: 'Pembangunan/Rehabilitasi/Peningkatan Jembatan' },
    { id: '2.3', katId: 2, code: '2.2.06', name: 'Pembangunan/Rehabilitasi Gedung Posyandu' },
    { id: '2.4', katId: 2, code: '2.2.10', name: 'Pembangunan Sarana Olahraga Desa' },
    { id: '3.1', katId: 3, code: '2.3.01', name: 'Penyelenggaraan Kegiatan Keagamaan' },
    { id: '3.2', katId: 3, code: '2.3.05', name: 'Pembinaan Karang Taruna / Kepemudaan' },
    { id: '3.3', katId: 3, code: '2.3.06', name: 'Pembinaan Group Kesenian dan Kebudayaan' },
    { id: '4.1', katId: 4, code: '2.4.01', name: 'Peningkatan Kapasitas Perangkat Desa' },
    { id: '4.2', katId: 4, code: '2.4.03', name: 'Pemberdayaan Perempuan (PKK)' },
    { id: '4.3', katId: 4, code: '2.4.05', name: 'Pelatihan Pertanian dan Peternakan' },
    { id: '5.1', katId: 5, code: '2.5.01', name: 'Penanggulangan Bencana' },
    { id: '5.2', katId: 5, code: '2.5.02', name: 'Keadaan Mendesak (BLT Dana Desa)' },
    // Pendapatan
    { id: 'P1', katId: 6, code: '1.1.01', name: 'Dana Desa (DD)' },
    { id: 'P2', katId: 6, code: '1.1.02', name: 'Alokasi Dana Desa (ADD)' },
    { id: 'P3', katId: 6, code: '1.1.03', name: 'Bagi Hasil Pajak & Retribusi (BHPR)' },
    { id: 'P4', katId: 6, code: '1.1.05', name: 'Pendapatan Asli Desa (PAD)' },
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setFormattedAnggaran(new Intl.NumberFormat('id-ID').format(Number(editingItem.anggaran)));
      setFormattedRealisasi(new Intl.NumberFormat('id-ID').format(Number(editingItem.realisasi || 0)));
      setCoords({lat: editingItem.latitude, lng: editingItem.longitude});
      setPreviewImage(editingItem.fotoProgres);
    } else {
      setFormattedAnggaran('');
      setFormattedRealisasi('');
      setCoords({lat: null, lng: null});
      setPreviewImage(null);
    }
  }, [editingItem]);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Get Location
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
      Swal.fire({ icon: 'success', title: 'Berhasil disimpan', timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal menyimpan' });
    }
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
          <h3 className="text-2xl font-bold">{formatIDR(items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('pendapatan')).reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-[32px] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <BarChart className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10" />
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Total Belanja</p>
          <h3 className="text-2xl font-bold">{formatIDR(items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('bidang')).reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</h3>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-lg relative overflow-hidden">
          <LayoutDashboard className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-slate-50" />
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Program Kerja</p>
          <h3 className="text-2xl font-bold text-slate-800">{programs.length} Kegiatan</h3>
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
        </div>
      </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={`Cari ${activeTab === 'apbdes' ? 'Anggaran' : 'Program'}...`}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
              />
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
                  setModalType(activeTab);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <PlusCircle size={20} /> Tambah Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'apbdes' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-6">Kategori / Bidang</th>
                    <th className="px-8 py-6">Uraian</th>
                    <th className="px-8 py-6 text-right">Anggaran</th>
                    <th className="px-8 py-6">Sumber</th>
                    <th className="px-8 py-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-tight">
                          {item.kategori?.namaKategori}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-slate-800">{item.namaItem}</div>
                        <div className="text-[10px] font-mono font-bold text-slate-400">{item.kodeRekening}</div>
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-emerald-600 text-sm">
                        {formatIDR(Number(item.anggaran))}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold text-slate-400">{item.sumberDana}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => {
                              setEditingItem(item);
                              setModalType('apbdes');
                              setIsModalOpen(true);
                            }}
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
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
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
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

      {/* Print Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)}></div>
          <div className="relative bg-slate-200 w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center font-bold">SID</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Pratinjau Laporan APBDes</h3>
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
                  onClick={() => window.open(`/print/apbdes?tahun=${tahun}&status=${status}`, '_blank')}
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
                  <h1 className="text-sm font-bold">ANGGARAN PENDAPATAN DAN BELANJA DESA</h1>
                  <h1 className="text-sm font-bold">PEMERINTAH DESA {profil?.namaDesa?.toUpperCase()}</h1>
                  <h1 className="text-sm font-bold">TAHUN ANGGARAN {tahun}</h1>
                </div>

                <table className="w-full border-collapse border border-black text-[10px] font-serif">
                  <thead>
                    <tr className="border border-black font-bold text-center">
                      <th className="border border-black p-1 w-20">KODE</th>
                      <th className="border border-black p-1">URAIAN</th>
                      <th className="border border-black p-1 w-32">ANGGARAN (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-bold bg-slate-50">
                      <td className="border border-black p-1 text-center">4</td>
                      <td className="border border-black p-1">PENDAPATAN</td>
                      <td className="border border-black p-1 text-right">{formatIDR(items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('pendapatan')).reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</td>
                    </tr>
                    <tr className="font-bold bg-slate-50">
                      <td className="border border-black p-1 text-center">5</td>
                      <td className="border border-black p-1">BELANJA</td>
                      <td className="border border-black p-1 text-right">{formatIDR(items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('bidang')).reduce((acc, curr) => acc + Number(curr.anggaran), 0))}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="border border-black p-2 text-center" colSpan={2}>SURPLUS / (DEFISIT)</td>
                      <td className="border border-black p-2 text-right">
                        {formatIDR(
                          items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('pendapatan')).reduce((acc, curr) => acc + Number(curr.anggaran), 0) -
                          items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('bidang')).reduce((acc, curr) => acc + Number(curr.anggaran), 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

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
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foto Progres & Lokasi GPS</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden border-2 border-dashed border-slate-200">
                          {previewImage ? (
                            <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <ImageIcon size={32} />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <input 
                            type="file" 
                            id="camera-input"
                            accept="image/*" 
                            capture="environment"
                            onChange={handleCapture}
                            className="hidden"
                          />
                          <button 
                            type="button"
                            onClick={() => document.getElementById('camera-input')?.click()}
                            className="w-full py-3 bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
                          >
                            <Camera size={16} /> Ambil Foto / Kamera
                          </button>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <Navigation size={12} className={coords?.lat ? 'text-emerald-500' : ''} />
                            {coords?.lat ? `${coords.lat.toFixed(6)}, ${coords.lng?.toFixed(6)}` : 'GPS Belum Terdeteksi'}
                          </div>
                        </div>
                      </div>
                      <input type="hidden" name="fotoProgres" value={previewImage || ''} />
                      <input type="hidden" name="latitude" value={coords?.lat || ''} />
                      <input type="hidden" name="longitude" value={coords?.lng || ''} />
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
