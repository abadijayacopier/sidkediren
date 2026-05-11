import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  Printer, 
  ArrowLeft, 
  Users, 
  User,
  MapPin, 
  ShieldCheck, 
  Edit3,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default async function DetailKeluargaPage({
  params,
}: {
  params: { noKk: string };
}) {
  const { noKk } = await params;

  const keluarga = await prisma.keluarga.findUnique({
    where: { noKk },
    include: {
      penduduk: {
        orderBy: {
          statusDalamKeluarga: 'asc' // Bisa disesuaikan urutannya
        }
      },
      kepalaKeluarga: true,
    },
  });

  if (!keluarga) return notFound();

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Detail Keluarga</h1>
            <p className="text-slate-500 text-sm">Nomor KK: <span className="font-mono font-bold text-emerald-700">{keluarga.noKk}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium text-sm">
            <Printer size={18} /> Cetak Kartu Keluarga
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-100">
            <Edit3 size={18} /> Edit Data
          </button>
        </div>
      </div>

      {/* Info Header (Atas KK) */}
      <div className="grid md:grid-cols-3 gap-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="md:col-span-2 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <InfoItem label="Nama Kepala Keluarga" value={keluarga.kepalaKeluarga?.namaLengkap || '-'} />
              <InfoItem label="Alamat" value={keluarga.alamat} />
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="RT / RW" value={`${keluarga.rt} / ${keluarga.rw}`} />
                <InfoItem label="Kode Pos" value={keluarga.kodePos || '-'} />
              </div>
              <InfoItem label="Dusun" value={keluarga.dusun || '-'} />
            </div>

            <div className="space-y-4">
              <InfoItem label="Desa / Kelurahan" value="KEDIREN" />
              <InfoItem label="Kecamatan" value="LEMBEYAN" />
              <InfoItem label="Kabupaten / Kota" value="MAGETAN" />
              <InfoItem label="Provinsi" value="JAWA TIMUR" />
            </div>
        </div>

        {/* Foto 3x4 Kepala Keluarga */}
        <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-8">
            <div className="relative w-32 h-[170px] bg-slate-50 border-4 border-white shadow-xl rounded-lg overflow-hidden flex items-center justify-center group transition-all">
                {keluarga.kepalaKeluarga?.foto ? (
                    <img src={keluarga.kepalaKeluarga.foto} className="w-full h-full object-cover" alt="Foto Kepala Keluarga" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <User size={40} />
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Pas Foto 3x4</span>
                    </div>
                )}
                {/* Overlay Aksi */}
                <Link href={`/admin/penduduk/edit/${keluarga.kepalaKeluarga?.nik}`} className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white font-bold text-[10px]">
                    GANTI FOTO
                </Link>
            </div>
            <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kepala Keluarga</p>
        </div>
      </div>

      {/* Daftar Anggota Keluarga (Tabel Utama) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Users size={20} className="text-emerald-600" /> Anggota Keluarga
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Lengkap</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">NIK</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Jenis Kelamin</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tempat, Tgl Lahir</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Agama</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pendidikan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Pekerjaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {keluarga.penduduk.map((member: any, idx: number) => (
                <tr key={member.nik} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{member.namaLengkap}</td>
                  <td className="px-6 py-4 font-mono text-emerald-700">{member.nik}</td>
                  <td className="px-6 py-4 text-slate-600">{member.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {member.tempatLahir}, {new Date(member.tanggalLahir).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-slate-600 uppercase">{member.agama}</td>
                  <td className="px-6 py-4 text-slate-600 uppercase">{member.pendidikanTerakhir || '-'}</td>
                  <td className="px-6 py-4 text-slate-600 uppercase">{member.pekerjaan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Tambahan (Bawah KK) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600" /> Informasi Tambahan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status Perkawinan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status Hubungan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Kewarganegaraan</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Ayah</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Ibu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {keluarga.penduduk.map((member: any, idx: number) => (
                <tr key={`${member.nik}-extra`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                  <td className="px-6 py-4 text-slate-800 uppercase font-medium">{member.statusPerkawinan || '-'}</td>
                  <td className="px-6 py-4 text-slate-800 uppercase font-bold">{member.statusDalamKeluarga}</td>
                  <td className="px-6 py-4 text-slate-600 uppercase">{member.kewarganegaraan}</td>
                  <td className="px-6 py-4 text-slate-600 uppercase">{member.namaAyah || '-'}</td>
                  <td className="px-6 py-4 text-slate-600 uppercase">{member.namaIbu || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Arsip Digital KK */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ExternalLink size={20} className="text-emerald-600" /> Arsip Digital Kartu Keluarga
          </h3>
          {keluarga.fotoKk && (
            <a 
              href={keluarga.fotoKk} 
              target="_blank" 
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline uppercase tracking-widest"
            >
              Buka File Asli
            </a>
          )}
        </div>
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-slate-50/30">
          {keluarga.fotoKk ? (
            <div className="relative group w-full max-w-3xl rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src={keluarga.fotoKk} 
                alt="Scan Kartu Keluarga" 
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                 <a href={keluarga.fotoKk} target="_blank" className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 shadow-xl">
                   <ExternalLink size={18} /> Lihat Fullscreen
                 </a>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto">
                <Printer size={40} />
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Belum Ada Arsip Digital</p>
                <p className="text-slate-400 text-[10px] italic mt-1 text-center">Scan atau foto Kartu Keluarga belum diunggah.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}
