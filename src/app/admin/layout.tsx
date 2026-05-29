'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';

function AdminFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-8 sm:mt-12 pt-4 sm:pt-6 pb-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-400 font-semibold">
      <p>© {currentYear} <span className="font-bold text-slate-500">Pemerintah Desa Kediren</span>. Seluruh Hak Cipta Dilindungi.</p>
      <div className="flex items-center gap-3 font-black uppercase tracking-widest text-[9px]">
        <a
          href="https://wa.me/6285655620979"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-emerald-600 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 normal-case font-bold text-[10px]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Dev. Supriyanto (085655620979)
        </a>
        <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-inner">
          SID Desa Kediren V 2.1
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Backdrop overlay for mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Page Content - extra pb on mobile for bottom nav clearance */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative flex flex-col pb-24 lg:pb-4">
          <div className="flex-1">
            {children}
          </div>
          <AdminFooter />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
