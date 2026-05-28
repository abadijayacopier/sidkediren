'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Check, 
  X, 
  Clock, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { getAntreanPermohonan, prosesPersetujuanPermohonan } from '@/app/actions/permohonan-surat';
import { useRouter } from 'next/navigation';

export default function AntreanPermohonanPage() {
  const router = useRouter();
  const [antrean, setAntrean] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Modal State
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [alasanBatal, setAlasanBatal] = useState('');
  const [catatanSetuju, setCatatanSetuju] = useState('Silahkan ambil surat resmi Anda di kantor desa pada jam kerja.');
  
  // Detail State
  const [viewingData, setViewingData] = useState<any | null>(null);

  const fetchAntrean = async () => {
    try {
      const data = await getAntreanPermohonan();
      setAntrean(data as any[]);
    } catch (err) {
      console.error("Gagal mengambil data antrean", err);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingId) return;
    setLoadingId(approvingId);
    try {
      const res = await prosesPersetujuanPermohonan(approvingId, 'Disetujui', catatanSetuju);
      if (res.success) {
        setApprovingId(null);
        fetchAntrean();
        alert('Permohonan disetujui. Mengarahkan ke halaman cetak...');
        if (res.riwayatId) {
          router.push(`/admin/surat/preview/${res.riwayatId}`);
        }
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memproses persetujuan.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;
    if (!alasanBatal.trim()) {
      alert('Alasan penolakan surat harus diisi.');
      return;
    }

    setLoadingId(rejectingId);
    try {
      const res = await prosesPersetujuanPermohonan(rejectingId, 'Ditolak', alasanBatal);
      if (res.success) {
        setRejectingId(null);
        setAlasanBatal('');
        fetchAntrean();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memproses penolakan.');
    } finally {
      setLoadingId(null);
    }
  };

  // Stats
  const totalPending = antrean.filter(a => a.status === 'Pending').length;
  const totalApproved = antrean.filter(a => a.status === 'Disetujui').length;
  const totalRejected = antrean.filter(a => a.status === 'Ditolak').length;

  // Filter & Search
  const filtered = antrean.filter(a => {
    const matchesSearch = 
      a.penduduk.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      a.nikPemohon.includes(search) ||
      a.masterSurat.namaSurat.toLowerCase().includes(search.toLowerCase());
    
    if (filterStatus === 'Semua') return matchesSearch;
    return matchesSearch && a.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Antrean Pengajuan Surat</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Permohonan Surat Mandiri Online Dari Warga Desa Kediren
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/surat"
            className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/surat/riwayat"
            className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs"
          >
            Arsip Riwayat Surat
          </Link>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <Clock className="text-amber-500 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Menunggu Verifikasi</p>
          <p className="text-4xl font-black text-amber-500">{totalPending}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <CheckCircle className="text-emerald-500 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telah Disetujui</p>
          <p className="text-4xl font-black text-emerald-500">{totalApproved}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <XCircle className="text-rose-500 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pengajuan Ditolak</p>
          <p className="text-4xl font-black text-rose-500">{totalRejected}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-[2.5rem] shadow-2xl flex flex-col justify-center items-center py-8 text-white">
          <FileText className="text-slate-400 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Permohonan</p>
          <p className="text-4xl font-black">{antrean.length}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari pemohon, NIK, atau jenis surat..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {['Semua', 'Pending', 'Disetujui', 'Ditolak'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                filterStatus === st 
                  ? 'bg-slate-800 border-slate-850 text-white shadow-lg' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemohon & NIK</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Ajuan</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all font-black">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-700 leading-tight">{a.penduduk.namaLengkap}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{a.nikPemohon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-sm font-extrabold text-slate-700 leading-tight">{a.masterSurat.namaSurat}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{a.masterSurat.klasifikasi?.nama || 'Administrasi Umum'}</p>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(a.tanggalAjuan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        a.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        a.status === 'Disetujui' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        'bg-rose-50 border-rose-100 text-rose-600'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setViewingData(a)}
                          className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-150 flex items-center justify-center shadow-sm"
                          title="Lihat Detail Form"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {a.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => setApprovingId(a.id)}
                              disabled={loadingId !== null}
                              className="w-10 h-10 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-100 flex items-center justify-center shadow-sm"
                              title="Setujui & Cetak"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setRejectingId(a.id)}
                              disabled={loadingId !== null}
                              className="w-10 h-10 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all border border-rose-100 flex items-center justify-center shadow-sm"
                              title="Tolak Pengajuan"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                    Tidak ada antrean pengajuan yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VIEW DETAILS */}
      {viewingData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Detail Form Pengajuan</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Informasi Variabel Input Warga</p>
              </div>
              <button 
                onClick={() => setViewingData(null)}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full flex items-center justify-center transition-all border"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Pemohon</span>
                  <p className="font-extrabold text-slate-700 mt-1">{viewingData.penduduk.namaLengkap}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Keperluan Surat</span>
                  <p className="font-extrabold text-slate-700 mt-1">{viewingData.keperluan}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b pb-2">Variabel Formulir (Form Data)</h4>
                
                {viewingData.metaData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(JSON.parse(viewingData.metaData)).map(([key, val]: any) => (
                      <div key={key} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <p className="text-xs font-extrabold text-slate-700 mt-1 leading-normal">{val}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
                    <Info size={16} />
                    <p className="text-[11px] font-bold">Tidak ada variabel khusus yang diinput oleh warga.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APPROVE / SETUJUI */}
      {approvingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <form 
            onSubmit={handleApproveSubmit}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Setujui & Cetak Surat</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Berikan catatan ke warga pemohon</p>
              </div>
              <button 
                type="button"
                onClick={() => setApprovingId(null)}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full flex items-center justify-center transition-all border"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-4">
              <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Catatan Pengambilan (Opsional)</label>
              <textarea
                rows={3}
                placeholder="Contoh: Silahkan ambil di balai desa besok jam 09.00 pagi dengan membawa KK asli."
                value={catatanSetuju}
                onChange={(e) => setCatatanSetuju(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-350 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-inner"
              />
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={() => setApprovingId(null)}
                className="flex-1 py-4 bg-white text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest border"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loadingId !== null}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-200"
              >
                {loadingId ? 'Memproses...' : 'Setujui Pengajuan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL REJECT / TOLAK */}
      {rejectingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <form 
            onSubmit={handleRejectSubmit}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Tolak Pengajuan Surat</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Berikan Alasan Pembatalan Dokumen</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setAlasanBatal('');
                }}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full flex items-center justify-center transition-all border"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-4">
              <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Alasan Penolakan</label>
              <textarea
                required
                rows={3}
                placeholder="Contoh: Berkas persyaratan tidak lengkap atau NIK yang diinput bukan berdomisili RT/RW setempat..."
                value={alasanBatal}
                onChange={(e) => setAlasanBatal(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-350 focus:ring-4 focus:ring-rose-500/10 transition-all resize-none shadow-inner"
              />
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setAlasanBatal('');
                }}
                className="flex-1 py-4 bg-white text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest border"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loadingId !== null}
                className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rose-200"
              >
                {loadingId ? 'Memproses...' : 'Tolak Pengajuan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
