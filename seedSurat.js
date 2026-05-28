import prisma from './src/lib/prisma';

async function seedSurat() {
  console.log('Menambahkan template Surat Keterangan RT/RW...');

  const klasifikasi = await prisma.klasifikasiSurat.findFirst({
    where: { kode: '470' } // Kependudukan
  });

  if (!klasifikasi) {
    console.error('Klasifikasi 470 tidak ditemukan. Gagal.');
    return;
  }

  const existing = await prisma.masterSurat.findFirst({
    where: { kodeSurat: 'SK-RTRW' }
  });

  if (!existing) {
    await prisma.masterSurat.create({
      data: {
        kodeSurat: 'SK-RTRW',
        namaSurat: 'Surat Keterangan Pengantar RT/RW',
        formatNomor: '{kode_klasifikasi}/.../{tahun}',
        klasifikasiId: klasifikasi.id,
        deskripsi: 'Surat pengantar dasar dari RT dan RW untuk mengurus keperluan administrasi tingkat desa.',
        persyaratan: 'KTP, KK Asli',
        templateUrl: '/templates/sk_rtrw.pdf', // Placeholder
        isActive: true
      }
    });
    console.log('Berhasil menambahkan Surat Keterangan RT/RW.');
  } else {
    console.log('Surat Keterangan RT/RW sudah ada.');
  }
}

seedSurat().catch(e => console.error(e)).finally(() => prisma.$disconnect());
