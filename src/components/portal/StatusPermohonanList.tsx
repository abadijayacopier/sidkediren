'use client';

import React, { useState } from 'react';
import { Eye, Edit2, Trash2, X, AlertCircle, Loader2, Clock, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cancelPermohonanSurat, updatePermohonanSurat } from '@/app/actions/warga';

export default function StatusPermohonanList({ permohonan }: { permohonan: any[] }) {
  const [viewing, setViewing] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit form states
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});
  const [editKeperluan, setEditKeperluan] = useState('');

  const handleCancel = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan permohonan ini?')) return;
    setDeletingId(id);
    try {
      await cancelPermohonanSurat(id);
      alert('Permohonan berhasil dibatalkan.');
    } catch (e: any) {
      alert(e.message || 'Gagal membatalkan permohonan');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (p: any) => {
    const meta = p.metaData ? JSON.parse(p.metaData) : {};
    setEditFormData(meta);
    setEditKeperluan(p.keperluan || '');
    setEditing(p);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append('keperluan', editKeperluan);
      data.append('dataJson', JSON.stringify(editFormData));
      await updatePermohonanSurat(editing.id, data);
      alert('Permohonan berhasil diperbarui.');
      setEditing(null);
    } catch (e: any) {
      alert(e.message || 'Gagal memperbarui permohonan');
    } finally {
      setLoading(false);
    }
  };

  if (permohonan.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-sm">Belum ada permohonan surat aktif.</div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {permohonan.map((p) => {
        const isPending = p.status === 'Pending';
        const isApproved = p.status === 'Disetujui';
        
        return (
          <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm">{p.masterSurat.namaSurat}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <p className="text-xs text-slate-500">{new Date(p.tanggalAjuan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <span className="text-slate-300">•</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isApproved ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {isApproved && <CheckCircle2 size={12} />}
                  {p.status === 'Ditolak' && <XCircle size={12} />}
                  {isPending && <Clock size={12} />}
                  {p.status}
                </span>
              </div>
              {p.status === 'Ditolak' && p.keteranganBatal && (
                <p className="text-[11px] text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg inline-block font-medium">Alasan Penolakan: {p.keteranganBatal}</p>
              )}
              {p.status === 'Disetujui' && p.keteranganBatal && (
                <div className="mt-2 inline-flex items-start gap-1.5 bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                  <Info size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                  <p className="text-[11px] text-emerald-700 font-medium">Catatan Admin: {p.keteranganBatal}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setViewing(p)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Lihat Detail"
              >
                <Eye size={18} />
              </button>
              
              {isPending && (
                <>
                  <button 
                    onClick={() => startEdit(p)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Pengajuan"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleCancel(p.id)}
                    disabled={deletingId === p.id}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Batalkan Pengajuan"
                  >
                    {deletingId === p.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* VIEW MODAL */}
      {viewing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Detail Permohonan</h3>
              <button onClick={() => setViewing(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jenis Surat</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{viewing.masterSurat.namaSurat}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keperluan</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{viewing.keperluan}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Data Formulir</p>
                {viewing.metaData && Object.keys(JSON.parse(viewing.metaData)).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(JSON.parse(viewing.metaData)).map(([key, val]: any) => (
                      <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm font-bold text-slate-800 mt-1">{val}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Tidak ada data tambahan.</p>
                )}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button onClick={() => setViewing(null)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Edit Permohonan</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="bg-amber-50 text-amber-700 p-3 rounded-xl flex items-start gap-3 text-xs mb-4">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>Hanya permohonan dengan status PENDING yang dapat diubah.</p>
              </div>

              {/* Dynamic form fields from masterSchema */}
              {editing.masterSurat.formSchema && JSON.parse(editing.masterSurat.formSchema).length > 0 && (
                JSON.parse(editing.masterSurat.formSchema).map((field: any) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px]"
                        value={editFormData[field.name] || ''}
                        onChange={(e) => setEditFormData({...editFormData, [field.name]: e.target.value})}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        required={field.required}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                        value={editFormData[field.name] || ''}
                        onChange={(e) => setEditFormData({...editFormData, [field.name]: e.target.value})}
                      />
                    )}
                  </div>
                ))
              )}

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Keperluan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px]"
                  value={editKeperluan}
                  onChange={(e) => setEditKeperluan(e.target.value)}
                />
              </div>

            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
