'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getApbdesSummary(tahun: number, status: string = 'MURNI') {
  const items = await prisma.apbdesItem.findMany({
    where: { tahun, status } as any,
    include: { kategori: true }
  });

  // Kalkulasi Pendapatan, Belanja, Pembiayaan
  // Note: Usually categories are grouped by specific names or IDs
  // We'll assume the 5 Bidang are "Belanja"
  // We might need to add "Pendapatan" and "Pembiayaan" as categories too if they aren't there
  
  const summary = {
    totalPendapatan: items.filter(i => (i as any).kategori?.namaKategori.toLowerCase().includes('pendapatan')).reduce((acc, curr) => acc + Number(curr.anggaran), 0),
    totalBelanja: items.filter(i => (i as any).kategori?.namaKategori.toLowerCase().includes('bidang')).reduce((acc, curr) => acc + Number(curr.anggaran), 0),
    totalPembiayaan: items.filter(i => (i as any).kategori?.namaKategori.toLowerCase().includes('pembiayaan')).reduce((acc, curr) => acc + Number(curr.anggaran), 0),
  };

  return summary;
}

export async function getApbdesItems(tahun: number, status: string = 'MURNI') {
  return await prisma.apbdesItem.findMany({
    where: { tahun, status } as any,
    include: { kategori: true },
    orderBy: [
      { kategoriId: 'asc' },
      { kodeRekening: 'asc' }
    ]
  });
}

export async function getApbdesKategori() {
  return await prisma.apbdesKategori.findMany({
    orderBy: { id: 'asc' }
  });
}

export async function getProgramKerja(tahun: number) {
  return await prisma.programKerja.findMany({
    where: { tahun },
    orderBy: { updatedAt: 'desc' }
  });
}

export async function upsertApbdesItem(formData: FormData) {
  const id = formData.get('id') ? parseInt(formData.get('id') as string) : undefined;
  const tahun = parseInt(formData.get('tahun') as string);
  const status = formData.get('status') as string || 'MURNI';
  const kategoriId = parseInt(formData.get('kategoriId') as string);
  const kodeRekening = formData.get('kodeRekening') as string;
  const namaItem = formData.get('namaItem') as string;
  const anggaranRaw = formData.get('anggaran') as string;
  const anggaran = parseFloat(anggaranRaw.replace(/\./g, ''));
  const realisasiRaw = formData.get('realisasi') as string || '0';
  const realisasi = parseFloat(realisasiRaw.replace(/\./g, ''));
  const sumberDana = formData.get('sumberDana') as string;
  const keterangan = formData.get('keterangan') as string;

  const data = {
    tahun,
    status,
    kategoriId,
    kodeRekening,
    namaItem,
    anggaran,
    realisasi,
    sumberDana,
    keterangan
  };

  if (id) {
    await prisma.apbdesItem.update({ where: { id }, data });
  } else {
    await prisma.apbdesItem.create({ data });
  }

  revalidatePath('/admin/settings/transparansi');
  revalidatePath('/transparansi');
}

export async function upsertProgramKerja(formData: FormData) {
  const id = formData.get('id') ? parseInt(formData.get('id') as string) : undefined;
  const tahun = parseInt(formData.get('tahun') as string);
  const namaProgram = formData.get('namaProgram') as string;
  const deskripsi = formData.get('deskripsi') as string;
  const lokasi = formData.get('lokasi') as string;
  const anggaranRaw = formData.get('anggaran') as string;
  const anggaran = parseFloat(anggaranRaw.replace(/\./g, ''));
  const sumberDana = formData.get('sumberDana') as string;
  const status = formData.get('status') as string;
  const fotoProgres = formData.get('fotoProgres') as string;
  const latitude = formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined;
  const longitude = formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined;

  const data = {
    tahun,
    namaProgram,
    deskripsi,
    lokasi,
    anggaran,
    sumberDana,
    status,
    fotoProgres,
    latitude,
    longitude
  };

  if (id) {
    await prisma.programKerja.update({ where: { id }, data });
  } else {
    await prisma.programKerja.create({ data });
  }

  revalidatePath('/admin/settings/transparansi');
  revalidatePath('/transparansi');
}

export async function initializeTransparansi() {
  const count = await prisma.apbdesKategori.count();
  if (count === 0) {
    const categories = [
      "Bidang Penyelenggaraan Pemerintahan Desa",
      "Bidang Pelaksanaan Pembangunan Desa",
      "Bidang Pembinaan Kemasyarakatan Desa",
      "Bidang Pemberdayaan Masyarakat Desa",
      "Bidang Penanggulangan Bencana, Keadaan Darurat dan Mendesak Desa",
      "Pendapatan Desa",
      "Pembiayaan Desa"
    ];

    for (const name of categories) {
      await prisma.apbdesKategori.create({
        data: { namaKategori: name }
      });
    }
    return { success: true, message: "Kategori berhasil diinisialisasi" };
  }
  return { success: false, message: "Kategori sudah ada" };
}
