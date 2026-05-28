'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportPendudukToExcel } from '@/app/actions/export';

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const base64 = await exportPendudukToExcel();
      
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const safeDate = new Date().toISOString().split('T')[0];
      link.download = `Data_Penduduk_Kediren_${safeDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengekspor data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm"
    >
      {loading ? (
        <Loader2 className="animate-spin text-emerald-600" size={18} />
      ) : (
        <Download size={18} className="text-emerald-600" />
      )}
      Ekspor Excel
    </button>
  );
}
