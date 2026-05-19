'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, FileText, Calendar, Users, MapPin, Plus, Search, Edit3, Trash2, X, Save, 
  ArrowLeft, CheckSquare, Printer, ChevronRight, Check, AlertCircle, Info, Heart, Shield, Award, GraduationCap, TrendingUp
} from 'lucide-react';
import { 
  getKaderPkkList, seedPkkData,
  getBukuProgramKerjaPokjaIIList, saveBukuProgramKerjaPokjaII, deleteBukuProgramKerjaPokjaII,
  getBukuPelaksanaanPokjaIIList, saveBukuPelaksanaanPokjaII, deleteBukuPelaksanaanPokjaII,
  getBukuKegiatanPokjaIIList, saveBukuKegiatanPokjaII, deleteBukuKegiatanPokjaII,
  getBukuNotulenPokjaIIList, saveBukuNotulenPokjaII, deleteBukuNotulenPokjaII,
  getPokja2ReportData
} from '@/app/actions/pkk';
import Swal from 'sweetalert2';

type TabType = 'program' | 'pelaksanaan' | 'kegiatan' | 'notulen' | 'laporan';

export default function PokjaIIBukuBakuPage() {
  const [activeTab, setActiveTab] = useState<TabType>('program');
  const [loading, setLoading] = useState(true);
  const [kaderList, setKaderList] = useState<any[]>([]);

  // Database lists
  const [programList, setProgramList] = useState<any[]>([]);
  const [pelaksanaanList, setPelaksanaanList] = useState<any[]>([]);
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  const [notulenList, setNotulenList] = useState<any[]>([]);

  // e-Laporan States
  const [reportData, setReportData] = useState<any>({
    anakSekolah: [],
    putusSekolah: [],
    dusunStats: []
  });
  const [activeReportSubTab, setActiveReportSubTab] = useState<'sekolah' | 'putus_sekolah' | 'ekonomi_up2k'>('sekolah');
  const [selectedDusunFilter, setSelectedDusunFilter] = useState<string>('ALL');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // --- FORM STATES ---
  // Buku 1: Program Kerja
  const [b1ProgramPokok, setB1ProgramPokok] = useState('Pendidikan dan Keterampilan');
  const [b1ProgramPokja2, setB1ProgramPokja2] = useState('UP2K (Usaha Peningkatan Pendapatan Keluarga) PKK');
  const [b1Kegiatan, setB1Kegiatan] = useState('');
  const [b1Sasaran, setB1Sasaran] = useState('');
  const [b1Lokasi, setB1Lokasi] = useState('');
  const [b1WaktuBulan, setB1WaktuBulan] = useState<number[]>([]); 
  const [b1Mitra, setB1Mitra] = useState('');
  const [b1Indikator, setB1Indikator] = useState('');
  const [b1Keterangan, setB1Keterangan] = useState('');

  // Buku 2: Pelaksanaan
  const [b2ProgramPokok, setB2ProgramPokok] = useState('Pendidikan dan Keterampilan');
  const [b2ProgramPokja2, setB2ProgramPokja2] = useState('UP2K (Usaha Peningkatan Pendapatan Keluarga) PKK');
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
  const [b4JenisRapat, setB4JenisRapat] = useState('Rapat Pleno Pokja II');
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

      const b1 = await getBukuProgramKerjaPokjaIIList() as any[];
      setProgramList(b1);

      const b2 = await getBukuPelaksanaanPokjaIIList() as any[];
      setPelaksanaanList(b2);

      const b3 = await getBukuKegiatanPokjaIIList() as any[];
      setKegiatanList(b3);

      const b4 = await getBukuNotulenPokjaIIList() as any[];
      setNotulenList(b4);

      const rData = await getPokja2ReportData();
      setReportData(rData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueDusuns = () => {
    const list = new Set<string>();
    reportData.anakSekolah.forEach((item: any) => {
      if (item.dusun) list.add(item.dusun.trim().toUpperCase());
    });
    reportData.putusSekolah.forEach((item: any) => {
      if (item.dusun) list.add(item.dusun.trim().toUpperCase());
    });
    return Array.from(list);
  };

  const getFilteredAnakSekolahData = () => {
    if (selectedDusunFilter === 'ALL') return reportData.anakSekolah;
    return reportData.anakSekolah.filter((item: any) => item.dusun && item.dusun.trim().toUpperCase() === selectedDusunFilter.toUpperCase());
  };

  const getFilteredPutusSekolahData = () => {
    if (selectedDusunFilter === 'ALL') return reportData.putusSekolah;
    return reportData.putusSekolah.filter((item: any) => item.dusun && item.dusun.trim().toUpperCase() === selectedDusunFilter.toUpperCase());
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
            <title>LAPORAN POKJA II - TP PKK KEDIREN</title>
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

  useEffect(() => {
    loadAllData();
  }, []);

  const resetForm = () => {
    setEditId(null);
    // B1
    setB1ProgramPokok('Pendidikan dan Keterampilan');
    setB1ProgramPokja2('UP2K (Usaha Peningkatan Pendapatan Keluarga) PKK');
    setB1Kegiatan('');
    setB1Sasaran('');
    setB1Lokasi('');
    setB1WaktuBulan([]);
    setB1Mitra('');
    setB1Indikator('');
    setB1Keterangan('');

    // B2
    setB2ProgramPokok('Pendidikan dan Keterampilan');
    setB2ProgramPokja2('UP2K (Usaha Peningkatan Pendapatan Keluarga) PKK');
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
    setB4JenisRapat('Rapat Pleno Pokja II');
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
      setB1ProgramPokja2(item.programPokja2);
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
      setB2ProgramPokja2(item.programPokja2);
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
      confirmButtonColor: '#0284c7',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === 'program') await deleteBukuProgramKerjaPokjaII(id);
          else if (type === 'pelaksanaan') await deleteBukuPelaksanaanPokjaII(id);
          else if (type === 'kegiatan') await deleteBukuKegiatanPokjaII(id);
          else if (type === 'notulen') await deleteBukuNotulenPokjaII(id);

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
        formData.append('programPokja2', b1ProgramPokja2);
        formData.append('kegiatan', b1Kegiatan);
        formData.append('sasaran', b1Sasaran);
        formData.append('lokasi', b1Lokasi);
        formData.append('waktuPelaksanaan', JSON.stringify(b1WaktuBulan));
        formData.append('mitra', b1Mitra);
        formData.append('indikatorKeberhasilan', b1Indikator);
        formData.append('keterangan', b1Keterangan);
        await saveBukuProgramKerjaPokjaII(formData);
      } else if (activeTab === 'pelaksanaan') {
        if (!b2Kegiatan || !b2Tujuan || !b2Sasaran || !b2Pelaksana || !b2Waktu || !b2Lokasi || !b2Output || !b2Outcome || !b2Monev) {
          Swal.fire('Gagal', 'Lengkapi seluruh kolom pelaksanaan program kerja!', 'error');
          return;
        }
        formData.append('programPokok', b2ProgramPokok);
        formData.append('programPokja2', b2ProgramPokja2);
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
        await saveBukuPelaksanaanPokjaII(formData);
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
        await saveBukuKegiatanPokjaII(formData);
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
        await saveBukuNotulenPokjaII(formData);
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
          <span className="inline-block w-4 h-4 bg-sky-100 text-sky-700 rounded flex items-center justify-center mx-auto text-[10px] font-black">✓</span>
        ) : '-'}
      </td>
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 to-indigo-850 text-white shadow-lg sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/admin/pkk" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="bg-sky-100/20 text-sky-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Pokja II (Pendidikan & Ekonomi)
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">4 Buku Administrasi Baku</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition text-sm">
              <Printer className="w-4 h-4" /> Cetak Buku
            </button>
            <button onClick={handleOpenAdd} className="bg-white text-sky-800 hover:bg-sky-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition text-sm">
              <Plus className="w-4 h-4" /> Tambah Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Banner */}
        <div className="bg-white border-l-4 border-sky-500 p-4 rounded-r-xl shadow-sm mb-6 flex items-start gap-3 print:hidden">
          <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Buku Administrasi Standar TP PKK Nasional</h4>
            <p className="text-xs text-slate-600 mt-0.5">Sistem pencatatan terpusat program Pendidikan Anak, UP2K, Koperasi, dan Pelatihan keterampilan di Desa Kediren.</p>
          </div>
        </div>

        {/* Tab Menus */}
        <div className="flex overflow-x-auto space-x-2 border-b border-slate-200 pb-3 mb-6 scrollbar-none print:hidden">
          {[
            { id: 'program', label: 'Buku 1: Program Kerja', desc: 'Rencana kerja tahunan Pokja II', icon: BookOpen },
            { id: 'pelaksanaan', label: 'Buku 2: Pelaksanaan Kerja', desc: 'Realisasi & evaluasi program', icon: CheckSquare },
            { id: 'kegiatan', label: 'Buku 3: Log Kegiatan', desc: 'Buku catatan peristiwa khusus', icon: Calendar },
            { id: 'notulen', label: 'Buku 4: Notulen Rapat', desc: 'Hasil pleno & rapat koordinasi', icon: Users },
            { id: 'laporan', label: 'e-Laporan & Buku Bantu', desc: 'Laporan otomatis realtime warga', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(''); }}
                className={`flex-1 min-w-[240px] text-left p-4 rounded-xl border transition ${
                  active 
                    ? 'bg-sky-50/50 border-sky-200 shadow-sm ring-1 ring-sky-500/20' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${active ? 'text-sky-600' : 'text-slate-500'}`} />
                  <span className={`font-black text-sm ${active ? 'text-sky-800' : 'text-slate-800'}`}>{tab.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tab.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Search */}
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

        {/* Loading State */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
                      <th className="px-4 py-4 border">Program Pokja II</th>
                      <th className="px-4 py-4 border">Kegiatan Utama</th>
                      <th className="px-4 py-4 border">Sasaran</th>
                      <th className="px-4 py-4 border">Lokasi</th>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <th key={m} className="px-2 py-4 border text-center bg-sky-50/30 w-8">{m}</th>
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
                        <td colSpan={23} className="text-center py-12 text-slate-400 font-medium">Belum ada rencana program kerja Pokja II.</td>
                      </tr>
                    ) : (
                      getFilteredData().map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border font-black text-slate-800">{item.programPokok}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.programPokja2}</td>
                          <td className="px-4 py-3 border font-semibold text-sky-900">{item.kegiatan}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.sasaran}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.lokasi}</td>
                          {renderMonthCells(item.waktuPelaksanaan)}
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.mitra}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.indikatorKeberhasilan}</td>
                          <td className="px-4 py-3 border text-slate-500">{item.keterangan || '-'}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('program', item)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('program', item.id)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
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
                      <th className="px-4 py-4 border">Program Pokja II</th>
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
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.programPokja2}</td>
                          <td className="px-4 py-3 border font-semibold text-sky-900">{item.kegiatan}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.tujuanKegiatan}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.sasaran}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.pelaksana}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{new Date(item.waktu).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{item.lokasi}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.output}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.outcome}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold text-sky-850">{item.monitoringEvaluasi}</td>
                          <td className="px-4 py-3 border text-slate-500">{item.keterangan || '-'}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('pelaksanaan', item)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('pelaksanaan', item.id)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
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
                        <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">Belum ada log catatan kegiatan Pokja II.</td>
                      </tr>
                    ) : (
                      getFilteredData().map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 border-b transition">
                          <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 border font-black text-sky-900">{item.nama}</td>
                          <td className="px-4 py-3 border text-slate-600 font-medium">{item.jabatan}</td>
                          <td className="px-4 py-3 border text-slate-600 font-semibold">{new Date(item.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</td>
                          <td className="px-4 py-3 border text-slate-600">{item.tempat}</td>
                          <td className="px-4 py-3 border text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{item.uraian}</td>
                          <td className="px-4 py-3 border text-slate-500">{item.keterangan || '-'}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('kegiatan', item)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('kegiatan', item.id)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
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
                        <td colSpan={11} className="text-center py-12 text-slate-400 font-medium">Belum ada buku log notulen rapat.</td>
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
                          <td className="px-4 py-3 border font-black text-sky-950">{item.jenisRapat}</td>
                          <td className="px-4 py-3 border">
                            <span className="font-bold text-sky-900 block">{item.pimpinanRapat?.nama || 'Tanpa Pimpinan'}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Notulis: {item.pembuatNotulen?.nama || '-'}</span>
                          </td>
                          <td className="px-4 py-3 border text-center font-bold text-slate-600">{item.jumlahDiundang} org</td>
                          <td className="px-4 py-3 border text-center font-bold text-emerald-700 bg-emerald-50/30">{item.jumlahHadir} org</td>
                          <td className="px-4 py-3 border text-center font-bold text-rose-700 bg-rose-50/30">{item.jumlahTidakHadir} org</td>
                          <td className="px-4 py-3 border text-slate-600 leading-relaxed font-semibold whitespace-pre-wrap">{item.kesimpulan}</td>
                          <td className="px-4 py-3 border text-slate-500 text-[11px]">{item.penutup}</td>
                          <td className="px-4 py-3 border text-center print:hidden">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button onClick={() => handleEdit('notulen', item)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('notulen', item.id)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. RENDER TAB 5: E-LAPORAN & BUKU BANTU OTOMATIS */}
            {activeTab === 'laporan' && (
              <div className="p-6 space-y-6">
                {/* Kop Dinas Laporan Fisik */}
                <div className="hidden print:block text-center border-b-4 double border-slate-900 pb-4 mb-8">
                  <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">TIM PENGGERAK PKK DESA KEDIREN</h2>
                  <h3 className="text-base font-bold uppercase text-slate-700 mt-1">POKJA II (PENDIDIKAN & EKONOMI KELUARGA)</h3>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                    {activeReportSubTab === 'sekolah' && 'LAPORAN REKAPITULASI DATA ANAK USIA SEKOLAH (6-18 TAHUN)'}
                    {activeReportSubTab === 'putus_sekolah' && 'LAPORAN REKAPITULASI ANAK PUTUS SEKOLAH'}
                    {activeReportSubTab === 'ekonomi_up2k' && 'LAPORAN REKAPITULASI DUSUN - USAHA EKONOMI UP2K & KOPERASI'}
                  </h4>
                  {selectedDusunFilter !== 'ALL' && (
                    <p className="text-xs font-bold text-slate-700 mt-2 uppercase">WILAYAH DUSUN: {selectedDusunFilter}</p>
                  )}
                </div>

                {/* Sub-tab Selection */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6 print:hidden">
                  <button
                    onClick={() => { setActiveReportSubTab('sekolah'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'sekolah'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap size={14} /> Anak Usia Sekolah (6-18)
                  </button>
                  <button
                    onClick={() => { setActiveReportSubTab('putus_sekolah'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'putus_sekolah'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <AlertCircle size={14} /> Anak Putus Sekolah
                  </button>
                  <button
                    onClick={() => { setActiveReportSubTab('ekonomi_up2k'); setSelectedDusunFilter('ALL'); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeReportSubTab === 'ekonomi_up2k'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <TrendingUp size={14} /> UP2K & Koperasi Dusun
                  </button>
                </div>

                {/* Print & Filter Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 print:hidden">
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Filter Wilayah Dusun:</span>
                    {(activeReportSubTab === 'sekolah' || activeReportSubTab === 'putus_sekolah') ? (
                      <select
                        value={selectedDusunFilter}
                        onChange={(e) => setSelectedDusunFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-44"
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
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <Printer size={14} /> Cetak Laporan Fisik
                  </button>
                </div>

                {/* Content based on sub-tab */}
                {activeReportSubTab === 'sekolah' && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                      <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 p-5 rounded-2xl">
                        <span className="text-slate-500 font-bold text-xs uppercase block">Total Anak Usia Sekolah</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-black text-sky-850">{getFilteredAnakSekolahData().length}</span>
                          <span className="text-xs text-sky-600 font-bold">Jiwa</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-emerald-50 border border-slate-200 p-5 rounded-2xl">
                        <span className="text-slate-500 font-bold text-xs uppercase block">Informasi Pokja II (Pendidikan)</span>
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                          Menyajikan daftar warga usia wajib belajar (6 s/d 18 tahun) untuk mengawal program PAUD, Kejar Paket, serta pemenuhan wajib belajar 12 tahun di Desa Kediren.
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
                            <th className="px-4 py-3 border text-center w-24">Usia</th>
                            <th className="px-4 py-3 border text-center w-24">Gender</th>
                            <th className="px-4 py-3 border">Agama</th>
                            <th className="px-4 py-3 border">Dusun</th>
                            <th className="px-4 py-3 border text-center w-24">RT/RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredAnakSekolahData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">Belum ada data anak usia sekolah.</td>
                            </tr>
                          ) : (
                            getFilteredAnakSekolahData().map((item: any, idx: number) => (
                              <tr key={item.nik} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-slate-800">{item.nama}</td>
                                <td className="px-4 py-3 border text-center font-black text-slate-700">{item.usia} Tahun</td>
                                <td className="px-4 py-3 border text-center font-semibold text-slate-600">{item.jenisKelamin}</td>
                                <td className="px-4 py-3 border text-slate-600">{item.agama}</td>
                                <td className="px-4 py-3 border font-bold text-slate-700 uppercase">{item.dusun}</td>
                                <td className="px-4 py-3 border text-center font-mono">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeReportSubTab === 'putus_sekolah' && (
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-5 rounded-2xl">
                        <span className="text-slate-500 font-bold text-xs uppercase block">Total Anak Putus Sekolah</span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-3xl font-black text-rose-800">{getFilteredPutusSekolahData().length}</span>
                          <span className="text-xs text-rose-600 font-bold">Jiwa</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 p-5 rounded-2xl">
                        <span className="text-slate-500 font-bold text-xs uppercase block">Tindakan Pokja II</span>
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                          Data ini mendeteksi anak usia sekolah yang tidak bersekolah di Desa Kediren untuk memprioritaskan pemberian beasiswa, Kejar Paket A/B/C, atau pelatihan kerja.
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
                            <th className="px-4 py-3 border text-center w-24">Usia</th>
                            <th className="px-4 py-3 border text-center w-24">Gender</th>
                            <th className="px-4 py-3 border">Pendidikan Terakhir</th>
                            <th className="px-4 py-3 border">Dusun</th>
                            <th className="px-4 py-3 border text-center w-24">RT/RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPutusSekolahData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">Luar biasa! Tidak terdeteksi anak putus sekolah di wilayah terpilih.</td>
                            </tr>
                          ) : (
                            getFilteredPutusSekolahData().map((item: any, idx: number) => (
                              <tr key={item.nik} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-rose-800">{item.nama}</td>
                                <td className="px-4 py-3 border text-center font-black text-slate-700">{item.usia} Tahun</td>
                                <td className="px-4 py-3 border text-center font-semibold text-slate-600">{item.jenisKelamin}</td>
                                <td className="px-4 py-3 border text-slate-600 font-bold text-rose-600">{item.pendidikan || 'SD/Sederajat'}</td>
                                <td className="px-4 py-3 border font-bold text-slate-700 uppercase">{item.dusun}</td>
                                <td className="px-4 py-3 border text-center font-mono">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeReportSubTab === 'ekonomi_up2k' && (
                  <div className="space-y-6">
                    <div className="bg-white border-l-4 border-sky-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3 print:hidden">
                      <TrendingUp size={22} className="text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sky-600 font-bold text-xs uppercase block">Pokja II - Pemberdayaan Ekonomi</span>
                        <h4 className="text-slate-800 font-black text-base mt-0.5">Rekapitulasi Usaha UP2K & Kehidupan Koperasi Dusun</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          Menampilkan aggregat usaha industri rumah tangga (UP2K) binaan PKK, jumlah koperasi aktif, PAUD binaan, serta taman bacaan per dusun di Kediren.
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
                            <th className="px-4 py-3 border text-center bg-slate-100/50">Total KK</th>
                            <th className="px-4 py-3 border text-center text-sky-700">Industri RT (UP2K)</th>
                            <th className="px-4 py-3 border text-center text-indigo-750">Koperasi Aktif</th>
                            <th className="px-4 py-3 border text-center text-emerald-700">PAUD / Kejar Paket</th>
                            <th className="px-4 py-3 border text-center text-amber-700">Taman Bacaan (TBM)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.dusunStats && reportData.dusunStats.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">Belum ada data dusun terdeteksi.</td>
                            </tr>
                          ) : (
                            reportData.dusunStats?.map((item: any, idx: number) => (
                              <tr key={item.dusun} className="hover:bg-slate-50/50 border-b transition">
                                <td className="px-4 py-3 border text-center font-bold text-slate-500">{idx + 1}</td>
                                <td className="px-4 py-3 border font-black text-slate-800 uppercase">{item.dusun}</td>
                                <td className="px-4 py-3 border text-center font-black text-slate-700 bg-slate-100/30">{item.totalKk} KK</td>
                                <td className="px-4 py-3 border text-center text-sky-700 font-bold bg-sky-50/20">{item.up2kHomeIndustry} Usaha</td>
                                <td className="px-4 py-3 border text-center text-indigo-700 font-bold bg-indigo-50/20">{item.koperasiActive} Unit</td>
                                <td className="px-4 py-3 border text-center text-emerald-700 font-bold bg-emerald-50/20">{item.paudActive} Lembaga</td>
                                <td className="px-4 py-3 border text-center text-amber-700 font-bold bg-amber-50/20">{item.tbmActive} Unit</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- FORM MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-100 overflow-hidden flex flex-col my-8 max-h-[90vh]">
            <div className="bg-gradient-to-r from-sky-700 to-indigo-850 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 px-2 py-0.5 rounded">
                  Buku Baku Pokja II
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Pendidikan dan Keterampilan">Pendidikan dan Keterampilan</option>
                        <option value="Pengembangan Kehidupan Koperasi">Pengembangan Kehidupan Koperasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Program Pokja II</label>
                      <input 
                        type="text"
                        list="datalist-program-pokja2"
                        value={b1ProgramPokja2} 
                        onChange={(e) => setB1ProgramPokja2(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                      <datalist id="datalist-program-pokja2">
                        <option value="Pendidikan Anak Usia Dini (PAUD)" />
                        <option value="Taman Bacaan Masyarakat (TBM)" />
                        <option value="UP2K (Usaha Peningkatan Pendapatan Keluarga) PKK" />
                        <option value="Koperasi PKK / Toko PKK" />
                        <option value="Pelatihan Keterampilan Tangan" />
                        <option value="Bina Keluarga Balita (BKB)" />
                        <option value="Keaksaraan Fungsional (KF)" />
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Kegiatan Utama</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sosialisasi Manajemen Usaha UP2K Kader"
                      value={b1Kegiatan} 
                      onChange={(e) => setB1Kegiatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sasaran Peserta</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pelaku Usaha Mikro RT, Kader Posyandu"
                        value={b1Sasaran} 
                        onChange={(e) => setB1Sasaran(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Lokasi Pelaksanaan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ruang Rapat Balai Desa"
                        value={b1Lokasi} 
                        onChange={(e) => setB1Lokasi(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                              ? 'bg-sky-600 border-sky-600 text-white'
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
                        placeholder="e.g. Dinas Koperasi dan UMKM Magetan"
                        value={b1Mitra} 
                        onChange={(e) => setB1Mitra(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Indikator Keberhasilan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Terbentuknya 3 unit usaha UP2K baru berizin NIB"
                        value={b1Indikator} 
                        onChange={(e) => setB1Indikator(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Keterangan Tambahan</label>
                    <textarea 
                      placeholder="Catatan opsional..."
                      value={b1Keterangan} 
                      onChange={(e) => setB1Keterangan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Pendidikan dan Keterampilan">Pendidikan dan Keterampilan</option>
                        <option value="Pengembangan Kehidupan Koperasi">Pengembangan Kehidupan Koperasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Program Pokja II</label>
                      <input 
                        type="text"
                        list="datalist-program-pokja2"
                        value={b2ProgramPokja2} 
                        onChange={(e) => setB2ProgramPokja2(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tujuan Kegiatan</label>
                    <textarea 
                      placeholder="Jelaskan tujuan spesifik..."
                      value={b2Tujuan} 
                      onChange={(e) => setB2Tujuan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sasaran & Jumlah</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 15 pelaku usaha UP2K"
                        value={b2Sasaran} 
                        onChange={(e) => setB2Sasaran(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pelaksana Kegiatan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pokja II & Dinas Koperasi"
                        value={b2Pelaksana} 
                        onChange={(e) => setB2Pelaksana(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Lokasi Rinci</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Aula UP2K Kediren"
                        value={b2Lokasi} 
                        onChange={(e) => setB2Lokasi(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Outcome (Dampak/Manfaat Jangka Panjang)</label>
                      <textarea 
                        placeholder="..."
                        value={b2Outcome} 
                        onChange={(e) => setB2Outcome(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-sky-500"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Keterangan</label>
                    <input 
                      type="text" 
                      placeholder="Opsional..."
                      value={b2Keterangan} 
                      onChange={(e) => setB2Keterangan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jabatan di PKK</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ketua Pokja II, Anggota Pokja II"
                        value={b3Jabatan} 
                        onChange={(e) => setB3Jabatan(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tempat Kegiatan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pos PAUD Mentari"
                        value={b3Tempat} 
                        onChange={(e) => setB3Tempat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Uraian / Deskripsi Lengkap Kegiatan</label>
                    <textarea 
                      placeholder="Tulis jalannya kegiatan..."
                      value={b3Uraian} 
                      onChange={(e) => setB3Uraian(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-32 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Keterangan</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b3Keterangan} 
                      onChange={(e) => setB3Keterangan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Waktu Pelaksanaan</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 08:30 - 11:00 WIB"
                        value={b4Waktu} 
                        onChange={(e) => setB4Waktu(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tempat Rapat</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Balai Desa Kediren"
                        value={b4Tempat} 
                        onChange={(e) => setB4Tempat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Pimpinan Rapat (Kader)</label>
                      <select 
                        value={b4PimpinanId} 
                        onChange={(e) => setB4PimpinanId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Hadir</label>
                      <input 
                        type="number" 
                        value={b4Hadir} 
                        onChange={(e) => setB4Hadir(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Jumlah Tidak Hadir</label>
                      <input 
                        type="number" 
                        value={b4TidakHadir} 
                        onChange={(e) => setB4TidakHadir(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Susunan Acara Rapat</label>
                    <textarea 
                      placeholder="..."
                      value={b4SusunanAcara} 
                      onChange={(e) => setB4SusunanAcara(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-20 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kesimpulan Rapat / Butir Keputusan</label>
                    <textarea 
                      placeholder="..."
                      value={b4Kesimpulan} 
                      onChange={(e) => setB4Kesimpulan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 h-28 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kalimat Penutup Rapat</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b4Penutup} 
                      onChange={(e) => setB4Penutup(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tautan File Dokumentasi</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={b4Dokumentasi} 
                      onChange={(e) => setB4Dokumentasi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
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
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm"
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
                <span className="text-[10px] uppercase font-bold tracking-wider bg-sky-50/20 text-sky-300 px-2.5 py-1 rounded-full">
                  Pratinjau Cetak Fisik A4
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1.5 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-sky-500" /> Dokumen Laporan Pokja II
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" /> Cetak Sekarang
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Paper Viewport Wrapper */}
            <div className="flex-1 overflow-y-auto bg-slate-900 p-8 flex justify-center">
              {/* The "A4 Page" */}
              <div 
                id="report-print-preview-content"
                className="bg-white text-black p-[2.5cm] shadow-2xl relative select-none w-[21cm] min-h-[29.7cm] flex flex-col justify-between"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                <div>
                  {/* Kop Dinas PKK Kediren */}
                  <div className="text-center border-b-4 double border-slate-900 pb-3 mb-6">
                    <h2 className="text-lg font-bold uppercase text-slate-900 tracking-wide">PEMBERDAYAAN DAN KESEJAHTERAAN KELUARGA</h2>
                    <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-0.5">TIM PENGGERAK PKK DESA KEDIREN</h2>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Kecamatan Lembeyan, Kabupaten Magetan, Provinsi Jawa Timur</p>
                    <div className="border-t border-slate-400 my-1"></div>
                    <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wide mt-2">
                      REKAPITULASI DOKUMEN LAPORAN & BUKU BANTU - POKJA II
                    </h3>
                    <h4 className="text-xs font-bold uppercase text-sky-850 tracking-widest mt-1">
                      {activeReportSubTab === 'sekolah' && 'DATA REKAPITULASI WARGA USIA WAJIB BELAJAR (6-18 TAHUN)'}
                      {activeReportSubTab === 'putus_sekolah' && 'DATA REKAPITULASI WARGA PUTUS SEKOLAH'}
                      {activeReportSubTab === 'ekonomi_up2k' && 'REKAPITULASI PEMBERDAYAAN UP2K & EKONOMI DUSUN'}
                    </h4>
                    {selectedDusunFilter !== 'ALL' && (
                      <p className="text-[10px] font-bold text-slate-700 mt-1 uppercase">WILAYAH DUSUN: {selectedDusunFilter}</p>
                    )}
                  </div>

                  {/* Dynamic Table inside A4 Document */}
                  {activeReportSubTab === 'sekolah' && (
                    <div className="space-y-4">
                      <table className="w-full text-left border-collapse text-[11px] border border-slate-400">
                        <thead>
                          <tr className="bg-slate-100 font-bold uppercase border-b border-slate-400 text-[10px]">
                            <th className="px-3 py-2 border border-slate-400 text-center w-8">No</th>
                            <th className="px-3 py-2 border border-slate-400">Nama Lengkap Anak</th>
                            <th className="px-3 py-2 border border-slate-400 text-center w-16">Usia</th>
                            <th className="px-3 py-2 border border-slate-400 text-center w-16">Gender</th>
                            <th className="px-3 py-2 border border-slate-400">Agama</th>
                            <th className="px-3 py-2 border border-slate-400">Dusun</th>
                            <th className="px-3 py-2 border border-slate-400 text-center w-16">RT / RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredAnakSekolahData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-6">Belum ada data warga usia sekolah.</td>
                            </tr>
                          ) : (
                            getFilteredAnakSekolahData().map((item: any, idx: number) => (
                              <tr key={item.nik} className="border-b border-slate-400">
                                <td className="px-3 py-2 border border-slate-400 text-center">{idx + 1}</td>
                                <td className="px-3 py-2 border border-slate-400 font-bold uppercase">{item.nama}</td>
                                <td className="px-3 py-2 border border-slate-400 text-center">{item.usia} Thn</td>
                                <td className="px-3 py-2 border border-slate-400 text-center">{item.jenisKelamin}</td>
                                <td className="px-3 py-2 border border-slate-400">{item.agama}</td>
                                <td className="px-3 py-2 border border-slate-400 uppercase font-semibold">{item.dusun}</td>
                                <td className="px-3 py-2 border border-slate-400 text-center font-mono">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeReportSubTab === 'putus_sekolah' && (
                    <div className="space-y-4">
                      <table className="w-full text-left border-collapse text-[11px] border border-slate-400">
                        <thead>
                          <tr className="bg-slate-100 font-bold uppercase border-b border-slate-400 text-[10px]">
                            <th className="px-3 py-2 border border-slate-400 text-center w-8">No</th>
                            <th className="px-3 py-2 border border-slate-400">Nama Lengkap</th>
                            <th className="px-3 py-2 border border-slate-400 text-center w-16">Usia</th>
                            <th className="px-3 py-2 border border-slate-400 text-center w-16">Gender</th>
                            <th className="px-3 py-2 border border-slate-400">Pendidikan Terakhir</th>
                            <th className="px-3 py-2 border border-slate-400">Dusun</th>
                            <th className="px-3 py-2 border border-slate-400 text-center w-16">RT / RW</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPutusSekolahData().length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-6">Tidak terdeteksi anak putus sekolah di wilayah ini.</td>
                            </tr>
                          ) : (
                            getFilteredPutusSekolahData().map((item: any, idx: number) => (
                              <tr key={item.nik} className="border-b border-slate-400">
                                <td className="px-3 py-2 border border-slate-400 text-center">{idx + 1}</td>
                                <td className="px-3 py-2 border border-slate-400 font-bold uppercase text-rose-800">{item.nama}</td>
                                <td className="px-3 py-2 border border-slate-400 text-center">{item.usia} Thn</td>
                                <td className="px-3 py-2 border border-slate-400 text-center">{item.jenisKelamin}</td>
                                <td className="px-3 py-2 border border-slate-400 font-bold text-rose-600">{item.pendidikan || 'SD/Sederajat'}</td>
                                <td className="px-3 py-2 border border-slate-400 uppercase font-semibold">{item.dusun}</td>
                                <td className="px-3 py-2 border border-slate-400 text-center font-mono">{item.rt} / {item.rw}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeReportSubTab === 'ekonomi_up2k' && (
                    <div className="space-y-4">
                      <table className="w-full text-left border-collapse text-[11px] border border-slate-400">
                        <thead>
                          <tr className="bg-slate-100 font-bold uppercase border-b border-slate-400 text-[10px]">
                            <th className="px-3 py-2 border border-slate-400 text-center w-8">No</th>
                            <th className="px-3 py-2 border border-slate-400">Nama Wilayah Dusun</th>
                            <th className="px-3 py-2 border border-slate-400 text-center">Total KK</th>
                            <th className="px-3 py-2 border border-slate-400 text-center">Industri RT (UP2K)</th>
                            <th className="px-3 py-2 border border-slate-400 text-center">Koperasi Binaan</th>
                            <th className="px-3 py-2 border border-slate-400 text-center">Lembaga PAUD</th>
                            <th className="px-3 py-2 border border-slate-400 text-center">Taman Bacaan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.dusunStats?.map((item: any, idx: number) => (
                            <tr key={item.dusun} className="border-b border-slate-400">
                              <td className="px-3 py-2 border border-slate-400 text-center">{idx + 1}</td>
                              <td className="px-3 py-2 border border-slate-400 font-bold uppercase">{item.dusun}</td>
                              <td className="px-3 py-2 border border-slate-400 text-center font-bold">{item.totalKk} KK</td>
                              <td className="px-3 py-2 border border-slate-400 text-center font-semibold">{item.up2kHomeIndustry} Usaha</td>
                              <td className="px-3 py-2 border border-slate-400 text-center font-semibold">{item.koperasiActive} Unit</td>
                              <td className="px-3 py-2 border border-slate-400 text-center font-semibold">{item.paudActive} Lembaga</td>
                              <td className="px-3 py-2 border border-slate-400 text-center font-semibold">{item.tbmActive} Unit</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Wet Signatures block */}
                <div className="grid grid-cols-2 gap-4 mt-12 text-xs text-slate-800">
                  <div className="text-center">
                    <p>Mengetahui,</p>
                    <p className="font-bold uppercase mt-1">Ketua TP PKK Desa Kediren</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline uppercase">NY. SRI WAHYUNI</p>
                    <p className="text-[10px] text-slate-500">NIP. P-2026051901</p>
                  </div>
                  <div className="text-center">
                    <p>Kediren, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="font-bold uppercase mt-1">Kader Utama Pokja II</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline uppercase">NY. SUWARNI</p>
                    <p className="text-[10px] text-slate-500">Reg. ID: P2-2026051907</p>
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
