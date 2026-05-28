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

export async function downloadTemplateExcel() {
  const data = [{
    'NIK': '1234567890123456',
    'NO KK': '1234567890123456',
    'NAMA LENGKAP': 'Contoh Nama',
    'TEMPAT LAHIR': 'Madiun',
    'TANGGAL LAHIR (YYYY-MM-DD)': '1990-01-01',
    'JENIS KELAMIN (L/P)': 'L',
    'HUBUNGAN KELUARGA': 'KEPALA KELUARGA',
    'AGAMA': 'ISLAM',
    'PEKERJAAN': 'WIRASWASTA',
    'STATUS REKAM KTP': 'SUDAH',
    'NAMA IBU KANDUNG': 'Ibu Contoh',
    'PIN (Opsional)': '123456',
    'DUSUN': 'KRAJAN',
    'RT': '01',
    'RW': '01',
    'ALAMAT': 'Jl. Contoh Alamat No. 1'
  }];

  const worksheet = XLSX.utils.json_to_sheet(data);
  // Lebarkan kolom NIK agar tidak jadi notasi E
  worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 20 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Data");

  return XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
}

export async function importPendudukFromExcel(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: 'File tidak ditemukan' };

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let successCount = 0;
    let failCount = 0;

    // Gunakan transaction untuk optimasi
    await prisma.$transaction(async (tx) => {
      for (const row of data) {
        try {
          const nik = row['NIK']?.toString()?.replace(/\D/g, '');
          const noKk = row['NO KK']?.toString()?.replace(/\D/g, '');
          const nama = row['NAMA LENGKAP']?.toString()?.toUpperCase();
          
          if (!nik || !noKk || !nama) {
            failCount++;
            continue;
          }

          // Cek atau buat keluarga
          let keluarga = await tx.keluarga.findUnique({ where: { noKk } });
          if (!keluarga) {
            keluarga = await tx.keluarga.create({
              data: {
                noKk,
                kepalaKeluargaNik: nik, // Setara sementara
                dusun: row['DUSUN']?.toString() || 'KRAJAN',
                rt: row['RT']?.toString() || '00',
                rw: row['RW']?.toString() || '00',
                alamat: row['ALAMAT']?.toString() || '-'
              }
            });
          }

          // Parse Tanggal (mendukung format Excel numerik atau YYYY-MM-DD)
          let tglLahir = new Date('1990-01-01');
          if (row['TANGGAL LAHIR (YYYY-MM-DD)']) {
            const rawDate = row['TANGGAL LAHIR (YYYY-MM-DD)'];
            if (typeof rawDate === 'number') {
              // Convert Excel serial date
              tglLahir = new Date((rawDate - (25567 + 2)) * 86400 * 1000);
            } else {
              tglLahir = new Date(rawDate);
            }
          }

          // Upsert penduduk
          await tx.penduduk.upsert({
            where: { nik },
            update: {
              namaLengkap: nama,
              noKk: noKk,
              keluargaId: keluarga.id,
              tempatLahir: row['TEMPAT LAHIR']?.toString()?.toUpperCase() || '-',
              tanggalLahir: isNaN(tglLahir.getTime()) ? new Date('1990-01-01') : tglLahir,
              jenisKelamin: row['JENIS KELAMIN (L/P)']?.toString()?.toUpperCase() === 'P' ? 'P' : 'L',
              statusDalamKeluarga: row['HUBUNGAN KELUARGA']?.toString()?.toUpperCase() || 'ANGGOTA KELUARGA',
              agama: row['AGAMA']?.toString()?.toUpperCase() || 'ISLAM',
              pekerjaan: row['PEKERJAAN']?.toString()?.toUpperCase() || 'BELUM/TIDAK BEKERJA',
              statusRekam: row['STATUS REKAM KTP']?.toString()?.toUpperCase() || 'BELUM',
              namaIbu: row['NAMA IBU KANDUNG']?.toString()?.toUpperCase() || '-',
              pin: row['PIN (Opsional)']?.toString() || null,
              isHidup: true,
            },
            create: {
              nik,
              noKk,
              keluargaId: keluarga.id,
              namaLengkap: nama,
              tempatLahir: row['TEMPAT LAHIR']?.toString()?.toUpperCase() || '-',
              tanggalLahir: isNaN(tglLahir.getTime()) ? new Date('1990-01-01') : tglLahir,
              jenisKelamin: row['JENIS KELAMIN (L/P)']?.toString()?.toUpperCase() === 'P' ? 'P' : 'L',
              statusDalamKeluarga: row['HUBUNGAN KELUARGA']?.toString()?.toUpperCase() || 'ANGGOTA KELUARGA',
              agama: row['AGAMA']?.toString()?.toUpperCase() || 'ISLAM',
              pekerjaan: row['PEKERJAAN']?.toString()?.toUpperCase() || 'BELUM/TIDAK BEKERJA',
              statusRekam: row['STATUS REKAM KTP']?.toString()?.toUpperCase() || 'BELUM',
              namaIbu: row['NAMA IBU KANDUNG']?.toString()?.toUpperCase() || '-',
              pin: row['PIN (Opsional)']?.toString() || null,
              isHidup: true,
            }
          });

          // Update kepala keluarga if this is KEPALA KELUARGA
          if (row['HUBUNGAN KELUARGA']?.toString()?.toUpperCase() === 'KEPALA KELUARGA') {
            await tx.keluarga.update({
              where: { id: keluarga.id },
              data: { kepalaKeluargaNik: nik }
            });
          }

          successCount++;
        } catch (innerErr) {
          console.error("Error import row:", innerErr);
          failCount++;
        }
      }
    });

    revalidatePath('/admin/penduduk');
    return { success: true, imported: successCount, failed: failCount };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: 'Gagal memproses file Excel: ' + err.message };
  }
}
