# 📖 Panduan Cara Kerja: Modul Mutasi Warga Kediren

Dokumen ini menjelaskan logika sistem dalam menangani berbagai kasus kependudukan di Desa Kediren.

---

## 1. Skenario: Pindah Datang (Warga Baru dari Luar Desa)
Kasus: Ada warga baru masuk ke desa dengan membawa berkas pindah dari daerah asal.

**Alur Kerja Sistem:**
1. **Input Data:** Operator menggunakan form "Tambah Warga".
2. **Identifikasi Mutasi:** Operator mengaktifkan pilihan "Pindah Datang".
3. **Data Historis:** Sistem meminta input "Alamat Asal" dan "Tanggal Masuk Desa".
4. **Eksekusi:**
   - Sistem membuat record **Penduduk** baru.
   - Sistem membuat record **Keluarga** baru (jika ia kepala keluarga baru).
   - Sistem membuat catatan di **Buku Mutasi** dengan label "Pindah Datang".

---

## 2. Skenario: Pecah KK (Warga Lama Jadi KK Baru)
Kasus: Anak yang menikah dan membuat KK sendiri, atau warga yang pecah kongsi KK.

**Alur Kerja Sistem:**
1. **Pencarian:** Cari warga lama di Daftar Warga.
2. **Trigger:** Klik tombol "Mutasi" -> Pilih "Pecah KK".
3. **Validasi:** Sistem akan meminta "Nomor KK Baru" yang resmi dari Dukcapil.
4. **Otomatisasi:**
   - Sistem **melepaskan** warga tersebut dari KK lamanya.
   - Sistem **membuatkan tabel Keluarga baru** dengan Nomor KK tersebut.
   - Sistem mengupdate status warga tersebut menjadi "Kepala Keluarga".
   - Sistem mencatat perpindahan ini di **Buku Mutasi** agar histori "Anak dari KK X sekarang jadi KK Y" tetap terlacak.

---

## 3. Skenario: Meninggal & Pindah Keluar
Kasus: Warga meninggal dunia atau pindah ke luar desa Kediren.

**Alur Kerja Sistem:**
1. **Trigger:** Klik tombol "Mutasi" pada warga yang bersangkutan.
2. **Update Status:** Pilih "Meninggal" atau "Pindah Keluar".
3. **Data Retention:**
   - Data warga **TIDAK DIHAPUS**.
   - Status Dasar berubah dari "Hidup" menjadi "Meninggal/Pindah".
   - Warga tersebut otomatis hilang dari Daftar Warga Aktif.
   - Nama warga muncul di **Laporan Mutasi Warga** sebagai arsip permanen.

---

## 🏁 Rencana Pengembangan Masa Depan
- **Arsip Digital:** Fitur upload scan/foto KK fisik sebagai bukti otentik di sistem.
- **Referensi Historis:** Mencatat hubungan NIK Kepala Keluarga lama saat terjadi Pecah KK.

