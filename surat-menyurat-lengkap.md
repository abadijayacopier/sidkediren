# Rencana Implementasi Modul Surat-Menyurat Lengkap
## Desa Digital Kediren - Kabupaten Magetan

> **STATUS PROYEK:** ⏳ **PLANNING PHASE (P0)**
> Rencana komprehensif untuk membangun modul persuratan dua arah terintegrasi (Surat Masuk & Surat Keluar), dilengkapi dengan Portal Pengajuan Warga Online, sistem antrean persetujuan admin, dan verifikasi QR Code keaslian dokumen secara publik.

---

## 📋 1. Ringkasan Fitur & Spesifikasi (Overview)

Modul ini dikembangkan untuk mendigitalisasi alur surat dinas di Kantor Desa Kediren secara 360 derajat. Berdasarkan pilihan arsitektur, modul ini akan mencakup tiga subsistem utama:

1.  **📥 Subsistem Surat Masuk**: Registrasi surat masuk resmi dari luar (instansi/kementerian), upload berkas scan surat (PDF/Gambar), klasifikasi kearsipan dinas, serta pembuatan disposisi tugas digital ke perangkat desa.
2.  **👥 Portal Pengajuan Mandiri Warga**: Halaman publik bagi warga Desa Kediren untuk mencari NIK mereka, mengisi formulir pengajuan surat dinamis (seperti SKU, SKD, SKTM), dan mengirimkannya secara digital.
3.  **🔄 Antrean & Validasi Admin**: Dashboard peninjauan permohonan surat masuk dari warga bagi admin desa untuk memvalidasi kelayakan berkas, mengubah status (*Disetujui/Ditolak*), menerbitkan nomor surat otomatis, serta mencetak surat dengan **Kop Resmi Desa & QR Code Keaslian**.
4.  **🔍 Halaman Verifikasi Publik**: Halaman verifikasi publik `/layanan/verifikasi/[id]` yang menampilkan keabsahan surat ketika QR Code pada print-out fisik surat di-scan oleh pihak ketiga (misal: Bank, BPJS).

---

## 🏗️ 2. Spesifikasi Teknis & Stack

*   **Tipe Proyek**: Web Application (Next.js 15 App Router)
*   **Database & ORM**: MySQL & Prisma ORM
*   **Keamanan**: Validasi NIK & No KK secara real-time dari database kependudukan induk desa untuk pengajuan online guna mencegah spam.
*   **Cetak Fisik**: CSS Print `@media print` presisi tinggi dengan standarisasi margin dinas kertas F4/A4, didukung dengan tombol unduh file arsip.

---

## 📁 3. Struktur File Baru

Implementasi ini akan menambahkan file-file baru di bawah ini:

```plaintext
d:\WEB\desa\
├── prisma/
│   └── schema.prisma                 # Modifikasi tabel SuratMasuk & PermohonanSurat
├── src/app/
│   ├── actions/
│   │   ├── surat-masuk.ts            # Server Actions untuk CRUD Surat Masuk & Disposisi
│   │   └── permohonan-surat.ts       # Server Actions untuk Pengajuan Online Warga
│   ├── admin/
│   │   └── surat/
│   │       ├── masuk/                # Dashboard CRUD Surat Masuk & Disposisi
│   │       │   └── page.tsx
│   │       └── antrean/              # Dashboard Verifikasi Pengajuan Surat Warga
│   │           └── page.tsx
│   ├── layanan/
│   │   ├── pengajuan/                # Portal Publik Pengajuan Surat Mandiri
│   │   │   └── page.tsx
│   │   └── verifikasi/
│   │       └── [id]/                 # Halaman Verifikasi Keaslian Dokumen (QR Scan)
│   │           └── page.tsx
│   └── components/
│       └── surat/
│           ├── SuratMasukForm.tsx    # Komponen Form Registrasi Surat Masuk
│           └── DisposisiModal.tsx    # Modal untuk menerbitkan lembar disposisi
```

---

## 🛠️ 4. Langkah Detil Perubahan Skema Database (`prisma/schema.prisma`)

Kita akan menambahkan dua model baru dan menghubungkannya dengan model yang sudah ada:

```prisma
// --- UPDATE PERSURATAN ---

model SuratMasuk {
  id              Int            @id @default(autoincrement())
  nomorSurat      String         @map("nomor_surat") @db.VarChar(100)
  tanggalSurat    DateTime       @map("tanggal_surat")
  tanggalDiterima DateTime       @default(now()) @map("tanggal_diterima")
  pengirim        String         @db.VarChar(200)
  perihal         String         @db.Text
  klasifikasiId   Int?           @map("klasifikasi_id")
  fileScan        String?        @map("file_scan") @db.Text // URL/Base64 berkas surat
  disposisiKepada String?        @map("disposisi_kepada") @db.VarChar(150) // Perangkat desa yang ditugaskan
  catatanDisposisi String?       @map("catatan_disposisi") @db.Text
  statusDisposisi String         @default("Belum Diproses") @map("status_disposisi") @db.VarChar(50)
  
  klasifikasi     KlasifikasiSurat? @relation(fields: [klasifikasiId], references: [id])
  createdAt       DateTime       @default(now()) @map("created_at")

  @@map("surat_masuk")
}

model PermohonanSurat {
  id              String       @id @default(cuid())
  nikPemohon      String       @map("nik_pemohon") @db.VarChar(16)
  masterSuratId   Int          @map("master_surat_id")
  tanggalAjuan    DateTime     @default(now()) @map("tanggal_ajuan")
  status          String       @default("Pending") @db.VarChar(30) // Pending, Disetujui, Ditolak
  keteranganBatal String?      @map("keterangan_batal") @db.Text
  keperluan       String       @db.Text
  metaData        String       @map("meta_data") @db.LongText // Data dinamis formulir (JSON)
  
  penduduk        Penduduk     @relation(fields: [nikPemohon], references: [nik])
  masterSurat     MasterSurat  @relation(fields: [masterSuratId], references: [id])
  createdAt       DateTime     @default(now()) @map("created_at")

  @@map("permohonan_surat")
}
```

---

## 🎯 5. Pembagian Tugas & Langkah Kerja (Task Breakdown)

### 📌 FASE 1: Foundation (Database & API)
*   **Task 1.1: Perubahan Schema Prisma**
    *   **Agent**: `database-architect`
    *   **Skill**: `prisma-expert`
    *   **Deskripsi**: Menambahkan model `SuratMasuk` dan `PermohonanSurat` pada `prisma/schema.prisma`, membuat relasi ke `KlasifikasiSurat` & `Penduduk`.
    *   **INPUT**: `prisma/schema.prisma` yang ada saat ini.
    *   **OUTPUT**: `prisma/schema.prisma` yang diperbarui dengan model baru.
    *   **VERIFY**: Jalankan `npx prisma validate` untuk memastikan tidak ada kesalahan syntax.
*   **Task 1.2: Database Synchronization**
    *   **Agent**: `database-architect`
    *   **Skill**: `powershell-windows`
    *   **Deskripsi**: Sinkronisasi model database baru ke engine MySQL lokal dengan aman.
    *   **INPUT**: Schema Prisma terbaru.
    *   **OUTPUT**: Struktur tabel baru di MySQL.
    *   **VERIFY**: Jalankan `npx prisma db push` diikuti oleh `npx prisma generate` dan pastikan compiler sukses 100%.
*   **Task 1.3: Server Actions Surat Masuk (`actions/surat-masuk.ts`)**
    *   **Agent**: `backend-specialist`
    *   **Skill**: `nodejs-best-practices`
    *   **Deskripsi**: Membangun Server Actions CRUD untuk Surat Masuk (`getSuratMasuk`, `createSuratMasuk`, `updateDisposisiSurat`, `deleteSuratMasuk`) dibungkus dengan `withDriftRetry`.
    *   **INPUT**: Akses Prisma Client.
    *   **OUTPUT**: File `src/app/actions/surat-masuk.ts`.
    *   **VERIFY**: Fungsi ekspor berhasil diimpor tanpa kendala kompilasi TypeScript.
*   **Task 1.4: Server Actions Permohonan Online Warga (`actions/permohonan-surat.ts`)**
    *   **Agent**: `backend-specialist`
    *   **Skill**: `api-patterns`
    *   **Deskripsi**: Membangun Server Actions untuk alur pengajuan mandiri warga, validasi kecocokan NIK, serta alur persetujuan admin (`submitPermohonanWarga`, `getAntreanPermohonan`, `prosesPersetujuanPermohonan`).
    *   **INPUT**: Akses kependudukan & model permohonan.
    *   **OUTPUT**: File `src/app/actions/permohonan-surat.ts`.
    *   **VERIFY**: Pembuatan record baru diuji berhasil membuat status "Pending" secara default.

---

### 📌 FASE 2: Frontend & UI (Layanan Publik & Admin)
*   **Task 2.1: Portal Pengajuan Publik (`layanan/pengajuan/page.tsx`)**
    *   **Agent**: `frontend-specialist`
    *   **Skill**: `frontend-design`
    *   **Deskripsi**: Membuat halaman publik eksklusif dengan gradasi hijau tua keemasan khas alam Kediren (`from-[#2d5a27] to-[#154212]`). Warga dapat memilih Jenis Surat, memverifikasi NIK & Nama Ibu Kandung, lalu mengisi formulir variabel dinamis surat sebelum dikirim.
    *   **INPUT**: Server actions permohonan surat & daftar template master surat.
    *   **OUTPUT**: File `src/app/layanan/pengajuan/page.tsx` terintegrasi dengan layout navbar publik.
    *   **VERIFY**: Form memvalidasi bahwa NIK harus ada di database warga, jika salah akan memunculkan alert informatif.
*   **Task 2.2: Dashboard Antrean Permohonan Admin (`admin/surat/antrean/page.tsx`)**
    *   **Agent**: `frontend-specialist`
    *   **Skill**: `react-best-practices`
    *   **Deskripsi**: Membuat antarmuka admin untuk mengelola pengajuan masuk dari warga. Admin dapat melihat isi data pemohon, menyetujui (otomatis membuat `RiwayatSurat` baru dan generate Nomor Surat resmi), atau menolak permohonan dengan menyertakan alasan pembatalan.
    *   **INPUT**: Daftar antrean permohonan.
    *   **OUTPUT**: File `src/app/admin/surat/antrean/page.tsx`.
    *   **VERIFY**: Tombol setujui langsung mengarahkan admin ke halaman preview cetak dengan data lengkap terisi otomatis.
*   **Task 2.3: Registrasi & Disposisi Surat Masuk (`admin/surat/masuk/page.tsx`)**
    *   **Agent**: `frontend-specialist`
    *   **Skill**: `ui-ux-pro-max`
    *   **Deskripsi**: Membuat halaman pencatatan arsip Surat Masuk desa. Admin dapat mencatat surat masuk, mengunggah file attachment dinamis, serta mengklik tombol "Terbitkan Disposisi" yang memunculkan modal penugasan kerja perangkat desa lengkap dengan lembar disposisi cetak siap pakai.
    *   **INPUT**: Server actions surat masuk.
    *   **OUTPUT**: Halaman `src/app/admin/surat/masuk/page.tsx` beserta komponen modal pendukung.
    *   **VERIFY**: Fungsi penambahan record baru menyimpan data scan file dengan benar.
*   **Task 2.4: Halaman Verifikasi Keaslian QR-Code (`layanan/verifikasi/[id]/page.tsx`)**
    *   **Agent**: `frontend-specialist`
    *   **Skill**: `seo-fundamentals`
    *   **Deskripsi**: Membuat halaman verifikasi keabsahan dokumen publik `/layanan/verifikasi/[id]` yang berdesain premium, menampilkan status surat (*"ASLI & TEREGISTRASI"*), nama pemohon, perihal surat, tanggal diterbitkan, dan tanda tangan digital Kepala Desa Kediren untuk meyakinkan pihak ketiga.
    *   **INPUT**: Parameter ID dari `RiwayatSurat`.
    *   **OUTPUT**: File `src/app/layanan/verifikasi/[id]/page.tsx`.
    *   **VERIFY**: Melakukan pencocokan ID riwayat surat dinamis, jika ID tidak valid akan memunculkan banner status tidak sah.

---

## 🔍 6. Phase X: Rencana Pengujian Akhir & Verifikasi Mutu

Setelah pengerjaan selesai, kita wajib mengeksekusi rangkaian verifikasi berikut sebelum menandai pekerjaan selesai:

1.  **Build Verification**:
    ```powershell
    npm run build
    ```
    *Harus berhasil terkompilasi 100% tanpa adanya type-error TypeScript atau warning chunk.*
2.  **Lint Verification**:
    ```powershell
    npm run lint
    ```
    *Harus bebas dari error ESLint.*
3.  **Security Audit**:
    ```powershell
    python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
    ```
    *Memastikan modul unggahan berkas scan surat masuk tidak memiliki celah keamanan path-traversal atau eksekusi biner.*
4.  **UX & Accessibility Audit**:
    *   [ ] Warna tombol aksi persetujuan menggunakan gradasi kontras tinggi (bukan ungu/violet hex codes).
    *   [ ] Input text dan select box mematuhi hukum Fitts dan memiliki touch target minimal `44px` untuk kemudahan kader di tablet/ponsel.
