'use client';

import React from 'react';
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
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 text-emerald-600">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-bold text-slate-800 text-lg">SID Kediren</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === '/admin'} />
          
          {/* Menu Kependudukan dengan Submenu */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">
               Kependudukan
            </div>
            <SidebarLink href="/admin/penduduk" icon={<Users size={20} />} label="Daftar Warga" active={pathname === '/admin/penduduk'} />
            <SidebarLink href="/admin/penduduk/mutasi" icon={<RefreshCcw size={20} />} label="Mutasi Warga" active={pathname === '/admin/penduduk/mutasi'} />
          </div>

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Layanan Desa</p>
          </div>
          <SidebarLink href="/admin/surat" icon={<FileText size={20} />} label="Persuratan" active={pathname.startsWith('/admin/surat')} />
          <SidebarLink href="/admin/apbdes" icon={<PieChart size={20} />} label="Transparansi" active={pathname.startsWith('/admin/apbdes')} />
          <SidebarLink href="/admin/gis" icon={<Map size={20} />} label="Pemetaan GIS" active={pathname.startsWith('/admin/gis')} />
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Social & Ekonomi</p>
          </div>
          <SidebarLink href="/admin/umkm" icon={<Settings size={20} />} label="UMKM & Wisata" active={pathname.startsWith('/admin/umkm')} />
          <SidebarLink href="/admin/pkk" icon={<Users size={20} />} label="PKK & Posyandu" active={pathname.startsWith('/admin/pkk')} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
          
          <div className="px-3 pt-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Developed By</p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-[10px] font-bold text-slate-700">Supriyanto Abadi Jaya</p>
               <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">Donasi RoKi ☕🚬</p>
                  <p className="text-[9px] font-mono font-black text-emerald-600 select-all">085655620979</p>
                  <p className="text-[8px] text-slate-400 italic">OVO / DANA / GOPAY</p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500">
              <Menu size={24} />
            </button>
            <h1 className="font-semibold text-slate-700">Selamat Datang, Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Operator Desa</p>
              <p className="text-xs text-slate-500 italic">Pemerintah Desa Kediren</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserCircle size={28} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer Static */}
          <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
            <div className="text-[10px] font-medium tracking-wide">
              &copy; {new Date().getFullYear()} SID KEDIREN. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-6">
              <div className="text-[10px] font-medium tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                DEVELOPED BY <span className="font-black text-slate-600">SUPRIYANTO ABADI JAYA</span>
              </div>
              <div className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 border border-slate-200 uppercase tracking-tighter">
                VERSION V2026.1.0.1
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
        active 
          ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
