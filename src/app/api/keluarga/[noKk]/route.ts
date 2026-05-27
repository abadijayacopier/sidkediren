import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: { noKk: string } }
) {
  // Pengamanan: Hanya pengguna terautentikasi (admin/staff) yang bisa mencari KK
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { noKk } = await params;

  try {
    const keluarga = await prisma.keluarga.findUnique({
      where: { noKk },
      include: {
        penduduk: {
          where: { statusDalamKeluarga: 'KEPALA KELUARGA' },
          select: { namaLengkap: true }
        }
      }
    });

    if (keluarga) {
      // Menyesuaikan struktur data yang diharapkan oleh client (keluargaData.kepalaKeluarga.namaLengkap)
      const kepalaKeluarga = keluarga.penduduk[0] || null;
      return NextResponse.json({ 
        exists: true, 
        data: {
          ...keluarga,
          kepalaKeluarga
        } 
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
