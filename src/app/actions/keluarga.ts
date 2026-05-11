'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

  // Transaksi: Buat Penduduk dulu, lalu hubungkan ke Keluarga sebagai Kepala
  await prisma.$transaction(async (tx: any) => {
    // 1. Buat data Keluarga tanpa kepala dulu (bypass via raw if needed or connect later)
    // Tapi di schema kita kepalaKeluargaNik mandatory. 
    // Cara terbaik: Buat Penduduk dulu dengan noKk ini, lalu buat Keluarga.
    
    // Kita buat Penduduk-nya dulu
    const pendudukHead = await tx.penduduk.create({
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

    // 2. Buat Keluarga dan hubungkan ke Penduduk tadi
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
  });

  revalidatePath('/admin/penduduk');
  redirect(`/admin/keluarga/${noKk}`);
}
