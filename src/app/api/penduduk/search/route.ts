import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (q.length < 3) {
      return NextResponse.json([]);
    }

    const penduduk = await prisma.penduduk.findMany({
      where: {
        OR: [
          { nik: { contains: q } },
          { namaLengkap: { contains: q } }
        ]
      },
      select: {
        nik: true,
        namaLengkap: true,
        tanggalLahir: true,
        noKk: true
      },
      take: 10
    });

    return NextResponse.json(penduduk);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
