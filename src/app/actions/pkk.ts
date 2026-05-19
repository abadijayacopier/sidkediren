'use server';

import prisma, { withDriftRetry } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { syncDatabaseStructure } from './system';

export async function getPosyanduList() {
  return withDriftRetry(
    () => prisma.posyandu.findMany({
      orderBy: { nama: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getKaderPkkList() {
  return withDriftRetry(
    () => prisma.kaderPkk.findMany({
      where: { isActive: true },
      orderBy: { nama: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getJadwalPosyandu() {
  return withDriftRetry(
    () => prisma.jadwalPosyandu.findMany({
      include: {
        posyandu: true,
        kader: true
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBalitaKmsList() {
  return withDriftRetry(
    () => (prisma.balitaKms as any).findMany({
      include: {
        posyandu: true,
        pengukuran: {
          orderBy: { usiaBulan: 'asc' }
        }
      },
      orderBy: { nama: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getWargaBalitaList() {
  return withDriftRetry(
    () => {
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      return prisma.penduduk.findMany({
        where: {
          tanggalLahir: {
            gte: fiveYearsAgo
          },
          isHidup: true
        },
        select: {
          nik: true,
          namaLengkap: true,
          namaIbu: true,
          tanggalLahir: true,
          jenisKelamin: true,
          keluarga: {
            select: {
              dusun: true
            }
          }
        },
        orderBy: { namaLengkap: 'asc' }
      });
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getWargaList() {
  return withDriftRetry(
    () => {
      const seventeenYearsAgo = new Date();
      seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17);

      return prisma.penduduk.findMany({
        where: {
          isHidup: true,
          tanggalLahir: {
            lte: seventeenYearsAgo
          }
        },
        select: {
          nik: true,
          namaLengkap: true,
          keluarga: {
            select: {
              dusun: true,
              rt: true,
              rw: true
            }
          }
        },
        orderBy: { namaLengkap: 'asc' }
      });
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function seedPkkData() {
  // Hanya melakukan seeding jika tabel kosong
  const posyanduCount = await prisma.posyandu.count();

  if (posyanduCount === 0) {
    // 1. Seed Posyandu
    const p1 = await prisma.posyandu.create({ data: { nama: 'Posyandu Mawar 1', dusun: 'Krajan' } });
    const p2 = await prisma.posyandu.create({ data: { nama: 'Posyandu Melati 2', dusun: 'Pule' } });
    const p3 = await prisma.posyandu.create({ data: { nama: 'Posyandu Kenanga 3', dusun: 'Ngujung' } });

    // 2. Seed Kader
    const k1 = await prisma.kaderPkk.create({ data: { nik: '3511111111110001', nama: 'Siti Aminah', jabatan: 'Ketua TP PKK', areaTugas: 'Desa Kediren', kontak: '0812-3456-7890' } });
    const k2 = await prisma.kaderPkk.create({ data: { nik: '3511111111110002', nama: 'Rina Wati', jabatan: 'Kader Posyandu Lansia', areaTugas: 'Dusun Pule', kontak: '0856-7890-1234' } });
    const k3 = await prisma.kaderPkk.create({ data: { nik: '3511111111110003', nama: 'Mujiati', jabatan: 'Kader Posyandu Balita', areaTugas: 'Dusun Ngujung', kontak: '0821-2345-6789' } });

    // 3. Seed Jadwal
    await prisma.jadwalPosyandu.create({ data: { posyanduId: p1.id, kaderId: k1.id, tanggal: new Date('2026-05-20'), waktu: '08:00 - 11:00', sasaran: 'Balita & Ibu Hamil' } });
    await prisma.jadwalPosyandu.create({ data: { posyanduId: p2.id, kaderId: k2.id, tanggal: new Date('2026-05-22'), waktu: '08:30 - 11:30', sasaran: 'Lansia' } });
    await prisma.jadwalPosyandu.create({ data: { posyanduId: p3.id, kaderId: k3.id, tanggal: new Date('2026-05-25'), waktu: '08:00 - 11:00', sasaran: 'Balita & Ibu Hamil' } });

    // 4. Seed Balita
    const b1 = await (prisma.balitaKms as any).create({ data: { posyanduId: p1.id, nama: 'Ahmad Rafiq', namaIbu: 'Nurul Hidayah', jenisKelamin: 'L', usiaBulan: 18, beratBadan: 10.8, tinggiBadan: 82.5, statusGizi: 'Normal' } });
    const b2 = await (prisma.balitaKms as any).create({ data: { posyanduId: p1.id, nama: 'Siti Aisyah', namaIbu: 'Dewi Lestari', jenisKelamin: 'P', usiaBulan: 24, beratBadan: 11.5, tinggiBadan: 86.0, statusGizi: 'Normal' } }); // Catatan: Ada kesalahan penulisan 'namaIgu', kita perbaiki menjadi 'namaIbu' di bawah
    const b3 = await (prisma.balitaKms as any).create({ data: { posyanduId: p3.id, nama: 'Budi Santoso', namaIbu: 'Wahyuni', jenisKelamin: 'L', usiaBulan: 12, beratBadan: 7.2, tinggiBadan: 71.0, statusGizi: 'Gizi Kurang' } });
    const b4 = await (prisma.balitaKms as any).create({ data: { posyanduId: p2.id, nama: 'Clara Putri', namaIbu: 'Maria Ulfa', jenisKelamin: 'P', usiaBulan: 36, beratBadan: 14.2, tinggiBadan: 96.0, statusGizi: 'Normal' } });

    // 5. Seed Riwayat Pengukuran Bulanan (KmsPengukuran)
    // Ahmad Rafiq (Laki-laki, Usia 18 bln, saat ini 10.8 kg, 82.5 cm)
    await (prisma as any).kmsPengukuran.createMany({
      data: [
        { balitaId: b1.id, usiaBulan: 0, beratBadan: 3.2, tinggiBadan: 50.0, statusGizi: 'Normal', keterangan: 'Lahir Normal', petugas: 'Bidan Desa', tanggalUkur: new Date('2024-11-20') },
        { balitaId: b1.id, usiaBulan: 3, beratBadan: 5.8, tinggiBadan: 60.0, statusGizi: 'Normal', keterangan: 'Imunisasi DPT 1', petugas: 'Kader Posyandu', tanggalUkur: new Date('2025-02-20') },
        { balitaId: b1.id, usiaBulan: 6, beratBadan: 7.5, tinggiBadan: 66.0, statusGizi: 'Normal', keterangan: 'ASI Eksklusif', petugas: 'Kader Posyandu', tanggalUkur: new Date('2025-05-20') },
        { balitaId: b1.id, usiaBulan: 12, beratBadan: 9.2, tinggiBadan: 75.0, statusGizi: 'Normal', keterangan: 'Imunisasi Campak', petugas: 'Kader Posyandu', tanggalUkur: new Date('2025-11-20') },
        { balitaId: b1.id, usiaBulan: 18, beratBadan: 10.8, tinggiBadan: 82.5, statusGizi: 'Normal', keterangan: 'Aktif, PMT Lahap', petugas: 'Kader Posyandu', tanggalUkur: new Date('2026-05-20') }
      ]
    });

    // Siti Aisyah (Perempuan, Usia 24 bln, saat ini 11.5 kg, 86.0 cm)
    await (prisma as any).kmsPengukuran.createMany({
      data: [
        { balitaId: b2.id, usiaBulan: 0, beratBadan: 3.0, tinggiBadan: 49.0, statusGizi: 'Normal', keterangan: 'Lahir Sehat', petugas: 'Bidan Desa', tanggalUkur: new Date('2024-05-20') },
        { balitaId: b2.id, usiaBulan: 6, beratBadan: 7.2, tinggiBadan: 64.0, statusGizi: 'Normal', keterangan: 'Imunisasi Lengkap', petugas: 'Kader Posyandu', tanggalUkur: new Date('2024-11-20') },
        { balitaId: b2.id, usiaBulan: 12, beratBadan: 9.0, tinggiBadan: 74.0, statusGizi: 'Normal', keterangan: 'Tumbuh Baik', petugas: 'Kader Posyandu', tanggalUkur: new Date('2025-05-20') },
        { balitaId: b2.id, usiaBulan: 24, beratBadan: 11.5, tinggiBadan: 86.0, statusGizi: 'Normal', keterangan: 'Sangat Lincah, Vit A', petugas: 'Kader Posyandu', tanggalUkur: new Date('2026-05-20') }
      ]
    });

    // Budi Santoso (Laki-laki, Usia 12 bln, saat ini 7.2 kg, 71.0 cm - Gizi Kurang)
    await (prisma as any).kmsPengukuran.createMany({
      data: [
        { balitaId: b3.id, usiaBulan: 0, beratBadan: 3.1, tinggiBadan: 49.5, statusGizi: 'Normal', keterangan: 'Lahir Sehat', petugas: 'Bidan Desa', tanggalUkur: new Date('2025-05-20') },
        { balitaId: b3.id, usiaBulan: 4, beratBadan: 5.2, tinggiBadan: 58.0, statusGizi: 'Normal', keterangan: 'Tumbuh Normal', petugas: 'Kader Posyandu', tanggalUkur: new Date('2025-09-20') },
        { balitaId: b3.id, usiaBulan: 8, beratBadan: 6.3, tinggiBadan: 65.0, statusGizi: 'Gizi Kurang', keterangan: 'Nafsu Makan Turun', petugas: 'Kader Posyandu', tanggalUkur: new Date('2026-01-20') },
        { balitaId: b3.id, usiaBulan: 12, beratBadan: 7.2, tinggiBadan: 71.0, statusGizi: 'Gizi Kurang', keterangan: 'Perlu Intervensi PMT', petugas: 'Kader Posyandu', tanggalUkur: new Date('2026-05-20') }
      ]
    });

    revalidatePath('/admin/pkk');
    return { success: true, message: 'Seeding berhasil' };
  }

  // Seed berita juara PKK jika belum ada
  const beritaCount = await prisma.berita.count({
    where: { slug: 'desa-kediren-sabet-juara-ii-lomba-pkk-kabupaten-magetan' }
  });
  if (beritaCount === 0) {
    await prisma.berita.create({
      data: {
        judul: 'Kabar Membanggakan! Tim Penggerak PKK Desa Kediren Sabet Juara II Lomba PKK Tingkat Kabupaten Magetan',
        slug: 'desa-kediren-sabet-juara-ii-lomba-pkk-kabupaten-magetan',
        ringkasan: 'Desa Kediren berhasil menorehkan prestasi gemilang dengan meraih Juara II dalam Lomba Pelaksana Terbaik Gotong Royong dan Gerakan PKK Tingkat Kabupaten Magetan tahun 2026. Inovasi e-KMS dan keaktifan Dasawisma menjadi kunci sukses utama.',
        konten: `### Desa Kediren Raih Prestasi Gemilang di Tingkat Kabupaten Magetan! 🏆✨

Kabar gembira dan penuh kebanggaan menyelimuti seluruh masyarakat **Desa Kediren**. Jajaran Tim Penggerak PKK Desa Kediren berhasil meraih penghargaan sebagai **Juara II Pelaksana Terbaik Gotong Royong dan Gerakan PKK Tingkat Kabupaten Magetan tahun 2026**.

Penghargaan ini diserahkan langsung oleh jajaran Tim Penggerak PKK Kabupaten Magetan kepada Ketua TP PKK Desa Kediren dalam acara puncak evaluasi 10 Program Pokok PKK.

#### Inovasi Utama yang Menjadi Kunci Kemenangan:

1. **🩺 Digitalisasi Layanan KIA dengan Smart e-KMS**:
   Tim juri kabupaten memberikan apresiasi yang sangat tinggi terhadap terobosan sistem digital **e-KMS Desa Kediren** yang telah **sinkron 100% dengan database kependudukan desa**. Sistem ini memudahkan kader Posyandu melacak tumbuh kembang balita, mengklasifikasi status gizi, dan melakukan intervensi stunting secara real-time.

2. **🏠 Keaktifan Kelompok Dasawisma & Dasawisma Digital**:
   Soliditas **12 Kelompok Dasawisma** Desa Kediren yang aktif memantau kesehatan lingkungan, pendataan ibu hamil, serta pelestarian tanaman obat keluarga (TOGA) di pekarangan rumah warga menjadi percontohan gotong royong yang luar biasa.

3. **🛍️ Pameran Produk UP2K (Usaha Peningkatan Pendapatan Keluarga)**:
   Kerajinan tangan kreatif dan kuliner unggulan hasil karya ibu-ibu PKK Kediren terbukti memiliki nilai ekonomi yang tinggi dan siap bersaing di pasar daerah.

#### Sambutan Kepala Desa & TP PKK:
*"Prestasi ini bukan hanya milik kader PKK, melainkan buah dari gotong royong seluruh warga Desa Kediren. Inovasi digital Posyandu e-KMS akan terus kita kembangkan untuk mewujudkan generasi emas Desa Kediren yang bebas stunting,"* ujar jajaran Pemerintah Desa Kediren dengan penuh syukur.

Selamat kepada seluruh pengurus, kader, dan warga Desa Kediren! Semoga prestasi ini menjadi motivasi untuk terus berinnovasi dan meningkatkan taraf kesejahteraan keluarga serta pelayanan kesehatan masyarakat! 🇮🇩❤️`,
        gambar: '/juara_pkk_magetan.png',
        penulis: 'Admin Desa Kediren',
        isPublished: true,
        kategori: 'Prestasi'
      }
    });
    revalidatePath('/admin/berita');
    revalidatePath('/');
  }

  // Seed kegiatan PKK jika tabel kosong
  const kegiatanCount = await (prisma as any).kegiatanPkk.count();
  if (kegiatanCount === 0) {
    // Cari satu kader posyandu/PKK yang ada untuk dihubungkan
    const firstKader = await prisma.kaderPkk.findFirst();
    const kaderId = firstKader ? firstKader.id : null;

    await (prisma as any).kegiatanPkk.create({
      data: {
        nama: 'Penyuluhan Pola Asuh Anak & Remaja (PAAR)',
        kategori: 'Pokja I',
        subKategori: 'Penghayatan Pancasila',
        tanggal: new Date('2026-05-10'),
        lokasi: 'Balai Pertemuan Dusun Selungguh',
        kaderId,
        deskripsi: 'Penyuluhan interaktif mengenai pola asuh anak usia dini di era digital untuk mencegah kecanduan gadget dan kekerasan anak.',
        jumlahHadir: 45,
        sumberDana: 'Dana Desa (APBDes)'
      }
    });

    await (prisma as any).kegiatanPkk.create({
      data: {
        nama: 'Pelatihan Usaha UP2K Pembuatan Keripik Tempe Sagu',
        kategori: 'Pokja II',
        subKategori: 'Pendidikan & Keterampilan',
        tanggal: new Date('2026-05-12'),
        lokasi: 'Rumah Ketua TP PKK Dusun Sekadalan',
        kaderId,
        deskripsi: 'Pelatihan produksi kuliner inovatif keripik tempe sagu untuk meningkatkan pendapatan ekonomi mandiri ibu-ibu rumah tangga.',
        jumlahHadir: 30,
        sumberDana: 'UP2K Mandiri'
      }
    });

    await (prisma as any).kegiatanPkk.create({
      data: {
        nama: 'Lomba Pekarangan Hijau Sehat Hatinya PKK',
        kategori: 'Pokja III',
        subKategori: 'Sandang, Pangan & Perumahan',
        tanggal: new Date('2026-05-14'),
        lokasi: 'RT 002 / RW 001 Dusun Ledok',
        kaderId,
        deskripsi: 'Evaluasi pemanfaatan pekarangan rumah dengan kebun sayur mandiri, kolam ikan mini, dan tanaman obat keluarga (TOGA).',
        jumlahHadir: 60,
        sumberDana: 'Swadaya Masyarakat'
      }
    });

    await (prisma as any).kegiatanPkk.create({
      data: {
        nama: 'Sosialisasi PHBS dan Pembagian Paket Nutrisi PMT Stunting',
        kategori: 'Pokja IV',
        subKategori: 'Kesehatan & Lingkungan',
        tanggal: new Date('2026-05-16'),
        lokasi: 'Posyandu Mawar 1 Dusun Sekadalan',
        kaderId,
        deskripsi: 'Sosialisasi Perilaku Hidup Bersih & Sehat (PHBS) serta penyaluran telur, susu, dan biskuit PMT untuk 25 balita indikasi stunting.',
        jumlahHadir: 55,
        sumberDana: 'Dana CSR Puskesmas'
      }
    });

    await (prisma as any).kegiatanPkk.create({
      data: {
        nama: 'Kerja Bakti Kebun Gizi Mandiri Dasawisma Mawar',
        kategori: 'Dasawisma',
        subKategori: 'Dasawisma Gotong Royong',
        tanggal: new Date('2026-05-18'),
        lokasi: 'RT 003 / RW 001 Dusun Selungguh',
        kaderId,
        deskripsi: 'Gotong royong ibu-ibu anggota Dasawisma Mawar melakukan penyiangan, pemupukan organik, dan pemanenan sayur sawi di kebun gizi.',
        jumlahHadir: 20,
        sumberDana: 'Kas Dasawisma'
      }
    });

    // Seed Buku Program Kerja Pokja IV
    const pKerjaCount = await (prisma as any).bukuProgramKerjaPokjaIv.count();
    if (pKerjaCount === 0) {
      await (prisma as any).bukuProgramKerjaPokjaIv.createMany({
        data: [
          {
            programPokok: 'Kesehatan',
            programPokja4: 'GKSTTB',
            kegiatan: 'Penyuluhan Posyandu Terintegrasi',
            sasaran: 'Ibu dan Balita',
            lokasi: 'RT 001 / RW 002 Dusun Selungguh',
            waktuPelaksanaan: '[2,8]',
            mitra: 'Puskesmas',
            indikatorKeberhasilan: 'Jumlah balita stunting menurun dan cakupan imunisasi 100%',
            keterangan: 'Terintegrasi e-KMS dan PMT Balita'
          },
          {
            programPokok: 'Kelestarian Lingkungan Hidup',
            programPokja4: 'STBM',
            kegiatan: 'Kampanye & Pemicuan Jamban Sehat',
            sasaran: 'Keluarga BABS Mandiri',
            lokasi: 'Dusun Sekadalan',
            waktuPelaksanaan: '[5]',
            mitra: 'Sanitarian Puskesmas',
            indikatorKeberhasilan: 'Lingkungan Sehat bebas BABS (ODF)',
            keterangan: 'Swadaya pembuatan septic tank sehat'
          },
          {
            programPokok: 'Perencanaan Sehat',
            programPokja4: 'KB dan Kespro',
            kegiatan: 'Penyuluhan KB MKJP',
            sasaran: 'Pasangan Usia Subur (PUS)',
            lokasi: 'Dusun Ledok',
            waktuPelaksanaan: '[6]',
            mitra: 'Dinas PPKB dan PA',
            indikatorKeberhasilan: 'Jumlah akseptor KB aktif meningkat',
            keterangan: 'Fokus KB jangka panjang'
          }
        ]
      });
    }

    // Seed Buku Pelaksanaan Program Kerja Pokja IV
    const pelCount = await (prisma as any).bukuPelaksanaanPokjaIv.count();
    if (pelCount === 0) {
      await (prisma as any).bukuPelaksanaanPokjaIv.create({
        data: {
          programPokok: 'Kesehatan',
          programPokja4: 'GKSTTB',
          kegiatan: 'Penyuluhan Pengelolaan Sampah Rumah Tangga',
          tujuanKegiatan: 'Meningkatkan pemahaman keluarga terkait pemilahan dan pengelolaan sampah organik/anorganik',
          sasaran: 'Keluarga & Dasawisma',
          pelaksana: 'Pokja IV dan Kader Lingkungan',
          waktu: new Date('2026-05-02'),
          lokasi: 'Balai Pertemuan Dusun Selungguh',
          output: 'Pengetahuan pemilahan sampah meningkat',
          outcome: 'Sampah dipilah-pilah sesuai jenisnya dan siap disetor ke Bank Sampah',
          monitoringEvaluasi: 'Monitoring bulanan dan evaluasi volume sampah dusun',
          keterangan: 'Terbentuk kepengurusan Bank Sampah baru'
        }
      });
    }

    // Seed Buku Kegiatan Pokja IV
    const kegCount = await (prisma as any).bukuKegiatanPokjaIv.count();
    if (kegCount === 0) {
      await (prisma as any).bukuKegiatanPokjaIv.create({
        data: {
          nama: 'Ny. Luluk P',
          jabatan: 'Sekretaris Pokja IV',
          tanggal: new Date('2026-02-12T10:00:00'),
          tempat: 'Gedung Pertemuan Kelurahan Kediren',
          uraian: 'Penyuluhan pengelolaan sampah secara mandiri di tingkat rumah tangga.\nHasil :\n- Kegiatan diikuti oleh warga RT 003 Dusun Selungguh sejumlah 35 orang\n- Narasumber oleh DLH Kabupaten Magetan\n- Terbentuk rintisan bank sampah keluarga',
          keterangan: 'Berjalan lancar dan tertib'
        }
      });
    }

    // Seed Buku Notulen Pokja IV
    const notCount = await (prisma as any).bukuNotulenPokjaIv.count();
    if (notCount === 0) {
      await (prisma as any).bukuNotulenPokjaIv.create({
        data: {
          tanggal: new Date('2026-05-15'),
          waktu: '09:00 - 11:30 WIB',
          tempat: 'Ruang Rapat PKK Desa Kediren',
          jenisRapat: 'Rapat Pleno Bulanan Pokja IV',
          pimpinanRapatId: kaderId,
          pembuatNotulenId: kaderId,
          jumlahDiundang: 25,
          jumlahHadir: 22,
          jumlahTidakHadir: 3,
          susunanAcara: '1. Pembukaan oleh Pimpinan Rapat\n2. Evaluasi Imunisasi Vitamin A bulan Februari\n3. Pembahasan Lomba Jumantik\n4. Penutup',
          kesimpulan: 'Disepakati pelaksanaan gerakan serentak pemberantasan sarang nyamuk (PSN) di Dusun Selungguh hari Minggu besok.',
          penutup: 'Rapat ditutup oleh Pimpinan Rapat pada pukul 11:30 WIB dengan doa bersama.',
          dokumentasi: ''
        }
      });
    }

    revalidatePath('/admin/pkk');
  }

  return { success: true, message: 'Data sudah ada' };
}

// === CUD OPERATIONS ===

export async function saveBalita(formData: FormData) {
  try {
    const nama = formData.get('nama') as string;
    const namaIbu = formData.get('namaIbu') as string;
    const jenisKelamin = (formData.get('jenisKelamin') as string) || 'L';
    const usiaBulan = Number(formData.get('usiaBulan'));
    const beratBadan = Number(formData.get('beratBadan'));
    const tinggiBadan = Number(formData.get('tinggiBadan'));
    const posyanduId = Number(formData.get('posyanduId'));

    // Hitung status gizi dengan input dari client jika ada, jika tidak pakai fallback
    let statusGizi = formData.get('statusGizi') as string;
    if (!statusGizi) {
      statusGizi = 'Normal';
      if (beratBadan < (usiaBulan * 0.4)) statusGizi = 'Gizi Kurang';
      if (tinggiBadan < (usiaBulan * 2.5)) statusGizi = 'Stunting';
    }

    // Buat data balita utama
    const newBalita = await (prisma.balitaKms as any).create({
      data: {
        nama,
        namaIbu,
        jenisKelamin,
        usiaBulan,
        beratBadan,
        tinggiBadan,
        posyanduId,
        statusGizi,
        nik: Date.now().toString().slice(-16) // mock NIK
      }
    });

    // Otomatis buat entri pertama di riwayat pengukuran KMS
    await (prisma as any).kmsPengukuran.create({
      data: {
        balitaId: newBalita.id,
        usiaBulan,
        beratBadan,
        tinggiBadan,
        statusGizi,
        keterangan: 'Pendaftaran & Pengukuran Awal',
        petugas: 'Kader Posyandu',
        tanggalUkur: new Date()
      }
    });

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Balita:', error);
    throw new Error(error.message);
  }
}

export async function deleteBalita(id: number) {
  try {
    await prisma.balitaKms.delete({ where: { id } });
    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function savePengukuran(formData: FormData) {
  try {
    const id = formData.get('id') ? Number(formData.get('id')) : undefined;
    const balitaId = Number(formData.get('balitaId'));
    const usiaBulan = Number(formData.get('usiaBulan'));
    const beratBadan = Number(formData.get('beratBadan'));
    const tinggiBadan = Number(formData.get('tinggiBadan'));
    const statusGizi = formData.get('statusGizi') as string;
    const keterangan = (formData.get('keterangan') as string) || '';
    const petugas = (formData.get('petugas') as string) || 'Kader Posyandu';
    const tanggalUkur = new Date(formData.get('tanggalUkur') as string || new Date());

    if (id) {
      await (prisma as any).kmsPengukuran.update({
        where: { id },
        data: { balitaId, usiaBulan, beratBadan, tinggiBadan, statusGizi, keterangan, petugas, tanggalUkur }
      });
    } else {
      // Simpan ke riwayat pengukuran baru
      await (prisma as any).kmsPengukuran.create({
        data: { balitaId, usiaBulan, beratBadan, tinggiBadan, statusGizi, keterangan, petugas, tanggalUkur }
      });
    }

    // Sinkronisasikan BalitaKms dengan pengukuran terbaru (usiaBulan terbesar)
    const lastPengukuran = await (prisma as any).kmsPengukuran.findFirst({
      where: { balitaId },
      orderBy: { usiaBulan: 'desc' }
    });

    if (lastPengukuran) {
      await prisma.balitaKms.update({
        where: { id: balitaId },
        data: {
          usiaBulan: lastPengukuran.usiaBulan,
          beratBadan: lastPengukuran.beratBadan,
          tinggiBadan: lastPengukuran.tinggiBadan,
          statusGizi: lastPengukuran.statusGizi
        }
      });
    }

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Pengukuran:', error);
    throw new Error(error.message);
  }
}

export async function deletePengukuran(id: number, balitaId: number) {
  try {
    await (prisma as any).kmsPengukuran.delete({ where: { id } });

    // Cari pengukuran terbaru yang tersisa untuk disinkronkan kembali ke BalitaKms utama
    const lastPengukuran = await (prisma as any).kmsPengukuran.findFirst({
      where: { balitaId },
      orderBy: { usiaBulan: 'desc' }
    });

    if (lastPengukuran) {
      await prisma.balitaKms.update({
        where: { id: balitaId },
        data: {
          usiaBulan: lastPengukuran.usiaBulan,
          beratBadan: lastPengukuran.beratBadan,
          tinggiBadan: lastPengukuran.tinggiBadan,
          statusGizi: lastPengukuran.statusGizi
        }
      });
    }

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function saveJadwal(formData: FormData) {
  try {
    const posyanduId = Number(formData.get('posyanduId'));
    const kaderId = Number(formData.get('kaderId'));
    const tanggal = new Date(formData.get('tanggal') as string);
    const waktu = formData.get('waktu') as string;
    const sasaran = formData.get('sasaran') as string;

    await prisma.jadwalPosyandu.create({
      data: {
        posyanduId,
        kaderId,
        tanggal,
        waktu,
        sasaran
      }
    });

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Jadwal:', error);
    throw new Error(error.message);
  }
}

export async function deleteJadwal(id: number) {
  try {
    await prisma.jadwalPosyandu.delete({ where: { id } });
    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function savePosyandu(formData: FormData) {
  try {
    const id = formData.get('id') ? Number(formData.get('id')) : undefined;
    const nama = formData.get('nama') as string;
    const dusun = formData.get('dusun') as string;

    if (id) {
      await prisma.posyandu.update({
        where: { id },
        data: { nama, dusun }
      });
    } else {
      await prisma.posyandu.create({
        data: { nama, dusun }
      });
    }

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Posyandu:', error);
    throw new Error(error.message);
  }
}

export async function deletePosyandu(id: number) {
  try {
    // Pastikan tidak ada jadwal atau balita terikat sebelum dihapus, atau hapus cascading safely
    await prisma.jadwalPosyandu.deleteMany({ where: { posyanduId: id } });
    await prisma.balitaKms.deleteMany({ where: { posyanduId: id } });
    await prisma.posyandu.delete({ where: { id } });
    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function saveKader(formData: FormData) {
  try {
    const id = formData.get('id') ? Number(formData.get('id')) : undefined;
    const nik = formData.get('nik') as string;
    const nama = formData.get('nama') as string;
    const jabatan = formData.get('jabatan') as string;
    const areaTugas = formData.get('areaTugas') as string;
    const kontak = formData.get('kontak') as string;

    if (id) {
      await prisma.kaderPkk.update({
        where: { id },
        data: { nik, nama, jabatan, areaTugas, kontak }
      });
    } else {
      await prisma.kaderPkk.create({
        data: { nik, nama, jabatan, areaTugas, kontak, isActive: true }
      });
    }

    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving Kader:', error);
    throw new Error(error.message);
  }
}

export async function deleteKader(id: number) {
  try {
    await prisma.jadwalPosyandu.deleteMany({ where: { kaderId: id } });
    await prisma.kaderPkk.delete({ where: { id } });
    revalidatePath('/admin/pkk');
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getKegiatanList() {
  return withDriftRetry(
    () => (prisma as any).kegiatanPkk.findMany({
      include: {
        kader: {
          select: {
            nama: true,
            jabatan: true
          }
        }
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveKegiatan(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const nama = formData.get('nama') as string;
      const kategori = formData.get('kategori') as string;
      const subKategori = formData.get('subKategori') as string;
      const tanggal = new Date(formData.get('tanggal') as string);
      const lokasi = formData.get('lokasi') as string;
      const kaderId = formData.get('kaderId') ? Number(formData.get('kaderId')) : null;
      const deskripsi = formData.get('deskripsi') as string || '';
      const dokumentasi = formData.get('dokumentasi') as string || '';
      const jumlahHadir = formData.get('jumlahHadir') ? Number(formData.get('jumlahHadir')) : 0;
      const sumberDana = formData.get('sumberDana') as string || 'Swadaya';

      if (id) {
        await (prisma as any).kegiatanPkk.update({
          where: { id },
          data: { nama, kategori, subKategori, tanggal, lokasi, kaderId, deskripsi, dokumentasi, jumlahHadir, sumberDana }
        });
      } else {
        await (prisma as any).kegiatanPkk.create({
          data: { nama, kategori, subKategori, tanggal, lokasi, kaderId, deskripsi, dokumentasi, jumlahHadir, sumberDana }
        });
      }

      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteKegiatan(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).kegiatanPkk.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// ==========================================
// === BUKU BAKU POKJA IV SERVER ACTIONS ===
// ==========================================

// 1. BUKU PROGRAM KERJA POKJA IV
export async function getBukuProgramKerjaList() {
  return withDriftRetry(
    () => (prisma as any).bukuProgramKerjaPokjaIV.findMany({
      orderBy: { id: 'asc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuProgramKerja(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja4 = formData.get('programPokja4') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const lokasi = formData.get('lokasi') as string;
      const waktuPelaksanaan = formData.get('waktuPelaksanaan') as string; // JSON String e.g. "[2,5]"
      const mitra = formData.get('mitra') as string;
      const indikatorKeberhasilan = formData.get('indikatorKeberhasilan') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = {
        programPokok,
        programPokja4,
        kegiatan,
        sasaran,
        lokasi,
        waktuPelaksanaan,
        mitra,
        indikatorKeberhasilan,
        keterangan
      };

      if (id) {
        await (prisma as any).bukuProgramKerjaPokjaIV.update({
          where: { id },
          data
        });
      } else {
        await (prisma as any).bukuProgramKerjaPokjaIV.create({
          data
        });
      }

      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuProgramKerja(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuProgramKerjaPokjaIV.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// 2. BUKU PELAKSANAAN PROGRAM KERJA
export async function getBukuPelaksanaanList() {
  return withDriftRetry(
    () => (prisma as any).bukuPelaksanaanPokjaIV.findMany({
      orderBy: { waktu: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuPelaksanaan(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja4 = formData.get('programPokja4') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const tujuanKegiatan = formData.get('tujuanKegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const pelaksana = formData.get('pelaksana') as string;
      const waktu = new Date(formData.get('waktu') as string);
      const lokasi = formData.get('lokasi') as string;
      const output = formData.get('output') as string;
      const outcome = formData.get('outcome') as string;
      const monitoringEvaluasi = formData.get('monitoringEvaluasi') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = {
        programPokok,
        programPokja4,
        kegiatan,
        tujuanKegiatan,
        sasaran,
        pelaksana,
        waktu,
        lokasi,
        output,
        outcome,
        monitoringEvaluasi,
        keterangan
      };

      if (id) {
        await (prisma as any).bukuPelaksanaanPokjaIV.update({
          where: { id },
          data
        });
      } else {
        await (prisma as any).bukuPelaksanaanPokjaIV.create({
          data
        });
      }

      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuPelaksanaan(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuPelaksanaanPokjaIV.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// 3. BUKU KEGIATAN POKJA IV
export async function getBukuKegiatanList() {
  return withDriftRetry(
    () => (prisma as any).bukuKegiatanPokjaIV.findMany({
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuKegiatan(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const nama = formData.get('nama') as string;
      const jabatan = formData.get('jabatan') as string;
      const tanggal = new Date(formData.get('tanggal') as string);
      const tempat = formData.get('tempat') as string;
      const uraian = formData.get('uraian') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = {
        nama,
        jabatan,
        tanggal,
        tempat,
        uraian,
        keterangan
      };

      if (id) {
        await (prisma as any).bukuKegiatanPokjaIV.update({
          where: { id },
          data
        });
      } else {
        await (prisma as any).bukuKegiatanPokjaIV.create({
          data
        });
      }

      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuKegiatan(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuKegiatanPokjaIV.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// 4. BUKU NOTULEN POKJA IV
export async function getBukuNotulenList() {
  return withDriftRetry(
    () => (prisma as any).bukuNotulenPokjaIV.findMany({
      include: {
        pimpinanRapat: { select: { nama: true, jabatan: true } },
        pembuatNotulen: { select: { nama: true, jabatan: true } }
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuNotulen(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const tanggal = new Date(formData.get('tanggal') as string);
      const waktu = formData.get('waktu') as string;
      const tempat = formData.get('tempat') as string;
      const jenisRapat = formData.get('jenisRapat') as string;
      const pimpinanRapatId = formData.get('pimpinanRapatId') ? Number(formData.get('pimpinanRapatId')) : null;
      const pembuatNotulenId = formData.get('pembuatNotulenId') ? Number(formData.get('pembuatNotulenId')) : null;
      const jumlahDiundang = Number(formData.get('jumlahDiundang'));
      const jumlahHadir = Number(formData.get('jumlahHadir'));
      const jumlahTidakHadir = Number(formData.get('jumlahTidakHadir'));
      const susunanAcara = formData.get('susunanAcara') as string;
      const kesimpulan = formData.get('kesimpulan') as string;
      const penutup = formData.get('penutup') as string;
      const dokumentasi = formData.get('dokumentasi') as string || '';

      const data = {
        tanggal,
        waktu,
        tempat,
        jenisRapat,
        pimpinanRapatId,
        pembuatNotulenId,
        jumlahDiundang,
        jumlahHadir,
        jumlahTidakHadir,
        susunanAcara,
        kesimpulan,
        penutup,
        dokumentasi
      };

      if (id) {
        await (prisma as any).bukuNotulenPokjaIV.update({
          where: { id },
          data
        });
      } else {
        await (prisma as any).bukuNotulenPokjaIV.create({
          data
        });
      }

      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuNotulen(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuNotulenPokjaIV.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// ==========================================
// === BUKU BAKU POKJA I SERVER ACTIONS ===
// ==========================================

export async function getBukuProgramKerjaPokjaIList() {
  return withDriftRetry(
    () => (prisma as any).bukuProgramKerjaPokjaI.findMany({ orderBy: { id: 'asc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuProgramKerjaPokjaI(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja1 = formData.get('programPokja1') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const lokasi = formData.get('lokasi') as string;
      const waktuPelaksanaan = formData.get('waktuPelaksanaan') as string;
      const mitra = formData.get('mitra') as string;
      const indikatorKeberhasilan = formData.get('indikatorKeberhasilan') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { programPokok, programPokja1, kegiatan, sasaran, lokasi, waktuPelaksanaan, mitra, indikatorKeberhasilan, keterangan };

      if (id) {
        await (prisma as any).bukuProgramKerjaPokjaI.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuProgramKerjaPokjaI.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuProgramKerjaPokjaI(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuProgramKerjaPokjaI.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuPelaksanaanPokjaIList() {
  return withDriftRetry(
    () => (prisma as any).bukuPelaksanaanPokjaI.findMany({ orderBy: { waktu: 'desc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuPelaksanaanPokjaI(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja1 = formData.get('programPokja1') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const tujuanKegiatan = formData.get('tujuanKegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const pelaksana = formData.get('pelaksana') as string;
      const waktu = new Date(formData.get('waktu') as string);
      const lokasi = formData.get('lokasi') as string;
      const output = formData.get('output') as string;
      const outcome = formData.get('outcome') as string;
      const monitoringEvaluasi = formData.get('monitoringEvaluasi') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { programPokok, programPokja1, kegiatan, tujuanKegiatan, sasaran, pelaksana, waktu, lokasi, output, outcome, monitoringEvaluasi, keterangan };

      if (id) {
        await (prisma as any).bukuPelaksanaanPokjaI.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuPelaksanaanPokjaI.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuPelaksanaanPokjaI(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuPelaksanaanPokjaI.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuKegiatanPokjaIList() {
  return withDriftRetry(
    () => (prisma as any).bukuKegiatanPokjaI.findMany({ orderBy: { tanggal: 'desc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuKegiatanPokjaI(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const nama = formData.get('nama') as string;
      const jabatan = formData.get('jabatan') as string;
      const tanggal = new Date(formData.get('tanggal') as string);
      const tempat = formData.get('tempat') as string;
      const uraian = formData.get('uraian') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { nama, jabatan, tanggal, tempat, uraian, keterangan };

      if (id) {
        await (prisma as any).bukuKegiatanPokjaI.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuKegiatanPokjaI.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuKegiatanPokjaI(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuKegiatanPokjaI.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuNotulenPokjaIList() {
  return withDriftRetry(
    () => (prisma as any).bukuNotulenPokjaI.findMany({
      include: {
        pimpinanRapat: { select: { nama: true, jabatan: true } },
        pembuatNotulen: { select: { nama: true, jabatan: true } }
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuNotulenPokjaI(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const tanggal = new Date(formData.get('tanggal') as string);
      const waktu = formData.get('waktu') as string;
      const tempat = formData.get('tempat') as string;
      const jenisRapat = formData.get('jenisRapat') as string;
      const pimpinanRapatId = formData.get('pimpinanRapatId') ? Number(formData.get('pimpinanRapatId')) : null;
      const pembuatNotulenId = formData.get('pembuatNotulenId') ? Number(formData.get('pembuatNotulenId')) : null;
      const jumlahDiundang = Number(formData.get('jumlahDiundang'));
      const jumlahHadir = Number(formData.get('jumlahHadir'));
      const jumlahTidakHadir = Number(formData.get('jumlahTidakHadir'));
      const susunanAcara = formData.get('susunanAcara') as string;
      const kesimpulan = formData.get('kesimpulan') as string;
      const penutup = formData.get('penutup') as string;
      const dokumentasi = formData.get('dokumentasi') as string || '';

      const data = { tanggal, waktu, tempat, jenisRapat, pimpinanRapatId, pembuatNotulenId, jumlahDiundang, jumlahHadir, jumlahTidakHadir, susunanAcara, kesimpulan, penutup, dokumentasi };

      if (id) {
        await (prisma as any).bukuNotulenPokjaI.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuNotulenPokjaI.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuNotulenPokjaI(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuNotulenPokjaI.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// ==========================================
// === BUKU BAKU POKJA II SERVER ACTIONS ===
// ==========================================

export async function getBukuProgramKerjaPokjaIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuProgramKerjaPokjaII.findMany({ orderBy: { id: 'asc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuProgramKerjaPokjaII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja2 = formData.get('programPokja2') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const lokasi = formData.get('lokasi') as string;
      const waktuPelaksanaan = formData.get('waktuPelaksanaan') as string;
      const mitra = formData.get('mitra') as string;
      const indikatorKeberhasilan = formData.get('indikatorKeberhasilan') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { programPokok, programPokja2, kegiatan, sasaran, lokasi, waktuPelaksanaan, mitra, indikatorKeberhasilan, keterangan };

      if (id) {
        await (prisma as any).bukuProgramKerjaPokjaII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuProgramKerjaPokjaII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuProgramKerjaPokjaII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuProgramKerjaPokjaII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuPelaksanaanPokjaIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuPelaksanaanPokjaII.findMany({ orderBy: { waktu: 'desc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuPelaksanaanPokjaII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja2 = formData.get('programPokja2') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const tujuanKegiatan = formData.get('tujuanKegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const pelaksana = formData.get('pelaksana') as string;
      const waktu = new Date(formData.get('waktu') as string);
      const lokasi = formData.get('lokasi') as string;
      const output = formData.get('output') as string;
      const outcome = formData.get('outcome') as string;
      const monitoringEvaluasi = formData.get('monitoringEvaluasi') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { programPokok, programPokja2, kegiatan, tujuanKegiatan, sasaran, pelaksana, waktu, lokasi, output, outcome, monitoringEvaluasi, keterangan };

      if (id) {
        await (prisma as any).bukuPelaksanaanPokjaII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuPelaksanaanPokjaII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuPelaksanaanPokjaII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuPelaksanaanPokjaII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuKegiatanPokjaIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuKegiatanPokjaII.findMany({ orderBy: { tanggal: 'desc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuKegiatanPokjaII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const nama = formData.get('nama') as string;
      const jabatan = formData.get('jabatan') as string;
      const tanggal = new Date(formData.get('tanggal') as string);
      const tempat = formData.get('tempat') as string;
      const uraian = formData.get('uraian') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { nama, jabatan, tanggal, tempat, uraian, keterangan };

      if (id) {
        await (prisma as any).bukuKegiatanPokjaII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuKegiatanPokjaII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuKegiatanPokjaII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuKegiatanPokjaII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuNotulenPokjaIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuNotulenPokjaII.findMany({
      include: {
        pimpinanRapat: { select: { nama: true, jabatan: true } },
        pembuatNotulen: { select: { nama: true, jabatan: true } }
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuNotulenPokjaII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const tanggal = new Date(formData.get('tanggal') as string);
      const waktu = formData.get('waktu') as string;
      const tempat = formData.get('tempat') as string;
      const jenisRapat = formData.get('jenisRapat') as string;
      const pimpinanRapatId = formData.get('pimpinanRapatId') ? Number(formData.get('pimpinanRapatId')) : null;
      const pembuatNotulenId = formData.get('pembuatNotulenId') ? Number(formData.get('pembuatNotulenId')) : null;
      const jumlahDiundang = Number(formData.get('jumlahDiundang'));
      const jumlahHadir = Number(formData.get('jumlahHadir'));
      const jumlahTidakHadir = Number(formData.get('jumlahTidakHadir'));
      const susunanAcara = formData.get('susunanAcara') as string;
      const kesimpulan = formData.get('kesimpulan') as string;
      const penutup = formData.get('penutup') as string;
      const dokumentasi = formData.get('dokumentasi') as string || '';

      const data = { tanggal, waktu, tempat, jenisRapat, pimpinanRapatId, pembuatNotulenId, jumlahDiundang, jumlahHadir, jumlahTidakHadir, susunanAcara, kesimpulan, penutup, dokumentasi };

      if (id) {
        await (prisma as any).bukuNotulenPokjaII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuNotulenPokjaII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuNotulenPokjaII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuNotulenPokjaII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

// ==========================================
// === BUKU BAKU POKJA III SERVER ACTIONS ===
// ==========================================

export async function getBukuProgramKerjaPokjaIIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuProgramKerjaPokjaIII.findMany({ orderBy: { id: 'asc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuProgramKerjaPokjaIII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja3 = formData.get('programPokja3') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const lokasi = formData.get('lokasi') as string;
      const waktuPelaksanaan = formData.get('waktuPelaksanaan') as string;
      const mitra = formData.get('mitra') as string;
      const indikatorKeberhasilan = formData.get('indikatorKeberhasilan') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { programPokok, programPokja3, kegiatan, sasaran, lokasi, waktuPelaksanaan, mitra, indikatorKeberhasilan, keterangan };

      if (id) {
        await (prisma as any).bukuProgramKerjaPokjaIII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuProgramKerjaPokjaIII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuProgramKerjaPokjaIII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuProgramKerjaPokjaIII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuPelaksanaanPokjaIIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuPelaksanaanPokjaIII.findMany({ orderBy: { waktu: 'desc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuPelaksanaanPokjaIII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const programPokok = formData.get('programPokok') as string;
      const programPokja3 = formData.get('programPokja3') as string;
      const kegiatan = formData.get('kegiatan') as string;
      const tujuanKegiatan = formData.get('tujuanKegiatan') as string;
      const sasaran = formData.get('sasaran') as string;
      const pelaksana = formData.get('pelaksana') as string;
      const waktu = new Date(formData.get('waktu') as string);
      const lokasi = formData.get('lokasi') as string;
      const output = formData.get('output') as string;
      const outcome = formData.get('outcome') as string;
      const monitoringEvaluasi = formData.get('monitoringEvaluasi') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { programPokok, programPokja3, kegiatan, tujuanKegiatan, sasaran, pelaksana, waktu, lokasi, output, outcome, monitoringEvaluasi, keterangan };

      if (id) {
        await (prisma as any).bukuPelaksanaanPokjaIII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuPelaksanaanPokjaIII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuPelaksanaanPokjaIII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuPelaksanaanPokjaIII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuKegiatanPokjaIIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuKegiatanPokjaIII.findMany({ orderBy: { tanggal: 'desc' } }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuKegiatanPokjaIII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const nama = formData.get('nama') as string;
      const jabatan = formData.get('jabatan') as string;
      const tanggal = new Date(formData.get('tanggal') as string);
      const tempat = formData.get('tempat') as string;
      const uraian = formData.get('uraian') as string;
      const keterangan = formData.get('keterangan') as string || '';

      const data = { nama, jabatan, tanggal, tempat, uraian, keterangan };

      if (id) {
        await (prisma as any).bukuKegiatanPokjaIII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuKegiatanPokjaIII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuKegiatanPokjaIII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuKegiatanPokjaIII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function getBukuNotulenPokjaIIIList() {
  return withDriftRetry(
    () => (prisma as any).bukuNotulenPokjaIII.findMany({
      include: {
        pimpinanRapat: { select: { nama: true, jabatan: true } },
        pembuatNotulen: { select: { nama: true, jabatan: true } }
      },
      orderBy: { tanggal: 'desc' }
    }),
    async () => { await syncDatabaseStructure(); }
  );
}

export async function saveBukuNotulenPokjaIII(formData: FormData) {
  return withDriftRetry(
    async () => {
      const id = formData.get('id') ? Number(formData.get('id')) : undefined;
      const tanggal = new Date(formData.get('tanggal') as string);
      const waktu = formData.get('waktu') as string;
      const tempat = formData.get('tempat') as string;
      const jenisRapat = formData.get('jenisRapat') as string;
      const pimpinanRapatId = formData.get('pimpinanRapatId') ? Number(formData.get('pimpinanRapatId')) : null;
      const pembuatNotulenId = formData.get('pembuatNotulenId') ? Number(formData.get('pembuatNotulenId')) : null;
      const jumlahDiundang = Number(formData.get('jumlahDiundang'));
      const jumlahHadir = Number(formData.get('jumlahHadir'));
      const jumlahTidakHadir = Number(formData.get('jumlahTidakHadir'));
      const susunanAcara = formData.get('susunanAcara') as string;
      const kesimpulan = formData.get('kesimpulan') as string;
      const penutup = formData.get('penutup') as string;
      const dokumentasi = formData.get('dokumentasi') as string || '';

      const data = { tanggal, waktu, tempat, jenisRapat, pimpinanRapatId, pembuatNotulenId, jumlahDiundang, jumlahHadir, jumlahTidakHadir, susunanAcara, kesimpulan, penutup, dokumentasi };

      if (id) {
        await (prisma as any).bukuNotulenPokjaIII.update({ where: { id }, data });
      } else {
        await (prisma as any).bukuNotulenPokjaIII.create({ data });
      }
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}

export async function deleteBukuNotulenPokjaIII(id: number) {
  return withDriftRetry(
    async () => {
      await (prisma as any).bukuNotulenPokjaIII.delete({ where: { id } });
      revalidatePath('/admin/pkk');
      return { success: true };
    },
    async () => { await syncDatabaseStructure(); }
  );
}
