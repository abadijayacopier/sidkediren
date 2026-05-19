'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getBerita(limit?: number) {
  try {
    const berita = await prisma.berita.findMany({
      where: { isPublished: true },
      orderBy: { tanggal: 'desc' },
      take: limit,
    });
    return berita;
  } catch (error) {
    console.error('Error fetching berita:', error);
    return [];
  }
}

export async function getAllBerita() {
  try {
    return await prisma.berita.findMany({
      orderBy: { tanggal: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching all berita:', error);
    return [];
  }
}

export async function getBeritaById(id: number) {
  try {
    return await prisma.berita.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching berita by id:', error);
    return null;
  }
}

export async function getBeritaBySlug(slug: string) {
  try {
    return await prisma.berita.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error('Error fetching berita by slug:', error);
    return null;
  }
}

export async function createBerita(formData: FormData) {
  const judul = formData.get('judul') as string;
  const ringkasan = formData.get('ringkasan') as string;
  const konten = formData.get('konten') as string;
  const gambar = formData.get('gambar') as string;
  const kategori = formData.get('kategori') as string;
  const isPublished = formData.get('isPublished') === 'on';

  const slug = judul
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  try {
    await prisma.berita.create({
      data: {
        judul,
        slug,
        ringkasan,
        konten,
        gambar,
        kategori,
        isPublished,
      },
    });
  } catch (error) {
    console.error('Error creating berita:', error);
  }

  revalidatePath('/admin/berita');
  revalidatePath('/');
  redirect('/admin/berita');
}

export async function updateBerita(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const judul = formData.get('judul') as string;
  const ringkasan = formData.get('ringkasan') as string;
  const konten = formData.get('konten') as string;
  const gambar = formData.get('gambar') as string;
  const kategori = formData.get('kategori') as string;
  const isPublished = formData.get('isPublished') === 'on';

  const slug = judul
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  try {
    await prisma.berita.update({
      where: { id },
      data: {
        judul,
        slug,
        ringkasan,
        konten,
        gambar,
        kategori,
        isPublished,
      },
    });
  } catch (error) {
    console.error('Error updating berita:', error);
  }

  revalidatePath('/admin/berita');
  revalidatePath('/');
  redirect('/admin/berita');
}

export async function deleteBerita(id: number) {
  try {
    await prisma.berita.delete({
      where: { id },
    });
    revalidatePath('/admin/berita');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting berita:', error);
    return { error: 'Gagal menghapus berita' };
  }
}
