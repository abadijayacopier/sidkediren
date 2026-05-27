'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginAdmin(prevState: any, formData: FormData) {
  try {
    await signIn('admin-login', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirectTo: '/admin',
    });
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

    await signIn('warga-login', {
      nik,
      pin,
      redirectTo: '/portal',
    });
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
