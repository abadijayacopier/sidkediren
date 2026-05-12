import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  console.log("Membersihkan data lama...");
  // Matikan check agar bisa hapus semua tanpa error relasi
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
  await prisma.riwayatSurat.deleteMany({});
  await prisma.penduduk.deleteMany({});
  await prisma.keluarga.deleteMany({});
  await prisma.pengguna.deleteMany({});
  await prisma.masterSurat.deleteMany({});

  // 1. Buat Akun Admin
  await prisma.pengguna.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      peran: 'Admin',
      namaPetugas: 'Admin Utama Kediren',
    },
  });

  const noKkUtama = '3520032911190002';
  const nikUtama = '3520030101800002';

  console.log("Memasukkan data KK Pak Supriyanto via Raw SQL...");
  
  // Masukkan Keluarga dulu (Bypass check)
  await prisma.$executeRawUnsafe(`
    INSERT INTO keluarga (no_kk, kepala_keluarga_nik, alamat, dusun, rt, rw, kode_pos, tanggal_diterbitkan, updated_at) 
    VALUES ('${noKkUtama}', '${nikUtama}', 'SELUNGGUH', 'KEDIREN', '006', '001', '63372', '2021-01-27', NOW());
  `);

  // Masukkan Anggota Keluarga (Termasuk Pak Supriyanto)
  await prisma.penduduk.createMany({
    data: [
      {
        nik: nikUtama,
        noKk: noKkUtama,
        namaLengkap: 'SUPRIYANTO',
        tempatLahir: 'MAGETAN',
        tanggalLahir: new Date('1980-10-10'),
        jenisKelamin: 'L',
        agama: 'ISLAM',
        pendidikanTerakhir: 'SLTA / SEDERAJAT',
        pekerjaan: 'WIRASWASTA',
        statusPerkawinan: 'KAWIN TERCATAT',
        statusDalamKeluarga: 'KEPALA KELUARGA',
        golonganDarah: 'TIDAK TAHU',
        namaAyah: 'HADI SM',
        namaIbu: 'LATINI',
        kewarganegaraan: 'WNI',
      },
      {
        nik: '3520035004900002',
        noKk: noKkUtama,
        namaLengkap: 'EKO APRILIA SARI',
        tempatLahir: 'MAGETAN',
        tanggalLahir: new Date('1990-04-10'),
        jenisKelamin: 'P',
        agama: 'ISLAM',
        pendidikanTerakhir: 'SLTA / SEDERAJAT',
        pekerjaan: 'MENGURUS RUMAH TANGGA',
        statusPerkawinan: 'KAWIN TERCATAT',
        statusDalamKeluarga: 'ISTRI',
        namaAyah: 'SUKARDI',
        namaIbu: 'NUNUK INDAYANI',
        kewarganegaraan: 'WNI',
      },
      {
        nik: '3520035001210002',
        noKk: noKkUtama,
        namaLengkap: 'NAYLA ANINDA PUTRI',
        tempatLahir: 'MAGETAN',
        tanggalLahir: new Date('2021-01-10'),
        jenisKelamin: 'P',
        agama: 'ISLAM',
        pendidikanTerakhir: 'TIDAK / BELUM SEKOLAH',
        pekerjaan: 'BELUM / TIDAK BEKERJA',
        statusPerkawinan: 'BELUM KAWIN',
        statusDalamKeluarga: 'ANAK',
        namaAyah: 'SUPRIYANTO',
        namaIbu: 'EKO APRILIA SARI',
        kewarganegaraan: 'WNI',
      }
    ]
  });

  // 1. Profil Desa Default
  await prisma.profilDesa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      namaDesa: 'KEDIREN',
      kodeDesa: '35.20.03.2001',
      kecamatan: 'LEMBEYAN',
      kabupaten: 'MAGETAN',
      provinsi: 'JAWA TIMUR',
      alamat: 'Jl. Raya Kediren No. 01',
      kodePos: '63372',
      namaKepalaDesa: 'DJAZULI',
      nipKepalaDesa: '-',
    }
  });

  // 2. Klasifikasi Surat (Permendagri 83/2022)
  const klasifikasi = [
    { kode: '400.7.2.1', nama: 'Kesejahteraan Sosial (SKTM)' },
    { kode: '470', nama: 'Kependudukan & Pencatatan Sipil' },
    { kode: '140', nama: 'Pemerintahan Desa' },
  ];

  for (const k of klasifikasi) {
    await prisma.klasifikasiSurat.upsert({
      where: { kode: k.kode },
      update: { nama: k.nama },
      create: k
    });
  }

  // 3. Master Surat
  const masterSurat = [
    { 
      kodeSurat: 'SKTM', 
      namaSurat: 'Surat Keterangan Tidak Mampu', 
      formatNomor: '400.7.2.1/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: (await prisma.klasifikasiSurat.findUnique({ where: { kode: '400.7.2.1' } }))?.id
    },
    { 
      kodeSurat: 'SKD', 
      namaSurat: 'Surat Keterangan Domisili', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: (await prisma.klasifikasiSurat.findUnique({ where: { kode: '470' } }))?.id
    },
  ];

  for (const m of masterSurat) {
    await prisma.masterSurat.upsert({
      where: { kodeSurat: m.kodeSurat },
      update: { namaSurat: m.namaSurat, formatNomor: m.formatNomor, klasifikasiId: m.klasifikasiId },
      create: m
    });
  }

  // Hidupkan kembali check foreign key
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');

  console.log("Seed data berhasil dimasukkan!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    await prisma.$disconnect();
    process.exit(1);
  });
