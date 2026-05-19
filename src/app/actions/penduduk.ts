'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export async function createPenduduk(formData: FormData) {
  const nik = formData.get('nik') as string;
  const noKk = formData.get('noKk') as string;
  const namaLengkap = formData.get('namaLengkap') as string;
  const tempatLahir = formData.get('tempatLahir') as string;
  const tanggalLahir = new Date(formData.get('tanggalLahir') as string);
  const jenisKelamin = formData.get('jenisKelamin') as string;
  const statusDalamKeluarga = formData.get('statusDalamKeluarga') as string;
  const agama = formData.get('agama') as string;
  const pekerjaan = formData.get('pekerjaan') as string;
  const pendidikanTerakhir = formData.get('pendidikanTerakhir') as string;
  const namaAyah = formData.get('namaAyah') as string;
  const namaIbu = formData.get('namaIbu') as string;
  const kewarganegaraan = formData.get('kewarganegaraan') as string;
  const statusPerkawinan = formData.get('statusPerkawinan') as string;
  const golonganDarah = formData.get('golonganDarah') as string;
  const statusRekam = formData.get('statusRekam') as string;
  const noPaspor = formData.get('noPaspor') as string;
  const noKitas = formData.get('noKitas') as string;

  // Data Alamat (Jika KK Baru)
  const alamat = formData.get('alamat') as string;
  const dusun = formData.get('dusun') as string;
  const rt = formData.get('rt') as string;
  const rw = formData.get('rw') as string;
  const kecamatan = formData.get('kecamatan') as string;
  const kabupaten = formData.get('kabupaten') as string;
  const provinsi = formData.get('provinsi') as string;
  const kodePos = formData.get('kodePos') as string;

  // 1. Cek/Buat Keluarga
  const keluarga = await prisma.keluarga.upsert({
    where: { noKk },
    update: {}, // Jika ada, tidak usah update alamat di sini
    create: {
      noKk,
      kepalaKeluargaNik: nik,
      alamat: alamat || '-',
      dusun: dusun || '-',
      rt: rt || '-',
      rw: rw || '-',
      kecamatan: kecamatan || 'LEMBEYAN',
      kabupaten: kabupaten || 'MAGETAN',
      provinsi: provinsi || 'JAWA TIMUR',
      kodePos: kodePos || '63372'
    }
  });

  // 2. Handle Foto
  const file = formData.get('foto') as File;
  let fotoPath = null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${nik}-${Date.now()}.${file.name.split('.').pop()}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'penduduk');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    fotoPath = `/uploads/penduduk/${fileName}`;
  }

  // 2.1 Handle Foto KK
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

  if (fotoKkPath) {
    await prisma.keluarga.update({
      where: { noKk },
      data: { fotoKk: fotoKkPath }
    });
  }

  // 3. Simpan Penduduk & Mutasi (Atomic Transaction)
  try {
    await prisma.$transaction(async (tx: any) => {
      // Buat Penduduk
      await tx.penduduk.create({
        data: {
          nik,
          noKk,
          namaLengkap,
          tempatLahir,
          tanggalLahir,
          jenisKelamin,
          statusDalamKeluarga: statusDalamKeluarga || 'ANAK',
          agama: agama || 'ISLAM',
          pekerjaan: pekerjaan || '-',
          pendidikanTerakhir: pendidikanTerakhir || '-',
          namaAyah: namaAyah || '-',
          namaIbu: namaIbu || '-',
          kewarganegaraan: kewarganegaraan || 'WNI',
          statusPerkawinan: statusPerkawinan || 'BELUM KAWIN',
          golonganDarah: golonganDarah || '-',
          statusRekam: statusRekam || 'BELUM REKAM',
          noPaspor: noPaspor || '',
          noKitas: noKitas || '',
          foto: fotoPath
        }
      });

      // Jika ini adalah Mutasi (Pindah Datang / Kelahiran)
      const isMutasi = formData.get('isMutasi') === 'true';
      if (isMutasi) {
        const jenisMutasi = formData.get('jenisMutasi') as string;
        const tanggalMutasi = new Date(formData.get('tanggalMutasi') as string);

        const alamatAsal = formData.get('alamatAsal') as string;
        const desaAsal = formData.get('desaAsal') as string;
        const kecamatanAsal = formData.get('kecamatanAsal') as string;
        const kabupatenAsal = formData.get('kabupatenAsal') as string;
        const provinsiAsal = formData.get('provinsiAsal') as string;
        const kodePosAsal = formData.get('kodePosAsal') as string;

        await tx.mutasi.create({
          data: {
            nik,
            jenisMutasi: jenisMutasi || 'PINDAH MASUK',
            tanggalMutasi,
            keterangan: `Warga Baru (${jenisMutasi}). Asal: ${alamatAsal || desaAsal || 'Kediren'}`,
            alamatAsal,
            desaAsal,
            kecamatanAsal,
            kabupatenAsal,
            provinsiAsal,
            kodePosAsal,
            petugasInput: 'Admin Desa'
          }
        });
      }
    });

    revalidatePath('/admin/penduduk');
    revalidatePath('/admin/penduduk/mutasi');
    return { success: true };
  } catch (error) {
    console.error('Gagal simpan penduduk:', error);
    throw new Error('Gagal menyimpan data penduduk. Pastikan NIK belum terdaftar.');
  }
}

export async function updatePenduduk(formData: FormData) {
  const oldNik = formData.get('oldNik') as string;
  const nik = formData.get('nik') as string;
  const noKk = formData.get('noKk') as string;
  const namaLengkap = formData.get('namaLengkap') as string;
  const tempatLahir = formData.get('tempatLahir') as string;
  const tanggalLahir = new Date(formData.get('tanggalLahir') as string);
  const jenisKelamin = formData.get('jenisKelamin') as string;
  const statusDalamKeluarga = formData.get('statusDalamKeluarga') as string;
  const agama = formData.get('agama') as string;
  const pekerjaan = formData.get('pekerjaan') as string;
  const pendidikanTerakhir = formData.get('pendidikanTerakhir') as string;
  const namaAyah = formData.get('namaAyah') as string;
  const namaIbu = formData.get('namaIbu') as string;
  const kewarganegaraan = formData.get('kewarganegaraan') as string;
  const statusPerkawinan = formData.get('statusPerkawinan') as string;
  const golonganDarah = formData.get('golonganDarah') as string;
  const statusRekam = formData.get('statusRekam') as string;
  const noPaspor = formData.get('noPaspor') as string;
  const noKitas = formData.get('noKitas') as string;

  const alamat = formData.get('alamat') as string;
  const dusun = formData.get('dusun') as string;
  const rt = formData.get('rt') as string;
  const rw = formData.get('rw') as string;
  const kecamatan = formData.get('kecamatan') as string;
  const kabupaten = formData.get('kabupaten') as string;

  await prisma.keluarga.update({
    where: { noKk },
    data: { alamat, dusun, rt, rw, kecamatan, kabupaten }
  });

  const file = formData.get('foto') as File;
  let fotoPath = null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${nik}-${Date.now()}.${file.name.split('.').pop()}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'penduduk');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    fotoPath = `/uploads/penduduk/${fileName}`;
  }

  await prisma.penduduk.update({
    where: { nik: oldNik },
    data: {
      nik,
      noKk,
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      statusDalamKeluarga: statusDalamKeluarga || 'ANAK',
      agama: agama || 'ISLAM',
      pekerjaan: pekerjaan || '-',
      pendidikanTerakhir: pendidikanTerakhir || '-',
      namaAyah: namaAyah || '-',
      namaIbu: namaIbu || '-',
      kewarganegaraan: kewarganegaraan || 'WNI',
      statusPerkawinan: statusPerkawinan || 'BELUM KAWIN',
      golonganDarah: golonganDarah || '-',
      statusRekam: statusRekam || 'BELUM REKAM',
      noPaspor: noPaspor || '',
      noKitas: noKitas || '',
      ...(fotoPath ? { foto: fotoPath } : {})
    }
  });

  revalidatePath('/admin/penduduk');
  return { success: true, nik };
}

export async function deletePenduduk(nik: string) {
  const warga = await prisma.penduduk.findUnique({ where: { nik } });
  if (warga?.foto) {
    const fullPath = path.join(process.cwd(), 'public', warga.foto);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  await prisma.penduduk.delete({ where: { nik } });
  revalidatePath('/admin/penduduk');
}
