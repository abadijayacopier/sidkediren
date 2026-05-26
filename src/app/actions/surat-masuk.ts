'use server';

// Kearsipan Surat Masuk & Alur Disposisi
import prisma, { withDriftRetry } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';

export async function getSuratMasuk() {
  return withDriftRetry(
    () => prisma.suratMasuk.findMany({
      include: { klasifikasi: true },
      orderBy: { tanggalDiterima: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function createSuratMasuk(data: {
  nomorSurat: string;
  tanggalSurat: Date;
  pengirim: string;
  perihal: string;
  klasifikasiId?: number;
  fileScan?: string;
}) {
  const res = await withDriftRetry(
    () => prisma.suratMasuk.create({
      data: {
        nomorSurat: data.nomorSurat,
        tanggalSurat: new Date(data.tanggalSurat),
        pengirim: data.pengirim,
        perihal: data.perihal,
        klasifikasiId: data.klasifikasiId || null,
        fileScan: data.fileScan || null,
        statusDisposisi: 'Belum Diproses'
      }
    }),
    async () => { await syncDatabaseStructure(); }
  );

  revalidatePath('/admin/surat/masuk');
  return res;
}

export async function updateDisposisiSurat(
  id: number,
  data: {
    disposisiKepada: string;
    catatanDisposisi: string;
    statusDisposisi: string;
  }
) {
  const res = await withDriftRetry(
    () => prisma.suratMasuk.update({
      where: { id },
      data: {
        disposisiKepada: data.disposisiKepada,
        catatanDisposisi: data.catatanDisposisi,
        statusDisposisi: data.statusDisposisi
      }
    }),
    async () => { await syncDatabaseStructure(); }
  );

  revalidatePath('/admin/surat/masuk');
  return res;
}

export async function deleteSuratMasuk(id: number) {
  const res = await withDriftRetry(
    () => prisma.suratMasuk.delete({
      where: { id }
    }),
    async () => { await syncDatabaseStructure(); }
  );

  revalidatePath('/admin/surat/masuk');
  return res;
}
