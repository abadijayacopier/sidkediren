import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const klasifikasi = await prisma.klasifikasiSurat.findFirst({
      where: { kode: '470' } // Kependudukan
    });

    if (!klasifikasi) {
      return NextResponse.json({ success: false, message: 'Klasifikasi 470 tidak ditemukan.' });
    }

    const existing = await prisma.masterSurat.findFirst({
      where: { kodeSurat: 'SK-RTRW' }
    });

    if (!existing) {
      await prisma.masterSurat.create({
        data: {
          kodeSurat: 'SK-RTRW',
          namaSurat: 'Surat Pengantar RT/RW',
          formatNomor: '470/.../{rt}/{rw}/{tahun}',
          klasifikasiId: klasifikasi.id,
          deskripsi: 'Surat pengantar dasar dari Ketua RT dan Ketua RW untuk mengurus keperluan administrasi tingkat desa.',
          persyaratan: 'KTP Asli, KK Asli',
          templateUrl: '', 
          isActive: true
        }
      });
      return NextResponse.json({ success: true, message: 'Berhasil menambahkan Surat Pengantar RT/RW.' });
    } else {
      return NextResponse.json({ success: true, message: 'Surat Pengantar RT/RW sudah ada.' });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
