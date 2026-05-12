'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProfilDesa() {
  return await prisma.profilDesa.findFirst({
    where: { id: 1 }
  });
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
  };

  await prisma.profilDesa.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data }
  });

  revalidatePath('/admin/settings/profil');
  revalidatePath('/admin/settings/desa');
}

export async function getMasterSurat() {
  return await prisma.masterSurat.findMany({
    where: { isActive: true },
    include: { klasifikasi: true }
  });
}

export async function getRiwayatSurat() {
  return await prisma.riwayatSurat.findMany({
    include: {
      penduduk: true,
      masterSurat: true
    },
    orderBy: { createdAt: 'desc' }
  });
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

  // Hitung nomor urut dalam tahun ini
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
  
  // Format: [Kode Klasifikasi] / [Nomor Urut] / [Kode Wilayah] / [Bulan Romawi] / [Tahun]
  // Contoh formatNomor di DB: "400.7.2.1/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]"
  let nomorSurat = master.formatNomor
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
  const res = await prisma.riwayatSurat.create({
    data: {
      ...data,
      statusSurat: 'Selesai',
      qrCodeData: `VERIFIED-SURAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    }
  });

  revalidatePath('/admin/surat/riwayat');
  return res;
}
