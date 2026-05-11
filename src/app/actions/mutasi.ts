'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export async function laporMutasi(formData: FormData) {
  const nik = formData.get('nik') as string;
  const jenisMutasi = formData.get('jenisMutasi') as string;
  const tanggalMutasi = new Date(formData.get('tanggalMutasi') as string);
  const keterangan = formData.get('keterangan') as string;
  const petugasInput = formData.get('petugasInput') as string;

  try {
    await prisma.$transaction(async (tx: any) => {
      // 1. Simpan Riwayat Mutasi
      const mutasiData: any = {
        nik,
        jenisMutasi,
        tanggalMutasi,
        keterangan,
        petugasInput,
      };

      if (jenisMutasi === 'PINDAH KELUAR') {
        mutasiData.alamatTujuan = formData.get('alamatTujuan') as string;
        mutasiData.desaTujuan = formData.get('desaTujuan') as string;
        mutasiData.kecamatanTujuan = formData.get('kecamatanTujuan') as string;
        mutasiData.kabupatenTujuan = formData.get('kabupatenTujuan') as string;
        mutasiData.provinsiTujuan = formData.get('provinsiTujuan') as string;
        mutasiData.kodePosTujuan = formData.get('kodePosTujuan') as string;
      }

      if (jenisMutasi === 'PINDAH MASUK') {
        mutasiData.alamatAsal = formData.get('alamatAsal') as string;
        mutasiData.desaAsal = formData.get('desaAsal') as string;
        mutasiData.kecamatanAsal = formData.get('kecamatanAsal') as string;
        mutasiData.kabupatenAsal = formData.get('kabupatenAsal') as string;
        mutasiData.provinsiAsal = formData.get('provinsiAsal') as string;
        mutasiData.kodePosAsal = formData.get('kodePosAsal') as string;
      }

      await tx.mutasi.create({
        data: mutasiData,
      });

      // 2. Update Status Dasar Penduduk
      let statusDasar = 'Hidup';
      if (jenisMutasi === 'KEMATIAN') statusDasar = 'Meninggal';
      if (jenisMutasi === 'PINDAH KELUAR') statusDasar = 'Pindah';

      await tx.penduduk.update({
        where: { nik },
        data: { statusDasar },
      });
    });

    revalidatePath('/admin/penduduk');
    revalidatePath('/admin/penduduk/mutasi');
    return { success: true };
  } catch (error) {
    console.error('Gagal lapor mutasi:', error);
    return { success: false, error: 'Gagal memproses data mutasi' };
  }
}

export async function mutasiPecahKK(formData: FormData) {
  const nik = formData.get('nik') as string;
  const nikKepalaLama = formData.get('nikKepalaLama') as string;
  const noKkBaru = formData.get('noKkBaru') as string;
  const alamatBaru = formData.get('alamatBaru') as string;
  const rtBaru = formData.get('rtBaru') as string;
  const rwBaru = formData.get('rwBaru') as string;
  const dusunBaru = formData.get('dusunBaru') as string;
  const tanggalMutasi = new Date(formData.get('tanggalMutasi') as string);
  const petugasInput = formData.get('petugasInput') as string;

  try {
    await prisma.$transaction(async (tx: any) => {
      // 0. Handle Foto KK
      const fileKk = formData.get('fotoKk') as File;
      let fotoKkPath = null;

      if (fileKk && fileKk.size > 0) {
        const bytes = await fileKk.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `KK-${noKkBaru}-${Date.now()}.${fileKk.name.split('.').pop()}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kk');
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        fotoKkPath = `/uploads/kk/${fileName}`;
      }

      // 1. Buat Record Keluarga Baru
      await tx.keluarga.create({
        data: {
          noKk: noKkBaru,
          kepalaKeluargaNik: nik,
          alamat: alamatBaru,
          rt: rtBaru,
          rw: rwBaru,
          dusun: dusunBaru,
          fotoKk: fotoKkPath,
        },
      });

      // 2. Update Data Penduduk (Pindah ke KK Baru)
      await tx.penduduk.update({
        where: { nik },
        data: { 
          noKk: noKkBaru,
          statusDalamKeluarga: 'Kepala Keluarga' 
        },
      });

      // 3. Catat di Log Mutasi
      await tx.mutasi.create({
        data: {
          nik,
          jenisMutasi: 'PECAH KK',
          nikKepalaLama,
          tanggalMutasi,
          keterangan: `Pecah KK dari KK lama. Sekarang menjadi Kepala Keluarga di KK ${noKkBaru}`,
          petugasInput,
        },
      });
    });

    revalidatePath('/admin/penduduk');
    revalidatePath('/admin/penduduk/mutasi');
    revalidatePath(`/admin/keluarga/${noKkBaru}`);
    return { success: true };
  } catch (error) {
    console.error('Gagal pecah KK:', error);
    return { success: false, error: 'Gagal memproses Pecah KK. Pastikan Nomor KK Baru belum terdaftar.' };
  }
}

export async function getRiwayatMutasi() {
  return await prisma.mutasi.findMany({
    include: {
      penduduk: {
        select: {
          namaLengkap: true,
          nik: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
