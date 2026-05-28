'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getPengguna() {
  try {
    return await prisma.pengguna.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching pengguna:', error);
    return [];
  }
}

export async function createPengguna(formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const peran = formData.get('peran') as string;
    const namaPetugas = formData.get('namaPetugas') as string;
    const isActive = formData.get('isActive') === 'true';
    const aksesModul = formData.get('aksesModul') as string;

    // Validate
    if (!username || !password || !peran || !namaPetugas) {
      return { error: 'Semua kolom wajib diisi.' };
    }

    const existingUser = await prisma.pengguna.findUnique({ where: { username } });
    if (existingUser) {
      return { error: 'Username sudah digunakan.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.pengguna.create({
      data: {
        username,
        passwordHash,
        peran,
        namaPetugas,
        isActive,
        aksesModul
      } as any
    });

    revalidatePath('/admin/settings/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating pengguna:', error);
    return { error: 'Terjadi kesalahan sistem.' };
  }
}

export async function updatePengguna(formData: FormData) {
  try {
    const id = Number(formData.get('id'));
    const username = formData.get('username') as string;
    const password = formData.get('password') as string; // Optional for update
    const peran = formData.get('peran') as string;
    const namaPetugas = formData.get('namaPetugas') as string;
    const isActive = formData.get('isActive') === 'true';
    const aksesModul = formData.get('aksesModul') as string;

    if (!id || !username || !peran || !namaPetugas) {
      return { error: 'Data tidak lengkap.' };
    }

    // Check if updating username to one that already exists
    const existingUser = await prisma.pengguna.findFirst({
      where: {
        username,
        id: { not: id }
      }
    });

    if (existingUser) {
      return { error: 'Username sudah digunakan oleh user lain.' };
    }

    const updateData: any = {
      username,
      peran,
      namaPetugas,
      isActive,
      aksesModul
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    // Protect main admin
    const currentUser = await prisma.pengguna.findUnique({ where: { id } });
    if (currentUser?.username === 'admin' && !isActive) {
       return { error: 'Akun admin utama tidak boleh dinonaktifkan.' };
    }
    if (currentUser?.username === 'admin' && peran !== 'Admin') {
       return { error: 'Peran akun admin utama tidak boleh diubah.' };
    }

    await prisma.pengguna.update({
      where: { id },
      data: updateData as any
    });

    revalidatePath('/admin/settings/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating pengguna:', error);
    return { error: 'Terjadi kesalahan sistem.' };
  }
}

export async function deletePengguna(id: number) {
  try {
    const user = await prisma.pengguna.findUnique({ where: { id } });
    
    if (!user) {
      return { error: 'User tidak ditemukan.' };
    }

    if (user.username === 'admin') {
      return { error: 'Akun admin utama tidak dapat dihapus.' };
    }

    await prisma.pengguna.delete({
      where: { id }
    });

    revalidatePath('/admin/settings/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting pengguna:', error);
    return { error: 'Terjadi kesalahan sistem saat menghapus.' };
  }
}
