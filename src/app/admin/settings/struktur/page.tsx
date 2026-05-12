import { redirect } from 'next/navigation';

export default function DeprecatedStrukturPage() {
  // Halaman ini sudah dipindahkan ke tab Struktur di dalam Pengaturan Profil Desa.
  // Redirect otomatis pengunjung ke halaman yang baru agar tidak bingung.
  redirect('/admin/settings/profil');
}
