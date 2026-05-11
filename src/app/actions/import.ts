'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';

export async function importStatusPerekaman(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: 'File tidak ditemukan' };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Membaca workbook excel
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Mengubah data excel ke JSON
  const data: any[] = XLSX.utils.sheet_to_json(sheet);

  let updatedCount = 0;
  let errorCount = 0;

  // Proses sinkronisasi per baris
  // Kita asumsikan kolom di Excel bernama 'NIK' dan 'STATUS_REKAM'
  for (const row of data) {
    const nik = row['NIK']?.toString();
    const status = row['STATUS_REKAM']?.toString()?.toUpperCase();

    if (nik && status) {
      try {
        await prisma.penduduk.update({
          where: { nik },
          data: { statusRekam: status }
        });
        updatedCount++;
      } catch (e) {
        errorCount++;
      }
    }
  }

  revalidatePath('/admin/penduduk');
  return { success: true, updatedCount, errorCount };
}
