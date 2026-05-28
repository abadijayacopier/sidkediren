'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCcw,
  Calendar,
  FileText,
  Search,
  User,
  Home
} from 'lucide-react';
import { laporMutasi, mutasiPecahKK, searchWargaAktif } from '@/app/actions/mutasi';

export default function MutasiModal({ 
  warga = null, 
  onClose 
}: { 
  warga?: { 
    nik: string, 
    namaLengkap: string, 
    keluarga?: { kepalaKeluargaNik: string, alamat: string, dusun: string, rt: string, rw: string } 
  } | null, 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [jenisMutasi, setJenisMutasi] = useState('');
  
  // State pencarian warga
  const [selectedWarga, setSelectedWarga] = useState<any>(warga);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const results = await searchWargaAktif(query);
    setSearchResults(results);
    setSearching(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedWarga) {
      alert('Harap pilih warga terlebih dahulu.');
      return;
    }
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = jenisMutasi === 'PECAH KK' 
      ? await mutasiPecahKK(formData)
      : await laporMutasi(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <RefreshCcw size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Lapor Mutasi Warga</h3>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                {selectedWarga ? selectedWarga.namaLengkap : 'PILIH WARGA'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800">Laporan Terkirim!</h4>
              <p className="text-sm text-slate-500">Status warga berhasil diperbarui & tercatat di log mutasi.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
            
            {/* Bagian Pencarian Warga (jika belum dipilih) */}
            {!selectedWarga ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Cari Warga (Nama / NIK)</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Ketik minimal 2 karakter untuk mencari..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 placeholder-slate-400 text-sm transition-all"
                    />
                  </div>
                </div>

                {searching && (
                  <p className="text-xs text-slate-400 italic animate-pulse">Mencari di database warga Kediren...</p>
                )}

                {searchResults.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto bg-slate-50 shadow-inner">
                    {searchResults.map((w: any) => (
                      <button
                        key={w.nik}
                        type="button"
                        onClick={() => setSelectedWarga(w)}
                        className="w-full px-5 py-3 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{w.namaLengkap}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIK: {w.nik} | No. KK: {w.noKk}</p>
                        </div>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-xl font-bold uppercase shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">Pilih</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.trim().length >= 2 && searchResults.length === 0 && !searching && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-400 italic">
                    Warga tidak ditemukan atau status sudah tidak aktif (meninggal/pindah).
                  </div>
                )}
              </div>
            ) : (
              /* Tampilan Info Warga Terpilih */
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Warga Terpilih</p>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{selectedWarga.namaLengkap}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIK: {selectedWarga.nik} | No. KK: {selectedWarga.noKk}</p>
                  </div>
                </div>
                {!warga && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWarga(null);
                      setSearchQuery('');
                      setSearchResults([]);
                      setJenisMutasi('');
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-black transition-all shrink-0 uppercase tracking-wider"
                  >
                    Ganti
                  </button>
                )}
              </div>
            )}

            {/* Form Fields - Hanya muncul jika warga sudah dipilih */}
            {selectedWarga && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                <input type="hidden" name="nik" value={selectedWarga.nik} />
                <input type="hidden" name="nikKepalaLama" value={selectedWarga.keluarga?.kepalaKeluargaNik || ''} />
                <input type="hidden" name="petugasInput" value="Admin Desa" />

                <div className="space-y-4">
                  {/* Jenis Mutasi */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Jenis Kejadian</label>
                    <select 
                      name="jenisMutasi" 
                      required 
                      value={jenisMutasi}
                      onChange={(e) => setJenisMutasi(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                    >
                      <option value="">-- Pilih Kejadian --</option>
                      <option value="KEMATIAN">MENINGGAL DUNIA</option>
                      <option value="PINDAH KELUAR">PINDAH KELUAR DESA</option>
                      <option value="PECAH KK">PECAH KK / KK BARU</option>
                      <option value="PINDAH MASUK">PINDAH MASUK / DATANG</option>
                      <option value="KELAHIRAN">KELAHIRAN BARU</option>
                    </select>
                  </div>

                  {/* Form Tambahan untuk PECAH KK */}
                  {jenisMutasi === 'PECAH KK' && (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4 animate-in slide-in-from-top duration-300">
                       <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-2 mb-2 uppercase tracking-widest">
                         <FileText size={14} /> Data Keluarga Baru
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Nomor KK Baru</label>
                            <input name="noKkBaru" required placeholder="16 Digit No. KK" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold placeholder-emerald-300" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Dusun</label>
                            <input name="dusunBaru" required defaultValue={selectedWarga.keluarga?.dusun} className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">RT</label>
                            <input name="rtBaru" required defaultValue={selectedWarga.keluarga?.rt} className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">RW</label>
                            <input name="rwBaru" required defaultValue={selectedWarga.keluarga?.rw} className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                          </div>
                       </div>
                       <div>
                          <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Alamat Baru</label>
                          <textarea name="alamatBaru" required defaultValue={selectedWarga.keluarga?.alamat} rows={2} className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm"></textarea>
                       </div>
                       <div>
                          <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block flex items-center justify-between">
                             <span>Upload Scan / Foto KK Baru</span>
                             <span className="text-[8px] bg-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded-md font-black">OPSIONAL</span>
                          </label>
                          <input type="file" name="fotoKk" accept="image/*,application/pdf" className="w-full px-4 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs cursor-pointer" />
                       </div>
                    </div>
                  )}

                  {/* Form Tambahan untuk PINDAH KELUAR */}
                  {jenisMutasi === 'PINDAH KELUAR' && (
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4 animate-in slide-in-from-top duration-300">
                       <h4 className="font-bold text-blue-800 text-xs flex items-center gap-2 mb-2 uppercase tracking-widest">
                         <FileText size={14} /> Alamat Tujuan Pindah
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">Alamat Lengkap Tujuan</label>
                            <textarea name="alamatTujuan" required placeholder="Nama Jalan, No. Rumah, RT/RW" rows={2} className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">Desa/Kelurahan</label>
                            <input name="desaTujuan" required placeholder="Desa Tujuan" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">Kecamatan</label>
                            <input name="kecamatanTujuan" required placeholder="Kecamatan Tujuan" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">Kabupaten/Kota</label>
                            <input name="kabupatenTujuan" required placeholder="Kabupaten Tujuan" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">Provinsi</label>
                            <input name="provinsiTujuan" required placeholder="Provinsi Tujuan" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-blue-600 uppercase mb-1 block">Kode Pos</label>
                            <input name="kodePosTujuan" placeholder="63372" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Form Tambahan untuk PINDAH MASUK */}
                  {jenisMutasi === 'PINDAH MASUK' && (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4 animate-in slide-in-from-top duration-300">
                       <h4 className="font-bold text-emerald-800 text-xs flex items-center gap-2 mb-2 uppercase tracking-widest">
                         <FileText size={14} /> Alamat Asal (Lengkap)
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Alamat / Jalan Asal</label>
                            <textarea name="alamatAsal" required placeholder="Nama Jalan, No. Rumah, RT/RW" rows={2} className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Desa/Kelurahan</label>
                            <input name="desaAsal" required placeholder="Desa Asal" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Kecamatan</label>
                            <input name="kecamatanAsal" required placeholder="Kecamatan Asal" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Kabupaten/Kota</label>
                            <input name="kabupatenAsal" required placeholder="Kabupaten Asal" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Provinsi</label>
                            <input name="provinsiAsal" required placeholder="Provinsi Asal" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Kode Pos</label>
                            <input name="kodePosAsal" placeholder="63372" className="w-full px-4 py-2 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium" />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Tanggal */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Kejadian</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="date" 
                        name="tanggalMutasi" 
                        required 
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" 
                      />
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Keterangan / Alasan</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                      <textarea 
                        name="keterangan" 
                        placeholder="Contoh: Sakit, Pindah ke Surabaya, dll..."
                        rows={3}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                  <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                    <span className="font-bold">PERINGATAN:</span> Tindakan ini akan mengubah status warga di database utama dan memindahkannya ke daftar arsip mutasi.
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Memproses...' : 'Simpan Laporan Mutasi'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
