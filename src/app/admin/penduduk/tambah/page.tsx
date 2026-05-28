'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Home, Search, Loader2, BookOpen, Heart, Globe, Users, AlertCircle, CheckCircle2, RefreshCcw, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPenduduk } from '@/app/actions/penduduk';
import { getWilayahList } from '@/app/actions/wilayah';
import Swal from 'sweetalert2';

export default function TambahPendudukUnifiedPage() {
  const router = useRouter();
  const [noKk, setNoKk] = useState('');
  const [nik, setNik] = useState('');
  const [keluargaData, setKeluargaData] = useState<any>(null);
  const [isNewKk, setIsNewKk] = useState(false);
  const [loadingKk, setLoadingKk] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [nikExists, setNikExists] = useState(false);
  const [loadingNik, setLoadingNik] = useState(false);
  const [existingWargaName, setExistingWargaName] = useState('');

  const [wilayahList, setWilayahList] = useState<any[]>([]);
  const [selectedDusunId, setSelectedDusunId] = useState<number | null>(null);

  useEffect(() => {
    getWilayahList().then(data => setWilayahList(data));
  }, []);

  useEffect(() => {
    const checkKk = async () => {
      if (noKk.length === 16) {
        setLoadingKk(true);
        try {
          const res = await fetch(`/api/keluarga/${noKk}`);
          const result = await res.json();
          if (result.exists) {
            setKeluargaData(result.data);
            setIsNewKk(false);
          } else {
            setKeluargaData(null);
            setIsNewKk(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingKk(false);
        }
      } else {
        setKeluargaData(null);
        setIsNewKk(false);
      }
    };
    const timer = setTimeout(checkKk, 500);
    return () => clearTimeout(timer);
  }, [noKk]);

  useEffect(() => {
    const checkNik = async () => {
      if (nik.length === 16) {
        setLoadingNik(true);
        try {
          const res = await fetch(`/api/penduduk/${nik}`);
          if (res.status === 200) {
            const data = await res.json();
            setNikExists(true);
            setExistingWargaName(data.namaLengkap);
            Swal.fire({
              icon: 'warning',
              title: 'NIK Sudah Terdaftar!',
              html: `NIK <b class="font-mono text-rose-600">${nik}</b> sudah terdaftar di sistem atas nama <b>${data.namaLengkap}</b>.<br/><br/>Mohon gunakan NIK lain agar tidak terjadi duplikasi data.`,
              confirmButtonColor: '#10b981'
            });
          } else {
            setNikExists(false);
            setExistingWargaName('');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingNik(false);
        }
      } else {
        setNikExists(false);
        setExistingWargaName('');
      }
    };
    const timer = setTimeout(checkNik, 500);
    return () => clearTimeout(timer);
  }, [nik]);

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setter(val);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nikExists) {
      Swal.fire({
        icon: 'error',
        title: 'NIK Sudah Terdaftar!',
        text: `Data dengan NIK ${nik} sudah terdaftar atas nama ${existingWargaName}. Silakan gunakan NIK yang valid.`
      });
      return;
    }

    setIsSubmitting(true);
    Swal.fire({
      title: 'Menyimpan Data Warga...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData(e.currentTarget);
    try {
      const result = await createPenduduk(formData);
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Warga Berhasil Terdaftar!',
          text: 'Data kependudukan telah disimpan dengan aman.',
          showConfirmButton: false,
          timer: 1500
        });
        router.push('/admin/penduduk');
        router.refresh();
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mendaftar',
        text: err.message || 'Terjadi kesalahan internal. Pastikan NIK/No KK valid.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pendaftaran Penduduk Baru</h1>
          <p className="text-slate-500 text-sm italic">Kolom bertanda <span className="text-rose-500 font-bold">*</span> wajib diisi sesuai dokumen asli.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* STEP 1: VERIFIKASI KK */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <Search size={18} /> 1. Verifikasi Nomor KK
          </div>
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">No. Kartu Keluarga <span className="text-rose-500">*</span></label>
            <input 
              type="text" name="noKk" value={noKk} onChange={(e) => handleNumericInput(e, setNoKk)} placeholder="16 Digit No KK" required maxLength={16}
              className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-xl font-mono font-bold outline-none transition-all ${
                noKk.length === 16 ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'
              }`}
            />
            {noKk.length === 16 && !loadingKk && keluargaData?.kepalaKeluarga?.namaLengkap && (
              <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Kepala Keluarga Ditemukan</p>
                  <p className="text-sm font-bold text-slate-800">{keluargaData.kepalaKeluarga.namaLengkap}</p>
                </div>
              </div>
            )}
            {noKk.length > 0 && noKk.length < 16 && <p className="text-[10px] text-rose-600 font-bold mt-2">Kurang {16-noKk.length} digit</p>}
          </div>
        </div>

        {/* STEP 2: ALAMAT KELUARGA */}
        {(isNewKk || (noKk.length === 16 && !loadingKk)) && (
          <div className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 transition-all ${!isNewKk ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-2 text-slate-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
              <Home size={18} /> 2. Alamat & Domisili Keluarga
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <FormInput label="Alamat Lengkap" name="alamat" defaultValue={keluargaData?.alamat || ''} required={isNewKk} readOnly={!isNewKk} />
               </div>
               <div className="grid grid-cols-1 md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dusun <span className="text-rose-500">*</span></label>
                    <select 
                      name="dusun" 
                      required={isNewKk} 
                      disabled={!isNewKk} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      onChange={(e) => {
                        const dusunId = parseInt(e.target.selectedOptions[0].dataset.id || '0');
                        setSelectedDusunId(dusunId);
                      }}
                    >
                      <option value="">-- Pilih Dusun --</option>
                      {wilayahList.map(dusun => (
                        <option key={dusun.id} value={dusun.nama} data-id={dusun.id} selected={keluargaData?.dusun === dusun.nama}>
                          {dusun.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">RT / RW <span className="text-rose-500">*</span></label>
                    <select 
                      name="wilayahRtId" 
                      required={isNewKk} 
                      disabled={!isNewKk} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      onChange={(e) => {
                        // Untuk backward compatibility text, kita isi hidden input
                        const rtStr = e.target.selectedOptions[0].dataset.rt || '';
                        const rwStr = e.target.selectedOptions[0].dataset.rw || '';
                        const form = e.target.closest('form');
                        if (form) {
                           const rtInput = form.querySelector('input[name="rt"]') as HTMLInputElement;
                           const rwInput = form.querySelector('input[name="rw"]') as HTMLInputElement;
                           if (rtInput) rtInput.value = rtStr;
                           if (rwInput) rwInput.value = rwStr;
                        }
                      }}
                    >
                      <option value="">-- Pilih RT/RW --</option>
                      {wilayahList.find(d => d.id === selectedDusunId || d.nama === keluargaData?.dusun)?.rtRwList.map((rt: any) => (
                        <option key={rt.id} value={rt.id} data-rt={rt.rt} data-rw={rt.rw} selected={keluargaData?.wilayahRtId === rt.id || (keluargaData?.rt === rt.rt && keluargaData?.rw === rt.rw)}>
                          RT {rt.rt} / RW {rt.rw}
                        </option>
                      ))}
                    </select>
                    <input type="hidden" name="rt" value={keluargaData?.rt || ''} />
                    <input type="hidden" name="rw" value={keluargaData?.rw || ''} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4 md:col-span-2">
                  <FormInput label="Kecamatan" name="kecamatan" defaultValue={keluargaData?.kecamatan || 'LEMBEYAN'} required={isNewKk} readOnly={!isNewKk} />
                  <FormInput label="Kabupaten" name="kabupaten" defaultValue={keluargaData?.kabupaten || 'MAGETAN'} required={isNewKk} readOnly={!isNewKk} />
               </div>
            </div>
          </div>
        )}

        {/* STEP 3: IDENTITAS PERSONAL */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <User size={18} /> 3. Identitas Personal
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">NIK <span className="text-rose-500">*</span></label>
                <input 
                    type="text" name="nik" value={nik} onChange={(e) => handleNumericInput(e, setNik)} required maxLength={16}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl font-mono font-bold outline-none transition-all ${
                        nikExists ? 'border-rose-500 bg-rose-50/20 text-rose-700' : (nik.length === 16 ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50')
                    }`}
                />
                {nikExists && (
                  <p className="text-[10px] text-rose-600 font-bold mt-2 flex items-center gap-1 animate-pulse">
                    ⚠️ NIK sudah terdaftar atas nama: {existingWargaName}
                  </p>
                )}
                {loadingNik && <p className="text-[9px] text-slate-400 font-bold mt-1">Memeriksa NIK...</p>}
                {nik.length > 0 && nik.length < 16 && <p className="text-[9px] text-rose-600 font-bold mt-1">Kurang {16-nik.length} digit</p>}
            </div>
            <FormInput label="Nama Lengkap" name="namaLengkap" required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Tempat Lahir" name="tempatLahir" required />
              <FormInput label="Tanggal Lahir" name="tanggalLahir" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jenis Kelamin <span className="text-rose-500">*</span></label>
                    <select name="jenisKelamin" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                        <option value="L">LAKI-LAKI</option><option value="P">PEREMPUAN</option>
                    </select>
                </div>
                <FormInput label="Golongan Darah" name="golonganDarah" placeholder="Contoh: O" />
            </div>
          </div>
        </div>

        {/* STEP 4: STATUS & PENDIDIKAN */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <BookOpen size={18} /> 4. Pendidikan, Pekerjaan & Agama
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Agama <span className="text-rose-500">*</span></label>
              <select name="agama" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                <option>ISLAM</option><option>KRISTEN</option><option>KATOLIK</option><option>HINDU</option><option>BUDHA</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status Perkawinan <span className="text-rose-500">*</span></label>
              <select name="statusPerkawinan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                <option value="BELUM KAWIN">BELUM KAWIN</option><option value="KAWIN">KAWIN</option><option value="CERAI HIDUP">CERAI HIDUP</option><option value="CERAI MATI">CERAI MATI</option>
              </select>
            </div>
            <FormInput label="Pendidikan Terakhir" name="pendidikanTerakhir" />
            <FormInput label="Pekerjaan" name="pekerjaan" />
          </div>
        </div>

        {/* STEP 5: HUBUNGAN & ORANG TUA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-amber-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <Users size={18} /> 5. Hubungan Keluarga & Orang Tua
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hubungan Keluarga <span className="text-rose-500">*</span></label>
              <select name="statusDalamKeluarga" defaultValue={isNewKk ? 'KEPALA KELUARGA' : 'ANAK'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                <option>KEPALA KELUARGA</option><option>ISTRI</option><option>ANAK</option><option>MENANTU</option><option>CUCU</option><option>ORANG TUA</option><option>MERTUA</option><option>NUMPANG KK</option>
              </select>
            </div>
            <FormInput label="Nama Ibu Kandung" name="namaIbu" required />
            <FormInput label="Nama Ayah" name="namaAyah" />
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Kewarganegaraan <span className="text-rose-500">*</span></label>
                <select name="kewarganegaraan" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                    <option value="WNI">WNI</option><option value="WNA">WNA</option>
                </select>
            </div>
          </div>
        </div>

        {/* STEP 6: DOKUMEN & FOTO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <Globe size={18} /> 6. Dokumen Tambahan
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput label="No Paspor" name="noPaspor" />
            <FormInput label="No KITAS/KITAP" name="noKitas" />
            <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Foto Warga</label>
                <input type="file" name="foto" accept="image/*" className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            </div>
            <div className={`md:col-span-2 p-4 rounded-2xl border-2 transition-all ${isNewKk ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Scan / Foto Kartu Keluarga (KK)</span>
                  <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-black">OPSIONAL</span>
                </label>
                <input type="file" name="fotoKk" accept="image/*,application/pdf" className="w-full px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs" />
                {isNewKk && <p className="text-[9px] text-emerald-600 font-bold mt-2 italic">* Disarankan upload KK untuk arsip digital keluarga baru.</p>}
            </div>
          </div>
        </div>
        {/* STEP 7: STATUS KEDATANGAN (MUTASI) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-amber-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <RefreshCcw size={18} /> 7. Status Kedatangan (Mutasi)
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
             <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                <input 
                  type="checkbox" 
                  id="isMutasi" 
                  name="isMutasi" 
                  value="true"
                  className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isMutasi" className="font-bold text-slate-700 cursor-pointer text-sm">
                   Warga baru ini adalah pindahan / baru lahir (Catat di Buku Mutasi)
                </label>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jenis Kedatangan</label>
                   <select name="jenisMutasi" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700">
                      <option value="PINDAH MASUK">PINDAH DATANG</option>
                      <option value="KELAHIRAN">KELAHIRAN BARU</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tanggal Kedatangan</label>
                   <input type="date" name="tanggalMutasi" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-700" />
                </div>
                <div className="md:col-span-2 space-y-4">
                   <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} /> Alamat Asal (Lengkap)
                      </h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                           <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Alamat / Jalan</label>
                           <textarea name="alamatAsal" rows={2} placeholder="Contoh: Jl. Mawar No. 123, RT 01 RW 02" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Desa / Kelurahan</label>
                           <input name="desaAsal" placeholder="Desa Asal" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Kecamatan</label>
                           <input name="kecamatanAsal" placeholder="Kecamatan Asal" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Kabupaten / Kota</label>
                           <input name="kabupatenAsal" placeholder="Kabupaten Asal" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Provinsi</label>
                           <input name="provinsiAsal" placeholder="Provinsi Asal" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                        </div>
                        <div>
                           <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Kode Pos</label>
                           <input name="kodePosAsal" placeholder="Contoh: 63372" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/penduduk" className="px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Batal</Link>
          <button 
            type="submit" 
            disabled={noKk.length !== 16 || nik.length !== 16 || isSubmitting} 
            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                (noKk.length === 16 && nik.length === 16 && !isSubmitting) ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
            {isSubmitting ? 'Memproses...' : 'Simpan Data Warga'}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, type = "text", defaultValue = "", placeholder = "", required = false, maxLength, readOnly = false }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input 
        type={type} name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} maxLength={maxLength} readOnly={readOnly}
        className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition-all ${readOnly ? 'bg-slate-100 border-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 border-slate-200 focus:border-emerald-500'}`}
      />
    </div>
  );
}
