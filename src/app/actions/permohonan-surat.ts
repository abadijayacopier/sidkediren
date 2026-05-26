'use server';

import prisma, { withDriftRetry } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';
import { generateNomorSurat, createRiwayatSurat } from './surat';

export async function submitPermohonanWarga(data: {
  nikPemohon: string;
  namaIbuKandung: string;
  masterSuratId: number;
  keperluan: string;
  metaData: string; // JSON string of dynamic variables
}) {
  return withDriftRetry(
    async () => {
      // 1. Validasi NIK & Nama Ibu Kandung
      const warga = await prisma.penduduk.findUnique({
        where: { nik: data.nikPemohon }
      });

      if (!warga) {
        return { success: false, message: 'NIK tidak terdaftar dalam database kependudukan Desa Kediren' };
      }

      // Validasi nama ibu kandung (case insensitive)
      const namaIbuDb = warga.namaIbu?.toLowerCase().trim() || '';
      const namaIbuInput = data.namaIbuKandung.toLowerCase().trim();

      if (namaIbuDb !== namaIbuInput) {
        return { success: false, message: 'Verifikasi gagal: Nama Ibu Kandung tidak sesuai dengan NIK yang dimasukkan' };
      }

      // 2. Buat Permohonan
      const permohonan = await prisma.permohonanSurat.create({
        data: {
          nikPemohon: data.nikPemohon,
          masterSuratId: data.masterSuratId,
          status: 'Pending',
          keperluan: data.keperluan,
          metaData: data.metaData
        }
      });

      revalidatePath('/admin/surat/antrean');
      return { success: true, permohonanId: permohonan.id };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getAntreanPermohonan() {
  return withDriftRetry(
    () => prisma.permohonanSurat.findMany({
      include: {
        penduduk: true,
        masterSurat: {
          include: { klasifikasi: true }
        }
      },
      orderBy: { tanggalAjuan: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function prosesPersetujuanPermohonan(
  id: string,
  status: 'Disetujui' | 'Ditolak',
  alasanBatal?: string
) {
  return withDriftRetry(
    async () => {
      const permohonan = await prisma.permohonanSurat.findUnique({
        where: { id },
        include: { penduduk: true, masterSurat: true }
      });

      if (!permohonan) {
        return { success: false, message: 'Permohonan tidak ditemukan' };
      }

      if (status === 'Ditolak') {
        await prisma.permohonanSurat.update({
          where: { id },
          data: {
            status: 'Ditolak',
            keteranganBatal: alasanBatal || 'Persyaratan berkas kurang lengkap'
          }
        });
        revalidatePath('/admin/surat/antrean');
        return { success: true, message: 'Permohonan berhasil ditolak' };
      }

      // Jika Disetujui
      // 1. Generate nomor surat resmi secara otomatis
      const nomorSurat = await generateNomorSurat(permohonan.masterSuratId);

      // 2. Terbitkan RiwayatSurat
      const riwayat = await createRiwayatSurat({
        nikPemohon: permohonan.nikPemohon,
        masterSuratId: permohonan.masterSuratId,
        nomorSurat,
        keterangan: permohonan.keperluan,
        metaData: permohonan.metaData
      });

      // 3. Update status permohonan
      await prisma.permohonanSurat.update({
        where: { id },
        data: { status: 'Disetujui' }
      });

      revalidatePath('/admin/surat/antrean');
      revalidatePath('/admin/surat');
      return { success: true, riwayatId: riwayat.id, message: 'Permohonan berhasil disetujui and surat resmi diterbitkan' };
    },
    async () => { await syncDatabaseStructure(); }
  );
}
