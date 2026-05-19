'use client';
 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, FileText, Calendar, Users, MapPin, Plus, Search, Edit3, Trash2, X, Save, 
  ArrowLeft, CheckSquare, Printer, ChevronRight, Check, AlertCircle, Info, Heart, Shield, Award
} from 'lucide-react';
import { 
  getKaderPkkList, seedPkkData,
  getBukuProgramKerjaList, saveBukuProgramKerja, deleteBukuProgramKerja,
  getBukuPelaksanaanList, saveBukuPelaksanaan, deleteBukuPelaksanaan,
  getBukuKegiatanList, saveBukuKegiatan, deleteBukuKegiatan,
  getBukuNotulenList, saveBukuNotulen, deleteBukuNotulen,
  getPusWusData
} from '@/app/actions/pkk';
import Swal from 'sweetalert2';

type TabType = 'program' | 'pelaksanaan' | 'kegiatan' | 'notulen' | 'laporan';

export default function PokjaIVBukuBakuPage() {
  const [activeTab, setActiveTab] = useState<TabType>('program');
  const [loading, setLoading] = useState(true);
  const [kaderList, setKaderList] = useState<any[]>([]);

  // Database lists
  const [programList, setProgramList] = useState<any[]>([]);
  const [pelaksanaanList, setPelaksanaanList] = useState<any[]>([]);
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  const [notulenList, setNotulenList] = useState<any[]>([]);
  
  // Dynamic report lists
  const [pusWusData, setPusWusData] = useState<{ wus: any[], pus: any[], balitaStats: any, dusunStats?: any[] }>({ 
    wus: [], 
    pus: [], 
    balitaStats: { total: 0, stunting: 0, giziKurang: 0, giziBuruk: 0, normal: 0 },
    dusunStats: []
  });
  const [activeReportSubTab, setActiveReportSubTab] = useState<'pus' | 'wus' | 'balita' | 'sanitasi'>('pus');
  const [selectedDusunFilter, setSelectedDusunFilter] = useState<string>('ALL');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // --- FORM STATES ---
  // Buku 1: Program Kerja
  const [b1ProgramPokok, setB1ProgramPokok] = useState('Kesehatan');
  const [b1ProgramPokja4, setB1ProgramPokja4] = useState('GKSTTB');
  const [b1Kegiatan, setB1Kegiatan] = useState('');
  const [b1Sasaran, setB1Sasaran] = useState('');
  const [b1Lokasi, setB1Lokasi] = useState('');
  const [b1WaktuBulan, setB1WaktuBulan] = useState<number[]>([]); 
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

      const reportData = await getPusWusData() as any;
      if (reportData) {
        setPusWusData(reportData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const getUniqueDusuns = () => {
    const list = new Set<string>();
    pusWusData.pus.forEach((item: any) => {
      if (item.dusun) list.add(item.dusun.trim().toUpperCase());
    });
    pusWusData.wus.forEach((item: any) => {
      if (item.dusun) list.add(item.dusun.trim().toUpperCase());
    });
    return Array.from(list);
  };

  const getFilteredPusData = () => {
    if (selectedDusunFilter === 'ALL') return pusWusData.pus;
    return pusWusData.pus.filter((item: any) => item.dusun && item.dusun.trim().toUpperCase() === selectedDusunFilter.toUpperCase());
  };

  const getFilteredWusData = () => {
    if (selectedDusunFilter === 'ALL') return pusWusData.wus;
    return pusWusData.wus.filter((item: any) => item.dusun && item.dusun.trim().toUpperCase() === selectedDusunFilter.toUpperCase());
  };

  const handlePrint = () => {
    const printContent = document.getElementById('report-print-preview-content');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=1100,height=800,toolbar=0,scrollbars=0,status=0');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>LAPORAN POKJA IV - TP PKK KEDIREN</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page { size: portrait; margin: 1.5cm; }
                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              }
              body { font-family: 'Times New Roman', Times, serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
              th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; font-size: 11px; }
              th { background-color: #f8fafc; font-weight: bold; }
            </style>
          </head>
          <body class="bg-white p-6">
            ${printContent.innerHTML}
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

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
      confirmButtonColor: '#e11d48',
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
    } else if (activeTab === 'notulen') {
      return notulenList.filter(item =>
        item.jenisRapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tempat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kesimpulan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [];
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
          <span className="inline-block w-4 h-4 bg-rose-100 text-rose-700 rounded flex items-center justify-center mx-auto text-[10px] font-black">✓</span>
        ) : '-'}
      </td>
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 to-pink-850 text-white shadow-lg sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/admin/pkk" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="bg-rose-100/20 text-rose-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Pokja IV (Kesehatan, Kelestarian Lingkungan, Perencanaan Sehat)
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">4 Buku Administrasi Baku</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition text-sm">
              <Printer className="w-4 h-4" /> Cetak Buku
            </button>
            {activeTab !== 'laporan' && (
              <button onClick={handleOpenAdd} className="bg-white text-rose-800 hover:bg-rose-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition text-sm">
                <Plus className="w-4 h-4" /> Tambah Data
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Banner */}
        <div className="bg-white border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm mb-6 flex items-start gap-3 print:hidden">
          <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Buku Administrasi Standar TP PKK Nasional</h4>
            <p className="text-xs text-slate-600 mt-0.5">Sistem pencatatan terpusat program Kesehatan, Kelestarian Lingkungan Hidup, Imunisasi, Posyandu, PHBS, dan Perencanaan Sehat TP PKK Desa Kediren.</p>
          </div>
        </div>

        {/* Tab Menus */}
        <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 pb-3 mb-6 scrollbar-none print:hidden">
          {[
            { id: 'program', label: 'Buku 1: Program Kerja', desc: 'Rencana kerja tahunan Pokja IV', icon: BookOpen },
            { id: 'pelaksanaan', label: 'Buku 2: Pelaksanaan Kerja', desc: 'Realisasi & evaluasi program', icon: CheckSquare },
            { id: 'kegiatan', label: 'Buku 3: Log Kegiatan', desc: 'Buku catatan peristiwa khusus', icon: Calendar },
            { id: 'notulen', label: 'Buku 4: Notulen Rapat', desc: 'Hasil pleno & rapat koordinasi', icon: Users },
            { id: 'laporan', label: 'e-Laporan & Buku Bantu', desc: 'Laporan PUS/WUS & KMS otomatis', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(''); }}
                className={`flex-1 min-w-[240px] text-left p-4 rounded-xl border transition ${
                  active 
                    ? 'bg-rose-50/50 border-rose-200 shadow-sm ring-1 ring-rose-500/20' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${active ? 'text-rose-600' : 'text-slate-500'}`} />
                  <span className={`font-black text-sm ${active ? 'text-rose-800' : 'text-slate-800'}`}>{tab.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tab.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Search */}
        {activeTab !== 'laporan' && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm mb-6 print:hidden">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder={`Cari data berdasarkan nama kegiatan, program pokok, pelaksana...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 font-medium mt-4 text-sm">Menghubungkan ke database & mensinkronkan skema...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* 1. RENDER BUKU 1 */}
            {activeTab === 'program' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                      <th className="px-4 py-4 border w-12 text-center">No</th>
                      <th className="px-4 py-4 border">Program Pokok</th>
                      <th className="px-4 py-4 border">Program Pokja IV</th>
                      <th className="px-4 py-4 border">Kegiatan Utama</th>
                      <th className="px-4 py-4 border">Sasaran</th>
                      <th className="px-4 py-4 border">Lokasi</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <th key={m} className="px-2 py-4 border text-center bg-rose-50/30 w-8">{m}</th>
                      ))}
                      <th className="px-4 py-4 border">Mitra Kerja</th>
                      <th className="px-4 py-4 border">Indikator Sukses</th>
                      <th className="px-4 py-4 border">Ket</th>
                      <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().length === 0 ? (
                      <tr>
                        <td colSpan={23} className="text-center py-12 text-slate-400 font-medium">Belum ada rencana program kerja Pokja IV.</td>
                      </tr>
                    ) : (
                      getFilteredData().map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border font-black text-slate-800">{item.programPokok}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.programPokja4}</td>
                          <td className="px-4 py-3 border font-semibold text-rose-900">{item.kegiatan}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.sasaran}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.lokasi}</td>
                          {renderMonthCells(item.waktuPelaksanaan)}
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.mitra}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.indikatorKeberhasilan}</td>
                          <td className="px-4 py-3 border text-slate-500">{item.keterangan || '-'}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('program', item)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('program', item.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. RENDER BUKU 2 */}
            {activeTab === 'pelaksanaan' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                      <th className="px-4 py-4 border w-12 text-center">No</th>
                      <th className="px-4 py-4 border">Program Pokok</th>
                      <th className="px-4 py-4 border">Program Pokja IV</th>
                      <th className="px-4 py-4 border">Kegiatan</th>
                      <th className="px-4 py-4 border">Tujuan</th>
                      <th className="px-4 py-4 border">Sasaran</th>
                      <th className="px-4 py-4 border">Pelaksana</th>
                      <th className="px-4 py-4 border">Waktu</th>
                      <th className="px-4 py-4 border">Lokasi</th>
                      <th className="px-4 py-4 border">Output (Hasil)</th>
                      <th className="px-4 py-4 border">Outcome (Dampak)</th>
                      <th className="px-4 py-4 border">Monitoring/Evaluasi</th>
                      <th className="px-4 py-4 border">Ket</th>
                      <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().length === 0 ? (
                      <tr>
                        <td colSpan={14} className="text-center py-12 text-slate-400 font-medium">Belum ada catatan pelaksanaan program.</td>
                      </tr>
                    ) : (
                      getFilteredData().map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border font-black text-slate-800">{item.programPokok}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.programPokja4}</td>
                          <td className="px-4 py-3 border font-semibold text-rose-900">{item.kegiatan}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.tujuanKegiatan}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.sasaran}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.pelaksana}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{new Date(item.waktu).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.lokasi}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.output}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.outcome}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold text-rose-850">{item.monitoringEvaluasi}</td>
                          <td className="px-4 py-3 border text-slate-500">{item.keterangan || '-'}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('pelaksanaan', item)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('pelaksanaan', item.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. RENDER BUKU 3 */}
            {activeTab === 'kegiatan' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                      <th className="px-4 py-4 border w-12 text-center">No</th>
                      <th className="px-4 py-4 border">Nama Personel</th>
                      <th className="px-4 py-4 border">Jabatan</th>
                      <th className="px-4 py-4 border">Tanggal</th>
                      <th className="px-4 py-4 border">Tempat</th>
                      <th className="px-4 py-4 border">Uraian / Deskripsi Kegiatan</th>
                      <th className="px-4 py-4 border">Ket</th>
                      <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">Belum ada log catatan kegiatan Pokja IV.</td>
                      </tr>
                    ) : (
                      getFilteredData().map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border font-black text-rose-900">{item.nama}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.jabatan}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{new Date(item.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.tempat}</td>
                          <td className="px-4 py-3 border text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{item.uraian}</td>
                          <td className="px-4 py-3 border text-slate-500">{item.keterangan || '-'}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('kegiatan', item)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('kegiatan', item.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. RENDER BUKU 4 */}
            {activeTab === 'notulen' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                      <th className="px-4 py-4 border w-12 text-center">No</th>
                      <th className="px-4 py-4 border">Waktu & Tanggal</th>
                      <th className="px-4 py-4 border">Tempat</th>
                      <th className="px-4 py-4 border">Jenis Rapat</th>
                      <th className="px-4 py-4 border">Pimpinan / Notulis</th>
                      <th className="px-4 py-4 border text-center">Undangan</th>
                      <th className="px-4 py-4 border text-center">Hadir</th>
                      <th className="px-4 py-4 border text-center">Absen</th>
                      <th className="px-4 py-4 border">Kesimpulan</th>
                      <th className="px-4 py-4 border">Penutup</th>
                      <th className="px-4 py-4 border text-center w-24 print:hidden">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center py-12 text-slate-400 font-medium">Belum ada notulen rapat.</td>
                      </tr>
                    ) : (
                      getFilteredData().map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border">
                            <span className="font-bold text-slate-800 block">{new Date(item.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{item.waktu}</span>
                          </td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.tempat}</td>
                          <td className="px-4 py-3 border font-black text-rose-950">{item.jenisRapat}</td>
                          <td className="px-4 py-3 border">
                            <span className="font-bold text-rose-900 block">{item.pimpinanRapat?.nama || 'Tanpa Pimpinan'}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Notulis: {item.pembuatNotulen?.nama || '-'}</span>
                          </td>
                          <td className="px-4 py-3 border text-center font-bold text-slate-600">{item.jumlahDiundang} org</td>
                          <td className="px-4 py-3 border text-center font-bold text-rose-700 bg-rose-50/30">{item.jumlahHadir} org</td>
                          <td className="px-4 py-3 border text-center font-bold text-rose-700 bg-rose-50/30">{item.jumlahTidakHadir} org</td>
                          <td className="px-4 py-3 border text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">{item.kesimpulan}</td>
                          <td className="px-4 py-3 border text-slate-500 text-[11px]">{item.penutup}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('notulen', item)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('notulen', item.id)} className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}            {/* 5. RENDER TAB e-LAPORAN OTOMATIS */}
            {activeTab === 'laporan' && (
              <div className="p-6">
                {/* Print-Only Professional Header */}
                <div className="hidden print:block text-center border-b-4 double border-slate-900 pb-4 mb-8">
                  <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">TIM PENGGERAK PKK DESA KEDIREN</h2>
                  <h3 className="text-base font-bold uppercase text-slate-700 mt-1">POKJA IV (KESEHATAN, KELESTARIAN LINGKUNGAN, PERENCANAAN SEHAT)</h3>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                    {activeReportSubTab === 'pus' && 'LAPORAN REKAPITULASI PASANGAN USIA SUBUR (PUS)'}
                    {activeReportSubTab === 'wus' && 'LAPORAN REKAPITULASI WANITA USIA SUBUR (WUS)'}
                    {activeReportSubTab === 'balita' && 'REKAPITULASI POSYANDU & PERKEMBANGAN KMS BALITA'}
                    {activeReportSubTab === 'sanitasi' && 'REKAPITULASI CAKUPAN RUMAH & SANITASI DASAR SEHAT'}
                  </h4>
                  {selectedDusunFilter !== 'ALL' && (
                    <p className="text-xs font-bold text-slate-700 mt-2 uppercase">WILAYAH DUSUN: {selectedDusunFilter}</p>
                  )}
                </div>

                {/* Sub-tab Selection */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6 print:hidden">
                  <button
                    onClick={() => { setActiveReportSubTab('pus'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'pus'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Heart size={14} /> Pasangan Usia Subur (PUS)
                  </button>
                  <button
                    onClick={() => { setActiveReportSubTab('wus'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'wus'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Shield size={14} /> Wanita Usia Subur (WUS)
                  </button>
                  <button
                    onClick={() => { setActiveReportSubTab('balita'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'balita'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Award size={14} /> e-KMS & Tumbuh Kembang Balita
                  </button>
                  <button
                    onClick={() => { setActiveReportSubTab('sanitasi'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'sanitasi'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin size={14} /> Sanitasi & Lingkungan Sehat
                  </button>
                </div>

                {/* Print & Filter Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 print:hidden">
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Filter Wilayah Dusun:</span>
                    {(activeReportSubTab === 'pus' || activeReportSubTab === 'wus') ? (
                      <select
                        value={selectedDusunFilter}
                        onChange={(e) => setSelectedDusunFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-44"
                      >
                        <option value="ALL">Semua Dusun (Kediren)</option>
                        {getUniqueDusuns().map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">Filter wilayah tidak berlaku untuk rekap agregat</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setShowPrintPreview(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Printer size={14} /> Cetak Laporan Fisik
                  </button>
                </div>

                {/* Content based on sub-tab */}
                {activeReportSubTab === 'pus' && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-5 rounded-2xl">
                        <span className="text-slate-500 font-bold text-xs uppercase block">Total PUS Terdaftar</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-black text-rose-800">{getFilteredPusData().length}</span>
                          <span className="text-xs text-rose-600 font-bold">Pasangan</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Istri berusia 15-49 tahun & berstatus Kawin.</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl md:col-span-2">
                        <h5 className="font-bold text-slate-800 text-xs uppercase flex items-center gap-1.5"><Info size={14} className="text-rose-500" /> Informasi PUS (Pasangan Usia Subur)</h5>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          Pasangan Usia Subur (PUS) adalah pasangan suami-istri yang istrinya berumur antara 15 sampai dengan 49 tahun. Data ini ditarik secara **otomatis dan real-time** dari database kependudukan berdasarkan Kartu Keluarga (KK). Digunakan sebagai acuan program Keluarga Berencana (KB) sehat.
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden print:border-slate-300">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 print:bg-slate-100 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                            <th className="px-4 py-3 border w-12 text-center">No</th>
                            <th className="px-4 py-3 border">Nama Istri</th>
                            <th className="px-4 py-3 border text-center w-16">Usia</th>
                            <th className="px-4 py-3 border">Nama Suami</th>
                            <th className="px-4 py-3 border">No KK</th>
                            <th className="px-4 py-3 border">Dusun</th>
                            <th className="px-4 py-3 border text-center w-20">RT / RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPusData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">Belum ada warga berstatus PUS terdeteksi di database.</td>
                            </tr>
                          ) : (
                            getFilteredPusData().map((item, idx) => (
                              <tr key={item.wifeNik} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-rose-900 print:text-slate-900">{item.wifeNama}</td>
                                <td className="px-4 py-3 border text-center font-bold text-slate-700 bg-rose-50/30 print:bg-transparent">{item.wifeUsia} th</td>
                                <td className="px-4 py-3 border font-bold text-slate-800">{item.husbandNama}</td>
                                <td className="px-4 py-3 border text-slate-500 font-mono">{item.noKk}</td>
                                <td className="px-4 py-3 border text-slate-600 font-medium">{item.dusun}</td>
                                <td className="px-4 py-3 border text-center text-slate-600 font-bold">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeReportSubTab === 'wus' && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-5 rounded-2xl">
                        <span className="text-slate-500 font-bold text-xs uppercase block">Total WUS Terdaftar</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-black text-rose-800">{getFilteredWusData().length}</span>
                          <span className="text-xs text-rose-600 font-bold">Jiwa</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">Seluruh perempuan berusia 15-49 tahun.</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl md:col-span-2">
                        <h5 className="font-bold text-slate-800 text-xs uppercase flex items-center gap-1.5"><Info size={14} className="text-rose-500" /> Informasi WUS (Wanita Usia Subur)</h5>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          Wanita Usia Subur (WUS) adalah wanita yang keadaan organ reproduksinya berfungsi dengan baik antara umur 15-49 tahun. Baik yang sudah berstatus menikah, belum menikah, janda cerai maupun janda mati. Berguna untuk pelacakan imunisasi TT (Tetanus Toksoid) WUS dan pencegahan anemia sejak dini.
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden print:border-slate-300">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 print:bg-slate-100 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                            <th className="px-4 py-3 border w-12 text-center">No</th>
                            <th className="px-4 py-3 border">Nama Lengkap</th>
                            <th className="px-4 py-3 border text-center w-16">Usia</th>
                            <th className="px-4 py-3 border">Status Perkawinan</th>
                            <th className="px-4 py-3 border">No KK</th>
                            <th className="px-4 py-3 border">Dusun</th>
                            <th className="px-4 py-3 border text-center w-20">RT / RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredWusData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">Belum ada warga berstatus WUS terdeteksi di database.</td>
                            </tr>
                          ) : (
                            getFilteredWusData().map((item, idx) => (
                              <tr key={item.nik} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-rose-900 print:text-slate-900">{item.nama}</td>
                                <td className="px-4 py-3 border text-center font-bold text-slate-700 bg-rose-50/30 print:bg-transparent">{item.usia} th</td>
                                <td className="px-4 py-3 border text-slate-650 font-bold">{item.statusPerkawinan}</td>
                                <td className="px-4 py-3 border text-slate-500 font-mono">{item.noKk}</td>
                                <td className="px-4 py-3 border text-slate-600 font-medium">{item.dusun}</td>
                                <td className="px-4 py-3 border text-center text-slate-600 font-bold">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeReportSubTab === 'balita' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                        <span className="text-slate-400 font-bold text-[10px] uppercase block">Total Balita</span>
                        <span className="text-2xl font-black text-slate-800 block mt-1">{pusWusData.balitaStats.total}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Anak Terdaftar</span>
                      </div>
                      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                        <span className="text-emerald-600 font-bold text-[10px] uppercase block">Gizi Normal</span>
                        <span className="text-2xl font-black text-emerald-700 block mt-1">{pusWusData.balitaStats.normal}</span>
                        <span className="text-[10px] text-emerald-600 font-medium">Tumbuh Optimal</span>
                      </div>
                      <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-center">
                        <span className="text-amber-600 font-bold text-[10px] uppercase block">Gizi Kurang</span>
                        <span className="text-2xl font-black text-amber-700 block mt-1">{pusWusData.balitaStats.giziKurang}</span>
                        <span className="text-[10px] text-amber-500 font-medium">Butuh PMT</span>
                      </div>
                      <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl text-center">
                        <span className="text-red-600 font-bold text-[10px] uppercase block">Gizi Buruk</span>
                        <span className="text-2xl font-black text-red-700 block mt-1">{pusWusData.balitaStats.giziBuruk}</span>
                        <span className="text-[10px] text-red-500 font-medium">Atensi Khusus</span>
                      </div>
                      <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center col-span-2 md:col-span-1">
                        <span className="text-rose-600 font-bold text-[10px] uppercase block">Indikasi Stunting</span>
                        <span className="text-2xl font-black text-rose-700 block mt-1">{pusWusData.balitaStats.stunting}</span>
                        <span className="text-[10px] text-rose-500 font-medium">Tinggi Kurang</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex items-start gap-3 print:hidden">
                      <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs uppercase">Integrasi Digital Posyandu e-KMS</h5>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                          Statistik tumbuh kembang anak di atas merupakan rekapitulasi dinamis dari modul **e-KMS Posyandu Desa Kediren**. Setiap bulan, ketika kader mengukur tinggi badan, berat badan, dan lingkar kepala balita, data akan langsung diproses oleh sistem untuk menilai status gizi (Normal, Kurang, Buruk, Stunting) secara ilmiah menggunakan standar WHO. Sangat akurat dan tidak memerlukan pembukuan manual yang tebal!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeReportSubTab === 'sanitasi' && (
                  <div className="space-y-6">
                    {/* Intro */}
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-5 rounded-2xl flex items-start gap-3.5 print:hidden">
                      <MapPin size={22} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-rose-600 font-bold text-xs uppercase tracking-wider block">Kelestarian Lingkungan Hidup Pokja IV</span>
                        <h4 className="text-slate-800 font-black text-base mt-0.5">Rekapitulasi Cakupan Rumah & Sanitasi Sehat</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                          Data di bawah ini menunjukkan tingkat kepemilikan sarana sanitasi dasar sehat (Jamban Sehat, SPAL, dan Air Bersih Layak) di Desa Kediren. Data ini diperbarui secara dinamis mengikuti jumlah Kartu Keluarga (KK) terdaftar di masing-masing dusun untuk memastikan capaian SDGs Desa tercapai optimal.
                        </p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden print:border-slate-300">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 print:bg-slate-100 text-slate-700 font-bold uppercase border-b text-[10px] tracking-wider">
                            <th className="px-4 py-3 border w-12 text-center">No</th>
                            <th className="px-4 py-3 border">Nama Dusun</th>
                            <th className="px-4 py-3 border text-center w-24 bg-slate-100/50">Total KK</th>
                            <th className="px-4 py-3 border text-center w-32 text-emerald-700">Jamban Sehat</th>
                            <th className="px-4 py-3 border text-center w-32 text-blue-700">Saluran Air (SPAL)</th>
                            <th className="px-4 py-3 border text-center w-32 text-teal-700">Akses Air Bersih</th>
                            <th className="px-4 py-3 border text-center w-32 text-amber-700">Keluarga PHBS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pusWusData.dusunStats && pusWusData.dusunStats.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">Belum ada data dusun terdeteksi.</td>
                            </tr>
                          ) : (
                            pusWusData.dusunStats?.map((item, idx) => (
                              <tr key={item.dusun} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-slate-800 uppercase">{item.dusun}</td>
                                <td className="px-4 py-3 border text-center font-black text-slate-700 bg-slate-100/30">{item.totalKk} KK</td>
                                <td className="px-4 py-3 border text-center text-emerald-700 font-bold bg-emerald-50/20">{item.jambanSehat} KK ({Math.round((item.jambanSehat / item.totalKk) * 100)}%)</td>
                                <td className="px-4 py-3 border text-center text-blue-700 font-bold bg-blue-50/20">{item.spal} KK ({Math.round((item.spal / item.totalKk) * 100)}%)</td>
                                <td className="px-4 py-3 border text-center text-teal-700 font-bold bg-teal-50/20">{item.airBersih} KK ({Math.round((item.airBersih / item.totalKk) * 100)}%)</td>
                                <td className="px-4 py-3 border text-center text-amber-700 font-bold bg-amber-50/20">{item.phbs} KK ({Math.round((item.phbs / item.totalKk) * 100)}%)</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Print-Only Signature Block */}
                <div className="hidden print:block mt-12 grid grid-cols-2 text-center text-xs">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold mt-1">Ketua TP PKK Desa Kediren</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">( ___________________________ )</p>
                  </div>
                  <div>
                    <p>Kediren, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="font-bold mt-1">Kader Pokja IV</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">( ___________________________ )</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-100 overflow-hidden flex flex-col my-8 max-h-[90vh]">
            <div className="bg-gradient-to-r from-rose-700 to-pink-850 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Buku Baku Pokja IV
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
              {/* Buku 1 */}
              {activeTab === 'program' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Program Pokok PKK</label>
                      <select 
                        value={b1ProgramPokok} 
                        onChange={(e) => setB1ProgramPokok(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Kelestarian Lingkungan Hidup">Kelestarian Lingkungan Hidup</option>
                        <option value="Perencanaan Sehat">Perencanaan Sehat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Program Pokja IV</label>
                      <input 
                        type="text"
                        list="datalist-program-pokja4"
                        value={b1ProgramPokja4} 
                        onChange={(e) => setB1ProgramPokja4(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                      <datalist id="datalist-program-pokja4">
                        <option value="GKSTTB (Gerakan Keluarga Sehat Tanggap Tangguh Bencana)" />
                        <option value="Kesehatan & Penurunan Stunting (e-KMS)" />
                        <option value="PHBS (Perilaku Hidup Bersih dan Sehat)" />
                        <option value="LILA & Imunisasi Balita Lengkap" />
                        <option value="Kelestarian Lingkungan Hidup & Sampah" />
                        <option value="Perencanaan Sehat & KB Sejahtera" />
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Kegiatan Utama</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pemeriksaan Balita e-KMS Terintegrasi & Vitamin A"
                      value={b1Kegiatan} 
                      onChange={(e) => setB1Kegiatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sasaran Peserta</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Balita Usia 0-5 Tahun Desa Kediren"
                        value={b1Sasaran} 
                        onChange={(e) => setB1Sasaran(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Lokasi Pelaksanaan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Gedung Posyandu Balita"
                        value={b1Lokasi} 
                        onChange={(e) => setB1Lokasi(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Waktu Pelaksanaan (Pilih Bulan)</label>
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleMonthToggle(m)}
                          className={`p-2 rounded-lg border font-bold text-xs transition ${
                            b1WaktuBulan.includes(m)
                              ? 'bg-rose-600 border-rose-600 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Bulan {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Mitra Kerja Utama</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Puskesmas Lembeyan & Bidan Desa"
                        value={b1Mitra} 
                        onChange={(e) => setB1Mitra(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Indikator Keberhasilan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 100% Balita terdata gizi KMS-nya"
                        value={b1Indikator} 
                        onChange={(e) => setB1Indikator(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Keterangan Tambahan</label>
                    <textarea 
                      placeholder="..."
                      value={b1Keterangan} 
                      onChange={(e) => setB1Keterangan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </>
              )}

              {/* Buku 2 */}
              {activeTab === 'pelaksanaan' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Program Pokok PKK</label>
                      <select 
                        value={b2ProgramPokok} 
                        onChange={(e) => setB2ProgramPokok(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Kelestarian Lingkungan Hidup">Kelestarian Lingkungan Hidup</option>
                        <option value="Perencanaan Sehat">Perencanaan Sehat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Program Pokja IV</label>
                      <input 
                        type="text"
                        list="datalist-program-pokja4"
                        value={b2ProgramPokja4} 
                        onChange={(e) => setB2ProgramPokja4(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kegiatan</label>
                    <input 
                      type="text" 
                      placeholder="Nama kegiatan..."
                      value={b2Kegiatan} 
                      onChange={(e) => setB2Kegiatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tujuan Kegiatan</label>
                    <textarea 
                      placeholder="Jelaskan tujuan spesifik..."
                      value={b2Tujuan} 
                      onChange={(e) => setB2Tujuan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sasaran & Jumlah</label>
                      <input 
                        type="text" 
                        placeholder="..."
                        value={b2Sasaran} 
                        onChange={(e) => setB2Sasaran(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pelaksana Kegiatan</label>
                      <input 
                        type="text" 
                        placeholder="..."
                        value={b2Pelaksana} 
                        onChange={(e) => setB2Pelaksana(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tanggal Pelaksanaan</label>
                      <input 
                        type="date" 
                        value={b2Waktu} 
                        onChange={(e) => setB2Waktu(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Lokasi Rinci</label>
                      <input 
                        type="text" 
                        placeholder="..."
                        value={b2Lokasi} 
                        onChange={(e) => setB2Lokasi(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Output (Hasil Capaian/Jumlah Hadir)</label>
                      <textarea 
                        placeholder="..."
                        value={b2Output} 
                        onChange={(e) => setB2Output(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Outcome (Dampak/Manfaat Jangka Panjang)</label>
                      <textarea 
                        placeholder="..."
                        value={b2Outcome} 
                        onChange={(e) => setB2Outcome(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Monitoring & Evaluasi</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b2Monev} 
                      onChange={(e) => setB2Monev(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Keterangan</label>
                    <input 
                      type="text" 
                      placeholder="Opsional..."
                      value={b2Keterangan} 
                      onChange={(e) => setB2Keterangan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </>
              )}

              {/* Buku 3 */}
              {activeTab === 'kegiatan' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Anggota/Kader</label>
                      <input 
                        type="text" 
                        value={b3Nama} 
                        onChange={(e) => setB3Nama(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jabatan di PKK</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ketua Pokja IV, Anggota Pokja IV"
                        value={b3Jabatan} 
                        onChange={(e) => setB3Jabatan(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tanggal Kegiatan</label>
                      <input 
                        type="date" 
                        value={b3Tanggal} 
                        onChange={(e) => setB3Tanggal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tempat Kegiatan</label>
                      <input 
                        type="text" 
                        placeholder="..."
                        value={b3Tempat} 
                        onChange={(e) => setB3Tempat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Uraian / Deskripsi Lengkap Kegiatan</label>
                    <textarea 
                      placeholder="Tulis jalannya kegiatan..."
                      value={b3Uraian} 
                      onChange={(e) => setB3Uraian(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-32 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Keterangan</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b3Keterangan} 
                      onChange={(e) => setB3Keterangan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </>
              )}

              {/* Buku 4 */}
              {activeTab === 'notulen' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tanggal Rapat</label>
                      <input 
                        type="date" 
                        value={b4Tanggal} 
                        onChange={(e) => setB4Tanggal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Waktu Pelaksanaan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 09:00 - 11:30 WIB"
                        value={b4Waktu} 
                        onChange={(e) => setB4Waktu(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tempat Rapat</label>
                      <input 
                        type="text" 
                        placeholder="..."
                        value={b4Tempat} 
                        onChange={(e) => setB4Tempat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jenis Rapat</label>
                      <input 
                        type="text" 
                        value={b4JenisRapat} 
                        onChange={(e) => setB4JenisRapat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pimpinan Rapat (Kader)</label>
                      <select 
                        value={b4PimpinanId} 
                        onChange={(e) => setB4PimpinanId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">-- Pilih Kader Pimpinan --</option>
                        {kaderList.map(k => (
                          <option key={k.id} value={k.id}>{k.nama} ({k.jabatan})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pembuat Notulen (Notulis)</label>
                      <select 
                        value={b4PembuatId} 
                        onChange={(e) => setB4PembuatId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">-- Pilih Notulis --</option>
                        {kaderList.map(k => (
                          <option key={k.id} value={k.id}>{k.nama} ({k.jabatan})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Diundang</label>
                      <input 
                        type="number" 
                        value={b4Diundang} 
                        onChange={(e) => setB4Diundang(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Hadir</label>
                      <input 
                        type="number" 
                        value={b4Hadir} 
                        onChange={(e) => setB4Hadir(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Tidak Hadir</label>
                      <input 
                        type="number" 
                        value={b4TidakHadir} 
                        onChange={(e) => setB4TidakHadir(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Susunan Acara Rapat</label>
                    <textarea 
                      placeholder="..."
                      value={b4SusunanAcara} 
                      onChange={(e) => setB4SusunanAcara(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kesimpulan Rapat / Butir Keputusan</label>
                    <textarea 
                      placeholder="..."
                      value={b4Kesimpulan} 
                      onChange={(e) => setB4Kesimpulan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-28 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kalimat Penutup Rapat</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b4Penutup} 
                      onChange={(e) => setB4Penutup(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tautan File Dokumentasi</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b4Dokumentasi} 
                      onChange={(e) => setB4Dokumentasi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500"
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
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm"
                >
                  <Save className="w-4 h-4" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PRINT PREVIEW MODAL --- */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col my-8 max-h-[90vh]">
            {/* Toolbar Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-2">
                <Printer size={18} className="text-rose-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-white">Pratinjau Laporan Fisik Pokja IV</h3>
                  <p className="text-[10px] text-slate-400">Pastikan format cetak sesuai kertas A4 sebelum mencetak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Printer size={14} /> Cetak Sekarang
                </button>
                <button 
                  onClick={() => setShowPrintPreview(false)} 
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* A4 Sheet Mockup Container */}
            <div className="p-8 overflow-y-auto bg-slate-200/40 flex justify-center items-start flex-1">
              <div 
                id="report-print-preview-content"
                className="bg-white p-10 sm:p-14 w-full max-w-[21cm] min-h-[29.7cm] shadow-xl border border-slate-350 rounded-sm text-slate-800 text-xs flex flex-col justify-between"
                style={{ fontFamily: 'Times New Roman, Times, serif' }}
              >
                <div>
                  {/* Kop Surat Dinas TP PKK */}
                  <div className="text-center border-b-4 double border-slate-900 pb-3 mb-6">
                    <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-tight">TIM PENGGERAK PKK DESA KEDIREN</h2>
                    <h3 className="text-xs font-bold uppercase text-slate-700 mt-1">POKJA IV (KESEHATAN, KELESTARIAN LINGKUNGAN, PERENCANAAN SEHAT)</h3>
                    <div className="h-0.5 bg-slate-900 my-1"></div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-800 mt-1 underline">
                      {activeReportSubTab === 'pus' && 'LAPORAN REKAPITULASI PASANGAN USIA SUBUR (PUS)'}
                      {activeReportSubTab === 'wus' && 'LAPORAN REKAPITULASI WANITA USIA SUBUR (WUS)'}
                      {activeReportSubTab === 'balita' && 'REKAPITULASI POSYANDU & PERKEMBANGAN KMS BALITA'}
                      {activeReportSubTab === 'sanitasi' && 'REKAPITULASI CAKUPAN RUMAH & SANITASI DASAR SEHAT'}
                    </h4>
                    {selectedDusunFilter !== 'ALL' && (
                      <p className="text-[10px] font-black text-slate-700 mt-1 uppercase">WILAYAH DUSUN: {selectedDusunFilter}</p>
                    )}
                  </div>

                  {/* Print Content based on active tab */}
                  {activeReportSubTab === 'pus' && (
                    <div className="space-y-4">
                      <table className="w-full border-collapse border border-slate-400 text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold uppercase">
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                            <th className="border border-slate-400 px-2 py-1.5">Nama Istri</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-12">Usia</th>
                            <th className="border border-slate-400 px-2 py-1.5">Nama Suami</th>
                            <th className="border border-slate-400 px-2 py-1.5">No KK</th>
                            <th className="border border-slate-400 px-2 py-1.5">Dusun</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-16">RT/RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPusData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-6 text-slate-400">Tidak ada data pasangan usia subur.</td>
                            </tr>
                          ) : (
                            getFilteredPusData().map((item, idx) => (
                              <tr key={item.wifeNik}>
                                <td className="border border-slate-400 px-2 py-1.5 text-center">{idx + 1}</td>
                                <td className="border border-slate-400 px-2 py-1.5 font-bold">{item.wifeNama}</td>
                                <td className="border border-slate-400 px-2 py-1.5 text-center">{item.wifeUsia} th</td>
                                <td className="border border-slate-400 px-2 py-1.5">{item.husbandNama}</td>
                                <td className="border border-slate-400 px-2 py-1.5 font-mono">{item.noKk}</td>
                                <td className="border border-slate-400 px-2 py-1.5">{item.dusun}</td>
                                <td className="border border-slate-400 px-2 py-1.5 text-center">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeReportSubTab === 'wus' && (
                    <div className="space-y-4">
                      <table className="w-full border-collapse border border-slate-400 text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold uppercase">
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                            <th className="border border-slate-400 px-2 py-1.5">Nama Lengkap</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-12">Usia</th>
                            <th className="border border-slate-400 px-2 py-1.5">Status Perkawinan</th>
                            <th className="border border-slate-400 px-2 py-1.5">No KK</th>
                            <th className="border border-slate-400 px-2 py-1.5">Dusun</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-16">RT/RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredWusData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-6 text-slate-400">Tidak ada data wanita usia subur.</td>
                            </tr>
                          ) : (
                            getFilteredWusData().map((item, idx) => (
                              <tr key={item.nik}>
                                <td className="border border-slate-400 px-2 py-1.5 text-center">{idx + 1}</td>
                                <td className="border border-slate-400 px-2 py-1.5 font-bold">{item.nama}</td>
                                <td className="border border-slate-400 px-2 py-1.5 text-center">{item.usia} th</td>
                                <td className="border border-slate-400 px-2 py-1.5">{item.statusPerkawinan}</td>
                                <td className="border border-slate-400 px-2 py-1.5 font-mono">{item.noKk}</td>
                                <td className="border border-slate-400 px-2 py-1.5">{item.dusun}</td>
                                <td className="border border-slate-400 px-2 py-1.5 text-center">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeReportSubTab === 'balita' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-4 border border-slate-300 rounded">
                        <h5 className="font-bold text-center underline uppercase mb-3">RINGKASAN STATUS GIZI BALITA DESA KEDIREN</h5>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="border border-slate-300 p-2">
                            <span className="font-bold block">Total Balita</span>
                            <span className="text-lg font-black">{pusWusData.balitaStats.total} Anak</span>
                          </div>
                          <div className="border border-slate-300 p-2">
                            <span className="font-bold text-emerald-800 block">Status Gizi Normal</span>
                            <span className="text-lg font-black text-emerald-800">{pusWusData.balitaStats.normal} Anak</span>
                          </div>
                          <div className="border border-slate-300 p-2">
                            <span className="font-bold text-amber-800 block">Status Gizi Kurang</span>
                            <span className="text-lg font-black text-amber-800">{pusWusData.balitaStats.giziKurang} Anak</span>
                          </div>
                          <div className="border border-slate-300 p-2">
                            <span className="font-bold text-rose-800 block">Indikasi Stunting</span>
                            <span className="text-lg font-black text-rose-800">{pusWusData.balitaStats.stunting} Anak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeReportSubTab === 'sanitasi' && (
                    <div className="space-y-4">
                      <table className="w-full border-collapse border border-slate-400 text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold uppercase">
                            <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                            <th className="border border-slate-400 px-2 py-1.5">Nama Dusun</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center">Total KK</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center">Jamban Sehat</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center">SPAL Sehat</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center">Air Bersih</th>
                            <th className="border border-slate-400 px-2 py-1.5 text-center">Keluarga PHBS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pusWusData.dusunStats?.map((item, idx) => (
                            <tr key={item.dusun}>
                              <td className="border border-slate-400 px-2 py-1.5 text-center">{idx + 1}</td>
                              <td className="border border-slate-400 px-2 py-1.5 font-bold uppercase">{item.dusun}</td>
                              <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">{item.totalKk} KK</td>
                              <td className="border border-slate-400 px-2 py-1.5 text-center">{item.jambanSehat} KK ({Math.round((item.jambanSehat / item.totalKk) * 100)}%)</td>
                              <td className="border border-slate-400 px-2 py-1.5 text-center">{item.spal} KK ({Math.round((item.spal / item.totalKk) * 100)}%)</td>
                              <td className="border border-slate-400 px-2 py-1.5 text-center">{item.airBersih} KK ({Math.round((item.airBersih / item.totalKk) * 100)}%)</td>
                              <td className="border border-slate-400 px-2 py-1.5 text-center">{item.phbs} KK ({Math.round((item.phbs / item.totalKk) * 100)}%)</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Tanda Tangan Basah */}
                <div className="mt-12 grid grid-cols-2 text-center text-[11px] leading-relaxed">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold mt-1">Ketua TP PKK Desa Kediren</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">( ___________________________ )</p>
                  </div>
                  <div>
                    <p>Kediren, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="font-bold mt-1">Kader Pokja IV</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">( ___________________________ )</p>
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
