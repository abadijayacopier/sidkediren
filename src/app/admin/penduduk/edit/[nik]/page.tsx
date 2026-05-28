'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Home, BookOpen, Heart, Globe, Users, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { updatePenduduk } from '@/app/actions/penduduk';
import { getWilayahList } from '@/app/actions/wilayah';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const getAvatarUrl = (w: any) => {
  if (!w) return '';
  if (w.foto) return w.foto;
  return w.jenisKelamin === 'L' ? '/avatars/male.svg' : '/avatars/female.svg';
};

export default function EditPendudukPage() {
  const params = useParams();
  const router = useRouter();
  const nikParam = params.nik as string;

  const [warga, setWarga] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nik, setNik] = useState('');
  const [noKk, setNoKk] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [wilayahList, setWilayahList] = useState<any[]>([]);
  const [selectedDusunId, setSelectedDusunId] = useState<number | null>(null);

  useEffect(() => {
    getWilayahList().then(data => setWilayahList(data));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/penduduk/${nikParam}`);
        const data = await res.json();
        setWarga(data);
        setNik(data.nik);
        setNoKk(data.noKk);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [nikParam]);

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setter(val);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    Swal.fire({
      title: 'Menyimpan Perubahan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData(e.currentTarget);
    try {
      const result = await updatePenduduk(formData);
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Perubahan Berhasil Disimpan!',
          text: 'Biodata warga telah diperbarui.',
          showConfirmButton: false,
          timer: 1500
        });
        router.push(`/admin/penduduk/view/${result.nik}`);
        router.refresh();
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.message || 'Terjadi kesalahan saat menyimpan perubahan.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-slate-500 font-bold">Memuat Data...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
          <ArrowLeft size={24} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Data Warga</h1>
            <p className="text-slate-500 text-sm italic">Tanda <span className="text-rose-500 font-bold">*</span> adalah kolom wajib (tidak boleh kosong).</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <input type="hidden" name="oldNik" value={warga.nik} />

        {/* 1. IDENTITAS UTAMA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <User size={18} /> 1. Identitas Utama & NIK
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">NIK <span className="text-rose-500">*</span></label>
              <input 
                type="text" name="nik" value={nik} onChange={(e) => handleNumericInput(e, setNik)} maxLength={16} required
                className={`w-full px-4 py-2.5 border-2 rounded-xl font-mono font-bold outline-none transition-all ${
                    nik.length === 16 ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30'
                }`} 
              />
              {nik.length < 16 && <p className="text-[9px] text-rose-600 font-bold mt-1 uppercase">Kurang {16-nik.length} Digit</p>}
            </div>
            <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">No. KK <span className="text-rose-500">*</span></label>
                <input 
                    type="text" name="noKk" value={noKk} onChange={(e) => handleNumericInput(e, setNoKk)} required maxLength={16}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl font-mono font-bold outline-none transition-all ${
                        noKk.length === 16 ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30'
                    }`} 
                />
                {noKk.length < 16 && <p className="text-[9px] text-rose-600 font-bold mt-1 uppercase">Kurang {16-noKk.length} Digit</p>}
            </div>
            <FormInput label="Nama Lengkap" name="namaLengkap" defaultValue={warga.namaLengkap} required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Tempat Lahir" name="tempatLahir" defaultValue={warga.tempatLahir} required />
              <FormInput label="Tanggal Lahir" name="tanggalLahir" type="date" defaultValue={warga.tanggalLahir?.split('T')[0]} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Jenis Kelamin <span className="text-rose-500">*</span></label>
                    <select name="jenisKelamin" defaultValue={warga.jenisKelamin} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                        <option value="L">LAKI-LAKI</option><option value="P">PEREMPUAN</option>
                    </select>
                </div>
                <FormInput label="Golongan Darah" name="golonganDarah" defaultValue={warga.golonganDarah || '-'} />
            </div>
          </div>
        </div>

        {/* 2. ALAMAT KELUARGA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-slate-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <Home size={18} /> 2. Alamat & Lokasi Domisili
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <FormInput label="Alamat Jalan" name="alamat" defaultValue={warga.keluarga?.alamat || ''} required />
            </div>
            <div className="grid grid-cols-1 md:col-span-2 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dusun <span className="text-rose-500">*</span></label>
                  <select 
                    name="dusun" 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => {
                      const dusunId = parseInt(e.target.selectedOptions[0].dataset.id || '0');
                      setSelectedDusunId(dusunId);
                    }}
                  >
                    <option value="">-- Pilih Dusun --</option>
                    {wilayahList.map(dusun => (
                      <option key={dusun.id} value={dusun.nama} data-id={dusun.id} selected={warga.keluarga?.dusun === dusun.nama}>
                        {dusun.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">RT / RW <span className="text-rose-500">*</span></label>
                  <select 
                    name="wilayahRtId" 
                    required 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    onChange={(e) => {
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
                    {wilayahList.find(d => d.id === selectedDusunId || d.nama === warga.keluarga?.dusun)?.rtRwList.map((rt: any) => (
                      <option key={rt.id} value={rt.id} data-rt={rt.rt} data-rw={rt.rw} selected={warga.keluarga?.wilayahRtId === rt.id || (warga.keluarga?.rt === rt.rt && warga.keluarga?.rw === rt.rw)}>
                        RT {rt.rt} / RW {rt.rw}
                      </option>
                    ))}
                  </select>
                  <input type="hidden" name="rt" value={warga.keluarga?.rt || ''} />
                  <input type="hidden" name="rw" value={warga.keluarga?.rw || ''} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <FormInput label="Kecamatan" name="kecamatan" defaultValue={warga.keluarga?.kecamatan || 'LEMBEYAN'} required />
                <FormInput label="Kabupaten" name="kabupaten" defaultValue={warga.keluarga?.kabupaten || 'MAGETAN'} required />
            </div>
          </div>
        </div>

        {/* 3. STATUS & PENDIDIKAN */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <BookOpen size={18} /> 3. Pendidikan, Pekerjaan & Agama
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Agama <span className="text-rose-500">*</span></label>
              <select name="agama" defaultValue={warga.agama || 'ISLAM'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                <option>ISLAM</option><option>KRISTEN</option><option>KATOLIK</option><option>HINDU</option><option>BUDHA</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status Perkawinan <span className="text-rose-500">*</span></label>
              <select name="statusPerkawinan" defaultValue={warga.statusPerkawinan || 'BELUM KAWIN'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                <option value="BELUM KAWIN">BELUM KAWIN</option><option value="KAWIN">KAWIN</option><option value="CERAI HIDUP">CERAI HIDUP</option><option value="CERAI MATI">CERAI MATI</option>
              </select>
            </div>
            <FormInput label="Pendidikan Terakhir" name="pendidikanTerakhir" defaultValue={warga.pendidikanTerakhir || ''} />
            <FormInput label="Pekerjaan" name="pekerjaan" defaultValue={warga.pekerjaan || ''} />
          </div>
        </div>

        {/* 4. KELUARGA & ORANG TUA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-amber-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <Users size={18} /> 4. Hubungan Keluarga & Orang Tua
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hubungan Keluarga <span className="text-rose-500">*</span></label>
              <select name="statusDalamKeluarga" defaultValue={warga.statusDalamKeluarga || 'ANAK'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                <option>KEPALA KELUARGA</option><option>ISTRI</option><option>ANAK</option><option>MENANTU</option><option>CUCU</option><option>ORANG TUA</option><option>MERTUA</option><option>NUMPANG KK</option>
              </select>
            </div>
            <FormInput label="Nama Ibu Kandung" name="namaIbu" defaultValue={warga.namaIbu || ''} required />
            <FormInput label="Nama Ayah" name="namaAyah" defaultValue={warga.namaAyah || ''} />
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Kewarganegaraan <span className="text-rose-500">*</span></label>
                <select name="kewarganegaraan" defaultValue={warga.kewarganegaraan || 'WNI'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" required>
                    <option value="WNI">WNI</option><option value="WNA">WNA</option>
                </select>
            </div>
          </div>
        </div>

        {/* 5. DOKUMEN & FOTO WARGA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider text-sm">
            <Globe size={18} /> 5. Dokumen & Foto Warga
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Foto Warga */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Foto Profil Warga</label>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white border rounded-xl overflow-hidden shadow-sm flex items-center justify-center shrink-0 relative group/avatar">
                  <img 
                    src={getAvatarUrl(warga)} 
                    alt="Foto Profil" 
                    className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unggah Foto Baru</p>
                  <input 
                    type="file" 
                    name="foto" 
                    accept="image/*" 
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
                  />
                  <p className="text-[9px] text-slate-400 italic">Format: JPG, JPEG, PNG (Maks 2MB)</p>
                </div>
              </div>
            </div>

            {/* Foto KK */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scan / Foto Kartu Keluarga (KK)</label>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white border rounded-xl overflow-hidden shadow-sm flex items-center justify-center shrink-0">
                  {warga.keluarga?.fotoKk ? (
                    <img src={warga.keluarga.fotoKk} alt="Scan KK" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-350 text-[10px] font-black uppercase tracking-tight text-center p-2 leading-none flex items-center justify-center h-full w-full">
                      Belum Ada Scan
                    </div>
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unggah Scan KK Baru</p>
                  <input 
                    type="file" 
                    name="fotoKk" 
                    accept="image/*,application/pdf" 
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" 
                  />
                  <p className="text-[9px] text-slate-400 italic">Format: JPG, PNG, PDF (Maks 5MB)</p>
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
            disabled={nik.length !== 16 || noKk.length !== 16 || isSubmitting}
            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                (nik.length === 16 && noKk.length === 16 && !isSubmitting) ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
            {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormInput({ label, name, type = "text", defaultValue = "", placeholder = "", required = false, maxLength }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input 
        type={type} name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} maxLength={maxLength}
        className={`w-full px-4 py-2.5 bg-slate-50 border-2 rounded-xl outline-none transition-all ${required ? 'border-slate-200' : 'border-slate-100'} focus:border-emerald-500`}
      />
    </div>
  );
}
