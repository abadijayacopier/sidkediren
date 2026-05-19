import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart,
  Fingerprint,
  Info,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import PrintBiodata from '@/components/PrintBiodata';

const getAvatarUrl = (w: any) => {
  if (w.foto) return w.foto;
  return w.jenisKelamin === 'L' ? '/avatars/male.svg' : '/avatars/female.svg';
};

export default async function ViewPendudukPage({
  params,
}: {
  params: { nik: string };
}) {
  const { nik } = await params;

  const warga = await prisma.penduduk.findUnique({
    where: { nik },
    include: {
      keluarga: true
    }
  });

  if (!warga) return notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/penduduk" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Biodata Warga</h1>
            <p className="text-slate-500 text-sm">Menampilkan rincian data personal individu.</p>
          </div>
        </div>
        
        <PrintBiodata warga={warga} />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
            <div className="w-32 h-32 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-md relative group/avatar">
              <img 
                src={getAvatarUrl(warga)} 
                alt={warga.namaLengkap} 
                className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-300" 
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{warga.namaLengkap}</h2>
            <p className="text-sm font-mono text-emerald-600 font-bold mb-4">{warga.nik}</p>
            <div className="flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                warga.statusRekam === 'KTP SUDAH JADI' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {warga.statusRekam || 'BELUM REKAM'}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {warga.statusDalamKeluarga}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Informasi Keluarga</h3>
             <div className="space-y-4">
                <QuickInfo icon={<Fingerprint size={16} />} label="No KK" value={warga.noKk} />
                <Link href={`/admin/keluarga/${warga.noKk}`} className="block w-full text-center py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                   Lihat Anggota Keluarga
                </Link>
             </div>
          </div>
        </div>

        {/* Right Column: Detailed Data */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6">
                <Info size={20} /> Data Kelahiran & Personal
             </div>
             <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <DetailRow label="Tempat Lahir" value={warga.tempatLahir || '-'} />
                <DetailRow label="Tanggal Lahir" value={warga.tanggalLahir ? new Date(warga.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
                <DetailRow label="Jenis Kelamin" value={warga.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'} />
                <DetailRow label="Agama" value={warga.agama || '-'} />
                <DetailRow label="Golongan Darah" value={warga.golonganDarah || '-'} />
                <DetailRow label="Kewarganegaraan" value={warga.kewarganegaraan || 'WNI'} />
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6">
                <Briefcase size={20} /> Pendidikan & Pekerjaan
             </div>
             <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <DetailRow label="Pendidikan Terakhir" value={warga.pendidikanTerakhir || '-'} />
                <DetailRow label="Jenis Pekerjaan" value={warga.pekerjaan || '-'} />
                <DetailRow label="Status Perkawinan" value={warga.statusPerkawinan || '-'} />
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-slate-100 pb-4 mb-6">
                <Heart size={20} /> Orang Tua
             </div>
             <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <DetailRow label="Nama Ayah" value={warga.namaAyah || '-'} />
                <DetailRow label="Nama Ibu" value={warga.namaIbu || '-'} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickInfo({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700 uppercase">{value}</p>
    </div>
  );
}
