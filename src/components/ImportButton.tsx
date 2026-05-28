'use client';

import React, { useRef, useState } from 'react';
import { Upload, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import { importPendudukFromExcel, downloadTemplateExcel } from '@/app/actions/import';
import Swal from 'sweetalert2';

export default function ImportButton() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      const base64 = await downloadTemplateExcel();
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
      link.download = `Template_Import_Penduduk.xlsx`;
      link.click();
    } catch (err) {
      Swal.fire('Gagal!', 'Gagal mengunduh template.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      Swal.fire('Format Salah', 'Pastikan Anda mengunggah file Excel (.xlsx atau .xls).', 'warning');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await importPendudukFromExcel(formData);
      
      if (res?.success) {
        Swal.fire(
          'Berhasil!', 
          `Berhasil mengimpor ${res.imported} data warga.${res.failed ? ` (Gagal: ${res.failed} baris)` : ''}`, 
          'success'
        );
      } else {
        Swal.fire('Gagal', res?.message || 'Gagal mengimpor data.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan sistem saat mengimpor.', 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={handleDownloadTemplate}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-bold text-sm shadow-sm"
          title="Unduh Template Excel"
        >
          {downloading ? <Loader2 className="animate-spin" size={18} /> : <FileSpreadsheet size={18} className="text-blue-600" />}
          <span className="hidden sm:inline">Template</span>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all font-bold text-sm shadow-sm"
        >
          {loading ? <Loader2 className="animate-spin text-indigo-600" size={18} /> : <Upload size={18} className="text-indigo-600" />}
          Import Excel
        </button>
      </div>
    </div>
  );
}
