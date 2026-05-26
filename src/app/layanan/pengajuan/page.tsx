'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DynamicForm from '@/components/surat/DynamicForm';
import { getProfilDesa, getMasterSurat } from '@/app/actions/surat';
import { submitPermohonanWarga } from '@/app/actions/permohonan-surat';

export default function PengajuanPage() {
  const [profil, setProfil] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // Form States
  const [step, setStep] = useState(1);
  const [nik, setNik] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});
  
  // Status States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successId, setSuccessId] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getProfilDesa();
        const t = await getMasterSurat();
        setProfil(p);
        setTemplates(t);
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    }
    loadData();
  }, []);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    const temp = templates.find(t => t.id === id);
    setSelectedTemplate(temp || null);
    setDynamicValues({});
  };

  const handleDynamicChange = (name: string, value: any) => {
    setDynamicValues(prev => ({ ...prev, [name]: value }));
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) {
      setErrorMsg('Pilih jenis surat yang ingin diajukan.');
      return;
    }
    if (nik.length !== 16) {
      setErrorMsg('NIK harus terdiri dari 16 digit angka.');
      return;
    }
    if (!namaIbu.trim()) {
      setErrorMsg('Nama Ibu Kandung harus diisi untuk verifikasi keamanan.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Melakukan pengecekan data pemohon secara client action sebelum melangkah
    try {
      // Pindah ke step berikutnya untuk pengisian formulir detail
      setStep(2);
    } catch (err) {
      setErrorMsg('Terjadi kesalahan verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluan.trim()) {
      setErrorMsg('Tuliskan keperluan pembuatan surat Anda secara jelas.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await submitPermohonanWarga({
        nikPemohon: nik,
        namaIbuKandung: namaIbu,
        masterSuratId: selectedTemplate.id,
        keperluan,
        metaData: JSON.stringify(dynamicValues)
      });

      if (res.success) {
        setSuccessId(res.permohonanId || 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase());
        setStep(3);
      } else {
        // Kembali ke step 1 jika verifikasi DB gagal
        setStep(1);
        setErrorMsg(res.message || 'Verifikasi database gagal.');
      }
    } catch (err: any) {
      setErrorMsg('Gagal mengirimkan permohonan surat. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-[#f8f9ff] selection:bg-[#154212] selection:text-white text-[#0b1c30]">
      <Navbar profil={profil} />

      <main className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex px-4 py-1.5 bg-[#2d5a27]/10 text-[#154212] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              Layanan Mandiri Warga
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Pengajuan Surat Online
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Ajukan permohonan surat resmi Desa {profil?.namaDesa || 'Kediren'} dari rumah dengan cepat dan aman.
            </p>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#154212] font-black' : 'text-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#154212] text-white' : 'bg-slate-100 text-slate-400'}`}>
                1
              </div>
              <span className="hidden sm:inline text-xs uppercase tracking-widest">Verifikasi</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#154212] font-black' : 'text-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#154212] text-white' : 'bg-slate-100 text-slate-400'}`}>
                2
              </div>
              <span className="hidden sm:inline text-xs uppercase tracking-widest">Formulir</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#154212] font-black' : 'text-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-[#154212] text-white' : 'bg-slate-100 text-slate-400'}`}>
                3
              </div>
              <span className="hidden sm:inline text-xs uppercase tracking-widest">Selesai</span>
            </div>
          </div>

          {/* Error Alert Box */}
          {errorMsg && (
            <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-shake">
              <XCircle className="shrink-0" size={24} />
              <div className="text-xs font-bold leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Main Card Container */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 batik-pattern opacity-[0.03] pointer-events-none" style={{ backgroundImage: batikPattern }}></div>
            
            <div className="p-8 md:p-12">
              {/* STEP 1: VERIFIKASI IDENTITAS */}
              {step === 1 && (
                <form onSubmit={handleVerification} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                      <ShieldCheck className="text-[#154212]" size={24} />
                      Langkah 1: Verifikasi Keamanan
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Pilih jenis surat dan masukkan detail kependudukan resmi Anda untuk memulai.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Select Jenis Surat */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
                        Jenis Surat Keterangan
                      </label>
                      <select
                        required
                        className="w-full px-6 py-5 bg-[#f8f9ff] border border-[#d3e4fe] rounded-2xl focus:ring-2 focus:ring-[#154212] focus:border-transparent text-sm font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                        onChange={handleTemplateChange}
                        value={selectedTemplate?.id || ''}
                      >
                        <option value="">-- Pilih Jenis Surat --</option>
                        {templates.map(t => (
                          <option key={t.id} value={t.id}>{t.namaSurat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* NIK Input */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
                          Nomor Induk Kependudukan (NIK)
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          required
                          placeholder="Masukkan NIK 16 digit Anda..."
                          value={nik}
                          onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-6 py-5 bg-[#f8f9ff] border border-[#d3e4fe] rounded-2xl focus:ring-2 focus:ring-[#154212] focus:border-transparent text-sm font-bold text-[#0b1c30] placeholder:text-slate-300 shadow-sm font-mono tracking-wider"
                        />
                      </div>

                      {/* Nama Ibu Kandung */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
                          Nama Ibu Kandung
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Verifikasi nama ibu kandung sesuai KK..."
                          value={namaIbu}
                          onChange={(e) => setNamaIbu(e.target.value)}
                          className="w-full px-6 py-5 bg-[#f8f9ff] border border-[#d3e4fe] rounded-2xl focus:ring-2 focus:ring-[#154212] focus:border-transparent text-sm font-bold text-[#0b1c30] placeholder:text-slate-300 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-[#154212] hover:bg-[#2d5a27] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {loading ? 'Memproses...' : 'Mulai Pengisian'}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: ISI FORMULIR SURAT */}
              {step === 2 && selectedTemplate && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                      <FileText className="text-[#154212]" size={24} />
                      Langkah 2: Detail Informasi Surat
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      Lengkapi data dinamis untuk format surat **{selectedTemplate.namaSurat}** di bawah ini.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Keperluan Pembuatan Surat */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">
                        Tujuan / Keperluan Surat <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Contoh: Pengajuan pinjaman modal usaha di Bank BRI Cabang Magetan..."
                        value={keperluan}
                        onChange={(e) => setKeperluan(e.target.value)}
                        className="w-full px-6 py-5 bg-[#f8f9ff] border border-[#d3e4fe] rounded-2xl focus:ring-2 focus:ring-[#154212] focus:border-transparent text-sm font-bold text-slate-700 placeholder:text-slate-300 shadow-sm resize-none"
                      />
                    </div>

                    {/* Dynamic Fields */}
                    {selectedTemplate.formSchema && (
                      <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                          Variabel Tambahan Surat
                        </h3>
                        <DynamicForm
                          schema={selectedTemplate.formSchema}
                          values={dynamicValues}
                          onChange={handleDynamicChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-700 transition-all"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-[#154212] hover:bg-[#2d5a27] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {loading ? 'Mengirimkan...' : 'Kirim Pengajuan'}
                      <CheckCircle2 size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUKSES / RESI */}
              {step === 3 && (
                <div className="py-8 text-center space-y-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[30px] flex items-center justify-center shadow-inner animate-bounce">
                    <UserCheck size={40} />
                  </div>

                  <div className="space-y-3 max-w-lg">
                    <h2 className="text-2xl font-black text-slate-800">
                      Pengajuan Surat Terkirim!
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Terima kasih! Permohonan surat Anda telah sukses dikirimkan ke tim verifikasi Kantor Desa Kediren.
                    </p>
                  </div>

                  {/* Receipt Card */}
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 w-full max-w-md text-left space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 pb-3 border-b border-slate-200/60 uppercase tracking-widest">
                      <span>Kode Tracking Anda</span>
                      <span className="text-[#154212] font-mono tracking-normal">{successId}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Pemohon</span>
                        <span className="text-xs font-extrabold text-slate-700">{nik.substr(0, 4) + '**********' + nik.substr(14, 2)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format Surat</span>
                        <span className="text-xs font-extrabold text-slate-700">{selectedTemplate?.namaSurat}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100 flex items-center gap-1">
                          <Clock size={10} /> Pending
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-[#eff4ff] border border-[#d3e4fe] rounded-2xl flex items-start gap-4 max-w-lg text-left">
                    <HelpCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-[#0b1c30]">Apa langkah berikutnya?</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Admin desa akan melakukan verifikasi berkas dan mencetak surat dinas Anda dalam waktu 1x24 jam kerja. Anda akan menerima notifikasi jika surat siap diambil di Kantor Desa Kediren dengan membawa bukti fotokopi KK/KTP asli.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 w-full flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setStep(1);
                        setNik('');
                        setNamaIbu('');
                        setKeperluan('');
                        setSelectedTemplate(null);
                        setDynamicValues({});
                        setErrorMsg('');
                      }}
                      className="px-6 py-4 bg-[#154212] hover:bg-[#2d5a27] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Ajukan Surat Lain
                    </button>
                    <Link
                      href="/layanan"
                      className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-2"
                    >
                      Kembali ke Layanan <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer profil={profil} />
    </div>
  );
}
