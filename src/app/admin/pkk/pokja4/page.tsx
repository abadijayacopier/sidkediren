'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, FileText, Calendar, Users, MapPin, Plus, Search, Edit3, Trash2, X, Save, 
  ArrowLeft, CheckSquare, Printer, ChevronRight, Check, AlertCircle, Clock, Info
} from 'lucide-react';
import { 
  getKaderPkkList, seedPkkData,
  getBukuProgramKerjaList, saveBukuProgramKerja, deleteBukuProgramKerja,
  getBukuPelaksanaanList, saveBukuPelaksanaan, deleteBukuPelaksanaan,
  getBukuKegiatanList, saveBukuKegiatan, deleteBukuKegiatan,
  getBukuNotulenList, saveBukuNotulen, deleteBukuNotulen
} from '@/app/actions/pkk';
import Swal from 'sweetalert2';

type TabType = 'program' | 'pelaksanaan' | 'kegiatan' | 'notulen';

export default function PokjaIVBukuBakuPage() {
  const [activeTab, setActiveTab] = useState<TabType>('program');
  const [loading, setLoading] = useState(true);
  const [kaderList, setKaderList] = useState<any[]>([]);

  // Database lists
  const [programList, setProgramList] = useState<any[]>([]);
  const [pelaksanaanList, setPelaksanaanList] = useState<any[]>([]);
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  const [notulenList, setNotulenList] = useState<any[]>([]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // --- FORM STATES ---
  // Buku 1: Program Kerja
  const [b1ProgramPokok, setB1ProgramPokok] = useState('Kesehatan');
  const [b1ProgramPokja4, setB1ProgramPokja4] = useState('GKSTTB');
  const [b1Kegiatan, setB1Kegiatan] = useState('');
  const [b1Sasaran, setB1Sasaran] = useState('');
  const [b1Lokasi, setB1Lokasi] = useState('');
  const [b1WaktuBulan, setB1WaktuBulan] = useState<number[]>([]); // Array of months (1-12)
  const [b1Mitra, setB1Mitra] = useState('');
  const [b1Indikator, setB1Indikator] = useState('');
  const [b1Keterangan, setB1Keterangan] = useState('');

  // Buku 2: Pelaksanaan
  const [b2ProgramPokok, setB2ProgramPokok] = useState('Kesehatan');
  const [b2ProgramPokja4, setB2ProgramPokja4] = useState('GKSTTB');
  const [b2Kegiatan, setB2Kegiatan] = useState('');
  const [b2Tujuan, setB2Tujuan] = useState('');
  const [b2Sasaran, setB2Sasaran] = useState('');
  const [b2Pelaksana, setB2Pelaksana] = useState('');
  const [b2Waktu, setB2Waktu] = useState('');
  const [b2Lokasi, setB2Lokasi] = useState('');
  const [b2Output, setB2Output] = useState('');
  const [b2Outcome, setB2Outcome] = useState('');
  const [b2Monev, setB2Monev] = useState('');
  const [b2Keterangan, setB2Keterangan] = useState('');

  // Buku 3: Buku Kegiatan
  const [b3Nama, setB3Nama] = useState('');
  const [b3Jabatan, setB3Jabatan] = useState('');
  const [b3Tanggal, setB3Tanggal] = useState('');
  const [b3Tempat, setB3Tempat] = useState('');
  const [b3Uraian, setB3Uraian] = useState('');
  const [b3Keterangan, setB3Keterangan] = useState('');

  // Buku 4: Buku Notulen
  const [b4Tanggal, setB4Tanggal] = useState('');
  const [b4Waktu, setB4Waktu] = useState('');
  const [b4Tempat, setB4Tempat] = useState('');
  const [b4JenisRapat, setB4JenisRapat] = useState('Rapat Pleno Pokja IV');
  const [b4PimpinanId, setB4PimpinanId] = useState('');
  const [b4PembuatId, setB4PembuatId] = useState('');
  const [b4Diundang, setB4Diundang] = useState(0);
  const [b4Hadir, setB4Hadir] = useState(0);
  const [b4TidakHadir, setB4TidakHadir] = useState(0);
  const [b4SusunanAcara, setB4SusunanAcara] = useState('');
  const [b4Kesimpulan, setB4Kesimpulan] = useState('');
  const [b4Penutup, setB4Penutup] = useState('');
  const [b4Dokumentasi, setB4Dokumentasi] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      await seedPkkData();
      const kaders = await getKaderPkkList() as any[];
      setKaderList(kaders);

      const b1 = await getBukuProgramKerjaList() as any[];
      setProgramList(b1);

      const b2 = await getBukuPelaksanaanList() as any[];
      setPelaksanaanList(b2);

      const b3 = await getBukuKegiatanList() as any[];
      setKegiatanList(b3);

      const b4 = await getBukuNotulenList() as any[];
      setNotulenList(b4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const resetForm = () => {
    setEditId(null);
    // B1
    setB1ProgramPokok('Kesehatan');
    setB1ProgramPokja4('GKSTTB');
    setB1Kegiatan('');
    setB1Sasaran('');
    setB1Lokasi('');
    setB1WaktuBulan([]);
    setB1Mitra('');
    setB1Indikator('');
    setB1Keterangan('');

    // B2
    setB2ProgramPokok('Kesehatan');
    setB2ProgramPokja4('GKSTTB');
    setB2Kegiatan('');
    setB2Tujuan('');
    setB2Sasaran('');
    setB2Pelaksana('');
    setB2Waktu('');
    setB2Lokasi('');
    setB2Output('');
    setB2Outcome('');
    setB2Monev('');
    setB2Keterangan('');

    // B3
    setB3Nama('');
    setB3Jabatan('');
    setB3Tanggal('');
    setB3Tempat('');
    setB3Uraian('');
    setB3Keterangan('');

    // B4
    setB4Tanggal('');
    setB4Waktu('');
    setB4Tempat('');
    setB4JenisRapat('Rapat Pleno Pokja IV');
    setB4PimpinanId('');
    setB4PembuatId('');
    setB4Diundang(0);
    setB4Hadir(0);
    setB4TidakHadir(0);
    setB4SusunanAcara('');
    setB4Kesimpulan('');
    setB4Penutup('');
    setB4Dokumentasi('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (type: TabType, item: any) => {
    resetForm();
    setEditId(item.id);
    if (type === 'program') {
      setB1ProgramPokok(item.programPokok);
      setB1ProgramPokja4(item.programPokja4);
      setB1Kegiatan(item.kegiatan);
      setB1Sasaran(item.sasaran);
      setB1Lokasi(item.lokasi);
      try {
        setB1WaktuBulan(JSON.parse(item.waktuPelaksanaan || '[]'));
      } catch (e) {
        setB1WaktuBulan([]);
      }
      setB1Mitra(item.mitra);
      setB1Indikator(item.indikatorKeberhasilan);
      setB1Keterangan(item.keterangan || '');
    } else if (type === 'pelaksanaan') {
      setB2ProgramPokok(item.programPokok);
      setB2ProgramPokja4(item.programPokja4);
      setB2Kegiatan(item.kegiatan);
      setB2Tujuan(item.tujuanKegiatan);
      setB2Sasaran(item.sasaran);
      setB2Pelaksana(item.pelaksana);
      setB2Waktu(new Date(item.waktu).toISOString().split('T')[0]);
      setB2Lokasi(item.lokasi);
      setB2Output(item.output);
      setB2Outcome(item.outcome);
      setB2Monev(item.monitoringEvaluasi);
      setB2Keterangan(item.keterangan || '');
    } else if (type === 'kegiatan') {
      setB3Nama(item.nama);
      setB3Jabatan(item.jabatan);
      setB3Tanggal(new Date(item.tanggal).toISOString().split('T')[0]);
      setB3Tempat(item.tempat);
      setB3Uraian(item.uraian);
      setB3Keterangan(item.keterangan || '');
    } else if (type === 'notulen') {
      setB4Tanggal(new Date(item.tanggal).toISOString().split('T')[0]);
      setB4Waktu(item.waktu);
      setB4Tempat(item.tempat);
      setB4JenisRapat(item.jenisRapat);
      setB4PimpinanId(item.pimpinanRapatId ? String(item.pimpinanRapatId) : '');
      setB4PembuatId(item.pembuatNotulenId ? String(item.pembuatNotulenId) : '');
      setB4Diundang(item.jumlahDiundang);
      setB4Hadir(item.jumlahHadir);
      setB4TidakHadir(item.jumlahTidakHadir);
      setB4SusunanAcara(item.susunanAcara);
      setB4Kesimpulan(item.kesimpulan);
      setB4Penutup(item.penutup);
      setB4Dokumentasi(item.dokumentasi || '');
    }
    setShowModal(true);
  };

  const handleDelete = async (type: TabType, id: number) => {
    Swal.fire({
      title: 'Hapus data ini?',
      text: "Data administrasi terpilih akan dihapus permanen dari sistem.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === 'program') await deleteBukuProgramKerja(id);
          else if (type === 'pelaksanaan') await deleteBukuPelaksanaan(id);
          else if (type === 'kegiatan') await deleteBukuKegiatan(id);
          else if (type === 'notulen') await deleteBukuNotulen(id);

          Swal.fire('Terhapus!', 'Data berhasil dihapus dari Buku Administrasi.', 'success');
          loadAllData();
        } catch (e: any) {
          Swal.fire('Error', e.message, 'error');
        }
      }
    });
  };

  const handleMonthToggle = (monthNum: number) => {
    if (b1WaktuBulan.includes(monthNum)) {
      setB1WaktuBulan(b1WaktuBulan.filter(m => m !== monthNum));
    } else {
      setB1WaktuBulan([...b1WaktuBulan, monthNum].sort((a, b) => a - b));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (editId) formData.append('id', String(editId));

    try {
      if (activeTab === 'program') {
        if (!b1Kegiatan || !b1Sasaran || !b1Lokasi || !b1Mitra || !b1Indikator) {
          Swal.fire('Gagal', 'Lengkapi seluruh kolom utama program kerja!', 'error');
          return;
        }
        formData.append('programPokok', b1ProgramPokok);
        formData.append('programPokja4', b1ProgramPokja4);
        formData.append('kegiatan', b1Kegiatan);
        formData.append('sasaran', b1Sasaran);
        formData.append('lokasi', b1Lokasi);
        formData.append('waktuPelaksanaan', JSON.stringify(b1WaktuBulan));
        formData.append('mitra', b1Mitra);
        formData.append('indikatorKeberhasilan', b1Indikator);
        formData.append('keterangan', b1Keterangan);
        await saveBukuProgramKerja(formData);
      } else if (activeTab === 'pelaksanaan') {
        if (!b2Kegiatan || !b2Tujuan || !b2Sasaran || !b2Pelaksana || !b2Waktu || !b2Lokasi || !b2Output || !b2Outcome || !b2Monev) {
          Swal.fire('Gagal', 'Lengkapi seluruh kolom pelaksanaan program kerja!', 'error');
          return;
        }
        formData.append('programPokok', b2ProgramPokok);
        formData.append('programPokja4', b2ProgramPokja4);
        formData.append('kegiatan', b2Kegiatan);
        formData.append('tujuanKegiatan', b2Tujuan);
        formData.append('sasaran', b2Sasaran);
        formData.append('pelaksana', b2Pelaksana);
        formData.append('waktu', b2Waktu);
        formData.append('lokasi', b2Lokasi);
        formData.append('output', b2Output);
        formData.append('outcome', b2Outcome);
        formData.append('monitoringEvaluasi', b2Monev);
        formData.append('keterangan', b2Keterangan);
        await saveBukuPelaksanaan(formData);
      } else if (activeTab === 'kegiatan') {
        if (!b3Nama || !b3Jabatan || !b3Tanggal || !b3Tempat || !b3Uraian) {
          Swal.fire('Gagal', 'Lengkapi seluruh kolom utama buku kegiatan!', 'error');
          return;
        }
        formData.append('nama', b3Nama);
        formData.append('jabatan', b3Jabatan);
        formData.append('tanggal', b3Tanggal);
        formData.append('tempat', b3Tempat);
        formData.append('uraian', b3Uraian);
        formData.append('keterangan', b3Keterangan);
        await saveBukuKegiatan(formData);
      } else if (activeTab === 'notulen') {
        if (!b4Tanggal || !b4Waktu || !b4Tempat || !b4JenisRapat || !b4SusunanAcara || !b4Kesimpulan || !b4Penutup) {
          Swal.fire('Gagal', 'Lengkapi seluruh kolom notulen rapat!', 'error');
          return;
        }
        formData.append('tanggal', b4Tanggal);
        formData.append('waktu', b4Waktu);
        formData.append('tempat', b4Tempat);
        formData.append('jenisRapat', b4JenisRapat);
        if (b4PimpinanId) formData.append('pimpinanRapatId', b4PimpinanId);
        if (b4PembuatId) formData.append('pembuatNotulenId', b4PembuatId);
        formData.append('jumlahDiundang', String(b4Diundang));
        formData.append('jumlahHadir', String(b4Hadir));
        formData.append('jumlahTidakHadir', String(b4TidakHadir));
        formData.append('susunanAcara', b4SusunanAcara);
        formData.append('kesimpulan', b4Kesimpulan);
        formData.append('penutup', b4Penutup);
        formData.append('dokumentasi', b4Dokumentasi);
        await saveBukuNotulen(formData);
      }

      Swal.fire('Berhasil!', 'Data Buku Administrasi disimpan.', 'success');
      setShowModal(false);
      loadAllData();
    } catch (e: any) {
      Swal.fire('Error', e.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper render months checkboxes
  const renderMonthHeaders = () => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map(m => (
      <th key={m} className="px-2 py-3 text-center border text-[10px] font-black text-slate-500 w-8 bg-slate-50">{m}</th>
    ));
  };

  const renderMonthCells = (waktuPelaksanaanStr: string) => {
    let monthsArr: number[] = [];
    try {
      monthsArr = JSON.parse(waktuPelaksanaanStr || '[]');
    } catch (e) {
      monthsArr = [];
    }

    return Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
      <td key={m} className="px-2 py-3 text-center border text-xs font-bold w-8">
        {monthsArr.includes(m) ? (
          <span className="inline-block w-4 h-4 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center mx-auto text-[10px] font-black">✓</span>
        ) : '-'}
      </td>
    ));
  };

  // Formatting helpers
  const formatMonthNames = (waktuPelaksanaanStr: string) => {
    let monthsArr: number[] = [];
    try {
      monthsArr = JSON.parse(waktuPelaksanaanStr || '[]');
    } catch (e) {
      monthsArr = [];
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    return monthsArr.map(m => monthNames[m - 1]).join(', ') || 'Belum diatur';
  };

  // Filters based on active tab and search query
  const getFilteredData = () => {
    if (activeTab === 'program') {
      return programList.filter(item => 
        item.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.programPokok.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mitra.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'pelaksanaan') {
      return pelaksanaanList.filter(item =>
        item.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.programPokok.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pelaksana.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (activeTab === 'kegiatan') {
      return kegiatanList.filter(item =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uraian.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      return notulenList.filter(item =>
        item.jenisRapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tempat.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-8 print:space-y-4 print:p-0">
      {/* CSS Cetak Khusus */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            font-size: 10px !important;
          }
          aside, nav, header, button, .no-print, input, .flex-row-header {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
            font-size: 9px !important;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 4px !important;
            color: black !important;
          }
          .print-title {
            display: block !important;
            text-align: center !important;
            margin-bottom: 20px !important;
          }
        }
      `}</style>

      {/* Header Halaman (No Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print flex-row-header">
        <div>
          <Link href="/admin/pkk" className="text-rose-600 font-semibold text-xs flex items-center gap-1.5 hover:underline mb-2">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
               <BookOpen size={20} />
             </div>
             Buku Baku Administrasi Pokja IV
          </h1>
          <p className="text-slate-500 text-sm mt-1">Pembinaan program Kesehatan, Kelestarian Lingkungan Hidup, & Perencanaan Sehat.</p>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={handlePrint}
             className="px-4 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition-all shadow-sm"
           >
             <Printer size={16} /> Cetak Buku Administrasi
           </button>
           <button 
             onClick={handleOpenAdd}
             className="px-4 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-amber-700 shadow-sm transition-all shadow-amber-200"
           >
             <Plus size={16} /> Tambah Log Data
           </button>
        </div>
      </div>

      {/* Rambu Info Lomba (No Print) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start no-print">
        <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">Dokumentasi Baku Administrasi PKK</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Halaman ini memfasilitasi 4 Buku Baku Utama administrasi yang wajib dimiliki oleh Pokja IV PKK sesuai panduan penilaian tingkat kabupaten. Format tabel, penanggalan, dan kolom notulen telah disesuaikan 100% presisi dengan format cetak resmi.
          </p>
        </div>
      </div>

      {/* Judul Khusus Cetak (Hanya Muncul Saat Print) */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wide">Pemberdayaan Kesejahteraan Keluarga (PKK)</h1>
        <h2 className="text-lg font-bold uppercase tracking-wide mt-1">Tim Penggerak PKK Desa Kediren - Kecamatan Lembeyan</h2>
        <h3 className="text-md font-bold uppercase tracking-wide border-b border-black pb-3 mt-1 text-slate-700">
          {activeTab === 'program' && 'BUKU 1: PROGRAM KERJA POKJA IV'}
          {activeTab === 'pelaksanaan' && 'BUKU 2: PELAKSANAAN PROGRAM KERJA POKJA IV'}
          {activeTab === 'kegiatan' && 'BUKU 3: BUKU KEGIATAN KADER POKJA IV'}
          {activeTab === 'notulen' && 'BUKU 4: BUKU NOTULEN RAPAT POKJA IV'}
        </h3>
      </div>

      {/* Tab Navigasi Buku (No Print) */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto no-print">
        <button 
          onClick={() => { setActiveTab('program'); setSearchQuery(''); }}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'program' ? 'border-amber-600 text-amber-700 bg-amber-50/20' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          <FileText size={16} /> 1. Buku Program Kerja
        </button>
        <button 
          onClick={() => { setActiveTab('pelaksanaan'); setSearchQuery(''); }}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'pelaksanaan' ? 'border-amber-600 text-amber-700 bg-amber-50/20' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          <CheckSquare size={16} /> 2. Buku Pelaksanaan
        </button>
        <button 
          onClick={() => { setActiveTab('kegiatan'); setSearchQuery(''); }}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'kegiatan' ? 'border-amber-600 text-amber-700 bg-amber-50/20' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          <Calendar size={16} /> 3. Buku Kegiatan Kader
        </button>
        <button 
          onClick={() => { setActiveTab('notulen'); setSearchQuery(''); }}
          className={`px-5 py-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'notulen' ? 'border-amber-600 text-amber-700 bg-amber-50/20' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
        >
          <Clock size={16} /> 4. Buku Notulen Rapat
        </button>
      </div>

      {/* Main Content Box */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm print-full-width">
         {/* Search Bar (No Print) */}
         <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white no-print">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program, kegiatan, lokasi atau nama..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
            </div>
            <div className="text-xs text-slate-400 font-bold">
              Menampilkan {filteredData.length} data laporan
            </div>
         </div>

         {/* 1. BUKU PROGRAM KERJA TAB */}
         {activeTab === 'program' && (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80">
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">No</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Program Pokok PKK</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Program Pokja IV</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Kegiatan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Sasaran</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Lokasi</th>
                   {/* Column 1 to 12 header */}
                   {renderMonthHeaders()}
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Mitra</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Indikator</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Keterangan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-right no-print">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {loading ? (
                   <tr>
                     <td colSpan={23} className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data Buku Program Kerja...</td>
                   </tr>
                 ) : filteredData.length === 0 ? (
                   <tr>
                     <td colSpan={23} className="p-12 text-center text-slate-400 font-bold text-sm">Belum ada data program kerja tersimpan.</td>
                   </tr>
                 ) : (
                   filteredData.map((item, idx) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-600">{idx + 1}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-800">{item.programPokok}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-medium text-slate-700">{item.programPokja4}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-amber-700">{item.kegiatan}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.sasaran}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.lokasi}</td>
                       {/* Render checkboxes cells */}
                       {renderMonthCells(item.waktuPelaksanaan)}
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-700">{item.mitra}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600 max-w-xs truncate">{item.indikatorKeberhasilan}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-500">{item.keterangan || '-'}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-right space-x-2 no-print whitespace-nowrap">
                         <button onClick={() => handleEdit('program', item)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                           <Edit3 size={13} />
                         </button>
                         <button onClick={() => handleDelete('program', item.id)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors">
                           <Trash2 size={13} />
                         </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         )}

         {/* 2. BUKU PELAKSANAAN TAB */}
         {activeTab === 'pelaksanaan' && (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80">
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">No</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Program Pokok PKK</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Program Pokja IV</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Kegiatan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Tujuan Kegiatan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Sasaran</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Pelaksana</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Waktu</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Lokasi</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Output</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Outcome</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Monev</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Keterangan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-right no-print">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {loading ? (
                   <tr>
                     <td colSpan={14} className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data Buku Pelaksanaan...</td>
                   </tr>
                 ) : filteredData.length === 0 ? (
                   <tr>
                     <td colSpan={14} className="p-12 text-center text-slate-400 font-bold text-sm">Belum ada data pelaksanaan program tersimpan.</td>
                   </tr>
                 ) : (
                   filteredData.map((item, idx) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-600">{idx + 1}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-800">{item.programPokok}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-medium text-slate-700">{item.programPokja4}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-amber-700">{item.kegiatan}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600 max-w-xs truncate">{item.tujuanKegiatan}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.sasaran}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.pelaksana}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-mono text-slate-700">{new Date(item.waktu).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.lokasi}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600 max-w-xs truncate">{item.output}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600 max-w-xs truncate">{item.outcome}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600 max-w-xs truncate">{item.monitoringEvaluasi}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-500">{item.keterangan || '-'}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-right space-x-2 no-print whitespace-nowrap">
                         <button onClick={() => handleEdit('pelaksanaan', item)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                           <Edit3 size={13} />
                         </button>
                         <button onClick={() => handleDelete('pelaksanaan', item.id)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors">
                           <Trash2 size={13} />
                         </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         )}

         {/* 3. BUKU KEGIATAN TAB */}
         {activeTab === 'kegiatan' && (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80">
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">No</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Nama Pelapor</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Jabatan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Tanggal</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Tempat</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Uraian Kegiatan / Hasil</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Keterangan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-right no-print">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {loading ? (
                   <tr>
                     <td colSpan={8} className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data Buku Kegiatan...</td>
                   </tr>
                 ) : filteredData.length === 0 ? (
                   <tr>
                     <td colSpan={8} className="p-12 text-center text-slate-400 font-bold text-sm">Belum ada data buku kegiatan tersimpan.</td>
                   </tr>
                 ) : (
                   filteredData.map((item, idx) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-600">{idx + 1}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-800">{item.nama}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-medium text-slate-600">{item.jabatan}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-mono text-slate-700">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.tempat}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-w-md">{item.uraian}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-500">{item.keterangan || '-'}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-right space-x-2 no-print whitespace-nowrap">
                         <button onClick={() => handleEdit('kegiatan', item)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                           <Edit3 size={13} />
                         </button>
                         <button onClick={() => handleDelete('kegiatan', item.id)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors">
                           <Trash2 size={13} />
                         </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         )}

         {/* 4. BUKU NOTULEN TAB */}
         {activeTab === 'notulen' && (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80">
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">No</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Rapat & Waktu</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Tempat</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Pimpinan & Notulis</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Kehadiran</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Susunan Acara</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Hasil Kesimpulan</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Dokumentasi</th>
                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 text-right no-print">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {loading ? (
                   <tr>
                     <td colSpan={9} className="p-12 text-center text-slate-500 font-bold text-sm">Memuat data Buku Notulen Rapat...</td>
                   </tr>
                 ) : filteredData.length === 0 ? (
                   <tr>
                     <td colSpan={9} className="p-12 text-center text-slate-400 font-bold text-sm">Belum ada data notulen rapat tersimpan.</td>
                   </tr>
                 ) : (
                   filteredData.map((item, idx) => (
                     <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-600">{idx + 1}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-bold text-slate-800">
                         <div>{item.jenisRapat}</div>
                         <div className="text-[10px] font-normal text-slate-400 mt-1">
                           {new Date(item.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • {item.waktu}
                         </div>
                       </td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">{item.tempat}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">
                         <div><span className="font-semibold text-slate-700">PJ:</span> {item.pimpinanRapat?.nama || '-'}</div>
                         <div className="mt-0.5"><span className="font-semibold text-slate-700">Notulis:</span> {item.pembuatNotulen?.nama || '-'}</div>
                       </td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600">
                         <div>Diundang: {item.jumlahDiundang} orang</div>
                         <div>Hadir: <span className="text-emerald-600 font-bold">{item.jumlahHadir}</span> orang</div>
                         <div>Absen: <span className="text-rose-500 font-bold">{item.jumlahTidakHadir}</span> orang</div>
                       </td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-600 whitespace-pre-line leading-relaxed max-w-xs">{item.susunanAcara}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs font-medium text-amber-800 whitespace-pre-line leading-relaxed max-w-xs">{item.kesimpulan}</td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-slate-500">
                         {item.dokumentasi ? (
                           <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-md font-mono text-[9px]">Ada Foto</span>
                         ) : 'Tidak ada'}
                       </td>
                       <td className="px-4 py-3 border border-slate-100 text-xs text-right space-x-2 no-print whitespace-nowrap">
                         <button onClick={() => handleEdit('notulen', item)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition-colors">
                           <Edit3 size={13} />
                         </button>
                         <button onClick={() => handleDelete('notulen', item.id)} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors">
                           <Trash2 size={13} />
                         </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         )}
      </div>

      {/* --- FORM MODAL (No Print) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-[2rem] border border-slate-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 bg-white z-10">
               <div>
                 <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                   <BookOpen size={18} className="text-amber-600" />
                   {editId ? 'Ubah Data Administrasi' : 'Tambah Data Administrasi Baru'}
                 </h3>
                 <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                   {activeTab === 'program' && 'Buku 1: Program Kerja Pokja IV'}
                   {activeTab === 'pelaksanaan' && 'Buku 2: Pelaksanaan Program Kerja'}
                   {activeTab === 'kegiatan' && 'Buku 3: Buku Kegiatan Kader'}
                   {activeTab === 'notulen' && 'Buku 4: Buku Notulen Rapat'}
                 </p>
               </div>
               <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                 <X size={18} />
               </button>
             </div>

             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* 1. PROGRAM KERJA FORM */}
                {activeTab === 'program' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                       <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Program Pokok PKK</label>
                       <input 
                         type="text" 
                         value={b1ProgramPokok} 
                         onChange={(e) => setB1ProgramPokok(e.target.value)}
                         list="program-pokok-list"
                         placeholder="Pilih atau ketik program pokok..."
                         className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                       />
                       <datalist id="program-pokok-list">
                         <option value="Kesehatan" />
                         <option value="Kelestarian Lingkungan Hidup" />
                         <option value="Perencanaan Sehat" />
                       </datalist>
                     </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Program Pokja IV</label>
                      <input 
                        type="text" 
                        value={b1ProgramPokja4} 
                        onChange={(e) => setB1ProgramPokja4(e.target.value)}
                        placeholder="Contoh: GKSTTB, STBM, KB-Kespro"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Nama Kegiatan</label>
                      <input 
                        type="text" 
                        value={b1Kegiatan} 
                        onChange={(e) => setB1Kegiatan(e.target.value)}
                        placeholder="Contoh: Penyuluhan Imunisasi Lanjutan"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Sasaran Program</label>
                      <input 
                        type="text" 
                        value={b1Sasaran} 
                        onChange={(e) => setB1Sasaran(e.target.value)}
                        placeholder="Contoh: Ibu Hamil, Balita, Remaja"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Lokasi Kegiatan</label>
                      <input 
                        type="text" 
                        value={b1Lokasi} 
                        onChange={(e) => setB1Lokasi(e.target.value)}
                        placeholder="Contoh: RT 002 Dusun Selungguh"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Rencana Waktu Pelaksanaan (Bulan Ke 1-12)</label>
                      <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => handleMonthToggle(m)}
                            className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all ${b1WaktuBulan.includes(m) ? 'bg-amber-600 border-amber-600 text-white shadow-sm shadow-amber-200' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                          >
                            Bulan {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Mitra Kerja / Dinas Terkait</label>
                      <input 
                        type="text" 
                        value={b1Mitra} 
                        onChange={(e) => setB1Mitra(e.target.value)}
                        placeholder="Contoh: Puskesmas, Sanitarian"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Indikator Keberhasilan</label>
                      <input 
                        type="text" 
                        value={b1Indikator} 
                        onChange={(e) => setB1Indikator(e.target.value)}
                        placeholder="Contoh: Balita stunting berkurang"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Keterangan Tambahan</label>
                      <textarea 
                        value={b1Keterangan} 
                        onChange={(e) => setB1Keterangan(e.target.value)}
                        placeholder="Keterangan opsional..."
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                {/* 2. PELAKSANAAN PROGRAM WORK FORM */}
                {activeTab === 'pelaksanaan' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Program Pokok PKK</label>
                      <input 
                        type="text" 
                        value={b2ProgramPokok} 
                        onChange={(e) => setB2ProgramPokok(e.target.value)}
                        list="program-pokok-list"
                        placeholder="Pilih atau ketik program pokok..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Program Pokja IV</label>
                      <input 
                        type="text" 
                        value={b2ProgramPokja4} 
                        onChange={(e) => setB2ProgramPokja4(e.target.value)}
                        placeholder="Contoh: GKSTTB, STBM"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Nama Kegiatan</label>
                      <input 
                        type="text" 
                        value={b2Kegiatan} 
                        onChange={(e) => setB2Kegiatan(e.target.value)}
                        placeholder="Contoh: Penyuluhan Pengelolaan Sampah"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Tujuan Kegiatan</label>
                      <textarea 
                        value={b2Tujuan} 
                        onChange={(e) => setB2Tujuan(e.target.value)}
                        placeholder="Tujuan dilakukannya kegiatan ini..."
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Sasaran</label>
                      <input 
                        type="text" 
                        value={b2Sasaran} 
                        onChange={(e) => setB2Sasaran(e.target.value)}
                        placeholder="Contoh: Keluarga, RT 003"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Pelaksana</label>
                      <input 
                        type="text" 
                        value={b2Pelaksana} 
                        onChange={(e) => setB2Pelaksana(e.target.value)}
                        placeholder="Contoh: Pokja IV & Kader Dusun"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Waktu Kegiatan</label>
                      <input 
                        type="date" 
                        value={b2Waktu} 
                        onChange={(e) => setB2Waktu(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Lokasi / Tempat</label>
                      <input 
                        type="text" 
                        value={b2Lokasi} 
                        onChange={(e) => setB2Lokasi(e.target.value)}
                        placeholder="Contoh: RT 002 Dusun Selungguh"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Output (Hasil Langsung)</label>
                      <input 
                        type="text" 
                        value={b2Output} 
                        onChange={(e) => setB2Output(e.target.value)}
                        placeholder="Contoh: Pengetahuan pemilahan sampah meningkat"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Outcome (Dampak Jangka Panjang)</label>
                      <input 
                        type="text" 
                        value={b2Outcome} 
                        onChange={(e) => setB2Outcome(e.target.value)}
                        placeholder="Contoh: Sampah keluarga dipilah-pilah rapi"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Monitoring & Evaluasi</label>
                      <input 
                        type="text" 
                        value={b2Monev} 
                        onChange={(e) => setB2Monev(e.target.value)}
                        placeholder="Contoh: Evaluasi volume sampah tahunan"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Keterangan</label>
                      <textarea 
                        value={b2Keterangan} 
                        onChange={(e) => setB2Keterangan(e.target.value)}
                        placeholder="Keterangan pendukung..."
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                {/* 3. BUKU KEGIATAN FORM */}
                {activeTab === 'kegiatan' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Nama Pelapor (Kader/Pengurus)</label>
                      <input 
                        type="text" 
                        value={b3Nama} 
                        onChange={(e) => setB3Nama(e.target.value)}
                        placeholder="Contoh: Ny. Luluk P"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Jabatan di TP PKK</label>
                      <input 
                        type="text" 
                        value={b3Jabatan} 
                        onChange={(e) => setB3Jabatan(e.target.value)}
                        placeholder="Contoh: Sekretaris Pokja IV"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Tanggal Kegiatan</label>
                      <input 
                        type="date" 
                        value={b3Tanggal} 
                        onChange={(e) => setB3Tanggal(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Tempat / Gedung</label>
                      <input 
                        type="text" 
                        value={b3Tempat} 
                        onChange={(e) => setB3Tempat(e.target.value)}
                        placeholder="Contoh: Gedung Pertemuan Desa Kediren"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Uraian / Jalannya Kegiatan & Hasil Kerja</label>
                      <textarea 
                        value={b3Uraian} 
                        onChange={(e) => setB3Uraian(e.target.value)}
                        placeholder="Tuliskan detail uraian kegiatan dan hasilnya di sini..."
                        rows={6}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50 font-mono text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Keterangan</label>
                      <input 
                        type="text" 
                        value={b3Keterangan} 
                        onChange={(e) => setB3Keterangan(e.target.value)}
                        placeholder="Keterangan opsional..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                {/* 4. NOTULEN RAPAT FORM */}
                {activeTab === 'notulen' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Jenis Pertemuan / Rapat</label>
                      <input 
                        type="text" 
                        value={b4JenisRapat} 
                        onChange={(e) => setB4JenisRapat(e.target.value)}
                        placeholder="Contoh: Rapat Pleno Bulanan Pokja IV"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Pimpinan Rapat (Dropdown Kader)</label>
                      <select 
                        value={b4PimpinanId} 
                        onChange={(e) => setB4PimpinanId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      >
                        <option value="">-- Pilih Kader PJ Rapat --</option>
                        {kaderList.map(k => (
                          <option key={k.id} value={k.id}>{k.nama} ({k.jabatan})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Tanggal Rapat</label>
                      <input 
                        type="date" 
                        value={b4Tanggal} 
                        onChange={(e) => setB4Tanggal(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Waktu / Jam Rapat</label>
                      <input 
                        type="text" 
                        value={b4Waktu} 
                        onChange={(e) => setB4Waktu(e.target.value)}
                        placeholder="Contoh: 09:00 - 11:30 WIB"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Tempat Pertemuan</label>
                      <input 
                        type="text" 
                        value={b4Tempat} 
                        onChange={(e) => setB4Tempat(e.target.value)}
                        placeholder="Contoh: Ruang Rapat PKK Desa Kediren"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Pembuat Notulen (Sekretaris/Notulis)</label>
                      <select 
                        value={b4PembuatId} 
                        onChange={(e) => setB4PembuatId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      >
                        <option value="">-- Pilih Notulis --</option>
                        {kaderList.map(k => (
                          <option key={k.id} value={k.id}>{k.nama} ({k.jabatan})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:col-span-2">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Diundang (Orang)</label>
                        <input 
                          type="number" 
                          value={b4Diundang} 
                          onChange={(e) => setB4Diundang(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Hadir (Orang)</label>
                        <input 
                          type="number" 
                          value={b4Hadir} 
                          onChange={(e) => setB4Hadir(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Absen/Tidak Hadir</label>
                        <input 
                          type="number" 
                          value={b4TidakHadir} 
                          onChange={(e) => setB4TidakHadir(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Susunan Acara / Uraian Jalannya Rapat</label>
                      <textarea 
                        value={b4SusunanAcara} 
                        onChange={(e) => setB4SusunanAcara(e.target.value)}
                        placeholder="Contoh: 1. Pembukaan oleh Pimpinan Rapat, 2. Pembahasan..."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50 font-mono text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Hasil Kesimpulan Rapat</label>
                      <textarea 
                        value={b4Kesimpulan} 
                        onChange={(e) => setB4Kesimpulan(e.target.value)}
                        placeholder="Tuliskan butir-butir kesepakatan atau kesimpulan rapat di sini..."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50 font-mono text-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Penutup Rapat</label>
                      <textarea 
                        value={b4Penutup} 
                        onChange={(e) => setB4Penutup(e.target.value)}
                        placeholder="Kalimat penutup rapat..."
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Dokumentasi (Opsional - URL atau Keterangan Gambar)</label>
                      <input 
                        type="text" 
                        value={b4Dokumentasi} 
                        onChange={(e) => setB4Dokumentasi(e.target.value)}
                        placeholder="Tulis URL gambar atau deskripsi dokumentasi foto..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 -mx-8 -mb-8 sticky bottom-0 z-10 bg-white">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-amber-700 shadow-sm transition-all shadow-amber-200"
                  >
                    <Save size={14} /> Simpan Data
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
