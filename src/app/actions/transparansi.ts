'use server';

import prisma, { withDriftRetry } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';

export async function getApbdesSummary(tahun: number, status: string = 'MURNI') {
  const items = await withDriftRetry(
    () => prisma.apbdesItem.findMany({
      where: { tahun, status },
      include: { kategori: true }
    }),
    syncDatabaseStructure
  );

  return {
    totalPendapatan: items.filter((i: any) => i.kategori?.jenis === 'PENDAPATAN').reduce((acc: number, curr: any) => acc + Number(curr.anggaran), 0),
    totalBelanja: items.filter((i: any) => i.kategori?.jenis === 'BELANJA').reduce((acc: number, curr: any) => acc + Number(curr.anggaran), 0),
    totalPembiayaan: items.filter((i: any) => i.kategori?.jenis === 'PEMBIAYAAN').reduce((acc: number, curr: any) => acc + Number(curr.anggaran), 0),
  };
}

export async function getApbdesItems(tahun: number, status: string = 'MURNI') {
  const items = await withDriftRetry(
    () => prisma.apbdesItem.findMany({
      where: { tahun, status },
      include: { kategori: true },
      orderBy: [
        { kategoriId: 'asc' },
        { kodeRekening: 'asc' }
      ]
    }),
    syncDatabaseStructure
  );

  return JSON.parse(JSON.stringify(items));
}

export async function getApbdesKategori() {
  const categories = await prisma.apbdesKategori.findMany({
    orderBy: { id: 'asc' }
  });
  return JSON.parse(JSON.stringify(categories));
}

export async function getProgramKerja(tahun: number) {
  const programs = await withDriftRetry(
    () => prisma.programKerja.findMany({
      where: { tahun },
      orderBy: { updatedAt: 'desc' }
    }),
    syncDatabaseStructure
  );

  return JSON.parse(JSON.stringify(programs));
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

  const data = { tahun, status, kategoriId, kodeRekening, namaItem, anggaran, realisasi, sumberDana, keterangan };

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

  const data = { tahun, namaProgram, deskripsi, lokasi, anggaran, sumberDana, status, fotoProgres, latitude, longitude };

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
      { nama: "Bidang Penyelenggaraan Pemerintahan Desa", jenis: "BELANJA" },
      { nama: "Bidang Pelaksanaan Pembangunan Desa", jenis: "BELANJA" },
      { nama: "Bidang Pembinaan Kemasyarakatan Desa", jenis: "BELANJA" },
      { nama: "Bidang Pemberdayaan Masyarakat Desa", jenis: "BELANJA" },
      { nama: "Bidang Penanggulangan Bencana, Keadaan Darurat dan Mendesak Desa", jenis: "BELANJA" },
      { nama: "Pendapatan Desa", jenis: "PENDAPATAN" },
      { nama: "Pembiayaan Desa", jenis: "PEMBIAYAAN" }
    ];

    for (const cat of categories) {
      await prisma.apbdesKategori.create({
        data: { 
          namaKategori: cat.nama,
          jenis: cat.jenis as any
        }
      });
    }
    return { success: true, message: "Kategori berhasil diinisialisasi" };
  }
  return { success: false, message: "Kategori sudah ada" };
}

export async function deleteApbdesItem(id: number) {
  await prisma.apbdesItem.delete({ where: { id } });
  revalidatePath('/admin/settings/transparansi');
  revalidatePath('/transparansi');
}

export async function deleteProgramKerja(id: number) {
  await prisma.programKerja.delete({ where: { id } });
  revalidatePath('/admin/settings/transparansi');
  revalidatePath('/transparansi');
}
