'use client';

import React from 'react';
import { UserCircle, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500">
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-slate-700 text-lg">Selamat Datang, Admin</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">Operator Desa</p>
          <p className="text-xs text-slate-500 italic">Pemerintah Desa Kediren</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
          <UserCircle size={28} />
        </div>
      </div>
    </header>
  );
}
