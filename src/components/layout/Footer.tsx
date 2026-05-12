'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400">
      <div className="text-[11px] font-bold tracking-wider uppercase">
        &copy; {new Date().getFullYear()} SID KEDIREN. ALL RIGHTS RESERVED.
      </div>
      <div className="flex items-center gap-8">
        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-tighter shadow-sm">
          VERSION V2026.1.0.1
        </div>
      </div>
    </footer>
  );
}
