import React from 'react';
import prisma from '@/lib/prisma';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Settings2, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  LayoutGrid,
  List
} from 'lucide-react';
import Link from 'next/link';

export default async function MasterSuratPage() {
  const templates = await prisma.masterSurat.findMany({
    include: {
      klasifikasi: true,
      _count: {
        select: { riwayatSurat: true }
      }
    },
    orderBy: { kodeSurat: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Master Surat</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Manajemen Template & Format Surat Desa Kediren</p>
        </div>
        <Link 
          href="/admin/surat/master/tambah"
          className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs"
        >
          <Plus size={18} />
          <span>Tambah Template</span>
        </Link>
      </div>

      {/* Quick Stats & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama atau kode surat..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
            />
          </div>
          <button className="flex items-center gap-3 px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all text-xs uppercase tracking-widest border border-slate-100">
            <Filter size={18} />
            <span>Kategori</span>
          </button>
        </div>
        <div className="bg-slate-800 rounded-[2.5rem] p-6 text-white flex flex-col justify-center items-center shadow-2xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Template</p>
          <p className="text-4xl font-black">{templates.length}</p>
        </div>
      </div>

      {/* Grid Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {templates.map((s) => (
          <div 
            key={s.id}
            className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all overflow-hidden flex flex-col"
          >
            {/* Card Header */}
            <div className="p-8 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                  <FileText size={28} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {s.isActive ? 'Aktif' : 'Nonaktif'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight min-h-[3rem] line-clamp-2">
                  {s.namaSurat}
                </h3>
                <div className="flex items-center gap-2">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.kodeSurat}</p>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{s.klasifikasi?.nama || 'Umum'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                   <CheckCircle2 size={14} className="text-emerald-500" />
                   <p className="text-[10px] font-bold uppercase tracking-tighter">{s._count.riwayatSurat} Terbit</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all cursor-pointer">
                   <ChevronRight size={16} />
                </div>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4">
               <Link 
                 href={`/admin/surat/master/edit/${s.id}`}
                 className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-600 hover:text-white transition-all border border-slate-200/50 hover:border-emerald-500"
               >
                 <Settings2 size={14} />
                 Pengaturan
               </Link>
               <button 
                 className="w-12 h-11 flex items-center justify-center bg-white text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-slate-200/50 shadow-sm hover:border-rose-500"
                 title="Hapus Template"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}

        {/* Add New Card Blank */}
        <Link 
          href="/admin/surat/master/tambah"
          className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all space-y-4 min-h-[320px]"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all shadow-inner">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-slate-400 group-hover:text-emerald-700 transition-colors uppercase tracking-widest">Tambah Template Baru</p>
            <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-tighter">Buat format surat kustom desa</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
