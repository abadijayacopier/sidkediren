'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Printer,
  Save,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateNomorSurat, createRiwayatSurat } from '@/app/actions/surat';

interface MasterSurat {
  id: number;
  kodeSurat: string;
  namaSurat: string;
  formatNomor: string;
}

interface Penduduk {
  nik: string;
  namaLengkap: string;
  alamat?: string;
  tempatLahir: string;
  tanggalLahir: string | Date;
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

  // Search logic
  useEffect(() => {
    if (searchQuery) {
      const filtered = initialPenduduk.filter(p => 
        p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nik.includes(searchQuery)
      );
      setFilteredPenduduk(filtered);
    } else {
      setFilteredPenduduk(initialPenduduk);
    }
  }, [searchQuery, initialPenduduk]);

  // Auto generate nomor surat
  useEffect(() => {
    if (selectedSurat) {
      generateNomorSurat(selectedSurat.id).then(setNomorSurat);
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
          nama: selectedPenduduk.namaLengkap,
          nik: selectedPenduduk.nik,
          tglLahir: selectedPenduduk.tanggalLahir,
          tempatLahir: selectedPenduduk.tempatLahir
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
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <StepIndicator active={step >= 1} current={step === 1} number={1} label="Cari Warga" />
        <ChevronRight size={16} className="text-slate-300 shrink-0" />
        <StepIndicator active={step >= 2} current={step === 2} number={2} label="Pilih Surat" />
        <ChevronRight size={16} className="text-slate-300 shrink-0" />
        <StepIndicator active={step >= 3} current={step === 3} number={3} label="Detail & Simpan" />
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Step 1: Cari Warga */}
        {step === 1 && (
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Cari berdasarkan NIK atau Nama Lengkap..." 
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-slate-700 font-bold placeholder:text-slate-400 transition-all text-lg shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPenduduk.map((p) => (
                <button
                  key={p.nik}
                  onClick={() => { setSelectedPenduduk(p); setStep(2); }}
                  className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left group ${
                    selectedPenduduk?.nik === p.nik 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/20' 
                    : 'border-slate-50 bg-slate-50/30 hover:border-emerald-200 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all ${
                    selectedPenduduk?.nik === p.nik ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                  }`}>
                    <User size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-slate-800 truncate">{p.namaLengkap}</p>
                    <p className="text-xs text-slate-400 font-mono tracking-wider">{p.nik}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pilih Jenis Surat */}
        {step === 2 && (
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Pemohon Terpilih</p>
                <p className="text-sm font-bold text-slate-800">{selectedPenduduk?.namaLengkap} - {selectedPenduduk?.nik}</p>
              </div>
              <button onClick={() => setStep(1)} className="ml-auto text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors uppercase tracking-tighter">Ganti</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {masterSurat.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedSurat(s); setStep(3); }}
                  className={`flex items-center gap-5 p-6 rounded-3xl border transition-all text-left group ${
                    selectedSurat?.id === s.id 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/20' 
                    : 'border-slate-50 bg-slate-50/30 hover:border-emerald-200 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all ${
                    selectedSurat?.id === s.id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">{s.namaSurat}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.kodeSurat}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Detail & Finalisasi */}
        {step === 3 && (
          <div className="p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Informasi Surat</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500 font-bold">Jenis:</span>
                        <span className="text-xs font-black text-slate-800 uppercase">{selectedSurat?.namaSurat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500 font-bold">Pemohon:</span>
                        <span className="text-xs font-black text-slate-800 uppercase">{selectedPenduduk?.namaLengkap}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500 font-bold">NIK:</span>
                        <span className="text-xs font-mono font-black text-emerald-600 uppercase tracking-tighter">{selectedPenduduk?.nik}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Nomor Surat (Otomatis)</label>
                    <input 
                      type="text" 
                      readOnly 
                      className="w-full p-5 bg-slate-50 border-none rounded-2xl text-slate-700 font-mono font-black text-sm shadow-inner cursor-not-allowed"
                      value={nomorSurat}
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Keterangan / Keperluan</label>
                    <textarea 
                      rows={6}
                      placeholder="Contoh: Digunakan untuk persyaratan beasiswa anak..."
                      className="w-full p-5 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm shadow-inner"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                    />
                  </div>
               </div>
            </div>

            <div className="mt-auto pt-10 flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all uppercase tracking-tighter text-sm"
              >
                Kembali
              </button>
              <button 
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Printer size={20} />
                    <span>Cetak & Simpan Arsip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div>
          <p className="text-sm font-bold text-amber-900 italic">Penting!</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">Pastikan data warga sudah sesuai sebelum mencetak surat. Sistem akan otomatis mencatat nomor surat ini ke dalam Buku Register Surat Keluar sesuai aturan Kemendagri.</p>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ active, current, number, label }: { active: boolean, current: boolean, number: number, label: string }) {
  return (
    <div className={`flex items-center gap-3 shrink-0 ${active ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
        current ? 'bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-50' : (active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400')
      }`}>
        {active && !current ? <CheckCircle2 size={16} /> : number}
      </div>
      <span className={`text-xs font-black uppercase tracking-widest ${current ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}
