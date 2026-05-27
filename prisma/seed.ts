import { PrismaClient, Prisma } from '@prisma/client';
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

  // 2. Klasifikasi Surat (Permendagri 83/2022 / Umum)
  const klasifikasi = [
    { kode: '400', nama: 'Kesejahteraan Sosial' },
    { kode: '470', nama: 'Kependudukan & Pencatatan Sipil' },
    { kode: '100', nama: 'Pemerintahan Desa' },
    { kode: '500', nama: 'Perekonomian & Agraria' },
  ];

  for (const k of klasifikasi) {
    await prisma.klasifikasiSurat.upsert({
      where: { kode: k.kode },
      update: { nama: k.nama },
      create: k
    });
  }

  // Helper untuk ambil ID Klasifikasi (data pasti ada karena di-seed di atas)
  const getKId = async (kode: string) => (await prisma.klasifikasiSurat.findUnique({ where: { kode } }))!.id;

  // 3. Master Surat dengan Form Schema
  const masterSurat = [
    // --- KELOMPOK 1: LAYANAN PUBLIK DASAR ---
    { 
      kodeSurat: 'SKD', 
      namaSurat: 'Surat Keterangan Domisili', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('470'),
      formSchema: JSON.stringify([
        { name: 'keperluan', label: 'Keperluan', type: 'text', required: true }
      ])
    },
    { 
      kodeSurat: 'SKU', 
      namaSurat: 'Surat Keterangan Usaha', 
      formatNomor: '500/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('500'),
      formSchema: JSON.stringify([
        { name: 'nama_usaha', label: 'Nama Usaha', type: 'text', required: true },
        { name: 'jenis_usaha', label: 'Jenis Usaha', type: 'text', required: true },
        { name: 'alamat_usaha', label: 'Alamat Usaha', type: 'textarea', required: true },
        { name: 'sejak_tahun', label: 'Berdiri Sejak', type: 'number', required: false }
      ])
    },
    { 
      kodeSurat: 'SKTM', 
      namaSurat: 'Surat Keterangan Tidak Mampu', 
      formatNomor: '400/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('400'),
      formSchema: JSON.stringify([
        { name: 'tujuan', label: 'Tujuan Penggunaan', type: 'text', placeholder: 'Contoh: Keringanan Biaya RS / Beasiswa', required: true }
      ])
    },
    { 
      kodeSurat: 'SKCK', 
      namaSurat: 'Pengantar SKCK', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('470'),
      formSchema: JSON.stringify([
        { name: 'keperluan', label: 'Untuk Keperluan', type: 'text', placeholder: 'Contoh: Melamar Pekerjaan', required: true }
      ])
    },
    { 
      kodeSurat: 'SK-BEDA-ID', 
      namaSurat: 'Surat Keterangan Beda Identitas', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('470'),
      formSchema: JSON.stringify([
        { name: 'identitas_salah', label: 'Identitas di Dokumen Salah', type: 'textarea', required: true },
        { name: 'identitas_benar', label: 'Identitas yang Benar', type: 'textarea', required: true },
        { name: 'nama_dokumen', label: 'Nama Dokumen Bermasalah', type: 'text', placeholder: 'Contoh: Ijazah SMA / Buku Nikah', required: true }
      ])
    },
    { 
      kodeSurat: 'SK-HILANG', 
      namaSurat: 'Surat Keterangan Kehilangan', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('470'),
      formSchema: JSON.stringify([
        { name: 'barang_hilang', label: 'Barang / Dokumen yang Hilang', type: 'text', required: true },
        { name: 'lokasi_hilang', label: 'Perkiraan Lokasi Hilang', type: 'text', required: false },
        { name: 'waktu_hilang', label: 'Perkiraan Waktu Hilang', type: 'date', required: false }
      ])
    },

    // --- KELOMPOK 2: PENCATATAN SIPIL ---
    { 
      kodeSurat: 'F201', 
      namaSurat: 'Keterangan Kelahiran (F-2.01)', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('470'),
      formSchema: JSON.stringify([
        { name: 'nama_bayi', label: 'Nama Bayi', type: 'text', required: true },
        { name: 'jk_bayi', label: 'Jenis Kelamin Bayi', type: 'select', options: ['L', 'P'], required: true },
        { name: 'tgl_lahir_bayi', label: 'Tanggal Lahir Bayi', type: 'date', required: true },
        { name: 'tempat_lahir_bayi', label: 'Tempat Lahir Bayi', type: 'text', required: true }
      ])
    },
    { 
      kodeSurat: 'F229', 
      namaSurat: 'Keterangan Kematian (F-2.29)', 
      formatNomor: '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('470'),
      formSchema: JSON.stringify([
        { name: 'tgl_meninggal', label: 'Tanggal Meninggal', type: 'date', required: true },
        { name: 'tempat_meninggal', label: 'Tempat Meninggal', type: 'text', required: true },
        { name: 'sebab_meninggal', label: 'Sebab Meninggal', type: 'text', required: false }
      ])
    },

    // --- KELOMPOK 3: AGRARIA ---
    { 
      kodeSurat: 'SK-TANAH', 
      namaSurat: 'Surat Keterangan Riwayat Tanah', 
      formatNomor: '500/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('500'),
      formSchema: JSON.stringify([
        { name: 'no_persil', label: 'Nomor Persil', type: 'text', required: true },
        { name: 'luas_tanah', label: 'Luas Tanah (m2)', type: 'number', required: true },
        { name: 'batas_utara', label: 'Batas Utara', type: 'text', required: false },
        { name: 'asal_usul', label: 'Asal Usul Kepemilikan', type: 'textarea', required: true }
      ])
    },

    // --- KELOMPOK 4: INTERNAL ---
    { 
      kodeSurat: 'SPT', 
      namaSurat: 'Surat Perintah Tugas (SPT)', 
      formatNomor: '100/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
      klasifikasiId: await getKId('100'),
      formSchema: JSON.stringify([
        { name: 'dasar_tugas', label: 'Dasar Perintah Tugas', type: 'textarea', required: true },
        { name: 'tujuan_tugas', label: 'Maksud & Tujuan Tugas', type: 'textarea', required: true },
        { name: 'lokasi_tujuan', label: 'Lokasi Tujuan', type: 'text', required: true },
        { name: 'tgl_tugas', label: 'Tanggal Penugasan', type: 'date', required: true }
      ])
    },
  ];

  for (const m of masterSurat) {
    await prisma.masterSurat.upsert({
      where: { kodeSurat: m.kodeSurat },
      update: { 
        namaSurat: m.namaSurat, 
        formatNomor: m.formatNomor, 
        klasifikasiId: m.klasifikasiId,
        formSchema: m.formSchema
      },
      create: m
    });
  }

  // 4. Seeding Jabatan
  console.log("Memasukkan Jabatan Organisasi...");
  
  // Kepala Desa
  const kades = await prisma.jabatan.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, namaJabatan: 'KEPALA DESA', kategori: 'PEMERINTAH', level: 1, urutan: 1 }
  });

  // Sekretaris Desa
  const sekdes = await prisma.jabatan.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, namaJabatan: 'SEKRETARIS DESA', kategori: 'PEMERINTAH', level: 2, urutan: 1, parentId: kades.id }
  });

  // BPD & LSM (Selevel Sekdes tapi beda kategori)
  await prisma.jabatan.upsert({ where: { id: 3 }, update: {}, create: { id: 3, namaJabatan: 'KETUA BPD', kategori: 'BPD', level: 2, urutan: 2 } });
  await prisma.jabatan.upsert({ where: { id: 4 }, update: {}, create: { id: 4, namaJabatan: 'KETUA LSM', kategori: 'LSM', level: 2, urutan: 3 } });

  // Kaur (Bawah Sekdes)
  const kaur = [
    { id: 5, nama: 'KAUR KEUANGAN' },
    { id: 6, nama: 'KAUR UMUM' },
    { id: 7, nama: 'KAUR PERENCANAAN' },
  ];
  for (const k of kaur) {
    await prisma.jabatan.upsert({
      where: { id: k.id },
      update: {},
      create: { id: k.id, namaJabatan: k.nama, kategori: 'PEMERINTAH', level: 3, urutan: k.id, parentId: sekdes.id }
    });
  }

  // Kasi (Bawah Kades / Selevel Sekdes secara fungsional di bagan)
  const kasi = [
    { id: 8, nama: 'KASI PEMERINTAHAN' },
    { id: 9, nama: 'KASI KESEJAHTERAAN' },
    { id: 10, nama: 'KASI PELAYANAN' },
  ];
  for (const k of kasi) {
    await prisma.jabatan.upsert({
      where: { id: k.id },
      update: {},
      create: { id: k.id, namaJabatan: k.nama, kategori: 'PEMERINTAH', level: 3, urutan: k.id, parentId: kades.id }
    });
  }

  // Kepala Dusun
  await prisma.jabatan.upsert({
    where: { id: 11 },
    update: {},
    create: { id: 11, namaJabatan: 'KEPALA DUSUN', kategori: 'PEMERINTAH', level: 4, urutan: 1, parentId: 8 } // Bawah Kasi Pemerintahan biasanya
  });
  
  // 5. APBDes Kategori & Item (Standar Kemendesa/Kemendagri)
  console.log("Memasukkan Kategori & Item APBDes...");
  
  // PENDAPATAN
  const catPendapatan = [
    { id: 20, nama: "Pendapatan Asli Desa (PADes)", jenis: "PENDAPATAN" },
    { id: 21, nama: "Dana Desa (DD)", jenis: "PENDAPATAN" },
    { id: 22, nama: "Alokasi Dana Desa (ADD)", jenis: "PENDAPATAN" },
    { id: 23, nama: "Bagi Hasil Pajak & Retribusi", jenis: "PENDAPATAN" },
    { id: 24, nama: "Bantuan Keuangan Provinsi/Kabupaten", jenis: "PENDAPATAN" },
  ];

  // BELANJA (Sudah ada Bidang 1-5)
  const catBelanja = [
    { id: 1, nama: "Bidang Penyelenggaraan Pemerintahan Desa", jenis: "BELANJA" },
    { id: 2, nama: "Bidang Pelaksanaan Pembangunan Desa", jenis: "BELANJA" },
    { id: 3, nama: "Bidang Pembinaan Kemasyarakatan Desa", jenis: "BELANJA" },
    { id: 4, nama: "Bidang Pemberdayaan Masyarakat Desa", jenis: "BELANJA" },
    { id: 5, nama: "Bidang Penanggulangan Bencana, Keadaan Darurat dan Mendesak Desa", jenis: "BELANJA" },
  ];

  // PEMBIAYAAN
  const catPembiayaan = [
    { id: 30, nama: "Penerimaan Pembiayaan (SiLPA)", jenis: "PEMBIAYAAN" },
    { id: 31, nama: "Pengeluaran Pembiayaan (Penyertaan Modal)", jenis: "PEMBIAYAAN" },
  ];

  const allCats = [...catPendapatan, ...catBelanja, ...catPembiayaan];

  for (const c of allCats) {
    await prisma.apbdesKategori.upsert({
      where: { id: c.id },
      update: { namaKategori: c.nama, jenis: c.jenis as any },
      create: { id: c.id, namaKategori: c.nama, jenis: c.jenis as any }
    });
  }

  // --- Tambahkan Contoh Item APBDes ---
  const currentYear = new Date().getFullYear();
  await prisma.apbdesItem.deleteMany({}); // Bersihkan item lama agar seed bersih
  
  await prisma.apbdesItem.createMany({
    data: [
      // PENDAPATAN (4.)
      { tahun: currentYear, kategoriId: 21, namaItem: "Dana Desa Tahap I", anggaran: 450000000, realisasi: 450000000, sumberDana: "APBN", kodeRekening: "4.2.1.01" },
      { tahun: currentYear, kategoriId: 21, namaItem: "Dana Desa Tahap II", anggaran: 350000000, realisasi: 0, sumberDana: "APBN", kodeRekening: "4.2.1.02" },
      { tahun: currentYear, kategoriId: 22, namaItem: "Alokasi Dana Desa (ADD)", anggaran: 250000000, realisasi: 125000000, sumberDana: "APBD", kodeRekening: "4.2.2.01" },
      { tahun: currentYear, kategoriId: 20, namaItem: "Laba BUMDes", anggaran: 50000000, realisasi: 50000000, sumberDana: "PADes", kodeRekening: "4.1.1.01" },
      
      // BELANJA (5.)
      { tahun: currentYear, kategoriId: 1, namaItem: "Siltap Kades & Perangkat", anggaran: 300000000, realisasi: 150000000, sumberDana: "ADD", kodeRekening: "5.1.1.01" },
      { tahun: currentYear, kategoriId: 2, namaItem: "Pembangunan Jalan Lingkungan", anggaran: 200000000, realisasi: 200000000, sumberDana: "DD", kodeRekening: "5.2.1.01" },
      { tahun: currentYear, kategoriId: 2, namaItem: "Pembangunan Drainase", anggaran: 100000000, realisasi: 0, sumberDana: "DD", kodeRekening: "5.2.2.01" },
      { tahun: currentYear, kategoriId: 5, namaItem: "BLT Dana Desa (Jan-Jun)", anggaran: 108000000, realisasi: 108000000, sumberDana: "DD", kodeRekening: "5.5.2.01" },

      // PEMBIAYAAN (6.)
      { tahun: currentYear, kategoriId: 30, namaItem: "SiLPA Tahun 2023", anggaran: 75000000, realisasi: 75000000, sumberDana: "SiLPA", kodeRekening: "6.1.1.01" },
      { tahun: currentYear, kategoriId: 31, namaItem: "Penyertaan Modal BUMDes", anggaran: 50000000, realisasi: 50000000, sumberDana: "PADes", kodeRekening: "6.2.1.01" },
    ]
  });

  console.log("Memasukkan Contoh Program Kerja Fisik...");
  await prisma.programKerja.deleteMany({});
  await prisma.programKerja.createMany({
    data: [
      {
        tahun: currentYear,
        namaProgram: "Pembangunan Jalan Lingkungan Dusun Kediren",
        lokasi: "Dusun Kediren RT 06",
        anggaran: 200000000,
        sumberDana: "DANA DESA (DD)",
        status: "Selesai",
        latitude: -7.6789,
        longitude: 111.4567,
      },
      {
        tahun: currentYear,
        namaProgram: "Pembangunan Drainase Jalan Utama",
        lokasi: "Dusun Krajan",
        anggaran: 100000000,
        sumberDana: "DANA DESA (DD)",
        status: "Berjalan",
        latitude: -7.6800,
        longitude: 111.4580,
      },
      {
        tahun: currentYear,
        namaProgram: "Rehabilitasi Gedung Posyandu",
        lokasi: "Dusun Ngrayung",
        anggaran: 50000000,
        sumberDana: "ADD",
        status: "Rencana",
      }
    ]
  });

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
