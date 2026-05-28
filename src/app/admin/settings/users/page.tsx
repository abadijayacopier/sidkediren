import { getPengguna } from '@/app/actions/pengguna';
import UserManagementClient from './UserManagementClient';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Manajemen Pengguna - Desa Digital',
};

export default async function UserManagementPage() {
  const users = await getPengguna();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna & Hak Akses</h1>
        <p className="text-slate-500 mt-1">Kelola akun administrator dan operator desa</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
        <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-semibold text-amber-800 text-sm">Informasi Hak Akses</h3>
          <ul className="list-disc list-inside text-sm text-amber-700 mt-1 space-y-1">
            <li><strong>Admin:</strong> Akses penuh ke seluruh modul sistem.</li>
            <li><strong>Kepala Desa:</strong> Akses baca (read-only) laporan dan statistik, persetujuan surat.</li>
            <li><strong>Kasi Pemerintahan:</strong> Mengelola kependudukan dan surat menyurat.</li>
            <li><strong>Operator:</strong> Input data harian, pelayanan warga.</li>
          </ul>
        </div>
      </div>

      <UserManagementClient initialUsers={users} />
    </div>
  );
}
