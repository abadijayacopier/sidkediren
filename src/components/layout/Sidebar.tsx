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
  ChevronLeft,
  ChevronRight,
  Store,
  HeartPulse
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react'; // FIX BUG-06

export default function Sidebar({ 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: { 
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className={`bg-white/95 backdrop-blur-md lg:bg-white border-r border-slate-200 flex flex-col shrink-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-20 shadow-2xl lg:shadow-xl lg:shadow-slate-200/50 transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 shadow-sm z-50 transition-colors hidden lg:flex cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-6">
        <div className="flex items-center gap-3 text-emerald-600">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
            <LayoutDashboard size={18} />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-slate-800 text-lg tracking-tight leading-none">
                SID Kediren
              </span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
                Sistem Informasi Desa
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar border-t border-slate-50 pt-4">
        <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/admin'} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />

        {/* Menu Kependudukan */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] mt-6 mb-1 whitespace-nowrap">
              Kependudukan
            </div>
          ) : (
            <div className="h-px bg-slate-100 my-4 mx-2" />
          )}
          <SidebarLink href="/admin/penduduk" icon={<Users size={20} />} label="Daftar Warga" active={pathname === '/admin/penduduk'} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
          <SidebarLink href="/admin/penduduk/mutasi" icon={<RefreshCcw size={20} />} label="Riwayat Mutasi" active={pathname === '/admin/penduduk/mutasi'} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
        </div>

        {!isCollapsed ? (
          <div className="pt-6 mb-1">
            <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">Layanan Desa</p>
          </div>
        ) : (
          <div className="h-px bg-slate-100 my-4 mx-2" />
        )}

        {/* Persuratan */}
        <div className="space-y-1">
          <SidebarCollapse
            icon={<FileText size={20} />}
            label="Manajemen Surat"
            active={pathname.startsWith('/admin/surat')}
            isCollapsed={isCollapsed}
            onSubItemClick={() => setIsMobileOpen(false)}
            subItems={[
              { href: '/admin/surat/buat', label: 'Buat Surat' },
              { href: '/admin/surat/riwayat', label: 'Arsip Surat' },
              { href: '/admin/surat/master', label: 'Master Surat' },
            ]}
          />
        </div>

        <SidebarLink href="/admin/settings/transparansi" icon={<PieChart size={20} />} label="Transparansi" active={pathname.startsWith('/admin/settings/transparansi')} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
        
        {/* FIX BUG-11: Activated missing features */}
        <SidebarLink href="/admin/gis" icon={<Map size={20} />} label="Pemetaan GIS" active={pathname.startsWith('/admin/gis')} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />

        {!isCollapsed ? (
          <div className="pt-6 mb-1">
            <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] whitespace-nowrap">Sosial & Ekonomi</p>
          </div>
        ) : (
          <div className="h-px bg-slate-100 my-4 mx-2" />
        )}
        <SidebarLink href="/admin/settings/potensi" icon={<Store size={20} />} label="UMKM & Wisata" active={pathname.startsWith('/admin/settings/potensi')} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
        <SidebarLink href="/admin/pkk" icon={<Users size={20} />} label="Kegiatan PKK" active={pathname.startsWith('/admin/pkk')} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
        <SidebarLink href="/admin/posyandu" icon={<HeartPulse size={20} />} label="e-KMS & Posyandu" active={pathname.startsWith('/admin/posyandu')} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1 bg-white">
        <SidebarLink href="/admin/settings" icon={<Settings size={20} />} label="Pengaturan" active={pathname.startsWith('/admin/settings')} isCollapsed={isCollapsed} onClick={() => setIsMobileOpen(false)} />
        
        {/* FIX BUG-06: Attached onClick handler with signOut */}
        <button 
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-semibold group"
        >
          <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </motion.aside>
  );
}

function SidebarCollapse({ icon, label, active = false, isCollapsed = false, subItems, onSubItemClick }: { icon: React.ReactNode, label: string, active?: boolean, isCollapsed?: boolean, subItems: { href: string, label: string }[], onSubItemClick?: () => void }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(active);

  return (
    <div className="space-y-1">
      <button
        onClick={() => !isCollapsed && setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm w-full group ${active
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          } ${isCollapsed ? 'justify-center' : ''}`}
      >
        <span className="shrink-0">{icon}</span>
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="text-slate-400"
            >
              <ChevronLeft size={14} className="-rotate-90" />
            </motion.span>
          </>
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:ml-3 transition-all z-[100] whitespace-nowrap shadow-xl">
            {label}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-10 pr-2 space-y-1"
          >
            {subItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onSubItemClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${pathname === item.href
                  ? 'text-emerald-600 bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${pathname === item.href ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false, isCollapsed = false, disabled = false, onClick }: { href: string, icon: React.ReactNode, label: string, active?: boolean, isCollapsed?: boolean, disabled?: boolean, onClick?: () => void }) {
  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="whitespace-nowrap"
        >
          {label} {disabled && <span className="ml-2 text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-sm uppercase font-black">Soon</span>}
        </motion.span>
      )}

      {/* Tooltip for Collapsed State */}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:ml-3 transition-all z-[100] whitespace-nowrap shadow-xl">
          {label} {disabled && "(Soon)"}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
        </div>
      )}
    </>
  );

  const baseClasses = `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm relative group ${isCollapsed ? 'justify-center' : ''}`;
  
  if (disabled) {
    return (
      <div className={`${baseClasses} text-slate-300 cursor-not-allowed`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${active
        ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
    >
      {content}
    </Link>
  );
}
