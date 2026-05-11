'use server';

import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function exportPendudukToExcel() {
  // Ambil semua data warga beserta data keluarganya
  const penduduk = await prisma.penduduk.findMany({
    include: { keluarga: true },
    orderBy: { namaLengkap: 'asc' }
  });

  // Susun data untuk Excel
  const data = penduduk.map((w: any) => ({
    'NIK': w.nik,
    'NO KK': w.noKk,
    'NAMA LENGKAP': w.namaLengkap,
    'TEMPAT LAHIR': w.tempatLahir,
    'TANGGAL LAHIR': w.tanggalLahir.toLocaleDateString('id-ID'),
    'UMUR': Math.floor((new Date().getTime() - w.tanggalLahir.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) + ' Th',
    'JENIS KELAMIN': w.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN',
    'HUBUNGAN KELUARGA': w.statusDalamKeluarga,
    'AGAMA': w.agama,
    'PEKERJAAN': w.pekerjaan,
    'STATUS REKAM KTP': w.statusRekam,
    'DUSUN': w.keluarga?.dusun,
    'RT': w.keluarga?.rt,
    'RW': w.keluarga?.rw,
    'ALAMAT': w.keluarga?.alamat
  }));

  // Buat Workbook & Sheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penduduk");

  // Generate Base64
  const buf = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  return buf;
}
