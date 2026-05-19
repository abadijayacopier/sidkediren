import React from 'react';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PejabatFormClient from './PejabatFormClient';

export default async function EditPejabatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jabatanId = parseInt(id);
  
  const jabatan = await prisma.jabatan.findUnique({
    where: { id: jabatanId },
    include: {
      perangkatDesa: true
    } as any
  });

  if (!jabatan) return notFound();

  const perangkat = (jabatan as any).perangkatDesa[0]; // Ambil pejabat aktif jika ada

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings/profil" className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Atur Pejabat</h1>
            <p className="text-slate-500 text-sm font-medium">Jabatan: <span className="text-emerald-600 font-bold">{jabatan.namaJabatan}</span></p>
          </div>
        </div>
      </div>

      <PejabatFormClient jabatanId={jabatanId} perangkat={perangkat} />
    </div>
  );
}
