'use client';

import React, { useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { updateRiwayatSurat } from '@/app/actions/surat';
import DynamicForm from './DynamicForm';
import { useRouter } from 'next/navigation';

export default function EditForm({ data }: { data: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [keterangan, setKeterangan] = useState(data.keterangan || '');
  const [dynamicValues, setDynamicValues] = useState<Record<string, any>>(JSON.parse(data.metaData || '{}'));

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateRiwayatSurat(data.id, {
        keterangan,
        metaData: JSON.stringify(dynamicValues)
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/surat/riwayat');
      }, 1500);
    } catch (e) {
      console.error(e);
      alert('Gagal memperbarui arsip surat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
      {success && (
        <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
           <CheckCircle2 size={64} className="mb-4 animate-bounce" />
           <h3 className="text-2xl font-black uppercase tracking-widest">Update Berhasil!</h3>
           <p className="font-bold opacity-80 mt-2">Mengalihkan ke arsip...</p>
        </div>
      )}

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Keperluan Utama Surat</label>
        <textarea 
          placeholder="Tuliskan keperluan surat di sini..."
          className="w-full px-6 py-6 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg shadow-inner min-h-[140px] resize-none"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
        />
      </div>

      {data.masterSurat.formSchema && (
        <div className="space-y-6 pt-8 border-t border-slate-50">
           <div className="flex items-center gap-3 px-2">
             <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
             <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Informasi Atribut Khusus</h3>
           </div>
           <DynamicForm 
             schema={data.masterSurat.formSchema} 
             values={dynamicValues} 
             onChange={(name, val) => setDynamicValues((prev: Record<string, any>) => ({ ...prev, [name]: val }))} 
           />
        </div>
      )}

      <div className="pt-6">
        <button 
          onClick={handleUpdate}
          disabled={loading || success}
          className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-200 uppercase tracking-widest disabled:opacity-50 text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : (
            <>
              <Save size={20} />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
