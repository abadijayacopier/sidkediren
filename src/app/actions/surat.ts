'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProfilDesa() {
  try {
    return await prisma.profilDesa.findFirst({
      where: { id: 1 }
    });
  } catch (error: any) {
    const isDrift = error.message?.includes('does not exist') || 
                    error.message?.includes('Unknown column') || 
                    error.message?.includes('running_text') || 
                    error.message?.includes('slider_images') ||
                    error.message?.includes('logo_desa') ||
                    error.message?.includes('logoDesa') ||
                    error.message?.includes('nip_kepala_desa') ||
                    error.message?.includes('nipKepalaDesa');
    if (isDrift) {
      console.log('Detected database schema drift in getProfilDesa. Attempting auto-fix...');
      await syncDatabaseStructure();
      return await prisma.profilDesa.findFirst({
        where: { id: 1 }
      });
    }
    throw error;
  }
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

  try {
    const res = await prisma.profilDesa.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data }
    });
    revalidatePath('/admin/settings/profil');
    revalidatePath('/admin/settings/desa');
    return { success: true };
  } catch (error: any) {
    const isDrift = error.message?.includes('does not exist') || 
                    error.message?.includes('Unknown column') || 
                    error.message?.includes('running_text') || 
                    error.message?.includes('slider_images') ||
                    error.message?.includes('logo_desa') ||
                    error.message?.includes('logoDesa') ||
                    error.message?.includes('nip_kepala_desa') ||
                    error.message?.includes('nipKepalaDesa');
    if (isDrift) {
      console.log('Detected database schema drift in updateProfilDesa. Attempting auto-fix...');
      await syncDatabaseStructure();
      const res = await prisma.profilDesa.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data }
      });
      revalidatePath('/admin/settings/profil');
      revalidatePath('/admin/settings/desa');
      return { success: true };
    }
    throw error;
  }
}

import { syncDatabaseStructure } from './system';

export async function getMasterSurat() {
  try {
    return await prisma.masterSurat.findMany({
      where: { isActive: true },
      include: { klasifikasi: true }
    });
  } catch (error: any) {
    const isDrift = error.message?.includes('does not exist') || 
                    error.message?.includes('Unknown column') || 
                    error.message?.includes('isActive') || 
                    error.message?.includes('is_active');
    if (isDrift) {
      await syncDatabaseStructure();
      return await prisma.masterSurat.findMany({
        where: { isActive: true },
        include: { klasifikasi: true }
      });
    }
    throw error;
  }
}

export async function getRiwayatSurat() {
  try {
    return await prisma.riwayatSurat.findMany({
      include: {
        penduduk: true,
        masterSurat: true
      },
      orderBy: { tanggalSurat: 'desc' }
    });
  } catch (error: any) {
    const isDrift = error.message?.includes('does not exist') || 
                    error.message?.includes('Unknown column') || 
                    error.message?.includes('tanggal_surat') || 
                    error.message?.includes('tanggalSurat') || 
                    error.message?.includes('status_surat') || 
                    error.message?.includes('qr_code_data') || 
                    error.message?.includes('meta_data') || 
                    error.message?.includes('keterangan');
    if (isDrift) {
      await syncDatabaseStructure();
      return await prisma.riwayatSurat.findMany({
        include: {
          penduduk: true,
          masterSurat: true
        },
        orderBy: { tanggalSurat: 'desc' }
      });
    }
    throw error;
  }
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
  try {
    const res = await prisma.riwayatSurat.create({
      data: {
        ...data,
        statusSurat: 'Selesai',
        qrCodeData: `VERIFIED-SURAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    });

    revalidatePath('/admin/surat/riwayat');
    return res;
  } catch (error: any) {
    const isDrift = error.message?.includes('does not exist') || 
                    error.message?.includes('Unknown column') || 
                    error.message?.includes('tanggal_surat') || 
                    error.message?.includes('status_surat') || 
                    error.message?.includes('qr_code_data') || 
                    error.message?.includes('meta_data') || 
                    error.message?.includes('keterangan');
    if (isDrift) {
      await syncDatabaseStructure();
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
    throw error;
  }
}
export async function deleteRiwayatSurat(id: string) {
  const res = await prisma.riwayatSurat.delete({
    where: { id }
  });

  revalidatePath('/admin/surat/riwayat');
  revalidatePath('/admin/surat');
  return res;
}
export async function updateRiwayatSurat(id: string, data: { keterangan: string, metaData: string }) {
  const res = await prisma.riwayatSurat.update({
    where: { id },
    data
  });

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
