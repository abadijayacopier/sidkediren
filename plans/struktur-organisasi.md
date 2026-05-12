# Pelaksanaan Struktur Organisasi Desa Kediren

Fitur ini akan mengelola struktur kepemimpinan desa secara visual, terintegrasi dengan data penduduk, serta mendukung foto profil dan tanda tangan digital.

## 1. Perubahan Basis Data (Prisma)

### Model Baru: `Jabatan`
Menyimpan definisi posisi dalam organisasi.
- `id`: Int
- `namaJabatan`: String (Kades, Sekdes, dll)
- `kategori`: String (PEMERINTAH, BPD, LSM)
- `urutan`: Int (Untuk sorting)
- `parentId`: Int (Self-relation untuk hierarki)

### Model Baru: `PerangkatDesa`
Menghubungkan warga (Penduduk) dengan Jabatan.
- `id`: Int
- `jabatanId`: Int
- `nik`: String (FK ke Penduduk)
- `fotoProfil`: String?
- `tandaTanganDigital`: String?
- `status`: String (AKTIF, PURNA)

## 2. Struktur Folder & Routing

```text
src/app/admin/settings/struktur/
├── page.tsx            # Dashboard Pengelolaan Struktur
├── bagan/              # Halaman Visual Hierarchy Chart
│   └── page.tsx
└── [id]/edit/          # Form edit pejabat per jabatan
    └── page.tsx
```

## 3. Fitur Utama

### A. Visual Hierarchy Chart
- Menggunakan **Framer Motion** untuk animasi transisi.
- Layout kotak jabatan yang premium dengan foto profil & NIK.
- Garis penghubung hierarki otomatis.

### B. Integrasi NIK
- Saat memilih pejabat, admin cukup mencari NIK/Nama dari database penduduk.
- Data otomatis tersinkronisasi.

### C. Digital Workspace
- Upload foto profil khusus perangkat desa.
- Upload file TTD (PNG transparan) untuk diintegrasikan ke modul persuratan.

## 4. Langkah Implementasi

- [ ] **Langkah 1**: Update `schema.prisma` dan migrasi database.
- [ ] **Langkah 2**: Seeding data master Jabatan (Kades, Sekdes, Kaur, Kasi, Kasun, BPD, LSM).
- [ ] **Langkah 3**: Buat Server Actions untuk manajemen Perangkat Desa.
- [ ] **Langkah 4**: Implementasi UI Pengelolaan (CRUD).
- [ ] **Langkah 5**: Implementasi Visual Hierarchy Chart (High-Fidelity).
- [ ] **Langkah 6**: Integrasi TTD ke modul persuratan.
