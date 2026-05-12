'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
    >
      <Printer size={18} />
      <span>Cetak Surat</span>
    </button>
  );
}
