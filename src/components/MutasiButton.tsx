'use client';

import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import MutasiModal from './MutasiModal';

export default function MutasiButton({ warga }: { warga: { nik: string, namaLengkap: string } }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        title="Lapor Mutasi" 
        className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
      >
        <RefreshCcw size={16} />
      </button>

      {showModal && (
        <MutasiModal 
            warga={warga} 
            onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}
