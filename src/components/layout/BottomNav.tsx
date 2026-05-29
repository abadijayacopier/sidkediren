'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  PieChart,
  MoreHorizontal,
  X,
  Map,
  Settings,
  Store,
  HeartPulse,
  RefreshCcw,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  modulId?: string;
  matchFn?: (pathname: string) => boolean;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isSessionLoading = status === 'loading';
  const userRole = (session?.user as any)?.role;
  const userEmail = session?.user?.email;
  let aksesModul: string[] = [];
  try {
    const rawAkses = (session?.user as any)?.aksesModul;
    aksesModul = rawAkses ? JSON.parse(rawAkses) : [];
  } catch (e) {}

  const hasAccess = (modulId: string) => {
    if (isSessionLoading) return true;
    if (userRole?.toLowerCase() === 'admin' || userEmail === 'admin') return true;
    return aksesModul.includes(modulId);
  };

  // Close sheet on route change
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  // Close sheet on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSheetOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Primary tabs (max 5 shown in bottom bar)
  const primaryItems: NavItem[] = [
    {
      href: '/admin',
      icon: <LayoutDashboard size={20} />,
      label: 'Beranda',
      matchFn: (p) => p === '/admin',
    },
    {
      href: '/admin/penduduk',
      icon: <Users size={20} />,
      label: 'Warga',
      modulId: 'penduduk',
      matchFn: (p) => p.startsWith('/admin/penduduk'),
    },
    {
      href: '/admin/surat/buat',
      icon: <FileText size={20} />,
      label: 'Surat',
      modulId: 'surat',
      matchFn: (p) => p.startsWith('/admin/surat'),
    },
    {
      href: '/admin/settings/transparansi',
      icon: <PieChart size={20} />,
      label: 'APBDes',
      modulId: 'transparansi',
      matchFn: (p) => p.startsWith('/admin/settings/transparansi'),
    },
  ];

  // Filter by access
  const visiblePrimary = primaryItems.filter(
    (item) => !item.modulId || hasAccess(item.modulId)
  );

  // Secondary items (shown in "More" sheet)
  const secondaryItems: NavItem[] = [
    {
      href: '/admin/penduduk/mutasi',
      icon: <RefreshCcw size={20} />,
      label: 'Riwayat Mutasi',
      modulId: 'penduduk',
      matchFn: (p) => p === '/admin/penduduk/mutasi',
    },
    {
      href: '/admin/surat/riwayat',
      icon: <FileText size={20} />,
      label: 'Arsip Surat',
      modulId: 'surat',
      matchFn: (p) => p === '/admin/surat/riwayat',
    },
    {
      href: '/admin/surat/master',
      icon: <FileText size={20} />,
      label: 'Master Surat',
      modulId: 'surat',
      matchFn: (p) => p === '/admin/surat/master',
    },
    {
      href: '/admin/gis',
      icon: <Map size={20} />,
      label: 'Pemetaan GIS',
      modulId: 'gis',
      matchFn: (p) => p.startsWith('/admin/gis'),
    },
    {
      href: '/admin/settings/potensi',
      icon: <Store size={20} />,
      label: 'UMKM & Wisata',
      modulId: 'potensi',
      matchFn: (p) => p.startsWith('/admin/settings/potensi'),
    },
    {
      href: '/admin/pkk',
      icon: <Users size={20} />,
      label: 'Kegiatan PKK',
      modulId: 'pkk',
      matchFn: (p) => p.startsWith('/admin/pkk'),
    },
    {
      href: '/admin/posyandu',
      icon: <HeartPulse size={20} />,
      label: 'e-KMS & Posyandu',
      modulId: 'posyandu',
      matchFn: (p) => p.startsWith('/admin/posyandu'),
    },
    {
      href: '/admin/settings',
      icon: <Settings size={20} />,
      label: 'Pengaturan',
      modulId: 'pengaturan',
      matchFn: (p) => p === '/admin/settings' || p.startsWith('/admin/settings/profil'),
    },
  ];

  const visibleSecondary = secondaryItems.filter(
    (item) => !item.modulId || hasAccess(item.modulId)
  );

  const isActive = (item: NavItem) => item.matchFn?.(pathname) ?? false;
  const isMoreActive = visibleSecondary.some((item) => isActive(item));

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none">
        <div className="px-3 pb-3 pt-1">
          <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.08)] flex items-center justify-around px-1 py-1 relative overflow-hidden">
            {/* Subtle top gradient line */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

            {visiblePrimary.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center py-2 px-3 flex-1 min-w-0 group"
                >
                  <div className="relative">
                    {active && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -inset-1.5 bg-emerald-100 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        active ? 'text-emerald-600' : 'text-slate-400 group-active:text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 transition-colors duration-200 truncate max-w-full ${
                      active ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="bottomNavDot"
                      className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* More Button */}
            {visibleSecondary.length > 0 && (
              <button
                onClick={() => setIsSheetOpen(true)}
                className="relative flex flex-col items-center justify-center py-2 px-3 flex-1 min-w-0 group cursor-pointer"
              >
                <div className="relative">
                  {isMoreActive && !isSheetOpen && (
                    <motion.div
                      className="absolute -inset-1.5 bg-emerald-100 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      isMoreActive ? 'text-emerald-600' : 'text-slate-400 group-active:text-slate-600'
                    }`}
                  >
                    <MoreHorizontal size={20} />
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${
                    isMoreActive ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  Lainnya
                </span>
                {isMoreActive && !isSheetOpen && (
                  <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Sheet for "More" items */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-[61] lg:hidden"
            >
              <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.12)] max-h-[85vh] flex flex-col">
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-slate-200" />
                </div>

                {/* Sheet Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-base font-black text-slate-800">Menu Lainnya</h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Akses fitur tambahan
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Sheet Items - scrollable area */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-1">
                  {visibleSecondary.map((item, index) => {
                    const active = isActive(item);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                            active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              active
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <span className="font-semibold text-sm">{item.label}</span>
                          {active && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Logout in sheet */}
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-red-50 hover:text-red-600 active:bg-red-100 transition-all w-full cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <LogOut size={20} />
                      </div>
                      <span className="font-semibold text-sm">Keluar</span>
                    </button>
                  </div>

                  {/* Safe area spacer at bottom of scroll */}
                  <div className="h-4 shrink-0" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
