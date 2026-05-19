'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export async function createKeluargaBaru(formData: FormData) {
  const noKk = formData.get('noKk') as string;
  const alamat = formData.get('alamat') as string;
  const dusun = formData.get('dusun') as string;
  const rt = formData.get('rt') as string;
  const rw = formData.get('rw') as string;
  const kodePos = formData.get('kodePos') as string;
  const kecamatan = formData.get('kecamatan') as string;
  const kabupaten = formData.get('kabupaten') as string;
  const provinsi = formData.get('provinsi') as string;

  // Data Kepala Keluarga
  const nik = formData.get('nik') as string;
  const namaLengkap = formData.get('namaLengkap') as string;
  const tempatLahir = formData.get('tempatLahir') as string;
  const tanggalLahir = new Date(formData.get('tanggalLahir') as string);
  const jenisKelamin = formData.get('jenisKelamin') as string;
  const agama = formData.get('agama') as string;
  const pekerjaan = formData.get('pekerjaan') as string;

  // FIX BUG-03: Buat Keluarga DULU, baru Penduduk (FK constraint)
  await prisma.$transaction(async (tx) => {
    // 1. Buat Keluarga terlebih dahulu (karena Penduduk punya FK ke Keluarga)
    await tx.keluarga.create({
      data: {
        noKk,
        alamat,
        dusun,
        rt,
        rw,
        kodePos,
        kecamatan,
        kabupaten,
        provinsi,
        kepalaKeluargaNik: nik,
      }
    });

    // 2. Baru buat Penduduk (yang mereferensikan Keluarga via noKk)
    await tx.penduduk.create({
      data: {
        nik,
        noKk,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        pekerjaan,
        statusDalamKeluarga: 'KEPALA KELUARGA',
        kewarganegaraan: 'WNI',
      }
    });
  });

  revalidatePath('/admin/penduduk');
  redirect(`/admin/keluarga/${noKk}`);
}

export async function updateKeluargaDetails(formData: FormData) {
  const noKk = formData.get('noKk') as string;
  const alamat = formData.get('alamat') as string;
  const dusun = formData.get('dusun') as string;
  const rt = formData.get('rt') as string;
  const rw = formData.get('rw') as string;
  const kodePos = formData.get('kodePos') as string;
  const kecamatan = formData.get('kecamatan') as string;
  const kabupaten = formData.get('kabupaten') as string;
  const provinsi = formData.get('provinsi') as string;
  const kepalaKeluargaNik = formData.get('kepalaKeluargaNik') as string;

  // Handle Foto KK
  const fileKk = formData.get('fotoKk') as File;
  let fotoKkPath = null;

  if (fileKk && fileKk.size > 0) {
    const bytes = await fileKk.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `KK-${noKk}-${Date.now()}.${fileKk.name.split('.').pop()}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kk');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    fotoKkPath = `/uploads/kk/${fileName}`;
  }

  await prisma.keluarga.update({
    where: { noKk },
    data: {
      alamat,
      dusun,
      rt,
      rw,
      kodePos,
      kecamatan,
      kabupaten,
      provinsi,
      kepalaKeluargaNik,
      ...(fotoKkPath ? { fotoKk: fotoKkPath } : {})
    }
  });

  revalidatePath(`/admin/keluarga/${noKk}`);
  revalidatePath('/admin/penduduk');
  return { success: true };
}
