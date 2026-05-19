'use client';

import React from 'react';
import { UserCircle, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  
  // FIX BUG-07: Fallbacks if session is loading/not present
  const userName = session?.user?.name || 'Admin';
  const userRole = session?.user?.role || 'Operator Desa';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu handled mostly via CSS classes in a real implementation, 
            but adding active state placeholder for functionality */}
        <button 
          className="md:hidden text-slate-500 hover:text-emerald-600 transition-colors"
          onClick={() => {
            const sidebar = document.querySelector('aside');
            if(sidebar) {
              const isHidden = sidebar.style.display === 'none' || sidebar.classList.contains('hidden');
              if(isHidden) {
                sidebar.classList.remove('hidden');
                sidebar.style.display = 'flex';
                sidebar.classList.add('absolute', 'inset-y-0', 'left-0', 'z-50');
              } else {
                sidebar.style.display = 'none';
              }
            }
          }}
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-slate-700 text-lg hidden sm:block">Selamat Datang, {userName.split(' ')[0]}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800">{userName}</p>
          <p className="text-xs text-slate-500 italic">{userRole}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner relative group cursor-pointer">
          <UserCircle size={28} />
          
          {/* Tooltip for mobile */}
          <div className="sm:hidden absolute top-full right-0 mt-2 bg-slate-800 text-white p-2 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {userName} - {userRole}
          </div>
        </div>
      </div>
    </header>
  );
}
