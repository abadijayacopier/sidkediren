'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  RefreshCcw,
  FileText,
  Map,
  PieChart,
  Settings,
  LogOut,
  UserCircle,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="bg-white border-r border-slate-200 flex flex-col shrink-0 relative z-20 shadow-xl shadow-slate-200/50"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 shadow-sm z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
              <LayoutDashboard size={18} />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-slate-800 text-lg tracking-tight"
              >
                SID Kediren
              </motion.span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/admin'} isCollapsed={isCollapsed} />

          {/* Menu Kependudukan dengan Submenu */}
          <div className="space-y-1">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] mt-6 mb-1 whitespace-nowrap">
                Kependudukan
              </div>
            ) : (
              <div className="h-px bg-slate-100 my-4 mx-2" />
            )}
            <SidebarLink href="/admin/penduduk" icon={<Users size={20} />} label="Daftar Warga" active={pathname === '/admin/penduduk'} isCollapsed={isCollapsed} />
            <SidebarLink href="/admin/penduduk/mutasi" icon={<RefreshCcw size={20} />} label="Riwayat Mutasi" active={pathname === '/admin/penduduk/mutasi'} isCollapsed={isCollapsed} />
          </div>

          {!isCollapsed ? (
            <div className="pt-6 mb-1">
              <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">Layanan Desa</p>
            </div>
          ) : (
            <div className="h-px bg-slate-100 my-4 mx-2" />
          )}
          <SidebarLink href="/admin/surat" icon={<FileText size={20} />} label="Persuratan" active={pathname.startsWith('/admin/surat')} isCollapsed={isCollapsed} />
          <SidebarLink href="/admin/apbdes" icon={<PieChart size={20} />} label="Transparansi" active={pathname.startsWith('/admin/apbdes')} isCollapsed={isCollapsed} />
          <SidebarLink href="/admin/gis" icon={<Map size={20} />} label="Pemetaan GIS" active={pathname.startsWith('/admin/gis')} isCollapsed={isCollapsed} />

          {!isCollapsed ? (
            <div className="pt-6 mb-1">
              <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">Social & Ekonomi</p>
            </div>
          ) : (
            <div className="h-px bg-slate-100 my-4 mx-2" />
          )}
          <SidebarLink href="/admin/umkm" icon={<Settings size={20} />} label="UMKM & Wisata" active={pathname.startsWith('/admin/umkm')} isCollapsed={isCollapsed} />
          <SidebarLink href="/admin/pkk" icon={<Users size={20} />} label="PKK & Posyandu" active={pathname.startsWith('/admin/pkk')} isCollapsed={isCollapsed} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4 bg-white">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-semibold">
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Keluar</span>}
          </button>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 pt-2"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Developed By</p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                <p className="text-[11px] font-bold text-slate-700">Supriyanto Abadi Jaya</p>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Donasi RoKi ☕🚬</p>
                  <p className="text-[10px] font-mono font-black text-emerald-600 select-all">085655620979</p>
                  <p className="text-[9px] text-slate-400 italic">OVO / DANA / GOPAY</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
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

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>

          {/* Footer Statis */}
          <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400">
            <div className="text-[11px] font-bold tracking-wider uppercase">
              &copy; {new Date().getFullYear()} SID KEDIREN. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-8">
              <div className="text-[11px] font-bold tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                DEVELOPED BY <span className="font-black text-slate-600">SUPRIYANTO ABADI JAYA</span>
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-tighter shadow-sm">
                VERSION V2026.1.0.1
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false, isCollapsed = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean, isCollapsed?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm relative group ${active
          ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}

      {/* Tooltip for Collapsed State */}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:ml-3 transition-all z-[100] whitespace-nowrap shadow-xl">
          {label}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
        </div>
      )}
    </Link>
  );
}
