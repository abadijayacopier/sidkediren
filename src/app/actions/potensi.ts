'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';

export async function getPotensiList(kategori?: string) {
  try {
    if (kategori) {
      return await prisma.potensi.findMany({
        where: { kategori },
        orderBy: { createdAt: 'desc' }
      });
    }
    return await prisma.potensi.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
    if (error.message?.includes('does not exist') || error.message?.includes('Unknown column') || error.message?.includes('potensi')) {
      console.log('Table potensi_wisata does not exist, triggering sync...');
      await syncDatabaseStructure();
      if (kategori) {
        return await prisma.potensi.findMany({
          where: { kategori },
          orderBy: { createdAt: 'desc' }
        });
      }
      return await prisma.potensi.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }
    throw error;
  }
}

export async function savePotensi(formData: FormData) {
  const idStr = formData.get('id') as string;
  const id = idStr ? parseInt(idStr) : undefined;
  
  const data = {
    kategori: (formData.get('kategori') as string) || 'UMKM',
    judul: (formData.get('judul') as string) || '',
    deskripsi: (formData.get('deskripsi') as string) || '',
    gambar: (formData.get('gambar') as string) || '',
    lokasi: (formData.get('lokasi') as string) || '',
    harga: (formData.get('harga') as string) || '',
    isBestSeller: formData.get('isBestSeller') === 'true',
    mapsUrl: (formData.get('mapsUrl') as string) || '',
  };

  try {
    if (id) {
      await prisma.potensi.update({
        where: { id },
        data
      });
    } else {
      await prisma.potensi.create({
        data
      });
    }
    revalidatePath('/potensi');
    revalidatePath('/admin/settings/potensi');
    return { success: true };
  } catch (error: any) {
    if (error.message?.includes('does not exist') || error.message?.includes('Unknown column') || error.message?.includes('potensi')) {
      await syncDatabaseStructure();
      if (id) {
        await prisma.potensi.update({
          where: { id },
          data
        });
      } else {
        await prisma.potensi.create({
          data
        });
      }
      revalidatePath('/potensi');
      revalidatePath('/admin/settings/potensi');
      return { success: true };
    }
    throw error;
  }
}

export async function deletePotensi(id: number) {
  try {
    await prisma.potensi.delete({
      where: { id }
    });
    revalidatePath('/potensi');
    revalidatePath('/admin/settings/potensi');
    return { success: true };
  } catch (error: any) {
    if (error.message?.includes('does not exist') || error.message?.includes('Unknown column') || error.message?.includes('potensi')) {
      await syncDatabaseStructure();
      await prisma.potensi.delete({
        where: { id }
      });
      revalidatePath('/potensi');
      revalidatePath('/admin/settings/potensi');
      return { success: true };
    }
    throw error;
  }
}
