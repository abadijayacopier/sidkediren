/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: apbdes_item
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `apbdes_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tahun` int(11) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MURNI',
  `kategori_id` int(11) NOT NULL,
  `nama_item` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anggaran` decimal(15, 2) NOT NULL,
  `realisasi` decimal(15, 2) NOT NULL DEFAULT '0.00',
  `sumber_dana` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode_rekening` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `apbdes_item_kategori_id_fkey` (`kategori_id`),
  CONSTRAINT `apbdes_item_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `apbdes_kategori` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 31 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: apbdes_kategori
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `apbdes_kategori` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('PENDAPATAN', 'BELANJA', 'PEMBIAYAAN') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: balita_kms
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `balita_kms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `posyandu_id` int(11) NOT NULL,
  `nama` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_ibu` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_kelamin` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'L',
  `usia_bulan` int(11) NOT NULL,
  `berat_badan` double NOT NULL,
  `tinggi_badan` double NOT NULL,
  `status_gizi` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `balita_kms_nik_key` (`nik`),
  KEY `balita_kms_posyandu_id_fkey` (`posyandu_id`),
  CONSTRAINT `balita_kms_posyandu_id_fkey` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandu` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: berita
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `berita` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `konten` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `gambar` text COLLATE utf8mb4_unicode_ci,
  `penulis` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isPublished` tinyint(1) NOT NULL DEFAULT '0',
  `kategori` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `berita_slug_key` (`slug`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: buku_kegiatan
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `buku_kegiatan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pokja` int(11) NOT NULL,
  `nama` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` datetime(3) NOT NULL,
  `tempat` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uraian` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: buku_notulen
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `buku_notulen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pokja` int(11) NOT NULL,
  `tanggal` datetime(3) NOT NULL,
  `waktu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempat` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_rapat` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pimpinan_rapat_id` int(11) DEFAULT NULL,
  `pembuat_notulen_id` int(11) DEFAULT NULL,
  `jumlah_diundang` int(11) NOT NULL,
  `jumlah_hadir` int(11) NOT NULL,
  `jumlah_tidak_hadir` int(11) NOT NULL,
  `susunan_acara` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `kesimpulan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `penutup` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `dokumentasi` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buku_notulen_pimpinan_rapat_id_fkey` (`pimpinan_rapat_id`),
  KEY `buku_notulen_pembuat_notulen_id_fkey` (`pembuat_notulen_id`),
  CONSTRAINT `buku_notulen_pembuat_notulen_id_fkey` FOREIGN KEY (`pembuat_notulen_id`) REFERENCES `kader_pkk` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `buku_notulen_pimpinan_rapat_id_fkey` FOREIGN KEY (`pimpinan_rapat_id`) REFERENCES `kader_pkk` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: buku_pelaksanaan
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `buku_pelaksanaan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pokja` int(11) NOT NULL,
  `program_pokok` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_pokja` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kegiatan` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tujuan_kegiatan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sasaran` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pelaksana` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `waktu` datetime(3) NOT NULL,
  `lokasi` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `output` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `outcome` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `monitoring_evaluasi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: buku_program_kerja
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `buku_program_kerja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pokja` int(11) NOT NULL,
  `program_pokok` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_pokja` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kegiatan` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sasaran` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lokasi` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `waktu_pelaksanaan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mitra` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `indikator_keberhasilan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: jabatan
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `jabatan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama_jabatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int(11) NOT NULL DEFAULT '1',
  `urutan` int(11) NOT NULL DEFAULT '1',
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: jadwal_posyandu
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `jadwal_posyandu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `posyandu_id` int(11) NOT NULL,
  `kader_id` int(11) NOT NULL,
  `tanggal` datetime(3) NOT NULL,
  `waktu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sasaran` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jadwal_posyandu_posyandu_id_fkey` (`posyandu_id`),
  KEY `jadwal_posyandu_kader_id_fkey` (`kader_id`),
  CONSTRAINT `jadwal_posyandu_kader_id_fkey` FOREIGN KEY (`kader_id`) REFERENCES `kader_pkk` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `jadwal_posyandu_posyandu_id_fkey` FOREIGN KEY (`posyandu_id`) REFERENCES `posyandu` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: kader_pkk
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `kader_pkk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `area_tugas` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kontak` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `kader_pkk_nik_key` (`nik`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: kegiatan_pkk
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `kegiatan_pkk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_kategori` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` datetime(3) NOT NULL,
  `lokasi` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kader_id` int(11) DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `dokumentasi` text COLLATE utf8mb4_unicode_ci,
  `jumlah_hadir` int(11) DEFAULT '0',
  `sumber_dana` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Swadaya',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kegiatan_pkk_kader_id_fkey` (`kader_id`),
  CONSTRAINT `kegiatan_pkk_kader_id_fkey` FOREIGN KEY (`kader_id`) REFERENCES `kader_pkk` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: keluarga
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `keluarga` (
  `no_kk` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kepala_keluarga_nik` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `dusun` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rt` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rw` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode_pos` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kabupaten` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_kk` text COLLATE utf8mb4_unicode_ci,
  `tanggal_diterbitkan` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `wilayah_rt_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`no_kk`),
  KEY `keluarga_wilayah_rt_id_fkey` (`wilayah_rt_id`),
  CONSTRAINT `keluarga_wilayah_rt_id_fkey` FOREIGN KEY (`wilayah_rt_id`) REFERENCES `wilayah_rt` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: klasifikasi_surat
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `klasifikasi_surat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `klasifikasi_surat_kode_key` (`kode`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: kms_pengukuran
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `kms_pengukuran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `balita_id` int(11) NOT NULL,
  `tanggal_ukur` datetime(3) NOT NULL,
  `usia_bulan` int(11) NOT NULL,
  `berat_badan` double NOT NULL,
  `tinggi_badan` double NOT NULL,
  `status_gizi` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `petugas` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `kms_pengukuran_balita_id_fkey` (`balita_id`),
  CONSTRAINT `kms_pengukuran_balita_id_fkey` FOREIGN KEY (`balita_id`) REFERENCES `balita_kms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: master_surat
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `master_surat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_surat` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_surat` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `klasifikasi_id` int(11) NOT NULL,
  `format_nomor` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `form_schema` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_content` longtext COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `master_surat_kode_surat_key` (`kode_surat`),
  KEY `master_surat_klasifikasi_id_fkey` (`klasifikasi_id`),
  CONSTRAINT `master_surat_klasifikasi_id_fkey` FOREIGN KEY (`klasifikasi_id`) REFERENCES `klasifikasi_surat` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 31 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: mutasi
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `mutasi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_mutasi` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_mutasi` datetime(3) NOT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `petugas_input` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik_kepala_lama` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat_asal` text COLLATE utf8mb4_unicode_ci,
  `desa_asal` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan_asal` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kabupaten_asal` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi_asal` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode_pos_asal` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat_tujuan` text COLLATE utf8mb4_unicode_ci,
  `desa_tujuan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan_tujuan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kabupaten_tujuan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi_tujuan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode_pos_tujuan` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `mutasi_nik_fkey` (`nik`),
  CONSTRAINT `mutasi_nik_fkey` FOREIGN KEY (`nik`) REFERENCES `penduduk` (`nik`) ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: penduduk
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `penduduk` (
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `no_kk` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_lengkap` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempat_lahir` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_lahir` datetime(3) DEFAULT NULL,
  `jenis_kelamin` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agama` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pendidikan_terakhir` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pekerjaan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_perkawinan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_dalam_keluarga` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `golongan_darah` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_ayah` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_ibu` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kewarganegaraan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'WNI',
  `foto` text COLLATE utf8mb4_unicode_ci,
  `is_hidup` tinyint(1) NOT NULL DEFAULT '1',
  `status_dasar` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'Hidup',
  `status_rekam` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'BELUM REKAM',
  `no_paspor` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `no_kitas` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `pin_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`nik`),
  KEY `penduduk_no_kk_fkey` (`no_kk`),
  CONSTRAINT `penduduk_no_kk_fkey` FOREIGN KEY (`no_kk`) REFERENCES `keluarga` (`no_kk`) ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pengguna
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `peran` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_petugas` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `akses_modul` text COLLATE utf8mb4_unicode_ci,
  `dusun_akses_id` int(11) DEFAULT NULL,
  `rt_akses_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengguna_username_key` (`username`),
  KEY `pengguna_dusun_akses_id_fkey` (`dusun_akses_id`),
  KEY `pengguna_rt_akses_id_fkey` (`rt_akses_id`),
  CONSTRAINT `pengguna_dusun_akses_id_fkey` FOREIGN KEY (`dusun_akses_id`) REFERENCES `wilayah_dusun` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `pengguna_rt_akses_id_fkey` FOREIGN KEY (`rt_akses_id`) REFERENCES `wilayah_rt` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: perangkat_desa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `perangkat_desa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jabatan_id` int(11) NOT NULL,
  `nik` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_profil` text COLLATE utf8mb4_unicode_ci,
  `tanda_tangan_digital` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `perangkat_desa_jabatan_id_fkey` (`jabatan_id`),
  CONSTRAINT `perangkat_desa_jabatan_id_fkey` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: permohonan_surat
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `permohonan_surat` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik_pemohon` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `master_surat_id` int(11) NOT NULL,
  `tanggal_ajuan` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status_surat` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `keterangan_batal` text COLLATE utf8mb4_unicode_ci,
  `keperluan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `permohonan_surat_nik_pemohon_fkey` (`nik_pemohon`),
  KEY `permohonan_surat_master_surat_id_fkey` (`master_surat_id`),
  CONSTRAINT `permohonan_surat_master_surat_id_fkey` FOREIGN KEY (`master_surat_id`) REFERENCES `master_surat` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `permohonan_surat_nik_pemohon_fkey` FOREIGN KEY (`nik_pemohon`) REFERENCES `penduduk` (`nik`) ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: posyandu
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `posyandu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dusun` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: potensi_wisata
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `potensi_wisata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kategori` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `gambar` text COLLATE utf8mb4_unicode_ci,
  `lokasi` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `harga` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT '0',
  `maps_url` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: profil_desa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `profil_desa` (
  `id` int(11) NOT NULL DEFAULT '1',
  `nama_desa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode_desa` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kabupaten` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `kode_pos` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sejarah` longtext COLLATE utf8mb4_unicode_ci,
  `visi` text COLLATE utf8mb4_unicode_ci,
  `misi` text COLLATE utf8mb4_unicode_ci,
  `instagram` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_kepala_desa` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nip_kepala_desa` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo_desa` text COLLATE utf8mb4_unicode_ci,
  `hero_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hero_subtitle` text COLLATE utf8mb4_unicode_ci,
  `welcome_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `welcome_message` longtext COLLATE utf8mb4_unicode_ci,
  `hero_image` text COLLATE utf8mb4_unicode_ci,
  `welcome_image` text COLLATE utf8mb4_unicode_ci,
  `running_text` text COLLATE utf8mb4_unicode_ci,
  `slider_images` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: program_kerja
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `program_kerja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tahun` int(11) NOT NULL,
  `nama_program` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `lokasi` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anggaran` decimal(15, 2) NOT NULL,
  `sumber_dana` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Rencana',
  `foto_progres` text COLLATE utf8mb4_unicode_ci,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `gambar` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: riwayat_surat
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `riwayat_surat` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nik_pemohon` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `master_surat_id` int(11) NOT NULL,
  `nomor_surat` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_surat` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status_surat` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `meta_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `qr_code_data` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `riwayat_surat_nik_pemohon_fkey` (`nik_pemohon`),
  KEY `riwayat_surat_master_surat_id_fkey` (`master_surat_id`),
  CONSTRAINT `riwayat_surat_master_surat_id_fkey` FOREIGN KEY (`master_surat_id`) REFERENCES `master_surat` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `riwayat_surat_nik_pemohon_fkey` FOREIGN KEY (`nik_pemohon`) REFERENCES `penduduk` (`nik`) ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: surat_masuk
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `surat_masuk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomor_surat` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_surat` datetime(3) NOT NULL,
  `tanggal_diterima` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `pengirim` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perihal` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `klasifikasi_id` int(11) DEFAULT NULL,
  `file_scan` text COLLATE utf8mb4_unicode_ci,
  `disposisi_kepada` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catatan_disposisi` text COLLATE utf8mb4_unicode_ci,
  `status_disposisi` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Belum Diproses',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `surat_masuk_klasifikasi_id_fkey` (`klasifikasi_id`),
  CONSTRAINT `surat_masuk_klasifikasi_id_fkey` FOREIGN KEY (`klasifikasi_id`) REFERENCES `klasifikasi_surat` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: wilayah_dusun
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `wilayah_dusun` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kepala_dusun_nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kepala_dusun_nama` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wakil_dusun_nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wakil_dusun_nama` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wilayah_dusun_nama_key` (`nama`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: wilayah_rt
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `wilayah_rt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rt` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rw` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dusun_id` int(11) NOT NULL,
  `ketua_rt_nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ketua_rt_nama` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wakil_rt_nik` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wakil_rt_nama` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wilayah_rt_dusun_id_rt_rw_key` (`dusun_id`, `rt`, `rw`),
  CONSTRAINT `wilayah_rt_dusun_id_fkey` FOREIGN KEY (`dusun_id`) REFERENCES `wilayah_dusun` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: apbdes_item
# ------------------------------------------------------------

INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    21,
    2026,
    'MURNI',
    21,
    'Dana Desa Tahap I',
    450000000.00,
    450000000.00,
    'APBN',
    '4.2.1.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    22,
    2026,
    'MURNI',
    21,
    'Dana Desa Tahap II',
    350000000.00,
    0.00,
    'APBN',
    '4.2.1.02',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    23,
    2026,
    'MURNI',
    22,
    'Alokasi Dana Desa (ADD)',
    250000000.00,
    125000000.00,
    'APBD',
    '4.2.2.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    24,
    2026,
    'MURNI',
    20,
    'Laba BUMDes',
    50000000.00,
    50000000.00,
    'PADes',
    '4.1.1.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    25,
    2026,
    'MURNI',
    1,
    'Siltap Kades & Perangkat',
    300000000.00,
    150000000.00,
    'ADD',
    '5.1.1.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    26,
    2026,
    'MURNI',
    2,
    'Pembangunan Jalan Lingkungan',
    200000000.00,
    200000000.00,
    'DD',
    '5.2.1.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    27,
    2026,
    'MURNI',
    2,
    'Pembangunan Drainase',
    100000000.00,
    0.00,
    'DD',
    '5.2.2.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    28,
    2026,
    'MURNI',
    5,
    'BLT Dana Desa (Jan-Jun)',
    108000000.00,
    108000000.00,
    'DD',
    '5.5.2.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    29,
    2026,
    'MURNI',
    30,
    'SiLPA Tahun 2023',
    75000000.00,
    75000000.00,
    'SiLPA',
    '6.1.1.01',
    NULL
  );
INSERT INTO
  `apbdes_item` (
    `id`,
    `tahun`,
    `status`,
    `kategori_id`,
    `nama_item`,
    `anggaran`,
    `realisasi`,
    `sumber_dana`,
    `kode_rekening`,
    `keterangan`
  )
VALUES
  (
    30,
    2026,
    'MURNI',
    31,
    'Penyertaan Modal BUMDes',
    50000000.00,
    50000000.00,
    'PADes',
    '6.2.1.01',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: apbdes_kategori
# ------------------------------------------------------------

INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    1,
    'Bidang Penyelenggaraan Pemerintahan Desa',
    'BELANJA'
  );
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    2,
    'Bidang Pelaksanaan Pembangunan Desa',
    'BELANJA'
  );
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    3,
    'Bidang Pembinaan Kemasyarakatan Desa',
    'BELANJA'
  );
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    4,
    'Bidang Pemberdayaan Masyarakat Desa',
    'BELANJA'
  );
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    5,
    'Bidang Penanggulangan Bencana, Keadaan Darurat dan Mendesak Desa',
    'BELANJA'
  );
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (20, 'Pendapatan Asli Desa (PADes)', 'PENDAPATAN');
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (21, 'Dana Desa (DD)', 'PENDAPATAN');
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (22, 'Alokasi Dana Desa (ADD)', 'PENDAPATAN');
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (23, 'Bagi Hasil Pajak & Retribusi', 'PENDAPATAN');
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    24,
    'Bantuan Keuangan Provinsi/Kabupaten',
    'PENDAPATAN'
  );
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (30, 'Penerimaan Pembiayaan (SiLPA)', 'PEMBIAYAAN');
INSERT INTO
  `apbdes_kategori` (`id`, `nama_kategori`, `jenis`)
VALUES
  (
    31,
    'Pengeluaran Pembiayaan (Penyertaan Modal)',
    'PEMBIAYAAN'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: balita_kms
# ------------------------------------------------------------

INSERT INTO
  `balita_kms` (
    `id`,
    `nik`,
    `posyandu_id`,
    `nama`,
    `nama_ibu`,
    `jenis_kelamin`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`
  )
VALUES
  (
    1,
    '3520120101250001',
    1,
    'Ahmad Rafiq',
    'Nurul Hidayah',
    'L',
    18,
    10.8,
    82.5,
    'Normal'
  );
INSERT INTO
  `balita_kms` (
    `id`,
    `nik`,
    `posyandu_id`,
    `nama`,
    `nama_ibu`,
    `jenis_kelamin`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`
  )
VALUES
  (
    2,
    '3520120101250002',
    1,
    'Siti Aisyah',
    'Dewi Lestari',
    'P',
    24,
    11.5,
    86,
    'Normal'
  );
INSERT INTO
  `balita_kms` (
    `id`,
    `nik`,
    `posyandu_id`,
    `nama`,
    `nama_ibu`,
    `jenis_kelamin`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`
  )
VALUES
  (
    3,
    '3520120101250003',
    3,
    'Budi Santoso',
    'Wahyuni',
    'L',
    12,
    7.2,
    71,
    'Gizi Kurang'
  );
INSERT INTO
  `balita_kms` (
    `id`,
    `nik`,
    `posyandu_id`,
    `nama`,
    `nama_ibu`,
    `jenis_kelamin`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`
  )
VALUES
  (
    4,
    '3520120101250004',
    2,
    'Clara Putri',
    'Maria Ulfa',
    'P',
    36,
    14.2,
    96,
    'Normal'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: berita
# ------------------------------------------------------------

INSERT INTO
  `berita` (
    `id`,
    `judul`,
    `slug`,
    `ringkasan`,
    `konten`,
    `gambar`,
    `penulis`,
    `tanggal`,
    `isPublished`,
    `kategori`
  )
VALUES
  (
    1,
    'Kabar Membanggakan! Tim Penggerak PKK Desa Kediren Sabet Juara II Lomba PKK Tingkat Kabupaten Magetan',
    'desa-kediren-sabet-juara-ii-lomba-pkk-kabupaten-magetan',
    'Desa Kediren berhasil menorehkan prestasi gemilang dengan meraih Juara II dalam Lomba Gerakan PKK Tingkat Kabupaten Magetan tahun 2026.',
    '### Desa Kediren Raih Prestasi Gemilang! ?✨\nTP PKK Desa Kediren berhasil meraih Juara II Lomba PKK Tingkat Kabupaten Magetan tahun 2026 berkat digitalisasi Posyandu e-KMS.',
    '',
    'Admin Desa Kediren',
    '2026-05-28 13:54:44.663',
    1,
    'Prestasi'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: buku_kegiatan
# ------------------------------------------------------------

INSERT INTO
  `buku_kegiatan` (
    `id`,
    `pokja`,
    `nama`,
    `jabatan`,
    `tanggal`,
    `tempat`,
    `uraian`,
    `keterangan`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    4,
    'Ny. Luluk P',
    'Sekretaris Pokja IV',
    '2026-02-12 03:00:00.000',
    'Gedung Pertemuan Kelurahan Kediren',
    'Penyuluhan pengelolaan sampah secara mandiri di tingkat rumah tangga.',
    'Berjalan lancar',
    '2026-05-28 13:54:44.570',
    '2026-05-28 13:54:44.570'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: buku_notulen
# ------------------------------------------------------------

INSERT INTO
  `buku_notulen` (
    `id`,
    `pokja`,
    `tanggal`,
    `waktu`,
    `tempat`,
    `jenis_rapat`,
    `pimpinan_rapat_id`,
    `pembuat_notulen_id`,
    `jumlah_diundang`,
    `jumlah_hadir`,
    `jumlah_tidak_hadir`,
    `susunan_acara`,
    `kesimpulan`,
    `penutup`,
    `dokumentasi`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    4,
    '2026-05-15 00:00:00.000',
    '09:00 - 11:30 WIB',
    'Ruang Rapat PKK Desa Kediren',
    'Rapat Pleno Bulanan Pokja IV',
    1,
    1,
    25,
    22,
    3,
    '1. Pembukaan\n2. Pembahasan Lomba Jumantik\n3. Penutup',
    'Gerakan PSN hari Minggu besok.',
    'Selesai 11:30',
    '',
    '2026-05-28 13:54:44.600',
    '2026-05-28 13:54:44.600'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: buku_pelaksanaan
# ------------------------------------------------------------

INSERT INTO
  `buku_pelaksanaan` (
    `id`,
    `pokja`,
    `program_pokok`,
    `program_pokja`,
    `kegiatan`,
    `tujuan_kegiatan`,
    `sasaran`,
    `pelaksana`,
    `waktu`,
    `lokasi`,
    `output`,
    `outcome`,
    `monitoring_evaluasi`,
    `keterangan`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    4,
    'Kesehatan',
    'GKSTTB',
    'Penyuluhan Pengelolaan Sampah Rumah Tangga',
    'Meningkatkan pemahaman keluarga terkait pemilahan sampah',
    'Keluarga & Dasawisma',
    'Pokja IV dan Kader Lingkungan',
    '2026-05-02 00:00:00.000',
    'Balai Pertemuan Dusun Selungguh',
    'Pengetahuan pemilahan sampah meningkat',
    'Sampah dipilah-pilah sesuai jenisnya',
    'Monitoring bulanan',
    'Terbentuk kepengurusan Bank Sampah baru',
    '2026-05-28 13:54:44.550',
    '2026-05-28 13:54:44.550'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: buku_program_kerja
# ------------------------------------------------------------

INSERT INTO
  `buku_program_kerja` (
    `id`,
    `pokja`,
    `program_pokok`,
    `program_pokja`,
    `kegiatan`,
    `sasaran`,
    `lokasi`,
    `waktu_pelaksanaan`,
    `mitra`,
    `indikator_keberhasilan`,
    `keterangan`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    1,
    'Penghayatan dan Pengamalan Pancasila',
    'PAAR',
    'Penyuluhan Anti-Narkoba Remaja',
    'Remaja Dusun',
    'Balai Desa',
    '[1,6]',
    'Polsek',
    'Remaja memahami bahaya narkoba',
    '',
    '2026-05-28 13:54:44.526',
    '2026-05-28 13:54:44.526'
  );
INSERT INTO
  `buku_program_kerja` (
    `id`,
    `pokja`,
    `program_pokok`,
    `program_pokja`,
    `kegiatan`,
    `sasaran`,
    `lokasi`,
    `waktu_pelaksanaan`,
    `mitra`,
    `indikator_keberhasilan`,
    `keterangan`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    4,
    'Kesehatan',
    'GKSTTB',
    'Penyuluhan Posyandu Terintegrasi',
    'Ibu dan Balita',
    'RT 001 / RW 002 Dusun Selungguh',
    '[2,8]',
    'Puskesmas',
    'Balita stunting menurun',
    'Terintegrasi e-KMS',
    '2026-05-28 13:54:44.526',
    '2026-05-28 13:54:44.526'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: jabatan
# ------------------------------------------------------------

INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (1, 'KEPALA DESA', 'PEMERINTAH', 1, 1, NULL);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (2, 'SEKRETARIS DESA', 'PEMERINTAH', 2, 1, 1);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (3, 'KETUA BPD', 'BPD', 2, 2, NULL);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (4, 'KETUA LSM', 'LSM', 2, 3, NULL);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (5, 'KAUR KEUANGAN', 'PEMERINTAH', 3, 5, 2);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (6, 'KAUR UMUM', 'PEMERINTAH', 3, 6, 2);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (7, 'KAUR PERENCANAAN', 'PEMERINTAH', 3, 7, 2);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (8, 'KASI PEMERINTAHAN', 'PEMERINTAH', 3, 8, 1);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (9, 'KASI KESEJAHTERAAN', 'PEMERINTAH', 3, 9, 1);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (10, 'KASI PELAYANAN', 'PEMERINTAH', 3, 10, 1);
INSERT INTO
  `jabatan` (
    `id`,
    `nama_jabatan`,
    `kategori`,
    `level`,
    `urutan`,
    `parent_id`
  )
VALUES
  (11, 'KEPALA DUSUN', 'PEMERINTAH', 4, 1, 8);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: jadwal_posyandu
# ------------------------------------------------------------

INSERT INTO
  `jadwal_posyandu` (
    `id`,
    `posyandu_id`,
    `kader_id`,
    `tanggal`,
    `waktu`,
    `sasaran`
  )
VALUES
  (
    1,
    1,
    1,
    '2026-05-20 00:00:00.000',
    '08:00 - 11:00',
    'Balita & Ibu Hamil'
  );
INSERT INTO
  `jadwal_posyandu` (
    `id`,
    `posyandu_id`,
    `kader_id`,
    `tanggal`,
    `waktu`,
    `sasaran`
  )
VALUES
  (
    2,
    2,
    2,
    '2026-05-22 00:00:00.000',
    '08:30 - 11:30',
    'Lansia'
  );
INSERT INTO
  `jadwal_posyandu` (
    `id`,
    `posyandu_id`,
    `kader_id`,
    `tanggal`,
    `waktu`,
    `sasaran`
  )
VALUES
  (
    3,
    3,
    3,
    '2026-05-25 00:00:00.000',
    '08:00 - 11:00',
    'Balita & Ibu Hamil'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: kader_pkk
# ------------------------------------------------------------

INSERT INTO
  `kader_pkk` (
    `id`,
    `nik`,
    `nama`,
    `jabatan`,
    `area_tugas`,
    `kontak`,
    `is_active`
  )
VALUES
  (
    1,
    '3511111111110001',
    'Siti Aminah',
    'Ketua TP PKK',
    'Desa Kediren',
    '0812-3456-7890',
    1
  );
INSERT INTO
  `kader_pkk` (
    `id`,
    `nik`,
    `nama`,
    `jabatan`,
    `area_tugas`,
    `kontak`,
    `is_active`
  )
VALUES
  (
    2,
    '3511111111110002',
    'Rina Wati',
    'Kader Posyandu Lansia',
    'Dusun Pule',
    '0856-7890-1234',
    1
  );
INSERT INTO
  `kader_pkk` (
    `id`,
    `nik`,
    `nama`,
    `jabatan`,
    `area_tugas`,
    `kontak`,
    `is_active`
  )
VALUES
  (
    3,
    '3511111111110003',
    'Mujiati',
    'Kader Posyandu Balita',
    'Dusun Ngujung',
    '0821-2345-6789',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: kegiatan_pkk
# ------------------------------------------------------------

INSERT INTO
  `kegiatan_pkk` (
    `id`,
    `nama`,
    `kategori`,
    `sub_kategori`,
    `tanggal`,
    `lokasi`,
    `kader_id`,
    `deskripsi`,
    `dokumentasi`,
    `jumlah_hadir`,
    `sumber_dana`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'Penyuluhan Pola Asuh Anak & Remaja (PAAR)',
    'Pokja I',
    'Penghayatan Pancasila',
    '2026-05-10 00:00:00.000',
    'Balai Pertemuan Dusun Selungguh',
    1,
    'Penyuluhan interaktif mengenai pola asuh anak usia dini di era digital untuk mencegah kecanduan gadget dan kekerasan anak.',
    NULL,
    45,
    'Dana Desa (APBDes)',
    '2026-05-28 13:54:44.502',
    '2026-05-28 13:54:44.502'
  );
INSERT INTO
  `kegiatan_pkk` (
    `id`,
    `nama`,
    `kategori`,
    `sub_kategori`,
    `tanggal`,
    `lokasi`,
    `kader_id`,
    `deskripsi`,
    `dokumentasi`,
    `jumlah_hadir`,
    `sumber_dana`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    'Pelatihan Usaha UP2K Pembuatan Keripik Tempe Sagu',
    'Pokja II',
    'Pendidikan & Keterampilan',
    '2026-05-12 00:00:00.000',
    'Rumah Ketua TP PKK Dusun Sekadalan',
    1,
    'Pelatihan produksi kuliner inovatif keripik tempe sagu untuk meningkatkan pendapatan ekonomi mandiri ibu-ibu rumah tangga.',
    NULL,
    30,
    'UP2K Mandiri',
    '2026-05-28 13:54:44.510',
    '2026-05-28 13:54:44.510'
  );
INSERT INTO
  `kegiatan_pkk` (
    `id`,
    `nama`,
    `kategori`,
    `sub_kategori`,
    `tanggal`,
    `lokasi`,
    `kader_id`,
    `deskripsi`,
    `dokumentasi`,
    `jumlah_hadir`,
    `sumber_dana`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    3,
    'Lomba Pekarangan Hijau Sehat Hatinya PKK',
    'Pokja III',
    'Sandang, Pangan & Perumahan',
    '2026-05-14 00:00:00.000',
    'RT 002 / RW 001 Dusun Ledok',
    1,
    'Evaluasi pemanfaatan pekarangan rumah dengan kebun sayur mandiri, kolam ikan mini, dan tanaman obat keluarga (TOGA).',
    NULL,
    60,
    'Swadaya Masyarakat',
    '2026-05-28 13:54:44.516',
    '2026-05-28 13:54:44.516'
  );
INSERT INTO
  `kegiatan_pkk` (
    `id`,
    `nama`,
    `kategori`,
    `sub_kategori`,
    `tanggal`,
    `lokasi`,
    `kader_id`,
    `deskripsi`,
    `dokumentasi`,
    `jumlah_hadir`,
    `sumber_dana`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    4,
    'Sosialisasi PHBS dan Pembagian Paket Nutrisi PMT Stunting',
    'Pokja IV',
    'Kesehatan & Lingkungan',
    '2026-05-16 00:00:00.000',
    'Posyandu Mawar 1 Dusun Sekadalan',
    1,
    'Sosialisasi Perilaku Hidup Bersih & Sehat (PHBS) serta penyaluran telur, susu, dan biskuit PMT untuk 25 balita indikasi stunting.',
    NULL,
    55,
    'Dana CSR Puskesmas',
    '2026-05-28 13:54:44.522',
    '2026-05-28 13:54:44.522'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: keluarga
# ------------------------------------------------------------

INSERT INTO
  `keluarga` (
    `no_kk`,
    `kepala_keluarga_nik`,
    `alamat`,
    `dusun`,
    `rt`,
    `rw`,
    `kode_pos`,
    `kecamatan`,
    `kabupaten`,
    `provinsi`,
    `foto_kk`,
    `tanggal_diterbitkan`,
    `created_at`,
    `updated_at`,
    `wilayah_rt_id`
  )
VALUES
  (
    '3520032911190002',
    '3520030101800002',
    'SELUNGGUH',
    'KEDIREN',
    '006',
    '001',
    '63372',
    NULL,
    NULL,
    NULL,
    NULL,
    '2021-01-27',
    '2026-05-28 23:05:39.938',
    '2026-05-28 23:05:39.000',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: klasifikasi_surat
# ------------------------------------------------------------

INSERT INTO
  `klasifikasi_surat` (`id`, `kode`, `nama`)
VALUES
  (1, '400', 'Kesejahteraan Sosial');
INSERT INTO
  `klasifikasi_surat` (`id`, `kode`, `nama`)
VALUES
  (2, '470', 'Kependudukan & Pencatatan Sipil');
INSERT INTO
  `klasifikasi_surat` (`id`, `kode`, `nama`)
VALUES
  (3, '100', 'Pemerintahan Desa');
INSERT INTO
  `klasifikasi_surat` (`id`, `kode`, `nama`)
VALUES
  (4, '500', 'Perekonomian & Agraria');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: kms_pengukuran
# ------------------------------------------------------------

INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    1,
    1,
    '2024-11-20 00:00:00.000',
    0,
    3.2,
    50,
    'Normal',
    'Lahir Normal',
    'Bidan Desa',
    '2026-05-28 13:54:44.428'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    2,
    1,
    '2025-02-20 00:00:00.000',
    3,
    5.8,
    60,
    'Normal',
    'Imunisasi DPT 1',
    'Kader Posyandu',
    '2026-05-28 13:54:44.428'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    3,
    1,
    '2025-05-20 00:00:00.000',
    6,
    7.5,
    66,
    'Normal',
    'ASI Eksklusif',
    'Kader Posyandu',
    '2026-05-28 13:54:44.428'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    4,
    1,
    '2025-11-20 00:00:00.000',
    12,
    9.2,
    75,
    'Normal',
    'Imunisasi Campak',
    'Kader Posyandu',
    '2026-05-28 13:54:44.428'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    5,
    1,
    '2026-05-20 00:00:00.000',
    18,
    10.8,
    82.5,
    'Normal',
    'Aktif, PMT Lahap',
    'Kader Posyandu',
    '2026-05-28 13:54:44.428'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    6,
    2,
    '2024-05-20 00:00:00.000',
    0,
    3,
    49,
    'Normal',
    'Lahir Sehat',
    'Bidan Desa',
    '2026-05-28 13:54:44.464'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    7,
    2,
    '2024-11-20 00:00:00.000',
    6,
    7.2,
    64,
    'Normal',
    'Imunisasi Lengkap',
    'Kader Posyandu',
    '2026-05-28 13:54:44.464'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    8,
    2,
    '2025-05-20 00:00:00.000',
    12,
    9,
    74,
    'Normal',
    'Tumbuh Baik',
    'Kader Posyandu',
    '2026-05-28 13:54:44.464'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    9,
    2,
    '2026-05-20 00:00:00.000',
    24,
    11.5,
    86,
    'Normal',
    'Sangat Lincah, Vit A',
    'Kader Posyandu',
    '2026-05-28 13:54:44.464'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    10,
    3,
    '2025-05-20 00:00:00.000',
    0,
    3.1,
    49.5,
    'Normal',
    'Lahir Sehat',
    'Bidan Desa',
    '2026-05-28 13:54:44.468'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    11,
    3,
    '2025-09-20 00:00:00.000',
    4,
    5.2,
    58,
    'Normal',
    'Tumbuh Normal',
    'Kader Posyandu',
    '2026-05-28 13:54:44.468'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    12,
    3,
    '2026-01-20 00:00:00.000',
    8,
    6.3,
    65,
    'Gizi Kurang',
    'Nafsu Makan Turun',
    'Kader Posyandu',
    '2026-05-28 13:54:44.468'
  );
INSERT INTO
  `kms_pengukuran` (
    `id`,
    `balita_id`,
    `tanggal_ukur`,
    `usia_bulan`,
    `berat_badan`,
    `tinggi_badan`,
    `status_gizi`,
    `keterangan`,
    `petugas`,
    `created_at`
  )
VALUES
  (
    13,
    3,
    '2026-05-20 00:00:00.000',
    12,
    7.2,
    71,
    'Gizi Kurang',
    'Perlu Intervensi PMT',
    'Kader Posyandu',
    '2026-05-28 13:54:44.468'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: master_surat
# ------------------------------------------------------------

INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    21,
    'SKD',
    'Surat Keterangan Domisili',
    2,
    '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"keperluan\",\"label\":\"Keperluan\",\"type\":\"text\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:39.994'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    22,
    'SKU',
    'Surat Keterangan Usaha',
    4,
    '500/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"nama_usaha\",\"label\":\"Nama Usaha\",\"type\":\"text\",\"required\":true},{\"name\":\"jenis_usaha\",\"label\":\"Jenis Usaha\",\"type\":\"text\",\"required\":true},{\"name\":\"alamat_usaha\",\"label\":\"Alamat Usaha\",\"type\":\"textarea\",\"required\":true},{\"name\":\"sejak_tahun\",\"label\":\"Berdiri Sejak\",\"type\":\"number\",\"required\":false}]',
    NULL,
    1,
    '2026-05-28 16:05:39.999'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    23,
    'SKTM',
    'Surat Keterangan Tidak Mampu',
    1,
    '400/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"tujuan\",\"label\":\"Tujuan Penggunaan\",\"type\":\"text\",\"placeholder\":\"Contoh: Keringanan Biaya RS / Beasiswa\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:40.003'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    24,
    'SKCK',
    'Pengantar SKCK',
    2,
    '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"keperluan\",\"label\":\"Untuk Keperluan\",\"type\":\"text\",\"placeholder\":\"Contoh: Melamar Pekerjaan\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:40.006'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    25,
    'SK-BEDA-ID',
    'Surat Keterangan Beda Identitas',
    2,
    '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"identitas_salah\",\"label\":\"Identitas di Dokumen Salah\",\"type\":\"textarea\",\"required\":true},{\"name\":\"identitas_benar\",\"label\":\"Identitas yang Benar\",\"type\":\"textarea\",\"required\":true},{\"name\":\"nama_dokumen\",\"label\":\"Nama Dokumen Bermasalah\",\"type\":\"text\",\"placeholder\":\"Contoh: Ijazah SMA / Buku Nikah\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:40.009'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    26,
    'SK-HILANG',
    'Surat Keterangan Kehilangan',
    2,
    '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"barang_hilang\",\"label\":\"Barang / Dokumen yang Hilang\",\"type\":\"text\",\"required\":true},{\"name\":\"lokasi_hilang\",\"label\":\"Perkiraan Lokasi Hilang\",\"type\":\"text\",\"required\":false},{\"name\":\"waktu_hilang\",\"label\":\"Perkiraan Waktu Hilang\",\"type\":\"date\",\"required\":false}]',
    NULL,
    1,
    '2026-05-28 16:05:40.012'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    27,
    'F201',
    'Keterangan Kelahiran (F-2.01)',
    2,
    '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"nama_bayi\",\"label\":\"Nama Bayi\",\"type\":\"text\",\"required\":true},{\"name\":\"jk_bayi\",\"label\":\"Jenis Kelamin Bayi\",\"type\":\"select\",\"options\":[\"L\",\"P\"],\"required\":true},{\"name\":\"tgl_lahir_bayi\",\"label\":\"Tanggal Lahir Bayi\",\"type\":\"date\",\"required\":true},{\"name\":\"tempat_lahir_bayi\",\"label\":\"Tempat Lahir Bayi\",\"type\":\"text\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:40.016'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    28,
    'F229',
    'Keterangan Kematian (F-2.29)',
    2,
    '470/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"tgl_meninggal\",\"label\":\"Tanggal Meninggal\",\"type\":\"date\",\"required\":true},{\"name\":\"tempat_meninggal\",\"label\":\"Tempat Meninggal\",\"type\":\"text\",\"required\":true},{\"name\":\"sebab_meninggal\",\"label\":\"Sebab Meninggal\",\"type\":\"text\",\"required\":false}]',
    NULL,
    1,
    '2026-05-28 16:05:40.020'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    29,
    'SK-TANAH',
    'Surat Keterangan Riwayat Tanah',
    4,
    '500/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"no_persil\",\"label\":\"Nomor Persil\",\"type\":\"text\",\"required\":true},{\"name\":\"luas_tanah\",\"label\":\"Luas Tanah (m2)\",\"type\":\"number\",\"required\":true},{\"name\":\"batas_utara\",\"label\":\"Batas Utara\",\"type\":\"text\",\"required\":false},{\"name\":\"asal_usul\",\"label\":\"Asal Usul Kepemilikan\",\"type\":\"textarea\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:40.024'
  );
INSERT INTO
  `master_surat` (
    `id`,
    `kode_surat`,
    `nama_surat`,
    `klasifikasi_id`,
    `format_nomor`,
    `form_schema`,
    `template_content`,
    `is_active`,
    `created_at`
  )
VALUES
  (
    30,
    'SPT',
    'Surat Perintah Tugas (SPT)',
    3,
    '100/[NOMOR]/35.20.03.2001/[BULAN]/[TAHUN]',
    '[{\"name\":\"dasar_tugas\",\"label\":\"Dasar Perintah Tugas\",\"type\":\"textarea\",\"required\":true},{\"name\":\"tujuan_tugas\",\"label\":\"Maksud & Tujuan Tugas\",\"type\":\"textarea\",\"required\":true},{\"name\":\"lokasi_tujuan\",\"label\":\"Lokasi Tujuan\",\"type\":\"text\",\"required\":true},{\"name\":\"tgl_tugas\",\"label\":\"Tanggal Penugasan\",\"type\":\"date\",\"required\":true}]',
    NULL,
    1,
    '2026-05-28 16:05:40.027'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: mutasi
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: penduduk
# ------------------------------------------------------------

INSERT INTO
  `penduduk` (
    `nik`,
    `no_kk`,
    `nama_lengkap`,
    `tempat_lahir`,
    `tanggal_lahir`,
    `jenis_kelamin`,
    `agama`,
    `pendidikan_terakhir`,
    `pekerjaan`,
    `status_perkawinan`,
    `status_dalam_keluarga`,
    `golongan_darah`,
    `nama_ayah`,
    `nama_ibu`,
    `kewarganegaraan`,
    `foto`,
    `is_hidup`,
    `status_dasar`,
    `status_rekam`,
    `no_paspor`,
    `no_kitas`,
    `pin_hash`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    '3520030101800002',
    '3520032911190002',
    'SUPRIYANTO',
    'MAGETAN',
    '1980-10-10 00:00:00.000',
    'L',
    'ISLAM',
    'SLTA / SEDERAJAT',
    'WIRASWASTA',
    'KAWIN TERCATAT',
    'KEPALA KELUARGA',
    'TIDAK TAHU',
    'HADI SM',
    'LATINI',
    'WNI',
    NULL,
    1,
    'Hidup',
    'BELUM REKAM',
    '',
    '',
    NULL,
    '2026-05-28 16:05:39.944',
    '2026-05-28 16:05:39.944'
  );
INSERT INTO
  `penduduk` (
    `nik`,
    `no_kk`,
    `nama_lengkap`,
    `tempat_lahir`,
    `tanggal_lahir`,
    `jenis_kelamin`,
    `agama`,
    `pendidikan_terakhir`,
    `pekerjaan`,
    `status_perkawinan`,
    `status_dalam_keluarga`,
    `golongan_darah`,
    `nama_ayah`,
    `nama_ibu`,
    `kewarganegaraan`,
    `foto`,
    `is_hidup`,
    `status_dasar`,
    `status_rekam`,
    `no_paspor`,
    `no_kitas`,
    `pin_hash`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    '3520035001210002',
    '3520032911190002',
    'NAYLA ANINDA PUTRI',
    'MAGETAN',
    '2021-01-10 00:00:00.000',
    'P',
    'ISLAM',
    'TIDAK / BELUM SEKOLAH',
    'BELUM / TIDAK BEKERJA',
    'BELUM KAWIN',
    'ANAK',
    NULL,
    'SUPRIYANTO',
    'EKO APRILIA SARI',
    'WNI',
    NULL,
    1,
    'Hidup',
    'BELUM REKAM',
    '',
    '',
    NULL,
    '2026-05-28 16:05:39.944',
    '2026-05-28 16:05:39.944'
  );
INSERT INTO
  `penduduk` (
    `nik`,
    `no_kk`,
    `nama_lengkap`,
    `tempat_lahir`,
    `tanggal_lahir`,
    `jenis_kelamin`,
    `agama`,
    `pendidikan_terakhir`,
    `pekerjaan`,
    `status_perkawinan`,
    `status_dalam_keluarga`,
    `golongan_darah`,
    `nama_ayah`,
    `nama_ibu`,
    `kewarganegaraan`,
    `foto`,
    `is_hidup`,
    `status_dasar`,
    `status_rekam`,
    `no_paspor`,
    `no_kitas`,
    `pin_hash`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    '3520035004900002',
    '3520032911190002',
    'EKO APRILIA SARI',
    'MAGETAN',
    '1990-04-10 00:00:00.000',
    'P',
    'ISLAM',
    'SLTA / SEDERAJAT',
    'MENGURUS RUMAH TANGGA',
    'KAWIN TERCATAT',
    'ISTRI',
    NULL,
    'SUKARDI',
    'NUNUK INDAYANI',
    'WNI',
    NULL,
    1,
    'Hidup',
    'BELUM REKAM',
    '',
    '',
    NULL,
    '2026-05-28 16:05:39.944',
    '2026-05-28 16:05:39.944'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pengguna
# ------------------------------------------------------------

INSERT INTO
  `pengguna` (
    `id`,
    `username`,
    `password_hash`,
    `peran`,
    `nama_petugas`,
    `is_active`,
    `last_login`,
    `created_at`,
    `akses_modul`,
    `dusun_akses_id`,
    `rt_akses_id`
  )
VALUES
  (
    3,
    'admin',
    '$2a$10$JbV4Y5A9NEuqrFo4v7Sy7.8o0BkV65ZsOLYS8yfn9K89qEkEarqCO',
    'Admin',
    'Admin Utama Kediren',
    1,
    NULL,
    '2026-05-28 16:05:39.902',
    NULL,
    NULL,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: perangkat_desa
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: permohonan_surat
# ------------------------------------------------------------

INSERT INTO
  `permohonan_surat` (
    `id`,
    `nik_pemohon`,
    `master_surat_id`,
    `tanggal_ajuan`,
    `status_surat`,
    `keterangan_batal`,
    `keperluan`,
    `meta_data`,
    `created_at`
  )
VALUES
  (
    'cmppma0fl0001t0ts7sv8u9te',
    '3520030101800002',
    12,
    '2026-05-28 14:57:21.577',
    'Disetujui',
    'Silahkan ambil surat resmi Anda di kantor desa pada jam kerja.',
    'Persyaratan NPWP',
    '{\"nama_usaha\":\"ABADI JAYA\",\"jenis_usaha\":\"FOTOCOPY\",\"alamat_usaha\":\"Desa Kediren RT 06 RW 01\",\"sejak_tahun\":\"2018\"}',
    '2026-05-28 14:57:21.577'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: posyandu
# ------------------------------------------------------------

INSERT INTO
  `posyandu` (`id`, `nama`, `dusun`)
VALUES
  (1, 'Posyandu Mawar 1', 'Krajan');
INSERT INTO
  `posyandu` (`id`, `nama`, `dusun`)
VALUES
  (2, 'Posyandu Melati 2', 'Pule');
INSERT INTO
  `posyandu` (`id`, `nama`, `dusun`)
VALUES
  (3, 'Posyandu Kenanga 3', 'Ngujung');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: potensi_wisata
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: profil_desa
# ------------------------------------------------------------

INSERT INTO
  `profil_desa` (
    `id`,
    `nama_desa`,
    `kode_desa`,
    `kecamatan`,
    `kabupaten`,
    `provinsi`,
    `alamat`,
    `kode_pos`,
    `telepon`,
    `email`,
    `website`,
    `sejarah`,
    `visi`,
    `misi`,
    `instagram`,
    `facebook`,
    `nama_kepala_desa`,
    `nip_kepala_desa`,
    `logo_desa`,
    `hero_title`,
    `hero_subtitle`,
    `welcome_title`,
    `welcome_message`,
    `hero_image`,
    `welcome_image`,
    `running_text`,
    `slider_images`
  )
VALUES
  (
    1,
    'KEDIREN',
    '35.20.03.2001',
    'LEMBEYAN',
    'MAGETAN',
    'JAWA TIMUR',
    'Jl. Raya Kediren No. 01',
    '63372',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'DJAZULI',
    '-',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: program_kerja
# ------------------------------------------------------------

INSERT INTO
  `program_kerja` (
    `id`,
    `tahun`,
    `nama_program`,
    `deskripsi`,
    `lokasi`,
    `anggaran`,
    `sumber_dana`,
    `status`,
    `foto_progres`,
    `latitude`,
    `longitude`,
    `gambar`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    7,
    2026,
    'Pembangunan Jalan Lingkungan Dusun Kediren',
    NULL,
    'Dusun Kediren RT 06',
    200000000.00,
    'DANA DESA (DD)',
    'Selesai',
    NULL,
    -7.6789,
    111.4567,
    NULL,
    '2026-05-28 16:05:40.106',
    '2026-05-28 16:05:40.106'
  );
INSERT INTO
  `program_kerja` (
    `id`,
    `tahun`,
    `nama_program`,
    `deskripsi`,
    `lokasi`,
    `anggaran`,
    `sumber_dana`,
    `status`,
    `foto_progres`,
    `latitude`,
    `longitude`,
    `gambar`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    8,
    2026,
    'Pembangunan Drainase Jalan Utama',
    NULL,
    'Dusun Krajan',
    100000000.00,
    'DANA DESA (DD)',
    'Berjalan',
    NULL,
    -7.68,
    111.458,
    NULL,
    '2026-05-28 16:05:40.106',
    '2026-05-28 16:05:40.106'
  );
INSERT INTO
  `program_kerja` (
    `id`,
    `tahun`,
    `nama_program`,
    `deskripsi`,
    `lokasi`,
    `anggaran`,
    `sumber_dana`,
    `status`,
    `foto_progres`,
    `latitude`,
    `longitude`,
    `gambar`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    9,
    2026,
    'Rehabilitasi Gedung Posyandu',
    NULL,
    'Dusun Ngrayung',
    50000000.00,
    'ADD',
    'Rencana',
    NULL,
    NULL,
    NULL,
    NULL,
    '2026-05-28 16:05:40.106',
    '2026-05-28 16:05:40.106'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: riwayat_surat
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: surat_masuk
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: wilayah_dusun
# ------------------------------------------------------------

INSERT INTO
  `wilayah_dusun` (
    `id`,
    `nama`,
    `kepala_dusun_nik`,
    `kepala_dusun_nama`,
    `wakil_dusun_nik`,
    `wakil_dusun_nama`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'SELUNGGUH',
    '3520030101800002',
    'SUPRIYANTO',
    '3520030101800002',
    'SUPRIYANTO',
    '2026-05-28 15:56:26.576',
    '2026-05-28 16:26:01.686'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: wilayah_rt
# ------------------------------------------------------------

INSERT INTO
  `wilayah_rt` (
    `id`,
    `rt`,
    `rw`,
    `dusun_id`,
    `ketua_rt_nik`,
    `ketua_rt_nama`,
    `wakil_rt_nik`,
    `wakil_rt_nama`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    '006',
    '001',
    1,
    '3520030101800002',
    'SUPRIYANTO',
    '3520030101800002',
    'SUPRIYANTO',
    '2026-05-28 15:56:26.753',
    '2026-05-28 16:17:23.854'
  );
INSERT INTO
  `wilayah_rt` (
    `id`,
    `rt`,
    `rw`,
    `dusun_id`,
    `ketua_rt_nik`,
    `ketua_rt_nama`,
    `wakil_rt_nik`,
    `wakil_rt_nama`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    2,
    '001',
    '001',
    1,
    '3520030101800002',
    'SUPRIYANTO',
    '3520030101800002',
    'SUPRIYANTO',
    '2026-05-28 16:27:15.845',
    '2026-05-28 16:27:15.845'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
