'use client';

import { Trash2 } from 'lucide-react';
import { deletePenduduk } from '@/app/actions/penduduk';

export default function DeletePenduduk({ nik }: { nik: string }) {
  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus data warga ini?')) {
      await deletePenduduk(nik);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
      title="Hapus Data"
    >
      <Trash2 size={16} />
    </button>
  );
}
