import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { noKk: string } }
) {
  const { noKk } = await params;

  try {
    const keluarga = await prisma.keluarga.findUnique({
      where: { noKk },
      include: {
        kepalaKeluarga: {
          select: { namaLengkap: true }
        }
      }
    });

    if (keluarga) {
      return NextResponse.json({ exists: true, data: keluarga });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
