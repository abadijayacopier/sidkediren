import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Map, 
  PieChart, 
  Settings, 
  LogOut,
  UserCircle,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarLink href="/admin/penduduk" icon={<Users size={20} />} label="Kependudukan" />
          <SidebarLink href="/admin/surat" icon={<FileText size={20} />} label="Persuratan" />
          <SidebarLink href="/admin/apbdes" icon={<PieChart size={20} />} label="Transparansi" />
          <SidebarLink href="/admin/gis" icon={<Map size={20} />} label="Pemetaan GIS" />
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Social & Ekonomi</p>
          </div>
          <SidebarLink href="/admin/umkm" icon={<Settings size={20} />} label="UMKM & Wisata" />
          <SidebarLink href="/admin/pkk" icon={<Users size={20} />} label="PKK & Posyandu" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
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
        <div className="flex-1 overflow-y-auto p-8">
          {children}
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
