'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveDusun(data: {
  id?: number;
  nama: string;
  kepalaDusunNik?: string;
  kepalaDusunNama?: string;
  wakilDusunNik?: string;
  wakilDusunNama?: string;
}) {
  try {
    if (data.id) {
      await prisma.wilayahDusun.update({
        where: { id: data.id },
        data: {
          nama: data.nama.toUpperCase(),
          kepalaDusunNik: data.kepalaDusunNik,
          kepalaDusunNama: data.kepalaDusunNama,
          wakilDusunNik: data.wakilDusunNik,
          wakilDusunNama: data.wakilDusunNama,
        }
      });
    } else {
      await prisma.wilayahDusun.create({
        data: {
          nama: data.nama.toUpperCase(),
          kepalaDusunNik: data.kepalaDusunNik,
          kepalaDusunNama: data.kepalaDusunNama,
          wakilDusunNik: data.wakilDusunNik,
          wakilDusunNama: data.wakilDusunNama,
        }
      });
    }
    revalidatePath('/admin/wilayah');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getWilayahList() {
  try {
    const list = await prisma.wilayahDusun.findMany({
      include: {
        rtRwList: {
          orderBy: [{ rw: 'asc' }, { rt: 'asc' }]
        }
      },
      orderBy: { nama: 'asc' }
    });
    return list;
  } catch (err: any) {
    console.error("Error getWilayahList:", err);
    return [];
  }
}

export async function saveRt(data: {
  id?: number;
  dusunId: number;
  rt: string;
  rw: string;
  ketuaRtNik?: string;
  ketuaRtNama?: string;
  wakilRtNik?: string;
  wakilRtNama?: string;
}) {
  try {
    if (data.id) {
      await prisma.wilayahRt.update({
        where: { id: data.id },
        data: {
          rt: data.rt,
          rw: data.rw,
          ketuaRtNik: data.ketuaRtNik,
          ketuaRtNama: data.ketuaRtNama,
          wakilRtNik: data.wakilRtNik,
          wakilRtNama: data.wakilRtNama,
        }
      });
    } else {
      await prisma.wilayahRt.create({
        data: {
          dusunId: data.dusunId,
          rt: data.rt,
          rw: data.rw,
          ketuaRtNik: data.ketuaRtNik,
          ketuaRtNama: data.ketuaRtNama,
          wakilRtNik: data.wakilRtNik,
          wakilRtNama: data.wakilRtNama,
        }
      });
    }
    revalidatePath('/admin/wilayah');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
