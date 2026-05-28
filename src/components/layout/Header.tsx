'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Menu, LogOut, Settings, Bell } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';
import { getPendingPermohonanSuratCount } from '@/app/actions/permohonan-surat';

export default function Header({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (v: boolean) => void }) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const [notifData, setNotifData] = useState<{ count: number, data: any[] }>({ count: 0, data: [] });
  
  const userEmail = session?.user?.email;
  const userName = session?.user?.name || 'Admin';
  const userRole = (session?.user as any)?.role || (userEmail === 'admin' ? 'Admin' : 'Operator Desa');

  const fetchNotifs = async () => {
    if (userRole === 'Warga') return; // Only admin checks
    try {
      const res = await getPendingPermohonanSuratCount();
      setNotifData(res);
    } catch (e) {
      console.error('Failed to fetch notifs', e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [userRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-slate-700 text-lg hidden sm:block">Selamat Datang, {userName.split(' ')[0]}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        {userRole !== 'Warga' && (
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen) fetchNotifs();
              }}
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer relative"
            >
              <Bell size={20} />
              {notifData.count > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Pemberitahuan</h3>
                  {notifData.count > 0 && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{notifData.count} Baru</span>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {notifData.data.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Tidak ada pemberitahuan baru
                    </div>
                  ) : (
                    notifData.data.map(notif => (
                      <Link 
                        key={notif.id}
                        href="/admin/surat/antrean"
                        onClick={() => setIsNotifOpen(false)}
                        className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <p className="text-xs font-bold text-slate-700">{notif.penduduk.namaLengkap}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Meminta <strong>{notif.masterSurat.namaSurat}</strong></p>
                        <p className="text-[9px] text-slate-400 mt-1">{new Date(notif.tanggalAjuan).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                      </Link>
                    ))
                  )}
                </div>

                {notifData.count > 0 && (
                  <div className="px-4 py-2 border-t border-slate-50">
                    <Link 
                      href="/admin/surat/antrean" 
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 text-center block w-full"
                    >
                      Lihat Semua Antrean
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{userName}</p>
            <p className="text-xs text-slate-500 italic">{userRole}</p>
          </div>
          
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner hover:bg-emerald-200 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <UserCircle size={28} />
          </button>

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-50 sm:hidden">
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              
              <div className="px-2 py-2 flex flex-col gap-1">
                <Link 
                  href="/admin/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  <Settings size={18} />
                  Pengaturan Akun
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                  Keluar Aplikasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
