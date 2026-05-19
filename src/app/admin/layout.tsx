'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

function AdminFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-12 pt-6 pb-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
      <p>© {currentYear} <span className="font-bold text-slate-500">Pemerintah Desa Kediren</span>. Seluruh Hak Cipta Dilindungi.</p>
      <div className="flex gap-4 font-black uppercase tracking-widest text-[9px]">
        <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 shadow-inner">
          Admin Panel v2.1
        </span>
      </div>
    </footer>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <AdminFooter />
        </div>
      </main>
    </div>
  );
}
