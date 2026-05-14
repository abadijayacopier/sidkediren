import React from 'react';
import prisma from '@/lib/prisma';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import MasterSuratForm from '@/components/surat/MasterSuratForm';
import { notFound } from 'next/navigation';

export default async function EditMasterSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await prisma.masterSurat.findUnique({
    where: { id: parseInt(id) },
    include: { klasifikasi: true }
  });

  if (!template) {
    notFound();
  }

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
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-black text-slate-800 tracking-tight">Edit Template</h1>
               <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-widest">{template.kodeSurat}</span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Modifikasi format and konfigurasi {template.namaSurat}</p>
         </div>
      </div>

      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-start gap-4">
         <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
            <AlertCircle size={20} />
         </div>
         <div>
            <p className="text-sm font-black text-emerald-800 uppercase tracking-widest">Mode Edit Aktif</p>
            <p className="text-xs text-emerald-600 font-bold mt-1 opacity-80 leading-relaxed uppercase tracking-tighter">
               Pastikan semua variabel placeholder and skema JSON tetap sinkron agar surat tidak error saat diterbitkan.
            </p>
         </div>
      </div>

      <MasterSuratForm initialData={template} classifications={classifications} />
    </div>
  );
}
