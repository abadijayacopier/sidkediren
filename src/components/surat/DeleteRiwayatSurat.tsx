'use client';

import React, { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { deleteRiwayatSurat } from '@/app/actions/surat';

export default function DeleteRiwayatSurat({ id, nomorSurat }: { id: string, nomorSurat: string }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteRiwayatSurat(id);
      setShowConfirm(false);
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus arsip surat.');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 space-y-6 transform animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto shadow-inner">
            <AlertTriangle size={32} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-slate-800">Hapus Arsip Surat?</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              Anda akan menghapus arsip surat <span className="font-bold text-slate-700">{nomorSurat}</span> secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all text-xs uppercase tracking-widest shadow-lg shadow-rose-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      className="p-2.5 bg-white text-slate-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-slate-100"
      title="Hapus Arsip"
    >
      <Trash2 size={18} />
    </button>
  );
}
