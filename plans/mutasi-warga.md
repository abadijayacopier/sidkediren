# 🔄 Implementation Plan: Mutasi Warga (Desa Kediren)

Modul ini bertujuan untuk melacak setiap perubahan status warga (Lahir, Mati, Pindah) secara dinamis dan historis.

## 📅 PHASE 3: MUTASI WARGA

### 1. 🗄️ Database Schema Update (Prisma) -> ✅ DONE
- **Model Mutasi**: Tabel `mutasi` ditambahkan untuk histori kejadian.
- **Penduduk Update**: Relationship ditambahkan.

### 2. ⚙️ Server Actions & Logic
- [x] **`laporMutasi`**: Fungsi atomik untuk update status warga & simpan log.
- [ ] **`mutasiPecahKK`**: Fungsi untuk memindahkan warga ke nomor KK baru & membuat tabel keluarga baru secara otomatis.

### 3. 🧱 Alur Kerja Spesifik (Skenario Baru)

#### A. Warga Datang (Pindah Datang)
- **Proses:** Gunakan Form "Tambah Warga" dengan flag Mutasi.
- **Data Tambahan:** Mencatat "Alamat Asal" dan "Tanggal Datang".
- **Hasil:** Warga baru tercipta + Log Mutasi Datang tercipta.

#### B. Pecah KK (Warga Lama)
- **Proses:** Tombol Mutasi -> "Pecah KK".
- **Data Tambahan:** Input Nomor KK Baru, Alamat Baru, dan Jabatan (Kepala Keluarga).
- **Hasil:** Update `noKk` warga + Buat record baru di tabel `Keluarga` + Log Mutasi Pecah KK.

#### C. Arsip Digital (Opsional)
- **Fitur:** Upload scan/foto Kartu Keluarga (KK) saat pendaftaran warga baru atau pecah KK.

---

## 🛠️ Status Eksekusi
- [x] Perancangan Skema Database
- [x] Implementasi Server Actions Dasar
- [x] Pembuatan UI Sidebar & Halaman Utama Mutasi
- [ ] Pengembangan Form Pecah KK (Next)
- [ ] Integrasi Upload Berkas KK (Next)
