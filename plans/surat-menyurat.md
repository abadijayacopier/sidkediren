# Pelaksanaan Fitur Surat Menyurat Desa Kediren

Fitur ini bertujuan untuk mengotomatisasi pembuatan surat-surat resmi desa sesuai standar Kemendes dan Kemendagri, terintegrasi dengan database kependudukan, dan memiliki sistem pengarsipan yang rapi.

## 1. Perubahan Basis Data (Prisma)

### Model Baru: `ProfilDesa`
Menyimpan informasi identitas desa untuk Kop Surat dan Penandatangan.
- Nama Desa, Kode Desa, Kecamatan, Kabupaten, Provinsi.
- Alamat, Kode Pos, Telepon, Email, Website.
- Nama Kepala Desa, NIP (jika ada), Tanda Tangan Digital (Path).
- Logo Desa (Path).

### Model Baru: `KlasifikasiSurat`
Menyimpan referensi kode klasifikasi arsip berdasarkan Permendagri 83/2022.
- Kode (contoh: 400.7.2.1)
- Nama Klasifikasi (contoh: Surat Keterangan)

### Pembaruan Model: `MasterSurat`
- Hubungkan ke `KlasifikasiSurat`.
- Tambahkan field `templateContent` (JSON/Markdown) jika diperlukan.

### Pembaruan Model: `RiwayatSurat`
- Tambahkan field `qrCodeData` untuk verifikasi.
- Tambahkan field `metaData` (JSON) untuk menyimpan variabel dinamis surat.

## 2. Struktur Folder & Routing

```text
src/app/admin/surat/
├── page.tsx            # Dashboard Persuratan (Stats & Quick Access)
├── buat/               # Alur pembuatan surat baru
│   └── page.tsx        # Pilih jenis surat & Cari Penduduk
├── riwayat/            # Daftar arsip surat keluar
│   └── page.tsx
├── preview/            # Halaman High-Fidelity Print Preview
│   └── [id]/page.tsx
└── pengaturan/         # Pengaturan Kop & Master Surat
    └── page.tsx
```

## 3. Fitur Utama

### A. Auto-Numbering (Kemendagri)
Format: `[Kode Klasifikasi] / [Nomor Urut] / [Kode Wilayah] / [Bulan Romawi] / [Tahun]`
Sistem akan otomatis menghitung `Nomor Urut` berdasarkan surat terakhir di tahun berjalan.

### B. Integrasi Data Penduduk
Pencarian penduduk berdasarkan NIK/Nama untuk mengisi otomatis variabel:
- Nama, Tempat/Tgl Lahir, Kelamin, Pekerjaan, Alamat, dll.

### C. High-Fidelity Print Preview
- Layout A4 standar dinas.
- Kop Surat resmi dengan logo daerah & desa.
- QR Code dinamis untuk validasi keaslian surat.

### D. Arsip Digital
- Setiap surat yang dicetak otomatis tersimpan dalam `RiwayatSurat`.
- Filter berdasarkan jenis surat, tanggal, atau pemohon.

## 4. Langkah Implementasi

- [ ] **Langkah 1**: Update `schema.prisma` dan jalankan migrasi.
- [ ] **Langkah 2**: Seeding data `KlasifikasiSurat` (Permendagri 83/2022) & `MasterSurat` standar Kemendes.
- [ ] **Langkah 3**: Buat Server Actions untuk CRUD Profil Desa & Logika Penomoran.
- [ ] **Langkah 4**: Implementasi UI Dashboard & Form Buat Surat.
- [ ] **Langkah 5**: Implementasi UI Print Preview (High-Fidelity).
- [ ] **Langkah 6**: Integrasi QR Code & Final Testing.
