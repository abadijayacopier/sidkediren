# Rencana Peningkatan e-KMS & Posyandu Premium Desa Kediren

> [!NOTE]
> Rencana ini dibuat untuk mengimplementasikan secara menyeluruh 4 fitur unggulan pada modul **e-KMS & Posyandu** agar menjadi sistem pemantauan tumbuh kembang balita terlengkap dan paling premium.

---

## 🚀 4 Fitur Utama yang Akan Diimplementasikan

### 1. Diferensiasi Jenis Kelamin Balita (Presisi WHO) 👶👧
*   **Database**: Menambahkan field `jenisKelamin` (`"L"` atau `"P"`) pada model `BalitaKms`.
*   **Z-Score WHO**: Mengubah logika hitung status gizi di client agar membedakan ambang batas median anak laki-laki dan perempuan berdasarkan kurva WHO Child Growth Standards.

### 2. Grafik Pertumbuhan Ganda (BB/U & TB/U - Stunting) 📊📐
*   **Grafik BB/U**: Kurva Berat Badan menurut Umur untuk memantau status gizi (Normal / Gizi Kurang / Gizi Buruk / Obesitas).
*   **Grafik TB/U**: Kurva Tinggi Badan menurut Umur untuk memantau deteksi dini stunting (Tinggi / Normal / Pendek / Sangat Pendek).
*   **Desain**: Pilihan tab di dalam modal KMS untuk berpindah kurva secara instan dengan gradasi visual yang interaktif.

### 3. Pencatatan Riwayat Timbang Bulanan (KIA Digital) 📈
*   **Database**: Membuat model relasional baru `KmsPengukuran` (`id`, `balitaId`, `tanggalUkur`, `usiaBulan`, `beratBadan`, `tinggiBadan`, `statusGizi`, `imunisasi`, `petugas`).
*   **Alur Kerja**: Kader dapat menambahkan entri timbangan baru untuk balita yang sama di setiap penimbangan bulanan Posyandu. Grafik KMS akan terisi dinamis sesuai titik-titik bulan pengukuran yang sebenarnya.
*   **Auto-Seeding**: Menyediakan data historis timbang bulanan (6 bulan ke belakang) untuk balita demo agar grafik langsung terisi indah sejak awal.

### 4. Fitur Cetak Kartu KMS Fisik 🖨️
*   **Desain Cetak**: Menambahkan tombol "Cetak KMS" yang memicu jendela print ramah kertas A4/F4 dengan layout super rapi, logo desa, grafik pertumbuhan, biodata lengkap, dan tanda tangan kader pengesah.

---

## 🛠️ Langkah-Langkah Teknis

### Fase 1: Pembaruan Skema Database (Prisma)
1. Edit [schema.prisma](file:///d:/WEB/desa/prisma/schema.prisma):
   * Tambahkan `jenisKelamin` pada `BalitaKms`.
   * Tambahkan model `KmsPengukuran`.
2. Jalankan sinkronisasi database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Fase 2: Peningkatan Server Actions
1. Edit [pkk.ts](file:///d:/WEB/desa/src/app/actions/pkk.ts):
   * Perbarui `saveBalita` untuk menerima parameter `jenisKelamin`.
   * Buat action baru `savePengukuran` untuk menyimpan timbangan bulanan.
   * Buat action baru `deletePengukuran` untuk menghapus entri timbangan yang salah input.
   * Tingkatkan `seedPkkData` untuk menyertakan riwayat timbangan bulanan (0-36 bulan) bagi balita bawaan agar kurvanya langsung meliuk estetik.

### Fase 3: Rekayasa Antarmuka Pengguna (UI/UX)
1. Edit [PosyanduDashboard.tsx](file:///d:/WEB/desa/src/app/admin/posyandu/PosyanduDashboard.tsx):
   * Tambahkan pilihan Jenis Kelamin (`Laki-laki` / `Perempuan`) di form pendaftaran balita baru.
   * Di modal Detail KMS, hadirkan tab interaktif: **Kurva Berat Badan (BB/U)** & **Kurva Tinggi Badan (TB/U)**.
   * Hadirkan form input penimbangan bulanan baru secara instan di dalam modal KMS, lengkap dengan daftar riwayat timbangan tabel mini di bawahnya.
   * Buat style cetak `@media print` khusus untuk merender lembar Kartu KMS premium yang rapi tanpa elemen navigasi admin.

---

## 🧪 Rencana Verifikasi
*   Verifikasi structural database dengan `npx prisma db push`.
*   Cek visualisasi grafik BB/U & TB/U serta deteksi jenis kelamin dengan browser subagent.
*   Uji proses penambahan timbangan bulanan secara interaktif.
