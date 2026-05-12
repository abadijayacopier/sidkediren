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
    <div className="space-y-8 pb-20">
      <SuratForm 
        masterSurat={JSON.parse(JSON.stringify(masterSurat))} 
        initialPenduduk={JSON.parse(JSON.stringify(penduduk))} 
      />
    </div>
  );
}
