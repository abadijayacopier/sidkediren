import React from 'react';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MasterSuratForm from '@/components/surat/MasterSuratForm';

export default async function TambahMasterSuratPage() {
  const classifications = await prisma.klasifikasiSurat.findMany({
    orderBy: { kode: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center gap-6">
         <Link href="/admin/surat/master" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 shadow-sm group">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-all" />
         </Link>
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tambah Template</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Buat format and jenis surat baru untuk desa</p>
         </div>
      </div>

      <MasterSuratForm classifications={classifications} />
    </div>
  );
}
