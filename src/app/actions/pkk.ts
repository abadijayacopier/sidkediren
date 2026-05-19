'use server';

import prisma, { withDriftRetry } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';

export async function getPosyanduList() {
  return withDriftRetry(
    () => prisma.posyandu.findMany({
      orderBy: { nama: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getKaderPkkList() {
  return withDriftRetry(
    () => prisma.kaderPkk.findMany({
      where: { isActive: true },
      orderBy: { nama: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getJadwalPosyandu() {
  return withDriftRetry(
    () => prisma.jadwalPosyandu.findMany({
      include: {
        posyandu: true,
        kader: true
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBalitaKmsList() {
  return withDriftRetry(
    () => prisma.balitaKms.findMany({
      include: {
        posyandu: true
      },
      orderBy: { nama: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function seedPkkData() {
  // Hanya melakukan seeding jika tabel kosong
  const posyanduCount = await prisma.posyandu.count();
  
  if (posyanduCount === 0) {
    // 1. Seed Posyandu
    const p1 = await prisma.posyandu.create({ data: { nama: 'Posyandu Mawar 1', dusun: 'Krajan' } });
    const p2 = await prisma.posyandu.create({ data: { nama: 'Posyandu Melati 2', dusun: 'Pule' } });
    const p3 = await prisma.posyandu.create({ data: { nama: 'Posyandu Kenanga 3', dusun: 'Ngujung' } });

    // 2. Seed Kader
    const k1 = await prisma.kaderPkk.create({ data: { nik: '3511111111110001', nama: 'Siti Aminah', jabatan: 'Ketua TP PKK', areaTugas: 'Desa Kediren', kontak: '0812-3456-7890' } });
    const k2 = await prisma.kaderPkk.create({ data: { nik: '3511111111110002', nama: 'Rina Wati', jabatan: 'Kader Posyandu Lansia', areaTugas: 'Dusun Pule', kontak: '0856-7890-1234' } });
    const k3 = await prisma.kaderPkk.create({ data: { nik: '3511111111110003', nama: 'Mujiati', jabatan: 'Kader Posyandu Balita', areaTugas: 'Dusun Ngujung', kontak: '0821-2345-6789' } });

    // 3. Seed Jadwal
    await prisma.jadwalPosyandu.create({ data: { posyanduId: p1.id, kaderId: k1.id, tanggal: new Date('2026-05-20'), waktu: '08:00 - 11:00', sasaran: 'Balita & Ibu Hamil' } });
    await prisma.jadwalPosyandu.create({ data: { posyanduId: p2.id, kaderId: k2.id, tanggal: new Date('2026-05-22'), waktu: '08:30 - 11:30', sasaran: 'Lansia' } });
    await prisma.jadwalPosyandu.create({ data: { posyanduId: p3.id, kaderId: k3.id, tanggal: new Date('2026-05-25'), waktu: '08:00 - 11:00', sasaran: 'Balita & Ibu Hamil' } });

    // 4. Seed Balita
    await prisma.balitaKms.create({ data: { posyanduId: p1.id, nama: 'Ahmad Rafiq', namaIbu: 'Nurul Hidayah', usiaBulan: 18, beratBadan: 10.2, tinggiBadan: 80, statusGizi: 'Normal' } });
    await prisma.balitaKms.create({ data: { posyanduId: p1.id, nama: 'Siti Aisyah', namaIbu: 'Dewi Lestari', usiaBulan: 24, beratBadan: 11.5, tinggiBadan: 86, statusGizi: 'Normal' } });
    await prisma.balitaKms.create({ data: { posyanduId: p3.id, nama: 'Budi Santoso', namaIbu: 'Wahyuni', usiaBulan: 12, beratBadan: 7.8, tinggiBadan: 72, statusGizi: 'Gizi Kurang' } });
    await prisma.balitaKms.create({ data: { posyanduId: p2.id, nama: 'Clara Putri', namaIbu: 'Maria Ulfa', usiaBulan: 36, beratBadan: 14.0, tinggiBadan: 95, statusGizi: 'Normal' } });

    revalidatePath('/admin/pkk');
    return { success: true, message: 'Seeding berhasil' };
  }
  
  return { success: true, message: 'Data sudah ada' };
}

// === CUD OPERATIONS ===

export async function saveBalita(formData: FormData) {
  try {
    const nama = formData.get('nama') as string;
    const namaIbu = formData.get('namaIbu') as string;
    const usiaBulan = Number(formData.get('usiaBulan'));
    const beratBadan = Number(formData.get('beratBadan'));
    const tinggiBadan = Number(formData.get('tinggiBadan'));
    const posyanduId = Number(formData.get('posyanduId'));

    // Hitung status gizi sederhana
    let statusGizi = 'Normal';
    if (beratBadan < (usiaBulan * 0.4)) statusGizi = 'Gizi Kurang';
    if (tinggiBadan < (usiaBulan * 2.5)) statusGizi = 'Stunting';

    await prisma.balitaKms.create({
      data: {
        nama,
        namaIbu,
        usiaBulan,
        beratBadan,
        tinggiBadan,
        posyanduId,
        statusGizi,
        nik: Date.now().toString().slice(-16) // mock NIK
      }
    });

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Balita:', error);
    throw new Error(error.message);
  }
}

export async function deleteBalita(id: number) {
  try {
    await prisma.balitaKms.delete({ where: { id } });
    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
