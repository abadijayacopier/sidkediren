import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: Request,
  { params }: { params: { nik: string } }
) {
  // Pengamanan: Hanya pengguna terautentikasi (admin/staff) yang bisa mencari NIK
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { nik } = await params;
    const warga = await prisma.penduduk.findUnique({
      where: { nik },
      include: { keluarga: true }
    });

    if (!warga) {
      return NextResponse.json({ error: 'Warga tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(warga);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
