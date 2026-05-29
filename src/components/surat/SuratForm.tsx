'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Users,
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Printer,
  Save,
  Loader2,
  ArrowLeft,
  ScanFace,
  Files,
  Signature,
  Edit,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { generateNomorSurat, createRiwayatSurat } from '@/app/actions/surat';

import DynamicForm from './DynamicForm';

interface MasterSurat {
  id: number;
  kodeSurat: string;
  namaSurat: string;
  formatNomor: string;
  formSchema?: string;
}

interface Penduduk {
  nik: string;
  namaLengkap: string;
  alamat?: string;
  tempatLahir: string;
  tanggalLahir: string | Date;
  jenisKelamin: string;
  pekerjaan: string;
  statusPerkawinan: string;
  agama: string;
  keluarga?: {
    dusun?: string;
    rt?: string;
    rw?: string;
  };
}

export default function SuratForm({ masterSurat, initialPenduduk }: { masterSurat: MasterSurat[], initialPenduduk: any[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [selectedPenduduk, setSelectedPenduduk] = useState<Penduduk | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPenduduk, setFilteredPenduduk] = useState(initialPenduduk);
  
  const [selectedSurat, setSelectedSurat] = useState<MasterSurat | null>(null);
  const [nomorSurat, setNomorSurat] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>({});

  const [kkQuery, setKkQuery] = useState('');
  const [dusunFilter, setDusunFilter] = useState('');
  const [rtFilter, setRtFilter] = useState('');

  // Search logic
  useEffect(() => {
    let filtered = initialPenduduk;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nik.includes(searchQuery)
      );
    }

    if (kkQuery) {
      filtered = filtered.filter(p => p.noKk?.includes(kkQuery));
    }

    if (dusunFilter) {
      filtered = filtered.filter(p => p.keluarga?.dusun === dusunFilter);
    }

    if (rtFilter) {
      filtered = filtered.filter(p => p.keluarga?.rt === rtFilter);
    }

    setFilteredPenduduk(filtered);
  }, [searchQuery, kkQuery, dusunFilter, rtFilter, initialPenduduk]);

  // Auto generate nomor surat
  useEffect(() => {
    if (selectedSurat) {
      generateNomorSurat(selectedSurat.id).then(setNomorSurat);
      setDynamicValues({}); // Reset dynamic values when surat type changes
    }
  }, [selectedSurat]);

  const handleCreate = async () => {
    if (!selectedPenduduk || !selectedSurat || !nomorSurat) return;
    
    setLoading(true);
    try {
      const res = await createRiwayatSurat({
        nikPemohon: selectedPenduduk.nik,
        masterSuratId: selectedSurat.id,
        nomorSurat: nomorSurat,
        keterangan: keterangan,
        metaData: JSON.stringify({
          ...dynamicValues,
          nama: selectedPenduduk.namaLengkap,
          nik: selectedPenduduk.nik,
          tglLahir: selectedPenduduk.tanggalLahir,
          tempatLahir: selectedPenduduk.tempatLahir,
          jk: selectedPenduduk.jenisKelamin,
          pekerjaan: selectedPenduduk.pekerjaan,
          status: selectedPenduduk.statusPerkawinan,
          agama: selectedPenduduk.agama,
          alamat: selectedPenduduk.alamat,
          keterangan: keterangan
        })
      });
      
      router.push(`/admin/surat/preview/${res.id}`);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan surat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Stepper Section Combined */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {selectedSurat ? `Penerbitan ${selectedSurat.namaSurat}` : 'Buat Surat Baru'}
            </h1>
            <p className="text-slate-500 text-sm">
              {selectedSurat 
                ? `Langkah selanjutnya: ${step === 2 ? 'Cari warga pemohon' : 'Lengkapi detail final'}` 
                : 'Silakan pilih jenis surat dan cari data warga yang akan diterbitkan.'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
           <StepTab active={step === 1} done={step > 1} label="Pilih Jenis Surat" icon={<Files size={16} />} />
           <StepTab active={step === 2} done={step > 2} label="Cari Warga" icon={<ScanFace size={16} />} />
           <StepTab active={step === 3} done={step > 3} label="Detail Final" icon={<Signature size={16} />} />
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {/* Step 1: Pilih Jenis Surat */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {masterSurat.map((s, idx) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => { setSelectedSurat(s); setStep(2); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedSurat(s); setStep(2); } }}
                    className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all text-left overflow-hidden cursor-pointer"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
                       <button 
                         onClick={(e) => { e.stopPropagation(); /* TODO: Edit Logic */ }}
                         className="p-2 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg transition-all"
                         title="Edit Template"
                       >
                         <Edit size={14} />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); /* TODO: Delete Logic */ }}
                         className="p-2 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-lg transition-all"
                         title="Hapus Template"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>

                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 -z-0" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-blue-200">
                        <FileText size={32} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">{s.namaSurat}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{s.kodeSurat}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pilih Format Ini</span>
                         <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Cari Warga */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Advanced Filter Bar - Daftar Warga Style */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari Nama/NIK secara otomatis..." 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-xs font-bold text-slate-700 transition-all placeholder:text-slate-300 shadow-inner" 
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={kkQuery}
                      onChange={(e) => setKkQuery(e.target.value)}
                      placeholder="No KK..." 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-xs font-bold text-slate-700 placeholder:text-slate-300 shadow-inner" 
                    />
                  </div>
                  <select 
                    value={dusunFilter} 
                    onChange={(e) => setDusunFilter(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-all shadow-inner uppercase"
                  >
                    <option value="">SEMUA DUSUN</option>
                    <option value="Selungguh">SELUNGGUH</option>
                    <option value="Sekadalan">SEKADALAN</option>
                    <option value="Ledok">LEDOK</option>
                  </select>
                  <select 
                    value={rtFilter} 
                    onChange={(e) => setRtFilter(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-all shadow-inner uppercase"
                  >
                    <option value="">RT</option>
                    {['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <div className="flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl px-4 py-3 font-bold text-[10px] uppercase tracking-widest border border-emerald-100 shadow-sm">
                    Auto
                  </div>
                </div>
              </div>

              {/* High Fidelity Table Results */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Data Warga</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Lokasi</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPenduduk.length > 0 ? (
                        filteredPenduduk.map((p) => (
                          <tr 
                            key={p.nik}
                            onClick={() => { setSelectedPenduduk(p); setStep(3); }}
                            className="hover:bg-slate-50/50 transition-all cursor-pointer group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner font-bold text-[10px] shrink-0 border border-white">
                                  {p.namaLengkap.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors uppercase leading-tight">{p.namaLengkap}</p>
                                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{p.nik}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col items-center gap-1">
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold border border-emerald-100 uppercase">HIDUP</span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{p.statusPerkawinan}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <p className="text-xs font-bold text-slate-600 uppercase">{p.keluarga?.dusun || p.alamat || 'KEDIREN'}</p>
                                <p className="text-[10px] text-slate-400 font-mono italic">RT {p.keluarga?.rt || '--'} / RW {p.keluarga?.rw || '--'}</p>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex justify-center opacity-40 group-hover:opacity-100 transition-all">
                                  <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200">
                                     Pilih Warga
                                  </div>
                               </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 shadow-inner">
                              <Search size={24} />
                            </div>
                            <h4 className="text-slate-800 font-bold">Warga Tidak Ditemukan</h4>
                            <p className="text-slate-400 text-xs font-medium mt-1">Gunakan kata kunci NIK atau Nama yang tepat.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Detail & Finalisasi */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Summary Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-800 rounded-[2rem] p-8 text-white space-y-8 shadow-2xl shadow-slate-900/30">
                    <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                       <button onClick={() => setStep(2)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                          <ArrowLeft size={18} />
                       </button>
                       <h3 className="font-bold text-lg">Detail Penerbitan</h3>
                    </div>

                    <div className="space-y-6">
                       <SummaryItem icon={<FileText size={16} />} label="Jenis Dokumen" value={selectedSurat?.namaSurat || ''} subValue={selectedSurat?.kodeSurat || ''} />
                       <SummaryItem icon={<User size={16} />} label="Identitas Warga" value={selectedPenduduk?.namaLengkap || ''} subValue={selectedPenduduk?.nik || ''} />
                       <SummaryItem icon={<Save size={16} />} label="Nomor Arsip" value={nomorSurat} subValue="Generated by System" highlight />
                    </div>
                 </div>

                 <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 flex gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" size={24} />
                    <div>
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">Verifikasi Data!</p>
                      <p className="text-[11px] text-amber-700 font-medium leading-relaxed">Pastikan data di samping sudah sesuai sebelum menekan tombol simpan and cetak.</p>
                    </div>
                 </div>
              </div>

              {/* Form Content */}
              <div className="lg:col-span-8 space-y-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Keperluan Utama Surat</label>
                    <textarea 
                      placeholder="Contoh: Digunakan untuk persyaratan pengajuan beasiswa pendidikan..."
                      className="w-full px-6 py-6 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg shadow-inner min-h-[120px] resize-none"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    />
                 </div>

                 {selectedSurat?.formSchema && (
                   <div className="space-y-6 pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Informasi Atribut Khusus</h3>
                      </div>
                      <DynamicForm 
                        schema={selectedSurat.formSchema} 
                        values={dynamicValues} 
                        onChange={(name, val) => setDynamicValues(prev => ({ ...prev, [name]: val }))} 
                      />
                   </div>
                 )}

                 <div className="pt-10">
                    <button 
                      onClick={handleCreate}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-200 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <>
                          <Printer size={24} />
                          <span>Simpan & Preview Cetak</span>
                        </>
                      )}
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepTab({ active, done, label, icon }: { active: boolean, done: boolean, label: string, icon: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
      active ? 'bg-white text-emerald-600 shadow-sm' : (done ? 'text-emerald-500' : 'text-slate-400')
    }`}>
      {done ? <CheckCircle2 size={16} /> : icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SummaryItem({ icon, label, value, subValue, highlight = false }: { icon: React.ReactNode, label: string, value: string, subValue: string, highlight?: boolean }) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={`p-4 rounded-2xl ${highlight ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white/5 border border-white/10'}`}>
         <p className="font-bold text-sm text-white truncate">{value}</p>
         <p className={`text-[10px] mt-1 font-bold ${highlight ? 'text-emerald-100' : 'text-white/30'}`}>{subValue}</p>
      </div>
    </div>
  );
}

