'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Inbox, 
  FileText, 
  Search, 
  Filter, 
  UserCheck, 
  Printer, 
  Calendar, 
  Trash2, 
  X, 
  UploadCloud,
  FileCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  getSuratMasuk, 
  createSuratMasuk, 
  updateDisposisiSurat, 
  deleteSuratMasuk 
} from '@/app/actions/surat-masuk';
import { getMasterSurat } from '@/app/actions/surat';

export default function SuratMasukPage() {
  const [suratList, setSuratList] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterDisposisi, setFilterDisposisi] = useState('Semua');
  const [loading, setLoading] = useState(false);

  // Modals States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [disposisiTarget, setDisposisiTarget] = useState<any | null>(null);
  const [printTarget, setPrintTarget] = useState<any | null>(null);

  // New Surat Masuk Form State
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [perihal, setPerihal] = useState('');
  const [klasifikasiId, setKlasifikasiId] = useState<number>(0);
  const [fileScan, setFileScan] = useState('');

  // Disposisi Form State
  const [disposisiKepada, setDisposisiKepada] = useState('');
  const [catatanDisposisi, setCatatanDisposisi] = useState('');
  const [statusDisposisi, setStatusDisposisi] = useState('Dalam Proses');

  const fetchAll = async () => {
    try {
      const list = await getSuratMasuk();
      setSuratList(list as any[]);
      const t = await getMasterSurat();
      // Extract unique Klasifikasi from templates
      const uniqueKlasifikasi = Array.from(new Map(t.map(item => [item.klasifikasi?.id, item.klasifikasi])).values());
      setTemplates(uniqueKlasifikasi.filter(Boolean));
    } catch (err) {
      console.error("Gagal memuat data surat masuk", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorSurat || !tanggalSurat || !pengirim || !perihal) {
      alert('Semua kolom wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      await createSuratMasuk({
        nomorSurat,
        tanggalSurat: new Date(tanggalSurat),
        pengirim,
        perihal,
        klasifikasiId: klasifikasiId || undefined,
        fileScan: fileScan || undefined
      });
      setIsAddOpen(false);
      // Reset form
      setNomorSurat('');
      setTanggalSurat('');
      setPengirim('');
      setPerihal('');
      setKlasifikasiId(0);
      setFileScan('');
      fetchAll();
    } catch (err) {
      alert('Gagal meregistrasi surat masuk.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisposisiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disposisiTarget) return;
    if (!disposisiKepada || !catatanDisposisi) {
      alert('Tentukan perangkat desa dan tulis catatan disposisi.');
      return;
    }
    setLoading(true);
    try {
      await updateDisposisiSurat(disposisiTarget.id, {
        disposisiKepada,
        catatanDisposisi,
        statusDisposisi
      });
      setDisposisiTarget(null);
      setDisposisiKepada('');
      setCatatanDisposisi('');
      setStatusDisposisi('Dalam Proses');
      fetchAll();
    } catch (err) {
      alert('Gagal memperbarui disposisi surat.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data kearsipan surat masuk ini secara permanen?')) return;
    try {
      await deleteSuratMasuk(id);
      fetchAll();
    } catch (err) {
      alert('Gagal menghapus arsip surat masuk.');
    }
  };

  // Stats
  const totalMasuk = suratList.length;
  const totalBelumProses = suratList.filter(s => s.statusDisposisi === 'Belum Diproses').length;
  const totalDalamProses = suratList.filter(s => s.statusDisposisi === 'Dalam Proses').length;
  const totalSelesai = suratList.filter(s => s.statusDisposisi === 'Selesai').length;

  // Filter lists
  const filtered = suratList.filter(s => {
    const matchesSearch = 
      s.nomorSurat.toLowerCase().includes(search.toLowerCase()) ||
      s.pengirim.toLowerCase().includes(search.toLowerCase()) ||
      s.perihal.toLowerCase().includes(search.toLowerCase());

    if (filterDisposisi === 'Semua') return matchesSearch;
    return matchesSearch && s.statusDisposisi === filterDisposisi;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kearsipan Surat Masuk</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Manajemen Arsip Surat Dinas Eksternal & Alur Disposisi
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/surat"
            className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest"
          >
            Dashboard
          </Link>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs"
          >
            <Plus size={18} />
            <span>Registrasi Surat</span>
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:hidden">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <Inbox className="text-emerald-600 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Surat Masuk</p>
          <p className="text-4xl font-black text-emerald-600">{totalMasuk}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <AlertCircle className="text-amber-500 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Belum Didisposisikan</p>
          <p className="text-4xl font-black text-amber-500">{totalBelumProses}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <FileCheck className="text-blue-500 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dalam Proses Tugas</p>
          <p className="text-4xl font-black text-blue-500">{totalDalamProses}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center py-8">
          <CheckCircle className="text-slate-700 mb-2" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pekerjaan Selesai</p>
          <p className="text-4xl font-black text-slate-700">{totalSelesai}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
        <div className="relative flex-1 w-full max-w-lg">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari perihal, nomor surat, atau pengirim..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {['Semua', 'Belum Diproses', 'Dalam Proses', 'Selesai'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterDisposisi(st)}
              className={`flex-1 md:flex-initial px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                filterDisposisi === st 
                  ? 'bg-slate-800 border-slate-850 text-white shadow-lg' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Surat & Nomor</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asal Pengirim</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Surat</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Tugas</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all font-black">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-700 leading-tight line-clamp-1">{s.perihal}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.nomorSurat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <p className="text-sm font-extrabold text-slate-700 leading-tight">{s.pengirim}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{s.klasifikasi?.nama || 'Umum Dinas'}</p>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(s.tanggalSurat).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        s.statusDisposisi === 'Belum Diproses' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        s.statusDisposisi === 'Dalam Proses' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        'bg-slate-550 border-slate-100 text-slate-500'
                      }`}>
                        {s.statusDisposisi}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setDisposisiTarget(s)}
                          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-wider border flex items-center gap-2 shadow-sm"
                          title="Tulis Disposisi"
                        >
                          <UserCheck size={12} />
                          <span>Disposisi</span>
                        </button>
                        
                        {s.statusDisposisi !== 'Belum Diproses' && (
                          <button
                            onClick={() => {
                              setPrintTarget(s);
                              setTimeout(() => window.print(), 300);
                            }}
                            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border flex items-center justify-center shadow-sm"
                            title="Cetak Lembar Disposisi"
                          >
                            <Printer size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(s.id)}
                          className="w-10 h-10 bg-white text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-slate-200/50 shadow-sm"
                          title="Hapus Arsip"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                    Tidak ada arsip surat masuk yang terdaftar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT AREA: LEMBAR DISPOSISI DINAS */}
      {printTarget && (
        <div className="hidden print:block max-w-4xl mx-auto p-12 bg-white text-black font-serif text-sm">
          {/* Header Kop Lembar Disposisi */}
          <div className="text-center space-y-2 border-b-4 border-double border-black pb-6 mb-8">
            <h2 className="text-lg font-black uppercase tracking-wider">Pemerintah Kabupaten Magetan</h2>
            <h3 className="text-lg font-black uppercase tracking-wider">Kecamatan Kawedanan</h3>
            <h1 className="text-2xl font-black uppercase tracking-wide">Kantor Kepala Desa Kediren</h1>
            <p className="text-xs font-bold italic">Alamat: Jl. Raya Kediren No. 01, Kode Pos 63382</p>
          </div>

          <h2 className="text-center text-xl font-black uppercase tracking-widest border-b pb-2 mb-8">Lembar Disposisi Kepala Desa</h2>

          {/* Surat Detail */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 border p-6 rounded-xl mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Asal Pengirim / Instansi</span>
              <p className="font-extrabold text-base mt-1">{printTarget.pengirim}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nomor Surat Dinas</span>
              <p className="font-extrabold text-base mt-1">{printTarget.nomorSurat}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Perihal / Subjek</span>
              <p className="font-bold mt-1 leading-relaxed">{printTarget.perihal}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tanggal Diterima Desa</span>
              <p className="font-bold mt-1">
                {new Date(printTarget.tanggalDiterima).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Disposisi Penugasan */}
          <div className="border p-8 rounded-xl space-y-6">
            <div className="pb-4 border-b">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Instruksi Tugas Kepada</span>
              <p className="font-black text-lg text-emerald-950 mt-1">{printTarget.disposisiKepada}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Catatan Arahan Kepala Desa</span>
              <p className="mt-2 text-base leading-relaxed whitespace-pre-line italic font-bold">"{printTarget.catatanDisposisi}"</p>
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className="mt-16 flex justify-end">
            <div className="text-center w-64 space-y-16">
              <div>
                <p className="text-xs">Kediren, {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p className="font-black uppercase tracking-wide text-xs">Kepala Desa Kediren</p>
              </div>
              <div>
                <p className="font-black underline uppercase text-xs">Drs. H. Purnomo, M.Si</p>
                <p className="text-[10px] font-bold text-slate-500">NIP. 19680324 199403 1 004</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD SURAT MASUK */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <form 
            onSubmit={handleAddSubmit}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Registrasi Surat Masuk</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Catat Surat Keluar Dari Pihak Luar</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full flex items-center justify-center transition-all border"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nomor Surat */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Nomor Surat Dinas</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 140/25/Kec.01/2026..."
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                  />
                </div>

                {/* Tanggal Surat */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Tanggal Surat Dinas</label>
                  <input
                    type="date"
                    required
                    value={tanggalSurat}
                    onChange={(e) => setTanggalSurat(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                  />
                </div>

                {/* Pengirim */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Asal Instansi / Pengirim</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kantor Camat Kawedanan..."
                    value={pengirim}
                    onChange={(e) => setPengirim(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                  />
                </div>

                {/* Klasifikasi */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Klasifikasi Arsip</label>
                  <select
                    value={klasifikasiId}
                    onChange={(e) => setKlasifikasiId(parseInt(e.target.value))}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner cursor-pointer"
                  >
                    <option value={0}>-- Kategori Umum --</option>
                    {templates.map(kl => (
                      <option key={kl.id} value={kl.id}>{kl.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Perihal */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Perihal / Hal Surat</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Undangan Rapat Koordinasi Posyandu Se-Kecamatan..."
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Upload Mock / FileScan URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Unggah Berkas Scan Surat (Optional)</label>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer">
                  <UploadCloud className="text-slate-300 mb-2" size={32} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Klik atau seret file PDF / scan surat</span>
                  <input 
                    type="text" 
                    placeholder="Atau tempel Link Berkas Scan..." 
                    value={fileScan}
                    onChange={(e) => setFileScan(e.target.value)}
                    className="w-full max-w-sm mt-3 px-4 py-2 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-center focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="flex-1 py-4 bg-white text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-250"
              >
                {loading ? 'Menyimpan...' : 'Registrasikan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DISPOSISI */}
      {disposisiTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <form 
            onSubmit={handleDisposisiSubmit}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
          >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Penerbitan Disposisi</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tugaskan Perangkat Desa Kediren</p>
              </div>
              <button 
                type="button"
                onClick={() => setDisposisiTarget(null)}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full flex items-center justify-center transition-all border"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Tugaskan Kepada */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Tugaskan Kepada Perangkat</label>
                <select
                  required
                  value={disposisiKepada}
                  onChange={(e) => setDisposisiKepada(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner cursor-pointer"
                >
                  <option value="">-- Pilih Staf Perangkat --</option>
                  <option value="Sekretaris Desa (Sekdes)">Sekretaris Desa (Sekdes)</option>
                  <option value="Kaur Keuangan">Kaur Keuangan</option>
                  <option value="Kaur Tata Usaha & Umum">Kaur Tata Usaha & Umum</option>
                  <option value="Kasi Pemerintahan">Kasi Pemerintahan</option>
                  <option value="Kasi Kesejahteraan (Kesra)">Kasi Kesejahteraan (Kesra)</option>
                  <option value="Kasi Pelayanan">Kasi Pelayanan</option>
                  <option value="Kepala Dusun (Kasun) I">Kepala Dusun (Kasun) I</option>
                  <option value="Kepala Dusun (Kasun) II">Kepala Dusun (Kasun) II</option>
                </select>
              </div>

              {/* Catatan Disposisi */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest px-1">Arahan / Petunjuk Tugas</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Harap hadir mewakili Kepala Desa dan susun notulen hasil koordinasi paling lambat H+1..."
                  value={catatanDisposisi}
                  onChange={(e) => setCatatanDisposisi(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none shadow-inner"
                />
              </div>

              {/* Status Disposisi */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest px-1">Status Penugasan</label>
                <div className="flex gap-3">
                  {['Dalam Proses', 'Selesai'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusDisposisi(st)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        statusDisposisi === st 
                          ? 'bg-slate-800 border-slate-850 text-white shadow-lg' 
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={() => setDisposisiTarget(null)}
                className="flex-1 py-4 bg-white text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-250"
              >
                {loading ? 'Mengirimkan...' : 'Simpan Arahan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
