'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function WargaLogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/portal/login' })}
      className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
    >
      <LogOut size={16} />
      <span>Keluar</span>
    </button>
  );
}
