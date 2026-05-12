import React from 'react';
import prisma from '@/lib/prisma';
import SuratForm from '@/components/surat/SuratForm';

export default async function BuatSuratPage() {
  const masterSurat = await prisma.masterSurat.findMany({
    where: { isActive: true },
    include: { klasifikasi: true }
  });

  const penduduk = await prisma.penduduk.findMany({
    take: 10, // Default 10 data awal
    orderBy: { namaLengkap: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Buat Surat Baru</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Silakan cari penduduk dan pilih jenis surat yang akan diterbitkan.</p>
      </div>

      <SuratForm 
        masterSurat={JSON.parse(JSON.stringify(masterSurat))} 
        initialPenduduk={JSON.parse(JSON.stringify(penduduk))} 
      />
    </div>
  );
}
