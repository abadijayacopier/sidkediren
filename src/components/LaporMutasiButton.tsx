'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MutasiModal from './MutasiModal';

export default function LaporMutasiButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all font-bold text-sm shadow-xl shadow-emerald-100/50 border border-emerald-600 cursor-pointer animate-in fade-in"
      >
        <Plus size={20} /> Lapor Kejadian Mutasi
      </button>

      {isOpen && (
        <MutasiModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
