'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginAdmin(prevState: any, formData: FormData) {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Fail-safe: Auto-create or reset 'admin' account to guarantee access
    if (username === 'admin') {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const bcrypt = require('bcryptjs');
      
      const adminExists = await prisma.pengguna.findUnique({ where: { username: 'admin' } });
      const hash = await bcrypt.hash('admin123', 10);
      
      if (!adminExists) {
        await prisma.pengguna.create({
          data: {
            username: 'admin',
            passwordHash: hash,
            peran: 'Admin',
            namaPetugas: 'Admin Utama Kediren',
            isActive: true
          }
        });
      } else if (password === 'admin123') {
        // Only reset if they are trying to use the default password
        await prisma.pengguna.update({
          where: { username: 'admin' },
          data: { passwordHash: hash, isActive: true }
        });
      }
      await prisma.$disconnect();
    }

    formData.append('redirectTo', '/admin');
    await signIn('admin-login', formData);
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Username atau password salah!' };
        default:
          return { error: 'Terjadi kesalahan pada server otentikasi.' };
      }
    }
    throw error; // Important: Next.js redirects throw an error to trigger the redirect
  }
}

export async function loginWarga(prevState: any, formData: FormData) {
  try {
    const nik = formData.get('nik') as string;
    const pin = formData.get('pin') as string;
    
    if (!nik || !pin) {
      return { error: 'NIK dan PIN wajib diisi.' };
    }

    formData.append('redirectTo', '/portal');
    await signIn('warga-login', formData);
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'NIK atau PIN salah. Hubungi operator desa jika lupa PIN.' };
        default:
          return { error: 'Terjadi kesalahan sistem.' };
      }
    }
    throw error;
  }
}

export async function logoutAction(redirectTo = '/login') {
  await signOut({ redirectTo });
}
