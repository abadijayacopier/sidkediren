'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

import { syncDatabaseStructure } from './system';


export async function getStrukturOrganisasi() {
  try {
    return await prisma.jabatan.findMany({
      include: {
        perangkatDesa: true
      } as any,
      orderBy: [
        { level: 'asc' },
        { urutan: 'asc' }
      ]
    });
  } catch (error: any) {
    const isDrift = error.message?.includes('does not exist') || 
                    error.message?.includes('Unknown column') || 
                    error.message?.includes('is_active') || 
                    error.message?.includes('created_at') || 
                    error.message?.includes('updated_at');
    if (isDrift) {
      console.log('Detected missing columns in perangkat_desa or jabatan. Attempting auto-fix...');
      await syncDatabaseStructure();
      return await prisma.jabatan.findMany({
        include: {
          perangkatDesa: true
        } as any,
        orderBy: [
          { level: 'asc' },
          { urutan: 'asc' }
        ]
      });
    }
    throw error;
  }
}

export async function updatePerangkatDesa(formData: FormData) {
  const jabatanId = parseInt(formData.get('jabatanId') as string);
  const nik = formData.get('nik') as string;
  const nama = formData.get('nama') as string;
  const status = formData.get('status') as string || 'AKTIF';
  const isActive = status === 'AKTIF';
  
  const fotoFile = formData.get('fotoProfil') as File;
  const ttdFile = formData.get('tandaTanganDigital') as File;

  let fotoPath = formData.get('existingFoto') as string || null;
  let ttdPath = formData.get('existingTTD') as string || null;

  // Handle Foto Upload
  if (fotoFile && fotoFile.size > 0 && fotoFile.name !== 'undefined') {
    try {
      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      const fileName = `${Date.now()}-foto-${nik}.png`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'perangkat');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);
      fotoPath = `/uploads/perangkat/${fileName}`;
    } catch (e) {
      console.error("Error uploading photo:", e);
    }
  }

  // Handle TTD Upload
  if (ttdFile && ttdFile.size > 0 && ttdFile.name !== 'undefined') {
    try {
      const buffer = Buffer.from(await ttdFile.arrayBuffer());
      const fileName = `${Date.now()}-ttd-${nik}.png`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'perangkat');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);
      ttdPath = `/uploads/perangkat/${fileName}`;
    } catch (e) {
      console.error("Error uploading TTD:", e);
    }
  }
  
  // Cek apakah sudah ada pejabat di jabatan ini
  const existing = await prisma.perangkatDesa.findFirst({
    where: { jabatanId }
  });

  if (existing) {
    await prisma.perangkatDesa.update({
      where: { id: existing.id },
      data: {
        nik,
        nama,
        isActive,
        fotoProfil: fotoPath,
        tandaTanganDigital: ttdPath
      }
    });
  } else {
    await prisma.perangkatDesa.create({
      data: {
        jabatanId,
        nik,
        nama,
        isActive,
        fotoProfil: fotoPath,
        tandaTanganDigital: ttdPath
      }
    });
  }

  revalidatePath('/admin/settings/struktur');
  revalidatePath('/admin/settings/profil');
}

export async function removePerangkatDesa(id: number) {
  await prisma.perangkatDesa.delete({
    where: { id }
  });
  revalidatePath('/admin/settings/struktur');
}
