'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { auth } from '@/auth';

// -------------------------------------------------------------
// 1. ZOD VALIDATION SCHEMAS
// -------------------------------------------------------------
const NIK_REGEX = /^\d+$/;

const pendudukInputSchema = z.object({
  nik: z.string()
    .length(16, "NIK harus tepat 16 digit.")
    .regex(NIK_REGEX, "NIK harus berupa angka."),
  noKk: z.string()
    .length(16, "Nomor KK harus tepat 16 digit.")
    .regex(NIK_REGEX, "Nomor KK harus berupa angka."),
  namaLengkap: z.string()
    .min(1, "Nama lengkap wajib diisi.")
    .max(150, "Nama lengkap maksimal 150 karakter."),
  tempatLahir: z.string().max(100, "Tempat lahir maksimal 100 karakter.").optional().nullable(),
  tanggalLahir: z.preprocess(
    (val) => (typeof val === 'string' && val ? new Date(val) : val),
    z.date({ required_error: "Tanggal lahir wajib diisi." })
  ),
  jenisKelamin: z.string().max(1).optional().nullable(),
  agama: z.string().max(20).optional().nullable(),
  pendidikanTerakhir: z.string().max(100).optional().nullable(),
  pekerjaan: z.string().max(100).optional().nullable(),
  statusPerkawinan: z.string().max(50).optional().nullable(),
  statusDalamKeluarga: z.string().max(50).optional().nullable(),
  golonganDarah: z.string().max(20).optional().nullable(),
  namaAyah: z.string().max(150).optional().nullable(),
  namaIbu: z.string().max(150).optional().nullable(),
  kewarganegaraan: z.string().max(50).default("WNI").optional().nullable(),
  noPaspor: z.string().max(30).default("").optional().nullable(),
  noKitas: z.string().max(30).default("").optional().nullable(),
  
  // Data Alamat (Jika KK Baru)
  alamat: z.string().optional().nullable(),
  dusun: z.string().max(50).optional().nullable(),
  rt: z.string().max(3).optional().nullable(),
  rw: z.string().max(3).optional().nullable(),
  kecamatan: z.string().max(100).optional().nullable(),
  kabupaten: z.string().max(100).optional().nullable(),
  provinsi: z.string().max(100).optional().nullable(),
  kodePos: z.string().max(10).optional().nullable(),
  wilayahRtId: z.coerce.number().optional().nullable(),
});

// -------------------------------------------------------------
// HELPER: FILE SANITIZER & VALIDATOR
// -------------------------------------------------------------
const sanitizeFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
};

const validateAndUploadFile = async (
  file: File,
  allowedExtensions: string[],
  maxSizeMB: number,
  prefix: string,
  uploadSubDir: string
): Promise<string> => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Ukuran file maksimal adalah ${maxSizeMB} MB.`);
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    throw new Error(`Format file tidak diizinkan. Hanya menerima: ${allowedExtensions.join(', ').toUpperCase()}`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const cleanPrefix = sanitizeFileName(prefix);
  const fileName = `${cleanPrefix}-${Date.now()}.${fileExtension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', uploadSubDir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);
  
  return `/uploads/${uploadSubDir}/${fileName}`;
};

// -------------------------------------------------------------
// 2. SERVER ACTIONS
// -------------------------------------------------------------

export async function createPenduduk(formData: FormData) {
  // A. Pengecekan Sesi Keamanan
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Sesi login Anda tidak valid atau telah berakhir. Silakan login kembali.");
  }

  // B. Parse Data Formulir & Validasi Zod
  const rawData: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key !== 'foto' && key !== 'fotoKk') {
      rawData[key] = value;
    }
  });

  const parsed = pendudukInputSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.errors.map(e => e.message).join(' ');
    throw new Error(errorMsg);
  }

  const data = parsed.data;

  // C. Cek NIK Duplikat Upfront
  const existingWarga = await prisma.penduduk.findUnique({
    where: { nik: data.nik },
    select: { namaLengkap: true }
  });

  if (existingWarga) {
    throw new Error(`NIK sudah terdaftar atas nama ${existingWarga.namaLengkap}. Silakan gunakan NIK yang valid.`);
  }

  // D. Cek/Buat Keluarga
  await prisma.keluarga.upsert({
    where: { noKk: data.noKk },
    update: {}, // Jangan timpa alamat jika KK sudah ada
    create: {
      noKk: data.noKk,
      kepalaKeluargaNik: data.nik,
      alamat: data.alamat || '-',
      dusun: data.dusun || '-',
      rt: data.rt || '-',
      rw: data.rw || '-',
      kecamatan: data.kecamatan || 'LEMBEYAN',
      kabupaten: data.kabupaten || 'MAGETAN',
      provinsi: data.provinsi || 'JAWA TIMUR',
      kodePos: data.kodePos || '63372',
      wilayahRtId: data.wilayahRtId || null
    }
  });

  // E. Handle Foto Warga (Max 5MB, JPG/PNG)
  const file = formData.get('foto') as File;
  let fotoPath: string | null = null;

  if (file && file.size > 0) {
    try {
      fotoPath = await validateAndUploadFile(file, ['jpg', 'jpeg', 'png'], 5, data.nik, 'penduduk');
    } catch (err: any) {
      throw new Error(`Gagal mengunggah foto warga: ${err.message}`);
    }
  }

  // F. Handle Foto KK (Max 5MB, JPG/PNG/PDF)
  const fileKk = formData.get('fotoKk') as File;
  let fotoKkPath: string | null = null;

  if (fileKk && fileKk.size > 0) {
    try {
      fotoKkPath = await validateAndUploadFile(fileKk, ['jpg', 'jpeg', 'png', 'pdf'], 5, `KK-${data.noKk}`, 'kk');
    } catch (err: any) {
      // Hapus foto warga yang sudah terupload jika upload KK gagal
      if (fotoPath) {
        const fullPath = path.join(process.cwd(), 'public', fotoPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
      throw new Error(`Gagal mengunggah berkas KK: ${err.message}`);
    }
  }

  if (fotoKkPath) {
    await prisma.keluarga.update({
      where: { noKk: data.noKk },
      data: { fotoKk: fotoKkPath }
    });
  }

  // G. Simpan Penduduk & Mutasi (Atomic Transaction)
  try {
    await prisma.$transaction(async (tx: any) => {
      // Buat Penduduk
      await tx.penduduk.create({
        data: {
          nik: data.nik,
          noKk: data.noKk,
          namaLengkap: data.namaLengkap,
          tempatLahir: data.tempatLahir,
          tanggalLahir: data.tanggalLahir,
          jenisKelamin: data.jenisKelamin,
          statusDalamKeluarga: data.statusDalamKeluarga || 'ANAK',
          agama: data.agama || 'ISLAM',
          pekerjaan: data.pekerjaan || '-',
          pendidikanTerakhir: data.pendidikanTerakhir || '-',
          namaAyah: data.namaAyah || '-',
          namaIbu: data.namaIbu || '-',
          kewarganegaraan: data.kewarganegaraan || 'WNI',
          statusPerkawinan: data.statusPerkawinan || 'BELUM KAWIN',
          golonganDarah: data.golonganDarah || '-',
          statusRekam: (formData.get('statusRekam') as string) || 'BELUM REKAM',
          noPaspor: data.noPaspor || '',
          noKitas: data.noKitas || '',
          foto: fotoPath
        }
      });

      // Jika ini adalah Mutasi (Pindah Datang / Kelahiran)
      const isMutasi = formData.get('isMutasi') === 'true';
      if (isMutasi) {
        const jenisMutasi = formData.get('jenisMutasi') as string;
        const tanggalMutasiRaw = formData.get('tanggalMutasi') as string;
        const tanggalMutasi = tanggalMutasiRaw ? new Date(tanggalMutasiRaw) : new Date();

        const alamatAsal = formData.get('alamatAsal') as string;
        const desaAsal = formData.get('desaAsal') as string;
        const kecamatanAsal = formData.get('kecamatanAsal') as string;
        const kabupatenAsal = formData.get('kabupatenAsal') as string;
        const provinsiAsal = formData.get('provinsiAsal') as string;
        const kodePosAsal = formData.get('kodePosAsal') as string;

        await tx.mutasi.create({
          data: {
            nik: data.nik,
            jenisMutasi: jenisMutasi || 'PINDAH MASUK',
            tanggalMutasi,
            keterangan: `Warga Baru (${jenisMutasi}). Asal: ${alamatAsal || desaAsal || 'Kediren'}`,
            alamatAsal,
            desaAsal,
            kecamatanAsal,
            kabupatenAsal,
            provinsiAsal,
            kodePosAsal,
            petugasInput: session.user?.name || 'Admin Desa'
          }
        });
      }
    });

    revalidatePath('/admin/penduduk');
    revalidatePath('/admin/penduduk/mutasi');
    return { success: true };
  } catch (error: any) {
    // Clean up uploaded files in case of db transaction fail
    if (fotoPath) {
      const fullPath = path.join(process.cwd(), 'public', fotoPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    if (fotoKkPath) {
      const fullPath = path.join(process.cwd(), 'public', fotoKkPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    console.error('Gagal simpan penduduk:', error);
    throw new Error(error.message || 'Gagal menyimpan data penduduk.');
  }
}

export async function updatePenduduk(formData: FormData) {
  // A. Pengecekan Sesi Keamanan
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Sesi login Anda tidak valid atau telah berakhir. Silakan login kembali.");
  }

  const oldNik = formData.get('oldNik') as string;
  if (!oldNik) throw new Error("NIK lama tidak ditemukan.");

  // B. Parse Data Formulir & Validasi Zod
  const rawData: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (key !== 'foto' && key !== 'fotoKk') {
      rawData[key] = value;
    }
  });

  const parsed = pendudukInputSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.errors.map(e => e.message).join(' ');
    throw new Error(errorMsg);
  }

  const data = parsed.data;

  // C. Cek NIK Duplikat jika NIK diubah
  if (data.nik !== oldNik) {
    const existingWarga = await prisma.penduduk.findUnique({
      where: { nik: data.nik },
      select: { namaLengkap: true }
    });
    if (existingWarga) {
      throw new Error(`NIK baru (${data.nik}) sudah terdaftar atas nama ${existingWarga.namaLengkap}.`);
    }
  }

  // D. Update KK Alamat
  await prisma.keluarga.update({
    where: { noKk: data.noKk },
    data: {
      alamat: data.alamat || '-',
      dusun: data.dusun || '-',
      rt: data.rt || '-',
      rw: data.rw || '-',
      kecamatan: data.kecamatan || 'LEMBEYAN',
      kabupaten: data.kabupaten || 'MAGETAN',
      wilayahRtId: data.wilayahRtId || null
    }
  });

  // E. Handle Foto Warga (Max 5MB, JPG/PNG)
  const file = formData.get('foto') as File;
  let fotoPath: string | null = null;

  if (file && file.size > 0) {
    try {
      fotoPath = await validateAndUploadFile(file, ['jpg', 'jpeg', 'png'], 5, data.nik, 'penduduk');
      
      // Hapus foto lama jika sukses upload yang baru
      const oldWarga = await prisma.penduduk.findUnique({
        where: { nik: oldNik },
        select: { foto: true }
      });
      if (oldWarga?.foto) {
        const oldFullPath = path.join(process.cwd(), 'public', oldWarga.foto);
        if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
      }
    } catch (err: any) {
      throw new Error(`Gagal mengunggah foto warga baru: ${err.message}`);
    }
  }

  // F. Update Penduduk di DB
  try {
    await prisma.penduduk.update({
      where: { nik: oldNik },
      data: {
        nik: data.nik,
        noKk: data.noKk,
        namaLengkap: data.namaLengkap,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        jenisKelamin: data.jenisKelamin,
        statusDalamKeluarga: data.statusDalamKeluarga || 'ANAK',
        agama: data.agama || 'ISLAM',
        pekerjaan: data.pekerjaan || '-',
        pendidikanTerakhir: data.pendidikanTerakhir || '-',
        namaAyah: data.namaAyah || '-',
        namaIbu: data.namaIbu || '-',
        kewarganegaraan: data.kewarganegaraan || 'WNI',
        statusPerkawinan: data.statusPerkawinan || 'BELUM KAWIN',
        golonganDarah: data.golonganDarah || '-',
        statusRekam: (formData.get('statusRekam') as string) || 'BELUM REKAM',
        noPaspor: data.noPaspor || '',
        noKitas: data.noKitas || '',
        ...(fotoPath ? { foto: fotoPath } : {})
      }
    });

    revalidatePath('/admin/penduduk');
    return { success: true, nik: data.nik };
  } catch (error: any) {
    if (fotoPath) {
      const fullPath = path.join(process.cwd(), 'public', fotoPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    console.error('Gagal update penduduk:', error);
    throw new Error('Gagal memperbarui data penduduk.');
  }
}

export async function deletePenduduk(nik: string) {
  // A. Pengecekan Sesi & Otorisasi Peran (Admin & Kepala Desa Saja)
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Sesi login Anda tidak valid atau telah berakhir.");
  }
  
  const role = (session.user as any).role;
  if (role !== 'Admin' && role !== 'Kepala Desa') {
    throw new Error("Anda tidak memiliki wewenang untuk menghapus data kependudukan.");
  }

  // B. Hapus Data
  const warga = await prisma.penduduk.findUnique({ where: { nik } });
  if (warga?.foto) {
    const fullPath = path.join(process.cwd(), 'public', warga.foto);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
  
  await prisma.penduduk.delete({ where: { nik } });
  revalidatePath('/admin/penduduk');
}
