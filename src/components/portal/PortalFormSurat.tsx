'use client';

import React, { useState } from 'react';
import { ArrowLeft, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { submitPermohonanSurat } from '@/app/actions/warga';
import Link from 'next/link';

export default function PortalFormSurat({ master }: { master: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const formSchema = JSON.parse(master.formSchema || '[]');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [keperluan, setKeperluan] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('masterSuratId', master.id.toString());
      submitData.append('keperluan', keperluan);
      submitData.append('dataJson', JSON.stringify(formData));

      await submitPermohonanSurat(submitData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengajukan surat.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xl max-w-xl mx-auto mt-10">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Permohonan Terkirim!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Permohonan surat <strong className="text-slate-700">{master.namaSurat}</strong> Anda telah berhasil dikirim dan sedang menunggu verifikasi dari perangkat desa.
        </p>
        <Link 
          href="/portal"
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-md"
        >
          Kembali ke Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/portal/surat/buat" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">{master.namaSurat}</h1>
          <p className="text-slate-500 text-sm">Lengkapi formulir di bawah ini dengan data yang benar.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Dynamic Form Fields */}
          {formSchema.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              Tidak ada field tambahan untuk surat ini.
            </div>
          ) : (
            formSchema.map((field: any) => (
              <div key={field.name} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm min-h-[100px]"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    required={field.required}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                  />
                )}
              </div>
            ))
          )}

          {/* Keperluan */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Keperluan Pengajuan <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              placeholder="Contoh: Persyaratan melamar kerja di PT Maju Mundur"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm min-h-[80px]"
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
            />
          </div>

        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Kirim Permohonan
          </button>
        </div>
      </form>
    </div>
  );
}
