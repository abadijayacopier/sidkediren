import React from 'react';
import prisma from '@/lib/prisma';
import SuratForm from '@/components/surat/SuratForm';

import { syncDatabaseStructure } from '@/app/actions/system';

export default async function BuatSuratPage() {
  let masterSurat: any[] = [];
  let penduduk: any[] = [];

  try {
    const [mSurat, pData] = await Promise.all([
      prisma.masterSurat.findMany({
        where: { isActive: true },
        include: { klasifikasi: true }
      }),
      prisma.penduduk.findMany({
        take: 10,
        orderBy: { namaLengkap: 'asc' }
      })
    ]);
    masterSurat = mSurat;
    penduduk = pData;
  } catch (error: any) {
    if (error.message?.includes('isActive') || error.message?.includes('is_hidup')) {
      await syncDatabaseStructure();
      const [mSurat, pData] = await Promise.all([
        prisma.masterSurat.findMany({
          where: { isActive: true },
          include: { klasifikasi: true }
        }),
        prisma.penduduk.findMany({
          take: 10,
          orderBy: { namaLengkap: 'asc' }
        })
      ]);
      masterSurat = mSurat;
      penduduk = pData;
    } else {
      throw error;
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <SuratForm 
        masterSurat={JSON.parse(JSON.stringify(masterSurat))} 
        initialPenduduk={JSON.parse(JSON.stringify(penduduk))} 
      />
    </div>
  );
}
