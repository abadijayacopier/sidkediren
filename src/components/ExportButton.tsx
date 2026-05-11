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
      
      // Proses download file dari base64
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
      link.download = `Data_Penduduk_Kediren_${new Date().toLocaleDateString('id-ID')}.xlsx`;
      link.click();
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
