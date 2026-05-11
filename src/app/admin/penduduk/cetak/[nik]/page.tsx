import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function CetakBiodataPage({ params }: { params: { nik: string } }) {
  const { nik } = await params;
  const warga = await prisma.penduduk.findUnique({
    where: { nik },
    include: { keluarga: true }
  });

  if (!warga) return notFound();

  return (
    <div className="bg-white min-h-screen p-10 font-serif text-slate-900">
      {/* Tombol Print Otomatis */}
      <script dangerouslySetInnerHTML={{ __html: `window.onload = () => { window.print(); }` }} />

      {/* Kop Surat Desa */}
      <div className="text-center border-b-4 border-double border-slate-800 pb-4 mb-8">
        <h1 className="text-xl font-bold uppercase">Pemerintah Kabupaten Magetan</h1>
        <h2 className="text-xl font-bold uppercase">Kecamatan Lembeyan</h2>
        <h3 className="text-2xl font-bold uppercase tracking-widest text-emerald-800">Desa Kediren</h3>
        <p className="text-sm italic">Jl. Raya Kediren No. 01, Kode Pos 63372</p>
      </div>

      <div className="text-center mb-8">
        <h4 className="text-lg font-bold underline decoration-2 underline-offset-4">BIODATA PENDUDUK</h4>
        <p className="text-sm font-mono mt-1">Nomor Induk Kependudukan: {warga.nik}</p>
      </div>

      {/* Konten Biodata */}
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto border p-8 rounded-xl relative overflow-hidden">
        {/* Foto Warga */}
        <div className="absolute top-8 right-8 w-32 h-40 border-2 border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
            {warga.foto ? (
                <img src={warga.foto} className="w-full h-full object-cover" />
            ) : (
                <span className="text-[10px] text-slate-400">PAS FOTO 3X4</span>
            )}
        </div>

        <div className="space-y-4">
          <DetailRow label="Nama Lengkap" value={warga.namaLengkap} />
          <DetailRow label="Nomor KK" value={warga.noKk} />
          <DetailRow label="Tempat, Tgl Lahir" value={`${warga.tempatLahir}, ${warga.tanggalLahir.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`} />
          <DetailRow label="Jenis Kelamin" value={warga.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'} />
          <DetailRow label="Alamat" value={`${warga.keluarga?.alamat || '-'}, RT ${warga.keluarga?.rt}/RW ${warga.keluarga?.rw}`} />
          <DetailRow label="Dusun" value={warga.keluarga?.dusun || '-'} />
          <DetailRow label="Agama" value={warga.agama} />
          <DetailRow label="Status Perkawinan" value={warga.statusPerkawinan} />
          <DetailRow label="Pendidikan" value={warga.pendidikanTerakhir || '-'} />
          <DetailRow label="Pekerjaan" value={warga.pekerjaan || '-'} />
          <DetailRow label="Kewarganegaraan" value={warga.kewarganegaraan} />
          <DetailRow label="Golongan Darah" value={warga.golonganDarah || '-'} />
          <DetailRow label="Hubungan Keluarga" value={warga.statusDalamKeluarga} />
          <DetailRow label="Nama Ayah" value={warga.namaAyah || '-'} />
          <DetailRow label="Nama Ibu" value={warga.namaIbu || '-'} />
        </div>
      </div>

      {/* Tanda Tangan */}
      <div className="mt-16 flex justify-end">
        <div className="text-center w-64">
          <p>Kediren, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-bold mb-20">Kepala Desa Kediren</p>
          <p className="font-bold underline">H. SUPRIYANTO</p>
        </div>
      </div>

      {/* Footer Cetak */}
      <div className="fixed bottom-4 left-10 right-10 text-[10px] text-slate-400 border-t pt-2 flex justify-between print:flex">
        <p>Dicetak melalui Sistem Informasi Desa (SID) Kediren</p>
        <p>{new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
      <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-slate-800 col-span-2">: {value}</span>
    </div>
  );
}
