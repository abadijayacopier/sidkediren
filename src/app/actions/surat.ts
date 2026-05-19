'use server';

import prisma, { withDriftRetry } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';

export async function getProfilDesa() {
  return withDriftRetry(
    () => prisma.profilDesa.findFirst({ where: { id: 1 } }),
    syncDatabaseStructure
  );
}

export async function updateProfilDesa(formData: FormData) {
  const data = {
    namaDesa: (formData.get('namaDesa') as string) || 'KEDIREN',
    kodeDesa: (formData.get('kodeDesa') as string) || '',
    kecamatan: (formData.get('kecamatan') as string) || 'LEMBEYAN',
    kabupaten: (formData.get('kabupaten') as string) || 'MAGETAN',
    provinsi: (formData.get('provinsi') as string) || 'JAWA TIMUR',
    alamat: (formData.get('alamat') as string) || '',
    kodePos: (formData.get('kodePos') as string) || '',
    telepon: (formData.get('telepon') as string) || '',
    email: (formData.get('email') as string) || '',
    website: (formData.get('website') as string) || '',
    sejarah: (formData.get('sejarah') as string) || '',
    visi: (formData.get('visi') as string) || '',
    misi: (formData.get('misi') as string) || '[]',
    instagram: (formData.get('instagram') as string) || '',
    facebook: (formData.get('facebook') as string) || '',
    namaKepalaDesa: (formData.get('namaKepalaDesa') as string) || 'SUPRIYANTO',
    nipKepalaDesa: (formData.get('nipKepalaDesa') as string) || '',
    logoDesa: (formData.get('logoDesa') as string) || '',
    heroTitle: (formData.get('heroTitle') as string) || '',
    heroSubtitle: (formData.get('heroSubtitle') as string) || '',
    welcomeTitle: (formData.get('welcomeTitle') as string) || '',
    welcomeMessage: (formData.get('welcomeMessage') as string) || '',
    heroImage: (formData.get('heroImage') as string) || '',
    welcomeImage: (formData.get('welcomeImage') as string) || '',
    runningText: (formData.get('runningText') as string) || '',
    sliderImages: (formData.get('sliderImages') as string) || '[]',
  };

  await withDriftRetry(
    () => prisma.profilDesa.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
    }),
    syncDatabaseStructure
  );

  revalidatePath('/admin/settings/profil');
  revalidatePath('/admin/settings/desa');
  return { success: true };
}

export async function getMasterSurat() {
  return withDriftRetry(
    () => prisma.masterSurat.findMany({
      where: { isActive: true },
      include: { klasifikasi: true }
    }),
    syncDatabaseStructure
  );
}

export async function getRiwayatSurat() {
  return withDriftRetry(
    () => prisma.riwayatSurat.findMany({
      include: { penduduk: true, masterSurat: true },
      orderBy: { tanggalSurat: 'desc' }
    }),
    syncDatabaseStructure
  );
}

export async function generateNomorSurat(masterSuratId: number) {
  const master = await prisma.masterSurat.findUnique({
    where: { id: masterSuratId },
    include: { klasifikasi: true }
  });

  if (!master) throw new Error('Master surat tidak ditemukan');

  const now = new Date();
  const year = now.getFullYear();
  const monthRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][now.getMonth()];

  const count = await prisma.riwayatSurat.count({
    where: {
      masterSuratId,
      createdAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1)
      }
    }
  });

  const nextNumber = (count + 1).toString().padStart(3, '0');
  
  const nomorSurat = master.formatNomor
    .replace('[NOMOR]', nextNumber)
    .replace('[BULAN]', monthRomawi)
    .replace('[TAHUN]', year.toString());

  return nomorSurat;
}

export async function createRiwayatSurat(data: {
  nikPemohon: string;
  masterSuratId: number;
  nomorSurat: string;
  keterangan: string;
  metaData: string;
}) {
  const res = await withDriftRetry(
    () => prisma.riwayatSurat.create({
      data: {
        ...data,
        statusSurat: 'Selesai',
        qrCodeData: `VERIFIED-SURAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    }),
    syncDatabaseStructure
  );

  revalidatePath('/admin/surat/riwayat');
  return res;
}

export async function deleteRiwayatSurat(id: string) {
  const res = await prisma.riwayatSurat.delete({ where: { id } });
  revalidatePath('/admin/surat/riwayat');
  revalidatePath('/admin/surat');
  return res;
}

export async function updateRiwayatSurat(id: string, data: { keterangan: string, metaData: string }) {
  const res = await prisma.riwayatSurat.update({ where: { id }, data });
  revalidatePath('/admin/surat/riwayat');
  revalidatePath(`/admin/surat/preview/${id}`);
  return res;
}

export async function upsertMasterSurat(data: { 
  id?: number, 
  namaSurat: string, 
  kodeSurat: string, 
  klasifikasiId: number, 
  formatNomor: string, 
  formSchema: string, 
  templateContent: string,
  isActive: boolean
}) {
  const { id, ...payload } = data;
  
  const res = id 
    ? await prisma.masterSurat.update({ where: { id }, data: payload })
    : await prisma.masterSurat.create({ data: payload });

  revalidatePath('/admin/surat/master');
  revalidatePath('/admin/surat/buat');
  return res;
}
