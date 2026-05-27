'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Generate random 6-character alphanumeric PIN
function generatePin(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars: I,O,0,1
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
}

// Admin action: Generate PIN for a penduduk
export async function generateWargaPin(nik: string) {
  const penduduk = await prisma.penduduk.findUnique({ where: { nik } });
  if (!penduduk) throw new Error('Penduduk tidak ditemukan');

  const pin = generatePin();
  const pinHash = await bcrypt.hash(pin, 10);

  await prisma.penduduk.update({
    where: { nik },
    data: { pinHash },
  });

  revalidatePath('/admin/penduduk');
  return { success: true, pin, nama: penduduk.namaLengkap };
}

// Admin action: Reset PIN for a penduduk
export async function resetWargaPin(nik: string) {
  return generateWargaPin(nik);
}

// Admin action: Bulk generate PINs for all penduduk without PIN
export async function bulkGeneratePin() {
  const pendudukTanpaPin = await prisma.penduduk.findMany({
    where: { pinHash: null, isHidup: true },
    select: { nik: true, namaLengkap: true },
  });

  const results: { nik: string; nama: string; pin: string }[] = [];

  for (const p of pendudukTanpaPin) {
    const pin = generatePin();
    const pinHash = await bcrypt.hash(pin, 10);

    await prisma.penduduk.update({
      where: { nik: p.nik },
      data: { pinHash },
    });

    results.push({ nik: p.nik, nama: p.namaLengkap, pin });
  }

  revalidatePath('/admin/penduduk');
  return { success: true, count: results.length, results };
}

// Warga action: Change own PIN
export async function changeWargaPin(currentPin: string, newPin: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).loginType !== 'warga') {
    throw new Error('Unauthorized');
  }

  const nik = (session.user as any).nik;
  if (!nik) throw new Error('NIK tidak ditemukan di sesi');

  if (!newPin || newPin.length !== 6) {
    throw new Error('PIN baru harus terdiri dari 6 karakter');
  }

  const penduduk = await prisma.penduduk.findUnique({ where: { nik } });
  if (!penduduk || !penduduk.pinHash) throw new Error('Data tidak valid');

  const isCurrentCorrect = await bcrypt.compare(currentPin, penduduk.pinHash);
  if (!isCurrentCorrect) throw new Error('PIN lama salah');

  const newPinHash = await bcrypt.hash(newPin.toUpperCase(), 10);
  await prisma.penduduk.update({
    where: { nik },
    data: { pinHash: newPinHash },
  });

  return { success: true };
}

// Warga action: Get own profile data
export async function getWargaProfile() {
  const session = await auth();
  if (!session?.user || (session.user as any).loginType !== 'warga') {
    return null;
  }

  const nik = (session.user as any).nik;
  const penduduk = await prisma.penduduk.findUnique({
    where: { nik },
    include: {
      keluarga: {
        include: {
          penduduk: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  return penduduk;
}

// Warga action: Get own surat history
export async function getWargaSuratHistory() {
  const session = await auth();
  if (!session?.user || (session.user as any).loginType !== 'warga') {
    return { riwayat: [], permohonan: [] };
  }

  const nik = (session.user as any).nik;

  const [riwayat, permohonan] = await Promise.all([
    prisma.riwayatSurat.findMany({
      where: { nikPemohon: nik },
      include: { masterSurat: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.permohonanSurat.findMany({
      where: { nikPemohon: nik },
      include: { masterSurat: true },
      orderBy: { tanggalAjuan: 'desc' },
    }),
  ]);

  return { riwayat, permohonan };
}

// Warga action: Submit surat request
export async function submitPermohonanSurat(formData: FormData) {
  const session = await auth();
  if (!session?.user || (session.user as any).loginType !== 'warga') {
    throw new Error('Unauthorized');
  }

  const nik = (session.user as any).nik;
  const masterSuratId = Number(formData.get('masterSuratId'));
  const keperluan = formData.get('keperluan') as string || '';
  const dataJson = formData.get('dataJson') as string || '{}';

  const penduduk = await prisma.penduduk.findUnique({ where: { nik } });
  if (!penduduk) throw new Error('Data penduduk tidak ditemukan');

  await prisma.permohonanSurat.create({
    data: {
      masterSuratId,
      nikPemohon: nik,
      keperluan,
      metaData: dataJson,
      status: 'Pending',
    },
  });

  revalidatePath('/portal');
  return { success: true };
}

// Public: Get available surat types for permohonan
export async function getAvailableSuratTypes() {
  return prisma.masterSurat.findMany({
    orderBy: { namaSurat: 'asc' },
    select: {
      id: true,
      kodeSurat: true,
      namaSurat: true,
      formSchema: true,
    },
  });
}
