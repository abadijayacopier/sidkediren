'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Activity, FileText, Plus, Calendar, MapPin, Search, ChevronRight, Scale, Baby, Stethoscope, Save, Trash2, X, ShieldCheck, CheckCircle2, UserCheck, Clock, Users, Link as LinkIcon, Edit, Printer } from 'lucide-react';
import { getJadwalPosyandu, getBalitaKmsList, seedPkkData, saveBalita, deleteBalita, getPosyanduList, getKaderPkkList, saveJadwal, deleteJadwal, getWargaBalitaList, savePengukuran, deletePengukuran } from '@/app/actions/pkk';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function PosyanduDashboard() {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'balita'>('jadwal');
  const [jadwalPosyandu, setJadwalPosyandu] = useState<any[]>([]);
  const [dataBalita, setDataBalita] = useState<any[]>([]);
  const [posyanduList, setPosyanduList] = useState<any[]>([]);
  const [kaderList, setKaderList] = useState<any[]>([]);
  const [wargaBalitaList, setWargaBalitaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dusunFilter, setDusunFilter] = useState('Semua Dusun');

  // Modal State Tambah Balita & Sinkronisasi
  const [showModal, setShowModal] = useState(false);
  const [isAutoWarga, setIsAutoWarga] = useState(true); // Default true untuk menyinkronkan data kependudukan
  const [selectedWargaNik, setSelectedWargaNik] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formIbu, setFormIbu] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formUsia, setFormUsia] = useState('');
  const [formBb, setFormBb] = useState('');
  const [formTb, setFormTb] = useState('');
  const [formPosyandu, setFormPosyandu] = useState('');

  // Modal State Tambah Jadwal (NEW)
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [formPosyanduJadwal, setFormPosyanduJadwal] = useState('');
  const [formKaderJadwal, setFormKaderJadwal] = useState('');
  const [formTanggalJadwal, setFormTanggalJadwal] = useState('');
  const [formWaktuJadwal, setFormWaktuJadwal] = useState('');
  const [formSasaranJadwal, setFormSasaranJadwal] = useState('');

  // Imunisasi & Vitamin State
  const [selectedVaksin, setSelectedVaksin] = useState<string[]>([]);
  const [hasVitaminA, setHasVitaminA] = useState(false);
  const [hasObatCacing, setHasObatCacing] = useState(false);
  const [hasPmt, setHasPmt] = useState(false);

  // Modal Detail KMS State
  const [selectedBalitaKms, setSelectedBalitaKms] = useState<any | null>(null);
  const [kmsChartTab, setKmsChartTab] = useState<'bb' | 'tb'>('bb');
  
  // State Input Timbang Bulanan Baru
  const [editPengukuranId, setEditPengukuranId] = useState<number | null>(null);
  const [inputTanggalUkur, setInputTanggalUkur] = useState(new Date().toISOString().split('T')[0]);
  const [inputUsiaBulan, setInputUsiaBulan] = useState('');
  const [inputBeratBadan, setInputBeratBadan] = useState('');
  const [inputTinggiBadan, setInputTinggiBadan] = useState('');
  const [inputKeterangan, setInputKeterangan] = useState('');
  const [inputPetugas, setInputPetugas] = useState('Kader Posyandu');

  const loadData = async () => {
    setLoading(true);
    try {
      await seedPkkData();
      const [jadwalRes, balitaRes, posyanduRes, kaderRes, wargaBalitaRes] = await Promise.all([
        getJadwalPosyandu(),
        getBalitaKmsList(),
        getPosyanduList(),
        getKaderPkkList(),
        getWargaBalitaList()
      ]);
      
      setJadwalPosyandu((jadwalRes as any[]) || []);
      setDataBalita((balitaRes as any[]) || []);
      setPosyanduList((posyanduRes as any[]) || []);
      setKaderList((kaderRes as any[]) || []);
      setWargaBalitaList((wargaBalitaRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load Posyandu data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBalitaKms) {
      document.body.classList.add('modal-kms-open');
    } else {
      document.body.classList.remove('modal-kms-open');
    }
    return () => {
      document.body.classList.remove('modal-kms-open');
    };
  }, [selectedBalitaKms]);

  // Fungsi saat kader memilih Warga Balita (Auto-Populate dan Lock Data)
  const handleSelectWarga = (nik: string) => {
    setSelectedWargaNik(nik);
    if (!nik) {
      setFormNama('');
      setFormIbu('');
      setFormUsia('');
      setFormGender('L');
      setFormPosyandu('');
      return;
    }

    const warga = wargaBalitaList.find(w => w.nik === nik);
    if (warga) {
      setFormNama(warga.namaLengkap);
      setFormIbu(warga.namaIbu || 'Ibu Kandung');
      setFormGender(warga.jenisKelamin === 'P' ? 'P' : 'L');

      // Hitung Usia (Bulan) otomatis berdasarkan tanggal lahir warga
      const lahir = new Date(warga.tanggalLahir);
      const hariIni = new Date();
      const diffTime = Math.abs(hariIni.getTime() - lahir.getTime());
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));
      setFormUsia(String(diffMonths));

      // Auto-Select Posyandu berdasarkan Dusun Warga kependudukan!
      const dusun = (warga.keluarga?.dusun || '').toLowerCase();
      let matchPosyandu = '';
      if (dusun.includes('ngujung')) {
        const found = posyanduList.find(p => p.nama.toLowerCase().includes('kenanga'));
        if (found) matchPosyandu = String(found.id);
      } else if (dusun.includes('krajan')) {
        const found = posyanduList.find(p => p.nama.toLowerCase().includes('mawar'));
        if (found) matchPosyandu = String(found.id);
      } else if (dusun.includes('pule')) {
        const found = posyanduList.find(p => p.nama.toLowerCase().includes('melati'));
        if (found) matchPosyandu = String(found.id);
      }
      setFormPosyandu(matchPosyandu);
    }
  };

  // Hitung Status Gizi Dinamis (Real-time di Client dengan Diferensiasi Gender WHO)
  const calculateNutritionalStatus = (usia: number, bb: number, tb: number, gender: 'L' | 'P' = 'L') => {
    if (!usia || !bb || !tb) return { status: 'Masukkan data...', color: 'text-slate-400', isStunted: false, statusTb: 'Normal', idealBb: 3.2, idealTb: 49.0, sdDown: 2.8, sdUp: 4.5, tbSdDown: 47.0 };

    // 1. Z-Score Berat Badan menurut Umur (BB/U)
    // Interpolasi Median WHO (0-60 Bulan)
    let idealBb = 3.2;
    let sdDown = 2.8;
    let sdUp = 4.5;

    if (gender === 'L') {
      idealBb = 3.3 + (usia * 0.28);
      sdDown = idealBb - (usia * 0.12) - 0.9;
      sdUp = idealBb + (usia * 0.15) + 1.8;
    } else { // Perempuan
      idealBb = 3.2 + (usia * 0.26);
      sdDown = idealBb - (usia * 0.11) - 0.8;
      sdUp = idealBb + (usia * 0.14) + 1.6;
    }

    const sdSevereDown = sdDown - 1.1;

    let status = 'Normal';
    let color = 'bg-emerald-50 text-emerald-600 border-emerald-200';

    if (bb < sdSevereDown) {
      status = 'Gizi Buruk';
      color = 'bg-rose-50 text-rose-600 border-rose-200';
    } else if (bb < sdDown) {
      status = 'Gizi Kurang';
      color = 'bg-amber-50 text-amber-600 border-amber-200';
    } else if (bb > sdUp) {
      status = 'Obesitas';
      color = 'bg-red-50 text-red-600 border-red-200';
    }

    // 2. Z-Score Tinggi Badan menurut Umur (TB/U - Stunting)
    let idealTb = 49.0;
    let tbSdDown = 47.0;
    let tbSdSevereDown = 45.0;

    if (gender === 'L') {
      idealTb = 49.9 + (usia * 1.05);
      tbSdDown = idealTb - (usia * 0.25) - 3.2;
      tbSdSevereDown = tbSdDown - 2.0;
    } else { // Perempuan
      idealTb = 49.1 + (usia * 1.02);
      tbSdDown = idealTb - (usia * 0.24) - 3.0;
      tbSdSevereDown = tbSdDown - 1.8;
    }

    let statusTb = 'Normal';
    const isStunted = tb < tbSdDown;
    const isSeverelyStunted = tb < tbSdSevereDown;

    if (isSeverelyStunted) {
      statusTb = 'Sangat Pendek';
    } else if (isStunted) {
      statusTb = 'Pendek (Stunting)';
    }

    if (isStunted) {
      status = status === 'Normal' ? 'Stunting' : `${status} & Stunting`;
      if (status.includes('Stunting')) color = 'bg-purple-50 text-purple-600 border-purple-200';
    }

    return { status, color, isStunted, statusTb, idealBb, idealTb, sdDown, sdUp, tbSdDown };
  };

  const currentGizi = calculateNutritionalStatus(Number(formUsia), Number(formBb), Number(formTb), formGender);

  const handleVaksinToggle = (vaksin: string) => {
    setSelectedVaksin(prev => 
      prev.includes(vaksin) ? prev.filter(v => v !== vaksin) : [...prev, vaksin]
    );
  };

  const handleSubmitBalita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formIbu || !formPosyandu) {
      Swal.fire('Oops!', 'Mohon lengkapi nama balita, nama ibu, dan pilih Posyandu.', 'warning');
      return;
    }

    Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const formData = new FormData();
      formData.append('nama', formNama);
      formData.append('namaIbu', formIbu);
      formData.append('jenisKelamin', formGender);
      formData.append('usiaBulan', formUsia);
      formData.append('beratBadan', formBb);
      formData.append('tinggiBadan', formTb);
      formData.append('posyanduId', formPosyandu);

      // Gabungkan status gizi dasar dengan data imunisasi/vitamin
      let finalStatusGizi = currentGizi.status;
      const tambahan: string[] = [];
      if (selectedVaksin.length > 0) tambahan.push(`Vaksin: ${selectedVaksin.join(', ')}`);
      if (hasVitaminA) tambahan.push('Vit A');
      if (hasObatCacing) tambahan.push('Obat Cacing');
      if (hasPmt) tambahan.push('PMT Nutrisi');

      if (tambahan.length > 0) {
        finalStatusGizi = `${finalStatusGizi} [${tambahan.join(' | ')}]`;
      }

      formData.append('statusGizi', finalStatusGizi);

      await saveBalita(formData);
      
      Swal.fire({ icon: 'success', title: 'Data Balita Tersimpan!', showConfirmButton: false, timer: 1500 });
      setShowModal(false);
      
      // Reset Form
      setFormNama(''); setFormIbu(''); setFormUsia(''); setFormBb(''); setFormTb(''); setFormGender('L');
      setSelectedVaksin([]); setHasVitaminA(false); setHasObatCacing(false); setHasPmt(false);
      
      loadData();
    } catch (err: any) {
      Swal.fire('Gagal', err.message, 'error');
    }
  };

  const handleSubmitJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPosyanduJadwal || !formKaderJadwal || !formTanggalJadwal || !formWaktuJadwal || !formSasaranJadwal) {
      Swal.fire('Oops!', 'Mohon lengkapi seluruh formulir jadwal.', 'warning');
      return;
    }

    Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const formData = new FormData();
      formData.append('posyanduId', formPosyanduJadwal);
      formData.append('kaderId', formKaderJadwal);
      formData.append('tanggal', formTanggalJadwal);
      formData.append('waktu', formWaktuJadwal);
      formData.append('sasaran', formSasaranJadwal);

      await saveJadwal(formData);
      
      Swal.fire({ icon: 'success', title: 'Jadwal Posyandu Ditambahkan!', showConfirmButton: false, timer: 1500 });
      setShowJadwalModal(false);
      
      // Reset Form
      setFormPosyanduJadwal(''); setFormKaderJadwal(''); setFormTanggalJadwal(''); setFormWaktuJadwal(''); setFormSasaranJadwal('');
      
      loadData();
    } catch (err: any) {
      Swal.fire('Gagal', err.message, 'error');
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus data?',
      text: "Data KMS balita ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });
        await deleteBalita(id);
        Swal.fire('Terhapus!', '', 'success');
        loadData();
      }
    });
  };

  const handleDeleteJadwal = (id: number) => {
    Swal.fire({
      title: 'Hapus Jadwal?',
      text: "Agenda Posyandu ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });
        await deleteJadwal(id);
        Swal.fire('Terhapus!', '', 'success');
        loadData();
      }
    });
  };

  const resetPengukuranForm = () => {
    setEditPengukuranId(null);
    setInputUsiaBulan('');
    setInputBeratBadan('');
    setInputTinggiBadan('');
    setInputKeterangan('');
    setInputTanggalUkur(new Date().toISOString().split('T')[0]);
  };

  const handleEditPengukuran = (pengukuran: any) => {
    setEditPengukuranId(pengukuran.id);
    setInputUsiaBulan(String(pengukuran.usiaBulan));
    setInputBeratBadan(String(pengukuran.beratBadan));
    setInputTinggiBadan(String(pengukuran.tinggiBadan));
    setInputKeterangan(pengukuran.keterangan || '');
    setInputPetugas(pengukuran.petugas || 'Kader Posyandu');
    if (pengukuran.tanggalUkur) {
      setInputTanggalUkur(new Date(pengukuran.tanggalUkur).toISOString().split('T')[0]);
    }
  };

  const handleSubmitPengukuran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBalitaKms || !inputUsiaBulan || !inputBeratBadan || !inputTinggiBadan) {
      Swal.fire('Oops!', 'Mohon lengkapi usia, berat, dan tinggi badan.', 'warning');
      return;
    }

    Swal.fire({ title: 'Menyimpan Pengukuran...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const parsedGizi = calculateNutritionalStatus(
        Number(inputUsiaBulan),
        Number(inputBeratBadan),
        Number(inputTinggiBadan),
        selectedBalitaKms.jenisKelamin
      );

      const formData = new FormData();
      if (editPengukuranId) formData.append('id', String(editPengukuranId));
      formData.append('balitaId', String(selectedBalitaKms.id));
      formData.append('usiaBulan', inputUsiaBulan);
      formData.append('beratBadan', inputBeratBadan);
      formData.append('tinggiBadan', inputTinggiBadan);
      formData.append('statusGizi', parsedGizi.status);
      formData.append('keterangan', inputKeterangan);
      formData.append('petugas', inputPetugas);
      formData.append('tanggalUkur', inputTanggalUkur);

      await savePengukuran(formData);

      Swal.fire({ icon: 'success', title: editPengukuranId ? 'Data Berhasil Diperbarui!' : 'Data Timbangan Berhasil Dicatat!', showConfirmButton: false, timer: 1500 });
      
      resetPengukuranForm();

      // Refresh data di dashboard, lalu buka ulang detail KMS dengan data ter-update
      const updatedList = await getBalitaKmsList();
      setDataBalita((updatedList as any[]) || []);
      const matched = (updatedList as any[]).find(b => b.id === selectedBalitaKms.id);
      if (matched) setSelectedBalitaKms(matched);
    } catch (err: any) {
      Swal.fire('Gagal', err.message, 'error');
    }
  };

  const handleDeletePengukuran = (id: number) => {
    Swal.fire({
      title: 'Hapus riwayat timbang?',
      text: "Data penimbangan bulan ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });
        try {
          await deletePengukuran(id, selectedBalitaKms.id);
          Swal.fire('Terhapus!', '', 'success');
          
          // Refresh list
          const updatedList = await getBalitaKmsList();
          setDataBalita((updatedList as any[]) || []);
          const matched = (updatedList as any[]).find(b => b.id === selectedBalitaKms.id);
          if (matched) setSelectedBalitaKms(matched);
        } catch (err: any) {
          Swal.fire('Gagal', err.message, 'error');
        }
      }
    });
  };

  // Generate Data Pertumbuhan KMS Historis untuk Recharts (Dinamis & Gender-Aware)
  const generateChartData = (balita: any, type: 'bb' | 'tb' = 'bb') => {
    if (!balita) return [];
    
    // Gunakan riwayat pengukuran asli dari DB jika ada, jika tidak pakai data pendaftaran awal
    const riwayat = balita.pengukuran && balita.pengukuran.length > 0
      ? balita.pengukuran
      : [{
          usiaBulan: balita.usiaBulan,
          beratBadan: balita.beratBadan,
          tinggiBadan: balita.tinggiBadan,
          statusGizi: balita.statusGizi,
          keterangan: 'Pendaftaran Awal',
          tanggalUkur: new Date()
        }];

    // Urutkan riwayat berdasarkan usiaBulan
    const sortedRiwayat = [...riwayat].sort((a, b) => a.usiaBulan - b.usiaBulan);
    
    // Tentukan target plotting (maksimal usiaBulan saat ini atau 24/36)
    const maxUsia = Math.max(24, Math.max(...sortedRiwayat.map(r => r.usiaBulan)));
    const chartData: any[] = [];

    // Buat grid usia WHO standar
    const steps: number[] = [];
    for (let i = 0; i <= maxUsia; i += (maxUsia <= 24 ? 2 : 4)) {
      steps.push(i);
    }
    // Pastikan usia saat ini tercakup
    sortedRiwayat.forEach(r => {
      if (!steps.includes(r.usiaBulan)) steps.push(r.usiaBulan);
    });
    steps.sort((a, b) => a - b);

    // Plotting data Z-Score WHO gender-aware untuk setiap langkah
    steps.forEach(u => {
      let ideal = 0;
      let limitLow = 0;
      let limitHigh = 0;
      let aktualVal: number | null = null;

      // Cari apakah ada riwayat aktual anak pada usia bulan ini
      const match = sortedRiwayat.find(r => r.usiaBulan === u);
      if (match) {
        aktualVal = type === 'bb' ? match.beratBadan : match.tinggiBadan;
      }

      if (type === 'bb') {
        // BB/U Z-Score WHO Standard
        if (balita.jenisKelamin === 'P') { // Perempuan
          ideal = 3.2 + (u * 0.26);
          limitLow = ideal - (u * 0.11) - 0.8;
          limitHigh = ideal + (u * 0.14) + 1.6;
        } else { // Laki-laki
          ideal = 3.3 + (u * 0.28);
          limitLow = ideal - (u * 0.12) - 0.9;
          limitHigh = ideal + (u * 0.15) + 1.8;
        }
      } else {
        // TB/U Z-Score WHO Standard
        if (balita.jenisKelamin === 'P') {
          ideal = 49.1 + (u * 1.02);
          limitLow = ideal - (u * 0.24) - 3.0;
          limitHigh = ideal + (u * 0.25) + 3.0;
        } else {
          ideal = 49.9 + (u * 1.05);
          limitLow = ideal - (u * 0.25) - 3.2;
          limitHigh = ideal + (u * 0.26) + 3.2;
        }
      }

      const dataPoint: any = {
        umur: `${u} Bln`,
        'Batas Atas': parseFloat(limitHigh.toFixed(1)),
        'Ideal (WHO)': parseFloat(ideal.toFixed(1)),
        'Batas Bawah': parseFloat(limitLow.toFixed(1)),
      };

      if (aktualVal !== null) {
        dataPoint[type === 'bb' ? 'Berat Balita' : 'Tinggi Balita'] = parseFloat(aktualVal.toFixed(1));
      }

      chartData.push(dataPoint);
    });

    return chartData;
  };

  // Parsing Status Gizi dari DB
  const parseStatusDisplay = (statusRaw: string) => {
    if (!statusRaw) return { label: 'Normal', detail: '' };
    const parts = statusRaw.split('[');
    const label = parts[0].trim();
    const detail = parts[1] ? parts[1].replace(']', '') : '';
    return { label, detail };
  };

  // Filter & Search data balita & jadwal
  const filteredBalita = dataBalita.filter(b => {
    const matchesSearch = b.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.namaIbu.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.posyandu?.nama || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDusun = dusunFilter === 'Semua Dusun' || b.posyandu?.dusun === dusunFilter.replace('Dusun ', '');
    return matchesSearch && matchesDusun;
  });

  const filteredJadwal = jadwalPosyandu.filter(j => {
    const matchesSearch = (j.posyandu?.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (j.kader?.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (j.sasaran || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDusun = dusunFilter === 'Semua Dusun' || j.posyandu?.dusun === dusunFilter.replace('Dusun ', '');
    return matchesSearch && matchesDusun;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
               <HeartPulse size={20} />
             </div>
             e-KMS & Posyandu Desa Kediren
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Pemantauan Gizi, Kartu Menuju Sehat (e-KMS) Interaktif, Imunisasi, dan Jadwal Pelayanan.</p>
        </div>
        
        {/* CONTEXTUAL TOP RIGHT HEADER BUTTONS (UX PERFECTED) */}
        <div className="flex items-center gap-2">
           {activeTab === 'jadwal' ? (
             <>
               <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-100 transition-all">
                 <FileText size={16} /> Laporan Jadwal
               </button>
               <button 
                 onClick={() => setShowJadwalModal(true)}
                 className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm transition-all shadow-blue-200 animate-fade-in"
               >
                 <Plus size={16} /> Tambah Jadwal
               </button>
             </>
           ) : (
             <>
               <button className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all">
                 <FileText size={16} /> Laporan KIA
               </button>
               <button 
                 onClick={() => setShowModal(true)}
                 className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm transition-all shadow-emerald-200 animate-fade-in"
               >
                 <Plus size={16} /> Tambah Data Balita
               </button>
             </>
           )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Baby size={24} />} label="Balita Terdaftar" value={dataBalita.length || 0} suffix="Anak" color="bg-emerald-50" textColor="text-emerald-600" />
        <StatCard icon={<Scale size={24} />} label="Kasus Stunting & Gizi Buruk" value={dataBalita.filter(b => b.statusGizi.toLowerCase().includes('kurang') || b.statusGizi.toLowerCase().includes('buruk') || b.statusGizi.toLowerCase().includes('stunting')).length || 0} suffix="Anak" color="bg-amber-50" textColor="text-amber-600" />
        <StatCard icon={<Stethoscope size={24} />} label="Agenda Bulan Ini" value={jadwalPosyandu.length || 0} suffix="Jadwal" color="bg-blue-50" textColor="text-blue-600" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
         {/* Tabs */}
         <div className="flex items-center border-b border-slate-100 bg-slate-50/50 p-2">
            <TabButton 
              active={activeTab === 'jadwal'} 
              onClick={() => setActiveTab('jadwal')} 
              icon={<Calendar size={16} />} 
              label="Jadwal Pelayanan" 
            />
            <TabButton 
              active={activeTab === 'balita'} 
              onClick={() => setActiveTab('balita')} 
              icon={<Baby size={16} />} 
              label="Data e-KMS & Tumbuh Kembang" 
            />
         </div>

         {/* Filter & Search Bar */}
         <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
           <div className="relative max-w-md w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder={activeTab === 'jadwal' ? "Cari nama posyandu, kader, atau sasaran..." : "Cari nama balita, ibu, atau posyandu..."}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
             />
           </div>
           <div className="flex items-center gap-3">
             <select 
               value={dusunFilter}
               onChange={(e) => setDusunFilter(e.target.value)}
               className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
             >
               <option>Semua Dusun</option>
               <option>Dusun Krajan</option>
               <option>Dusun Pule</option>
               <option>Dusun Ngujung</option>
             </select>
           </div>
         </div>

         {/* Content Table */}
         <div className="overflow-x-auto">
            {activeTab === 'jadwal' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Posyandu</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jadwal Pelaksanaan</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kader Bertugas</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJadwal.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Activity size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.posyandu?.nama || 'Posyandu'}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {item.posyandu?.dusun || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{item.waktu} WIB</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{item.sasaran}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {item.kader?.nama || 'Belum Diatur'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteJadwal(item.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'balita' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Balita & Ibu</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Usia</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Berat / Tinggi</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Gizi & Imunisasi</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBalita.map((item) => {
                    const parsed = parseStatusDisplay(item.statusGizi);
                    const isAlert = parsed.label.includes('Buruk') || parsed.label.includes('Kurang') || parsed.label.includes('Stunting');

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                            <p className="text-xs text-slate-500">Ibu: {item.namaIbu} • <span className="font-semibold text-emerald-600">{item.posyandu?.nama}</span></p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-slate-700">{item.usiaBulan} Bulan</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-slate-800">{item.beratBadan} kg</span>
                            <span className="text-xs text-slate-400">{item.tinggiBadan} cm</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              isAlert ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {parsed.label}
                            </span>
                            {parsed.detail && (
                              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">
                                {parsed.detail}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedBalitaKms(item)}
                              className="text-[10px] font-black text-emerald-600 hover:text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                            >
                              <ShieldCheck size={12} /> KMS Chart
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
         </div>

         {/* Pagination */}
         <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
            <p>Menampilkan {activeTab === 'jadwal' ? filteredJadwal.length : filteredBalita.length} data</p>
         </div>
      </div>

      {/* Modal Form Tambah Balita */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden my-8"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Baby size={20} /></div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Pendaftaran & e-KMS Balita</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Sistem Integrasi Z-Score WHO & Imunisasi</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmitBalita} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Bagian 1: Biodata Warga */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Informasi Balita & Ibu</h4>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => { setIsAutoWarga(true); handleSelectWarga(''); }}
                        className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${isAutoWarga ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <LinkIcon size={12} /> Ambil Data Warga
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAutoWarga(false); handleSelectWarga(''); }}
                        className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${!isAutoWarga ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <Edit size={12} /> Input Manual
                      </button>
                    </div>
                  </div>

                  {isAutoWarga && (
                    <div className="animate-fade-in">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Pilih Anak Balita dari Kependudukan</label>
                      <select 
                        value={selectedWargaNik} 
                        onChange={(e) => handleSelectWarga(e.target.value)} 
                        className="w-full px-5 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm"
                        required={isAutoWarga}
                      >
                        <option value="">-- Cari Nama Balita / NIK --</option>
                        {wargaBalitaList.map(w => (
                          <option key={w.nik} value={w.nik}>
                            {w.namaLengkap} (NIK: {w.nik}) - Dusun {w.keluarga?.dusun || '-'}
                          </option>
                        ))}
                      </select>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">Data warga di bawah usia 5 tahun otomatis disinkronkan ke sini.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Balita</label>
                      <input 
                        type="text" 
                        value={formNama} 
                        onChange={(e) => setFormNama(e.target.value)} 
                        disabled={isAutoWarga && !!selectedWargaNik}
                        className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                          isAutoWarga && !!selectedWargaNik 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`} 
                        placeholder="Contoh: Arfan Ramadhan" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Ibu</label>
                      <input 
                        type="text" 
                        value={formIbu} 
                        onChange={(e) => setFormIbu(e.target.value)} 
                        disabled={isAutoWarga && !!selectedWargaNik}
                        className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                          isAutoWarga && !!selectedWargaNik 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`} 
                        placeholder="Nama Ibu Kandung" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Jenis Kelamin</label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value as 'L' | 'P')}
                        disabled={isAutoWarga && !!selectedWargaNik}
                        className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                          isAutoWarga && !!selectedWargaNik 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`}
                        required
                      >
                        <option value="L">Laki-laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Posyandu Cakupan</label>
                      <select 
                        value={formPosyandu} 
                        onChange={(e) => setFormPosyandu(e.target.value)} 
                        disabled={isAutoWarga && !!selectedWargaNik}
                        className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                          isAutoWarga && !!selectedWargaNik 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`} 
                        required
                      >
                        <option value="">Pilih Lokasi</option>
                        {posyanduList.map(pos => (
                          <option key={pos.id} value={pos.id}>{pos.nama} - {pos.dusun}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Usia (Bulan)</label>
                      <input 
                        type="number" 
                        value={formUsia} 
                        onChange={(e) => setFormUsia(e.target.value)} 
                        disabled={isAutoWarga && !!selectedWargaNik}
                        className={`w-full px-5 py-3 border rounded-xl outline-none font-bold text-sm transition-all ${
                          isAutoWarga && !!selectedWargaNik 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-emerald-500'
                        }`} 
                        placeholder="Contoh: 12" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Tumbuh Kembang & Kalkulator Otomatis */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">2. Data Fisik & Status Gizi Otomatis</h4>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Berat Badan (kg)</label>
                      <input type="number" step="0.1" value={formBb} onChange={(e) => setFormBb(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm text-center" placeholder="0.0" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tinggi Badan (cm)</label>
                      <input type="number" step="0.1" value={formTb} onChange={(e) => setFormTb(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm text-center" placeholder="0.0" required />
                    </div>
                  </div>

                  {/* HASIL DETEKSI GIZI REAL-TIME */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deteksi Otomatis Gizi (Kemenkes/WHO):</p>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${
                            formUsia && formBb && formTb ? currentGizi.color : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {formUsia && formBb && formTb ? currentGizi.status : 'Menunggu Input...'}
                          </span>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-bold text-slate-400 uppercase">Estimasi Z-Score</p>
                       <p className="text-xs font-semibold text-slate-600 mt-0.5">
                         {formUsia && formBb ? `Median Ideal: ${(3.2 + Number(formUsia) * 0.35).toFixed(1)} kg` : '-'}
                       </p>
                     </div>
                  </div>
                </div>

                {/* Bagian 3: Imunisasi & Vitamin */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-1">3. Layanan Imunisasi Dasar & Vitamin</h4>
                  
                  {/* Vaksin Checklist Grid */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Imunisasi yang Sudah Diberikan:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['HB0', 'BCG', 'Polio', 'DPT-HB-Hib', 'Campak/MR'].map(vaksin => {
                        const isChecked = selectedVaksin.includes(vaksin);
                        return (
                          <button
                            type="button"
                            key={vaksin}
                            onClick={() => handleVaksinToggle(vaksin)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${
                              isChecked 
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <CheckCircle2 size={16} className={isChecked ? 'text-emerald-600' : 'text-slate-300'} />
                            {vaksin}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vitamin, Obat Cacing, & PMT */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <button
                       type="button"
                       onClick={() => setHasVitaminA(!hasVitaminA)}
                       className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                         hasVitaminA ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasVitaminA ? 'bg-blue-100' : 'bg-slate-100'}`}>💊</div>
                       <div className="text-left">
                         <p className="text-xs font-bold">Vitamin A</p>
                         <p className="text-[9px] text-slate-400">Bulan Feb/Agt</p>
                       </div>
                     </button>

                     <button
                       type="button"
                       onClick={() => setHasObatCacing(!hasObatCacing)}
                       className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                         hasObatCacing ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasObatCacing ? 'bg-amber-100' : 'bg-slate-100'}`}>🐛</div>
                       <div className="text-left">
                         <p className="text-xs font-bold">Obat Cacing</p>
                         <p className="text-[9px] text-slate-400">Pencegahan cacing</p>
                       </div>
                     </button>

                     <button
                       type="button"
                       onClick={() => setHasPmt(!hasPmt)}
                       className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                         hasPmt ? 'bg-purple-50 border-purple-400 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hasPmt ? 'bg-purple-100' : 'bg-slate-100'}`}>🍲</div>
                       <div className="text-left">
                         <p className="text-xs font-bold">Pemberian PMT</p>
                         <p className="text-[9px] text-slate-400">Nutrisi Tambahan</p>
                       </div>
                     </button>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                    <Save size={16} /> Simpan KMS & Layanan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Form Tambah Jadwal (CONTEXTUAL ACTION Modal) */}
      <AnimatePresence>
        {showJadwalModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden my-8"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Calendar size={20} /></div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Tambah Agenda Posyandu</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Penjadwalan Pelayanan Terintegrasi</p>
                  </div>
                </div>
                <button onClick={() => setShowJadwalModal(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmitJadwal} className="p-8 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Posyandu & Dusun</label>
                  <select value={formPosyanduJadwal} onChange={(e) => setFormPosyanduJadwal(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 text-sm" required>
                    <option value="">Pilih Posyandu</option>
                    {posyanduList.map(pos => (
                      <option key={pos.id} value={pos.id}>{pos.nama} - {pos.dusun}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Kader PKK Bertugas</label>
                  <select value={formKaderJadwal} onChange={(e) => setFormKaderJadwal(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 text-sm" required>
                    <option value="">Pilih Kader</option>
                    {kaderList.map(kader => (
                      <option key={kader.id} value={kader.id}>{kader.nama} ({kader.jabatan})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tanggal</label>
                    <input type="date" value={formTanggalJadwal} onChange={(e) => setFormTanggalJadwal(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 text-sm" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Waktu Pelaksanaan</label>
                    <input type="text" value={formWaktuJadwal} onChange={(e) => setFormWaktuJadwal(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 text-sm" placeholder="Contoh: 08:00 - 11:00" required />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sasaran Pelayanan</label>
                  <input type="text" value={formSasaranJadwal} onChange={(e) => setFormSasaranJadwal(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 text-sm" placeholder="Contoh: Balita & Ibu Hamil" required />
                </div>

                {/* Submit Actions */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowJadwalModal(false)} className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    <Save size={16} /> Jadwalkan Pelayanan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Detail KMS & Chart Interaktif */}
      <AnimatePresence>
        {selectedBalitaKms && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-6 md:p-10 overflow-y-auto print:p-0 print:bg-white print:static">
            <style dangerouslySetInnerHTML={{__html: `
              @media screen {
                /* Sembunyikan sidebar dan header secara global sewaktu modal ini di-render */
                aside, header {
                  display: none !important;
                }
              }
              @media print {
                /* Sembunyikan sidebar, header admin, footer admin, button, form */
                aside, header, footer, button, form, .print\\:hidden {
                  display: none !important;
                }
                /* Reset padding & layout pembungkus admin */
                main, .overflow-y-auto, .p-8 {
                  padding: 0 !important;
                  margin: 0 !important;
                  overflow: visible !important;
                }
                .flex-1 {
                  overflow: visible !important;
                  padding: 0 !important;
                }
                /* Posisikan modal di kiri atas */
                .print\\:static {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  background: white !important;
                  z-index: 99999 !important;
                }
              }
            `}} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden my-8 print:my-0 print:shadow-none print:rounded-none print:w-full print:max-w-none"
            >
              {/* Header Modal */}
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Kartu Menuju Sehat Digital (e-KMS)</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Sistem Tumbuh Kembang & Timbangan Bulanan Terpadu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setTimeout(() => {
                        window.print();
                      }, 200);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all border border-slate-200"
                  >
                    <Printer size={14} /> Cetak Kartu KMS
                  </button>
                  <button onClick={() => setSelectedBalitaKms(null)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"><X size={20} /></button>
                </div>
              </div>

              {/* Tampilan khusus Cetak Fisik (Hanya dirender saat print) */}
              <div className="hidden print:block p-8 space-y-6">
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-black text-slate-850">KARTU MENUJU SEHAT (KMS) BALITA</h1>
                    <p className="text-sm font-bold text-slate-500">POSYANDU DIGITAL DESA KEDIREN • KEC. LEMBEYAN</p>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-wider">
                      {selectedBalitaKms.jenisKelamin === 'P' ? 'Perempuan (P)' : 'Laki-Laki (L)'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NAMA BALITA</p>
                    <p className="text-sm font-bold text-slate-850">{selectedBalitaKms.nama}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NAMA IBU KANDUNG</p>
                    <p className="text-sm font-bold text-slate-700">{selectedBalitaKms.namaIbu}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">USIA UKUR</p>
                    <p className="text-sm font-bold text-slate-850">{selectedBalitaKms.usiaBulan} Bulan</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">POSYANDU CAKUPAN</p>
                    <p className="text-sm font-bold text-slate-750">{selectedBalitaKms.posyandu?.nama}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 print:p-4">
                
                {/* Biodata Balita (Web View) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 print:hidden">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Balita</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedBalitaKms.nama}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Ibu</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedBalitaKms.namaIbu}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Usia & Jenis Kelamin</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <span className="text-emerald-600">{selectedBalitaKms.usiaBulan} Bulan</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-black">
                        {selectedBalitaKms.jenisKelamin === 'P' ? 'P' : 'L'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Posyandu & Dusun</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedBalitaKms.posyandu?.nama} ({selectedBalitaKms.posyandu?.dusun})</p>
                  </div>
                </div>

                {/* Grid Utama: Kiri (Grafik & Riwayat), Kanan (Catat Baru) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Bagian Kiri: Grafik & Riwayat */}
                  <div className="lg:col-span-2 space-y-6 print:w-full">
                    
                    {/* Header Grafik & Tab Pilihan */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 print:hidden">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity size={14} className="text-emerald-600" />
                        {kmsChartTab === 'bb' ? 'Kurva Berat Badan menurut Usia (BB/U)' : 'Kurva Tinggi Badan menurut Usia (TB/U)'}
                      </h4>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setKmsChartTab('bb')}
                          className={`px-3 py-1 rounded-md transition-all ${kmsChartTab === 'bb' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Berat Badan (BB/U)
                        </button>
                        <button
                          type="button"
                          onClick={() => setKmsChartTab('tb')}
                          className={`px-3 py-1 rounded-md transition-all ${kmsChartTab === 'tb' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Tinggi Badan (TB/U)
                        </button>
                      </div>
                    </div>

                    {/* Judul Grafik untuk Cetak */}
                    <div className="hidden print:block text-xs font-black text-slate-600 uppercase tracking-widest mb-2 text-center">
                      Kurva Tumbuh Kembang: {kmsChartTab === 'bb' ? 'Berat Badan Anak menurut Usia (BB/U)' : 'Tinggi Badan Anak menurut Usia (TB/U)'}
                    </div>

                    {/* Render Grafik */}
                    <div className="w-full h-[320px] bg-white border border-slate-100 rounded-2xl p-4 shadow-inner print:shadow-none print:border-slate-300">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={generateChartData(selectedBalitaKms, kmsChartTab)}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorKms" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={kmsChartTab === 'bb' ? '#10b981' : '#3b82f6'} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={kmsChartTab === 'bb' ? '#10b981' : '#3b82f6'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="umur" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={kmsChartTab === 'bb' ? [0, 20] : [40, 120]} />
                          <Tooltip />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                          
                          {/* Batas Atas WHO */}
                          <Area type="monotone" dataKey="Batas Atas" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="5 5" name="Batas Atas (+2 SD)" />
                          
                          {/* Garis Ideal WHO */}
                          <Area type="monotone" dataKey="Ideal (WHO)" stroke="#3b82f6" fill="none" strokeWidth={1.5} name="Median WHO" />
                          
                          {/* Batas Bawah WHO */}
                          <Area type="monotone" dataKey="Batas Bawah" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="5 5" name="Batas Bawah (-2 SD)" />
                          
                          {/* Aktual Anak */}
                          {kmsChartTab === 'bb' ? (
                            <Area type="monotone" dataKey="Berat Balita" stroke="#10b981" fill="url(#colorKms)" strokeWidth={3} activeDot={{ r: 8 }} name="Berat Badan Aktual" />
                          ) : (
                            <Area type="monotone" dataKey="Tinggi Balita" stroke="#2563eb" fill="url(#colorKms)" strokeWidth={3} activeDot={{ r: 8 }} name="Tinggi Badan Aktual" />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Tabel Riwayat Pengukuran */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        📋 Riwayat Timbangan & Pengukuran Berkala
                      </h4>
                      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider">Usia</th>
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider">Tanggal</th>
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider text-center">BB (kg)</th>
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider text-center">TB (cm)</th>
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider text-center">Status Gizi</th>
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider">Keterangan</th>
                              <th className="px-4 py-3 font-black text-slate-500 uppercase tracking-wider print:hidden text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {selectedBalitaKms.pengukuran && selectedBalitaKms.pengukuran.length > 0 ? (
                              selectedBalitaKms.pengukuran.map((p: any) => {
                                const st = calculateNutritionalStatus(p.usiaBulan, p.beratBadan, p.tinggiBadan, selectedBalitaKms.jenisKelamin);
                                return (
                                  <tr key={p.id} className={`transition-colors ${editPengukuranId === p.id ? 'bg-blue-50/70 border-l-2 border-blue-500' : 'hover:bg-slate-50/50'}`}>
                                    <td className="px-4 py-3 font-bold text-slate-700">{p.usiaBulan} Bulan</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{new Date(p.tanggalUkur).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-4 py-3 text-center font-bold text-slate-800">{p.beratBadan} kg</td>
                                    <td className="px-4 py-3 text-center text-slate-600">{p.tinggiBadan} cm</td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${st.isStunted ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {p.statusGizi}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 italic text-xs">{p.keterangan || '-'}</td>
                                    <td className="px-4 py-3 print:hidden text-right">
                                      <div className="flex justify-end gap-1">
                                        <button 
                                          type="button"
                                          onClick={() => handleEditPengukuran(p)}
                                          className="p-1 text-blue-500 hover:text-white rounded-lg hover:bg-blue-500 transition-colors"
                                          title="Ubah Data"
                                        >
                                          <Edit size={13} />
                                        </button>
                                        {selectedBalitaKms.pengukuran.length > 1 && (
                                          <button 
                                            type="button"
                                            onClick={() => handleDeletePengukuran(p.id)}
                                            className="p-1 text-slate-350 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                            title="Hapus"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-slate-400 italic">
                                  Belum ada riwayat timbangan. Gunakan form di sebelah kanan untuk mencatat timbangan baru.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* Bagian Kanan: Catat Timbangan Baru (Hidden saat Print) */}
                  <div className={`bg-slate-50 p-6 rounded-[1.5rem] border space-y-5 print:hidden transition-all ${editPengukuranId ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editPengukuranId ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {editPengukuranId ? <Edit size={16} /> : <Plus size={16} />}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">{editPengukuranId ? 'Ubah Data Timbangan' : 'Catat Timbangan Bulanan'}</h4>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{editPengukuranId ? 'Edit Data Pengukuran' : 'Penimbangan Rutin Posyandu'}</p>
                        </div>
                      </div>
                      {editPengukuranId && (
                        <button type="button" onClick={resetPengukuranForm} className="text-[10px] px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold uppercase tracking-widest transition-colors">
                          Batal Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSubmitPengukuran} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Usia Pengukuran (Bulan)</label>
                          <input 
                            type="number" 
                            value={inputUsiaBulan}
                            onChange={(e) => setInputUsiaBulan(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm"
                            placeholder="Contoh: 19"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tanggal Posyandu</label>
                          <input 
                            type="date" 
                            value={inputTanggalUkur}
                            onChange={(e) => setInputTanggalUkur(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Berat Badan (kg)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={inputBeratBadan}
                            onChange={(e) => setInputBeratBadan(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm"
                            placeholder="Contoh: 11.2"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tinggi Badan (cm)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={inputTinggiBadan}
                            onChange={(e) => setInputTinggiBadan(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm"
                            placeholder="Contoh: 84.5"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Keterangan / Imunisasi</label>
                        <input 
                          type="text" 
                          value={inputKeterangan}
                          onChange={(e) => setInputKeterangan(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-600 text-sm"
                          placeholder="Misal: ASI Eksklusif, Vitamin A, Campak"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Nama Petugas Pemeriksa</label>
                        <input 
                          type="text" 
                          value={inputPetugas}
                          onChange={(e) => setInputPetugas(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-700 text-sm"
                          placeholder="Nama Bidan / Kader"
                          required
                        />
                      </div>

                      {inputUsiaBulan && inputBeratBadan && inputTinggiBadan && (
                        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs font-semibold text-center animate-fade-in">
                          Estimasi Status Gizi: <span className="font-black uppercase tracking-wider">{
                            calculateNutritionalStatus(Number(inputUsiaBulan), Number(inputBeratBadan), Number(inputTinggiBadan), selectedBalitaKms.jenisKelamin).status
                          }</span>
                        </div>
                      )}

                      <button 
                        type="submit"
                        className={`w-full py-3 ${editPengukuranId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'} text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md mt-2`}
                      >
                        {editPengukuranId ? <Edit size={14} /> : <Save size={14} />} 
                        {editPengukuranId ? 'Simpan Perubahan Data' : 'Simpan Pengukuran'}
                      </button>
                    </form>
                  </div>

                </div>

                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t pt-4 print:pt-6 print:border-slate-300">
                  <span>Sistem Informasi Posyandu Desa Kediren</span>
                  <span>Standar Z-Score WHO & Kemenkes RI</span>
                </div>
              </div>
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

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
        active 
          ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
      }`}
    >
      {icon} {label}
    </button>
  );
}
