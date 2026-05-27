'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Menu, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (v: boolean) => void }) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const userName = session?.user?.name || 'Admin';
  const userRole = session?.user?.role || 'Operator Desa';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
    </header>
  );
}
