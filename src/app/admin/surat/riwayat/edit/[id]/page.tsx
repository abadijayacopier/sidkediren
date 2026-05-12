import React from 'react';
import prisma from '@/lib/prisma';
import { ArrowLeft, FileText, User, Save, Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditForm from '@/components/surat/EditForm';

export default async function EditRiwayatSuratPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const data = await prisma.riwayatSurat.findUnique({
    where: { id },
    include: {
      penduduk: true,
      masterSurat: true
    }
  });

  if (!data) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
           <Link href="/admin/surat/riwayat" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 shadow-sm">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Arsip Surat</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Perbarui detail informasi surat yang telah terbit</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-800 rounded-[2rem] p-8 text-white space-y-8 shadow-2xl">
              <div className="space-y-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor Surat</p>
                    <p className="text-sm font-black bg-white/10 p-3 rounded-xl border border-white/10">{data.nomorSurat}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jenis Surat</p>
                    <p className="text-sm font-black">{data.masterSurat.namaSurat}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pemohon</p>
                    <p className="text-sm font-black">{data.penduduk.namaLengkap}</p>
                 </div>
              </div>
           </div>

           <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
              <Info className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] text-blue-700 font-bold leading-relaxed uppercase tracking-tighter">
                 Pengeditan hanya berlaku untuk keterangan and atribut khusus. Nomor surat and identitas warga bersifat tetap.
              </p>
           </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8">
           <EditForm data={data} />
        </div>
      </div>
    </div>
  );
}
