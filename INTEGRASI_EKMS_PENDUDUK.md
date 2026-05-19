# 🔗 Integrasi e-KMS & Kependudukan Desa Kediren

> **Kabar Gembira!** Alur pendaftaran e-KMS sekarang telah **SINKRON 100%** secara otomatis dan terintegrasi penuh dengan database kependudukan Desa Kediren! ✨

Fitur **Smart Sync Integration** ini menghubungkan langsung modul pelayanan Posyandu dengan database induk **Daftar Warga (Penduduk)** untuk menyederhanakan tugas kader posyandu.

---

## 1. 🔗 Alur Pendaftaran e-KMS Balita (Sinkron Data Warga)

Saat Kader membuka modal pendaftaran balita, sekarang terdapat dua pilihan alur di sudut kanan atas:

### 🌟 Pilihan A: Ambil Data Warga (Sangat Direkomendasikan - Default)
*   **Dropdown Pintar**: Muncul pilihan pencarian anak balita kependudukan: `-- Cari Nama Balita / NIK --`. Dropdown ini otomatis memfilter dan memuat warga Desa Kediren yang berusia di bawah 5 tahun (di bawah 60 bulan) yang masih hidup secara *real-time*.
*   **Auto-Populate & Lock (Anti-Human Error)**: Ketika Kader memilih nama anak balita tersebut, sistem secara otomatis:
    1.  **Nama Balita** otomatis terisi sesuai database kependudukan.
    2.  **Nama Ibu** otomatis terisi sesuai nama ibu kandung yang terdaftar di database warga.
    3.  **Usia (Bulan) Terhitung Otomatis**: Sistem menghitung selisih bulan secara presisi dari tanggal lahir warga sampai hari ini. Kader tidak perlu menebak atau menghitung manual lagi!
    4.  **Auto-Select Posyandu berdasarkan Dusun**: Sistem mendeteksi dusun tempat keluarga anak tersebut tinggal (dari data kependudukan), lalu otomatis memilih posyandu penanggung jawab cakupan dusun tersebut (misal: tinggal di *Dusun Ngujung* $\rightarrow$ otomatis memilih *Posyandu Kenanga 3*).
    5.  **Data Terkunci (Locked Input)**: Seluruh input kependudukan ini otomatis berwarna abu-abu dan dikunci (*disabled*) demi menjaga integritas data kependudukan agar tetap sinkron 100% dan tidak terpecah.

### ✍️ Pilihan B: Input Manual (Untuk Warga Baru / Pendatang)
*   Jika anak balita tersebut merupakan pendatang baru atau belum sempat dicatat di data kependudukan desa oleh admin, Kader dapat berpindah ke mode **Input Manual** untuk mengetik secara bebas seluruh data dari awal seperti biasa.

---

## 2. 🗺️ Bagaimana Penambahan Posyandu dan Dusun Tersinkron?

Sistem mencocokkan kode wilayah administrasi dusun secara presisi:

*   **Pencocokan Wilayah**: Data master Posyandu memiliki relasi langsung dengan nama dusun tempat posyandu berada (*Ngujung*, *Krajan*, *Pule*).
*   **Dinamis**: Saat admin menambahkan warga baru di modul Daftar Warga dan menetapkan mereka tinggal di Dusun Ngujung, saat balita dari keluarga tersebut didaftarkan ke e-KMS, sistem secara dinamis mencocokkan kode wilayah dusun tersebut dengan `posyanduId` milik *Posyandu Kenanga 3* yang berada di Dusun Ngujung.
*   **Penyaringan Data (Filter)**: Opsi filter dusun di pojok kanan atas tabel posyandu juga tersinkronisasi dinamis. Memilih *"Dusun Ngujung"* akan menyaring daftar riwayat balita sekaligus jadwal posyandu yang berlangsung khusus di Dusun Ngujung saja.

---

## 🚀 Kesimpulan Manfaat

Dengan sistem integrasi sinkronisasi data ini:
1.  **Efisiensi Kerja**: Kader tidak perlu lagi mengetik ulang nama anak, nama ibu, dan menghitung usia bulan $\rightarrow$ **Semua instan dengan 1 klik**.
2.  **Kualitas Data**: Menghilangkan risiko kesalahan ketik nama atau NIK.
3.  **Integritas Laporan**: Memastikan laporan stunting dan KIA yang dihasilkan di Posyandu sinkron 1:1 dengan profil data penduduk di modul kependudukan utama.

---
*Dokumentasi Sistem Informasi Desa Kediren - 2026*
